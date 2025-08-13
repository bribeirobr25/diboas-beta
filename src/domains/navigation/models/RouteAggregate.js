/**
 * Route Aggregate Root
 * Domain model for route configuration and resolution
 */

import { AggregateRoot } from '../../shared-kernel/common/models/ValueObjects.js';
import { 
  RouteResolvedEvent, 
  RouteConfigurationChangedEvent 
} from '../events/NavigationEvents.js';

/**
 * Route Value Object
 */
export class Route {
  constructor(destination, resolvedUrl, environment, metadata = {}) {
    this.destination = destination;
    this.resolvedUrl = resolvedUrl;
    this.environment = environment;
    this.metadata = metadata;
    this.resolvedAt = new Date();
    
    Object.freeze(this);
  }

  isValid() {
    return this.destination && this.resolvedUrl && this.environment;
  }

  equals(other) {
    return other instanceof Route &&
           other.destination === this.destination &&
           other.resolvedUrl === this.resolvedUrl &&
           other.environment === this.environment;
  }

  toString() {
    return `Route(${this.destination} -> ${this.resolvedUrl} [${this.environment}])`;
  }
}

/**
 * Route Configuration Aggregate Root
 */
export class RouteConfigurationAggregate extends AggregateRoot {
  constructor(environment, version = '1.0.0') {
    super(environment); // Pass environment as ID
    this._environment = environment;
    this._version = version;
    this._routeMap = new Map();
    this._lastModified = new Date();
    this._isActive = true;
  }

  // Getters
  get environment() { return this._environment; }
  get version() { return this._version; }
  get lastModified() { return this._lastModified; }
  get isActive() { return this._isActive; }
  get routeCount() { return this._routeMap.size; }

  /**
   * Add or update a route mapping
   * @param {string} destination - Route destination key (e.g., 'APP_URL')
   * @param {string} url - Target URL
   * @param {Object} metadata - Additional route metadata
   */
  addRoute(destination, url, metadata = {}) {
    this._validateDestination(destination);
    this._validateUrl(url);

    const oldRoute = this._routeMap.get(destination);
    const newRoute = new Route(destination, url, this._environment, metadata);

    this._routeMap.set(destination, newRoute);
    this._lastModified = new Date();

    // Publish domain event
    this._addDomainEvent(new RouteConfigurationChangedEvent(
      this._environment,
      destination,
      oldRoute,
      newRoute,
      'route_updated'
    ));

    return newRoute;
  }

  /**
   * Remove a route mapping
   * @param {string} destination - Route destination to remove
   */
  removeRoute(destination) {
    this._validateDestination(destination);

    const removedRoute = this._routeMap.get(destination);
    if (removedRoute) {
      this._routeMap.delete(destination);
      this._lastModified = new Date();

      // Publish domain event
      this._addDomainEvent(new RouteConfigurationChangedEvent(
        this._environment,
        destination,
        removedRoute,
        null,
        'route_removed'
      ));
    }

    return removedRoute;
  }

  /**
   * Resolve a route destination to URL
   * @param {string} destination - Route destination
   * @param {Object} context - Resolution context
   * @returns {Route} Resolved route
   */
  resolveRoute(destination, context = {}) {
    this._validateDestination(destination);

    const route = this._routeMap.get(destination);
    if (!route) {
      throw new Error(`Route not found for destination: ${destination}`);
    }

    // Apply context-based transformations if needed
    const resolvedUrl = this._applyContext(route.resolvedUrl, context);
    const resolvedRoute = new Route(
      destination, 
      resolvedUrl, 
      this._environment, 
      { ...route.metadata, ...context }
    );

    // Publish domain event
    this._addDomainEvent(new RouteResolvedEvent(
      destination,
      resolvedRoute,
      context,
      this._environment
    ));

    return resolvedRoute;
  }

  /**
   * Get all available destinations
   * @returns {string[]} Array of destination keys
   */
  getAvailableDestinations() {
    return Array.from(this._routeMap.keys());
  }

  /**
   * Get route configuration as plain object
   * @returns {Object} Route configuration
   */
  toConfiguration() {
    const config = {};
    for (const [destination, route] of this._routeMap) {
      config[destination] = {
        url: route.resolvedUrl,
        metadata: route.metadata,
        resolvedAt: route.resolvedAt
      };
    }
    return {
      environment: this._environment,
      version: this._version,
      lastModified: this._lastModified,
      isActive: this._isActive,
      routes: config
    };
  }

  /**
   * Create aggregate from configuration object
   * @param {Object} config - Configuration object
   * @returns {RouteConfigurationAggregate} New aggregate instance
   */
  static fromConfiguration(config) {
    const aggregate = new RouteConfigurationAggregate(
      config.environment,
      config.version
    );

    aggregate._lastModified = new Date(config.lastModified);
    aggregate._isActive = config.isActive !== false;

    // Add routes
    for (const [destination, routeConfig] of Object.entries(config.routes || {})) {
      aggregate.addRoute(destination, routeConfig.url, routeConfig.metadata);
    }

    // Clear domain events from construction
    aggregate.clearDomainEvents();

    return aggregate;
  }

  /**
   * Validate the aggregate state
   * @returns {Object} Validation result
   */
  validate() {
    const errors = [];

    if (!this._environment) {
      errors.push('Environment is required');
    }

    if (this._routeMap.size === 0) {
      errors.push('At least one route must be configured');
    }

    // Validate each route
    for (const [destination, route] of this._routeMap) {
      if (!route.isValid()) {
        errors.push(`Invalid route configuration for ${destination}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Private methods
  _validateDestination(destination) {
    if (!destination || typeof destination !== 'string') {
      throw new Error('Destination must be a non-empty string');
    }
  }

  _validateUrl(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('URL must be a non-empty string');
    }
  }

  _applyContext(url, context) {
    let resolvedUrl = url;

    // Apply query parameters if provided
    if (context.queryParams) {
      const params = new URLSearchParams(context.queryParams);
      const separator = url.includes('?') ? '&' : '?';
      resolvedUrl = `${url}${separator}${params.toString()}`;
    }

    // Apply hash if provided
    if (context.hash) {
      resolvedUrl = `${resolvedUrl}#${context.hash}`;
    }

    return resolvedUrl;
  }
}