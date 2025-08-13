/**
 * Navigation Domain Events
 * Event definitions for route resolution and configuration changes
 */

import { BaseDomainEvent as DomainEvent } from '../../../shared-kernel/common/events/DomainEvents.js';

/**
 * Published when a route is successfully resolved
 */
export class RouteResolvedEvent extends DomainEvent {
  constructor(destination, resolvedRoute, context, environment) {
    super('RouteResolved', {
      destination,
      resolvedRoute: {
        url: resolvedRoute.resolvedUrl,
        metadata: resolvedRoute.metadata,
        resolvedAt: resolvedRoute.resolvedAt
      },
      context,
      environment,
      timestamp: new Date()
    });
  }

  get destination() { return this.eventData.destination; }
  get resolvedRoute() { return this.eventData.resolvedRoute; }
  get context() { return this.eventData.context; }
  get environment() { return this.eventData.environment; }
}

/**
 * Published when route configuration changes
 */
export class RouteConfigurationChangedEvent extends DomainEvent {
  constructor(environment, destination, oldRoute, newRoute, changeType) {
    super('RouteConfigurationChanged', {
      environment,
      destination,
      oldRoute: oldRoute ? {
        url: oldRoute.resolvedUrl,
        metadata: oldRoute.metadata
      } : null,
      newRoute: newRoute ? {
        url: newRoute.resolvedUrl,
        metadata: newRoute.metadata
      } : null,
      changeType, // 'route_added', 'route_updated', 'route_removed'
      timestamp: new Date()
    });

    // Properties are accessible via eventData
    // this.environment = environment;
    // this.destination = destination;
    // this.oldRoute = oldRoute;
    // this.newRoute = newRoute;
    // this.changeType = changeType;
  }

  get environment() { return this.eventData.environment; }
  get destination() { return this.eventData.destination; }
  get oldRoute() { return this.eventData.oldRoute; }
  get newRoute() { return this.eventData.newRoute; }
  get changeType() { return this.eventData.changeType; }
}

/**
 * Published when route configuration is loaded
 */
export class RouteConfigurationLoadedEvent extends DomainEvent {
  constructor(environment, routeCount, source) {
    super('RouteConfigurationLoaded', {
      environment,
      routeCount,
      source, // 'file', 'database', 'cache', etc.
      timestamp: new Date()
    });
  }

  get environment() { return this.eventData.environment; }
  get routeCount() { return this.eventData.routeCount; }
  get source() { return this.eventData.source; }
}

/**
 * Published when route resolution fails
 */
export class RouteResolutionFailedEvent extends DomainEvent {
  constructor(destination, environment, error, context) {
    super('RouteResolutionFailed', {
      destination,
      environment,
      error: {
        message: error.message,
        type: error.constructor.name
      },
      context,
      timestamp: new Date()
    });
  }

  get destination() { return this.eventData.destination; }
  get environment() { return this.eventData.environment; }
  get error() { return this.eventData.error; }
  get context() { return this.eventData.context; }
}

/**
 * Published when route configuration validation fails
 */
export class RouteConfigurationValidationFailedEvent extends DomainEvent {
  constructor(environment, errors, source) {
    super('RouteConfigurationValidationFailed', {
      environment,
      errors,
      source,
      timestamp: new Date()
    });
  }

  get environment() { return this.eventData.environment; }
  get errors() { return this.eventData.errors; }
  get source() { return this.eventData.source; }
}

/**
 * Published when route processing starts for build operations
 */
export class RouteProcessingStartedEvent extends DomainEvent {
  constructor(environment, targetPath, processingType) {
    super('RouteProcessingStarted', {
      environment,
      targetPath,
      processingType, // 'build', 'development', 'production'
      timestamp: new Date()
    });
  }

  get environment() { return this.eventData.environment; }
  get targetPath() { return this.eventData.targetPath; }
  get processingType() { return this.eventData.processingType; }
}

/**
 * Published when route processing completes
 */
export class RouteProcessingCompletedEvent extends DomainEvent {
  constructor(environment, targetPath, processingType, processedFileCount, duration) {
    super('RouteProcessingCompleted', {
      environment,
      targetPath,
      processingType,
      processedFileCount,
      duration,
      timestamp: new Date()
    });
  }

  get environment() { return this.eventData.environment; }
  get targetPath() { return this.eventData.targetPath; }
  get processingType() { return this.eventData.processingType; }
  get processedFileCount() { return this.eventData.processedFileCount; }
  get duration() { return this.eventData.duration; }
}