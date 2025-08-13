/**
 * Navigation Service Factory
 * Factory for creating navigation services with proper dependency injection
 */

import { NavigationService } from '../../domains/navigation/services/NavigationService.js';
import { FileRouteRepository } from './FileRouteRepository.js';
import { InMemoryRouteRepository } from '../../domains/navigation/repositories/RouteRepository.js';
import { InMemoryEventBus } from '../../shared-kernel/common/events/EventBus.js';
import { ConsoleAuditLogger } from '../adapters/ConsoleAuditLogger.js';
import { SimplePerformanceMonitor } from '../adapters/SimplePerformanceMonitor.js';

/**
 * Factory for creating navigation services
 */
export class NavigationServiceFactory {
  constructor() {
    this._instances = new Map();
  }

  /**
   * Create or get navigation service instance
   * @param {Object} config - Configuration options
   * @returns {NavigationService} Navigation service instance
   */
  createNavigationService(config = {}) {
    const instanceKey = this._getInstanceKey(config);
    
    if (this._instances.has(instanceKey)) {
      return this._instances.get(instanceKey);
    }

    // Create dependencies
    const routeRepository = this._createRouteRepository(config);
    const eventBus = this._createEventBus(config);
    const auditLogger = this._createAuditLogger(config);
    const performanceMonitor = this._createPerformanceMonitor(config);

    // Create navigation service
    const navigationService = new NavigationService(
      routeRepository,
      eventBus,
      auditLogger,
      performanceMonitor
    );

    // Cache the instance
    this._instances.set(instanceKey, navigationService);

    return navigationService;
  }

  /**
   * Create route repository
   * @param {Object} config - Configuration options
   * @returns {RouteRepository} Route repository instance
   */
  _createRouteRepository(config) {
    const { repository } = config;

    switch (repository?.type) {
      case 'file':
        return new FileRouteRepository(repository.configPath);
      
      case 'memory':
        return new InMemoryRouteRepository();
      
      default:
        // Default to file repository
        return new FileRouteRepository();
    }
  }

  /**
   * Create event bus
   * @param {Object} config - Configuration options
   * @returns {EventBus} Event bus instance
   */
  _createEventBus(config) {
    const { eventBus } = config;

    switch (eventBus?.type) {
      case 'memory':
        return new InMemoryEventBus();
      
      // Future: Add other event bus implementations (Redis, RabbitMQ, etc.)
      default:
        return new InMemoryEventBus();
    }
  }

  /**
   * Create audit logger
   * @param {Object} config - Configuration options
   * @returns {Object} Audit logger instance
   */
  _createAuditLogger(config) {
    const { auditLogger } = config;

    if (auditLogger?.enabled === false) {
      return null;
    }

    switch (auditLogger?.type) {
      case 'console':
        return new ConsoleAuditLogger(auditLogger.options);
      
      case 'custom':
        if (auditLogger.instance) {
          return auditLogger.instance;
        }
        throw new Error('Custom audit logger requires instance');
      
      default:
        // Default to console logger
        return new ConsoleAuditLogger({
          logLevel: auditLogger?.logLevel || 'info',
          colorized: auditLogger?.colorized !== false,
          ...auditLogger?.options
        });
    }
  }

  /**
   * Create performance monitor
   * @param {Object} config - Configuration options
   * @returns {Object} Performance monitor instance
   */
  _createPerformanceMonitor(config) {
    const { performanceMonitor } = config;

    if (performanceMonitor?.enabled === false) {
      return null;
    }

    switch (performanceMonitor?.type) {
      case 'simple':
        return new SimplePerformanceMonitor(performanceMonitor.options);
      
      case 'custom':
        if (performanceMonitor.instance) {
          return performanceMonitor.instance;
        }
        throw new Error('Custom performance monitor requires instance');
      
      default:
        // Default to simple monitor
        return new SimplePerformanceMonitor({
          logToConsole: performanceMonitor?.logToConsole !== false,
          enabled: performanceMonitor?.enabled !== false,
          ...performanceMonitor?.options
        });
    }
  }

  /**
   * Get instance key for caching
   * @param {Object} config - Configuration options
   * @returns {string} Instance key
   */
  _getInstanceKey(config) {
    return JSON.stringify({
      repository: config.repository?.type || 'file',
      eventBus: config.eventBus?.type || 'memory',
      configPath: config.repository?.configPath || 'default'
    });
  }

  /**
   * Clear cached instances
   */
  clearCache() {
    this._instances.clear();
  }

  /**
   * Get current instance count
   * @returns {number} Number of cached instances
   */
  getInstanceCount() {
    return this._instances.size;
  }
}

/**
 * Default factory instance
 */
export const navigationServiceFactory = new NavigationServiceFactory();

/**
 * Helper function to create navigation service with default configuration
 * @param {Object} config - Optional configuration overrides
 * @returns {NavigationService} Navigation service instance
 */
export function createNavigationService(config = {}) {
  return navigationServiceFactory.createNavigationService(config);
}