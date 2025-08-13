/**
 * Navigation Domain Service
 * Core domain service for route resolution and navigation logic
 */

import { RouteConfigurationAggregate } from '../models/RouteAggregate.js';
import { 
  RouteResolvedEvent, 
  RouteResolutionFailedEvent,
  RouteConfigurationLoadedEvent,
  RouteConfigurationValidationFailedEvent
} from '../events/NavigationEvents.js';

/**
 * Navigation Domain Service
 * Orchestrates route resolution and configuration management
 */
export class NavigationService {
  constructor(routeRepository, eventBus, auditLogger, performanceMonitor) {
    this._routeRepository = routeRepository;
    this._eventBus = eventBus;
    this._auditLogger = auditLogger;
    this._performanceMonitor = performanceMonitor;
    
    // Cache for loaded configurations
    this._configurationCache = new Map();
    
    // Bind methods for consistent context
    this.resolveRoute = this.resolveRoute.bind(this);
    this.loadConfiguration = this.loadConfiguration.bind(this);
    this.updateConfiguration = this.updateConfiguration.bind(this);
  }

  /**
   * Resolve a route destination to URL
   * @param {string} destination - Route destination (e.g., 'APP_URL', 'DOCS_URL')
   * @param {string} environment - Target environment
   * @param {Object} context - Resolution context (query params, hash, etc.)
   * @returns {Promise<Route>} Resolved route
   */
  async resolveRoute(destination, environment, context = {}) {
    const timer = this._performanceMonitor?.startTimer('navigation_resolve_route');
    
    try {
      // Validate inputs
      this._validateDestination(destination);
      this._validateEnvironment(environment);

      // Load configuration for environment
      const configuration = await this._getConfiguration(environment);

      // Resolve the route through domain logic
      const resolvedRoute = configuration.resolveRoute(destination, context);

      // Audit logging
      await this._auditLogger?.logBusinessAction(null, 'route_resolved', {
        destination,
        environment,
        resolvedUrl: resolvedRoute.resolvedUrl,
        context
      });

      // Publish domain events from aggregate
      await this._publishDomainEvents(configuration);

      timer?.end();
      return resolvedRoute;

    } catch (error) {
      timer?.end();
      
      // Publish failure event
      await this._eventBus.publish(new RouteResolutionFailedEvent(
        destination,
        environment,
        error,
        context
      ));

      await this._handleServiceError('resolveRoute', error, {
        destination,
        environment,
        context
      });
      
      throw error;
    }
  }

  /**
   * Load route configuration for environment
   * @param {string} environment - Target environment
   * @param {boolean} forceReload - Force reload from repository
   * @returns {Promise<RouteConfigurationAggregate>} Route configuration
   */
  async loadConfiguration(environment, forceReload = false) {
    const timer = this._performanceMonitor?.startTimer('navigation_load_configuration');
    
    try {
      this._validateEnvironment(environment);

      // Check cache first
      if (!forceReload && this._configurationCache.has(environment)) {
        timer?.end();
        return this._configurationCache.get(environment);
      }

      // Load from repository
      const configData = await this._routeRepository.loadConfiguration(environment);
      
      // Validate configuration
      const validation = this._routeRepository.validateConfiguration(configData);
      if (!validation.isValid) {
        const validationEvent = new RouteConfigurationValidationFailedEvent(
          environment,
          validation.errors,
          'repository'
        );
        await this._eventBus.publish(validationEvent);
        throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
      }

      // Create domain aggregate
      const configuration = RouteConfigurationAggregate.fromConfiguration(configData);
      
      // Validate aggregate
      const aggregateValidation = configuration.validate();
      if (!aggregateValidation.isValid) {
        throw new Error(`Invalid aggregate: ${aggregateValidation.errors.join(', ')}`);
      }

      // Cache the configuration
      this._configurationCache.set(environment, configuration);

      // Publish loaded event
      await this._eventBus.publish(new RouteConfigurationLoadedEvent(
        environment,
        configuration.routeCount,
        'repository'
      ));

      // Audit logging
      await this._auditLogger?.logBusinessAction(null, 'configuration_loaded', {
        environment,
        routeCount: configuration.routeCount,
        version: configuration.version
      });

      timer?.end();
      return configuration;

    } catch (error) {
      timer?.end();
      await this._handleServiceError('loadConfiguration', error, { environment });
      throw error;
    }
  }

  /**
   * Update route configuration
   * @param {string} environment - Target environment
   * @param {Object} updates - Configuration updates
   * @returns {Promise<RouteConfigurationAggregate>} Updated configuration
   */
  async updateConfiguration(environment, updates) {
    const timer = this._performanceMonitor?.startTimer('navigation_update_configuration');
    
    try {
      this._validateEnvironment(environment);

      // Load current configuration
      const configuration = await this._getConfiguration(environment);

      // Apply updates through domain logic
      for (const [destination, routeConfig] of Object.entries(updates.routes || {})) {
        if (routeConfig === null) {
          // Remove route
          configuration.removeRoute(destination);
        } else {
          // Add or update route
          configuration.addRoute(destination, routeConfig.url, routeConfig.metadata);
        }
      }

      // Validate updated configuration
      const validation = configuration.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid updated configuration: ${validation.errors.join(', ')}`);
      }

      // Save to repository
      await this._routeRepository.saveConfiguration(environment, configuration.toConfiguration());

      // Update cache
      this._configurationCache.set(environment, configuration);

      // Publish domain events
      await this._publishDomainEvents(configuration);

      // Audit logging
      await this._auditLogger?.logBusinessAction(null, 'configuration_updated', {
        environment,
        updates: Object.keys(updates.routes || {}),
        version: configuration.version
      });

      timer?.end();
      return configuration;

    } catch (error) {
      timer?.end();
      await this._handleServiceError('updateConfiguration', error, { environment, updates });
      throw error;
    }
  }

  /**
   * Get all routes for environment
   * @param {string} environment - Target environment
   * @returns {Promise<Object>} Route mapping object
   */
  async getAllRoutes(environment) {
    const timer = this._performanceMonitor?.startTimer('navigation_get_all_routes');
    
    try {
      const configuration = await this._getConfiguration(environment);
      const routes = {};

      for (const destination of configuration.getAvailableDestinations()) {
        try {
          const route = configuration.resolveRoute(destination);
          routes[destination] = route.resolvedUrl;
        } catch (error) {
          // Log but don't fail for individual route errors
          await this._auditLogger?.warn('Failed to resolve route in getAllRoutes', {
            destination,
            environment,
            error: error.message
          });
        }
      }

      timer?.end();
      return routes;

    } catch (error) {
      timer?.end();
      await this._handleServiceError('getAllRoutes', error, { environment });
      throw error;
    }
  }

  /**
   * Check if route exists for destination
   * @param {string} destination - Route destination
   * @param {string} environment - Target environment
   * @returns {Promise<boolean>} True if route exists
   */
  async routeExists(destination, environment) {
    try {
      const configuration = await this._getConfiguration(environment);
      return configuration.getAvailableDestinations().includes(destination);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get configuration metadata
   * @param {string} environment - Target environment
   * @returns {Promise<Object>} Configuration metadata
   */
  async getConfigurationMetadata(environment) {
    const timer = this._performanceMonitor?.startTimer('navigation_get_metadata');
    
    try {
      const metadata = await this._routeRepository.getConfigurationMetadata(environment);
      timer?.end();
      return metadata;
    } catch (error) {
      timer?.end();
      await this._handleServiceError('getConfigurationMetadata', error, { environment });
      throw error;
    }
  }

  /**
   * Clear configuration cache
   * @param {string} environment - Optional specific environment to clear
   */
  clearCache(environment = null) {
    if (environment) {
      this._configurationCache.delete(environment);
    } else {
      this._configurationCache.clear();
    }
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  async _getConfiguration(environment) {
    // Try cache first
    if (this._configurationCache.has(environment)) {
      return this._configurationCache.get(environment);
    }

    // Load from repository
    return await this.loadConfiguration(environment);
  }

  async _publishDomainEvents(aggregate) {
    const events = aggregate.domainEvents;
    
    for (const event of events) {
      try {
        await this._eventBus.publish(event);
      } catch (error) {
        // Log error but don't fail the operation
        await this._auditLogger?.error('Failed to publish domain event', {
          eventType: event.eventType,
          eventId: event.eventId,
          error: error.message
        });
      }
    }
    
    aggregate.clearDomainEvents();
  }

  _validateDestination(destination) {
    if (!destination || typeof destination !== 'string') {
      throw new Error('Destination must be a non-empty string');
    }

    // Business rule: destinations should follow naming convention
    if (!/^[A-Z][A-Z_]*_URL$/.test(destination)) {
      throw new Error('Destination must follow format: DESTINATION_URL (e.g., APP_URL, DOCS_URL)');
    }
  }

  _validateEnvironment(environment) {
    if (!environment || typeof environment !== 'string') {
      throw new Error('Environment must be a non-empty string');
    }

    // Business rule: supported environments
    const validEnvironments = ['development', 'production', 'staging', 'test'];
    if (!validEnvironments.includes(environment)) {
      throw new Error(`Environment must be one of: ${validEnvironments.join(', ')}`);
    }
  }

  async _handleServiceError(operation, error, context) {
    // Log error for monitoring
    await this._auditLogger?.error(`NavigationService.${operation} failed`, {
      operation,
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date()
    });

    // Record performance metric
    if (this._performanceMonitor) {
      // This would typically integrate with your performance monitoring system
      await this._auditLogger?.warn('Performance metric recorded', {
        metric: `navigation_service_error`,
        value: 1,
        tags: { operation, errorType: error.constructor.name }
      });
    }
  }
}