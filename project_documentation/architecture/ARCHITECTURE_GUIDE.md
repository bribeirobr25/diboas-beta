# diBoaS Domain-Driven Architecture Guide

This guide explains the new Domain-Driven Design (DDD) architecture that has replaced the legacy URL processing system.

## 🏗️ Architecture Overview

The system follows Domain-Driven Design principles with clean separation of concerns:

- **Domain Layer**: Core business logic for navigation and routing
- **Application Layer**: Use cases and orchestration services  
- **Infrastructure Layer**: External service implementations and adapters
- **Clean Architecture**: No legacy compatibility layers - pure DDD implementation

## 📁 Project Structure

```
src/
├── domains/
│   ├── navigation/                           # Navigation Domain
│   │   ├── models/
│   │   │   └── RouteAggregate.js            # Route domain model & aggregate root
│   │   ├── services/
│   │   │   └── NavigationService.js         # Navigation domain service
│   │   ├── repositories/
│   │   │   └── RouteRepository.js           # Repository interface & in-memory impl
│   │   └── events/
│   │       └── NavigationEvents.js          # Domain events
│   └── shared-kernel/
│       ├── common/
│       │   ├── models/
│       │   │   └── ValueObjects.js          # Base classes (AggregateRoot, Entity, etc.)
│       │   └── events/
│       │       └── DomainEvents.js          # Event infrastructure
│       └── infrastructure/
│           └── interfaces/
│               └── ServiceInterfaces.js     # Service abstraction interfaces
├── application/
│   └── navigation/
│       └── RouteProcessingService.js        # Application service for file processing
├── infrastructure/
│   ├── navigation/
│   │   ├── FileRouteRepository.js           # File-based repository implementation
│   │   └── NavigationServiceFactory.js     # Dependency injection factory
│   └── adapters/
│       ├── ConsoleAuditLogger.js            # Console logging implementation
│       ├── SimplePerformanceMonitor.js     # Performance monitoring implementation
│       └── InMemoryCache.js                 # Caching implementation
└── scripts/
    └── domain-aware-url-processor.js        # Build script using domain services

config/
└── build-urls.js                            # URL configuration (enhanced for DDD)
```

## 🎯 Key Architectural Principles

### 1. Domain-Driven Design (DDD)

**Domain Model**: `RouteAggregate` represents the core business concept
```javascript
// Rich domain model with business logic
const route = routeAggregate.resolveRoute('APP_URL', { queryParams: { ref: 'nav' } });
```

**Domain Service**: `NavigationService` orchestrates complex domain operations
```javascript
// Domain service with proper abstractions
const navigationService = new NavigationService(routeRepository, eventBus, auditLogger, performanceMonitor);
```

**Repository Pattern**: Abstract data access from domain logic
```javascript
// Interface-based repository
class RouteRepository {
  async loadConfiguration(environment) { /* abstract */ }
}
```

### 2. Event-Driven Architecture

**Domain Events**: All business operations publish events
```javascript
// Route resolution publishes RouteResolvedEvent
this._addDomainEvent(new RouteResolvedEvent(destination, resolvedRoute, context, environment));
```

**Event Bus**: Decoupled communication between components
```javascript
// Subscribe to domain events
eventBus.subscribe('RouteResolved', async (event) => {
  console.log(`Route resolved: ${event.destination} -> ${event.resolvedRoute.url}`);
});
```

### 3. Service Agnostic Design

**Interface Abstractions**: All external services implement interfaces
```javascript
// Abstract audit logger interface
export class AuditLoggerInterface {
  async logBusinessAction(userId, action, data) { /* abstract */ }
}

// Concrete console implementation
export class ConsoleAuditLogger extends AuditLoggerInterface {
  async logBusinessAction(userId, action, data) { /* implementation */ }
}
```

**Dependency Injection**: Services configured through factory
```javascript
const navigationService = createNavigationService({
  repository: { type: 'file', configPath: './config/build-urls.js' },
  auditLogger: { type: 'console', logLevel: 'info' },
  performanceMonitor: { type: 'simple', logToConsole: true }
});
```

## 🚀 Usage

### Build Commands

Replace all legacy URL processing with these clean DDD commands:

```bash
# Development processing
npm run process-urls:dev

# Production processing  
npm run process-urls:prod

# Dry run (preview changes without writing files)
npm run process-urls:dry

# Test configuration and connectivity
npm run process-urls:test
```

### Direct Usage

```javascript
import { createNavigationService } from './src/infrastructure/navigation/NavigationServiceFactory.js';
import { RouteProcessingService } from './src/application/navigation/RouteProcessingService.js';

// Create services
const navigationService = createNavigationService();
const processor = new RouteProcessingService(navigationService);

// Resolve individual routes
const route = await navigationService.resolveRoute('APP_URL', 'production');
console.log(route.resolvedUrl); // https://dapp.diboas.com

// Process files in a directory
const results = await processor.processDirectory('./src', 'production');
console.log(`Processed ${results.processedFiles} files`);
```

## 🔧 Configuration

### Environment Support

```javascript
// config/build-urls.js
export function getUrlMappings(environment = null) {
  // Supports: development, production, staging, test
  const targetEnv = environment || (process.env.NODE_ENV || 'development');
  
  if (targetEnv === 'staging') {
    return {
      '{{HOME_URL}}': 'https://staging.diboas.com',
      '{{APP_URL}}': 'https://dapp.staging.diboas.com',
      // ... staging URLs
    };
  }
  
  // ... other environment configurations
}
```

### Service Configuration

```javascript
const navigationService = createNavigationService({
  repository: {
    type: 'file',                              // 'file' | 'memory'
    configPath: './config/build-urls.js'      // Path to configuration
  },
  eventBus: {
    type: 'memory'                             // 'memory' (more types coming)
  },
  auditLogger: {
    type: 'console',                           // 'console' | 'custom'
    logLevel: 'info',                          // 'debug' | 'info' | 'warn' | 'error'
    colorized: true                            // Enable color output
  },
  performanceMonitor: {
    type: 'simple',                            // 'simple' | 'custom'
    logToConsole: false,                       // Log metrics to console
    retainMetrics: true                        // Keep metrics in memory
  }
});
```

## 📊 Monitoring & Debugging

### Performance Monitoring

```javascript
// Get performance statistics
const stats = performanceMonitor.getStatistics();
console.log({
  totalMetrics: stats.totalMetrics,
  activeTimers: stats.activeTimers,
  histogramSummaries: stats.histogramSummaries
});

// Export Prometheus format
console.log(performanceMonitor.exportPrometheusMetrics());
```

### Event History

```javascript
// Access event history for debugging
const eventHistory = eventBus.getEventHistory();
console.log('Recent route resolutions:', 
  eventHistory.filter(e => e.eventType === 'RouteResolved').slice(-5)
);
```

### Audit Logging

```javascript
// Structured audit logs automatically generated
// [2024-01-15T10:30:00.000Z] INFO [BUSINESS ACTION] route_resolved
// {
//   "userId": "system",
//   "destination": "APP_URL", 
//   "environment": "production",
//   "resolvedUrl": "https://dapp.diboas.com"
// }
```

## 🧪 Testing

### Domain Testing

```javascript
import { RouteConfigurationAggregate } from './src/domains/navigation/models/RouteAggregate.js';

// Test domain model
const aggregate = new RouteConfigurationAggregate('test', '1.0.0');
aggregate.addRoute('HOME_URL', 'https://test.com');

const route = aggregate.resolveRoute('HOME_URL');
expect(route.resolvedUrl).toBe('https://test.com');
```

### Service Testing

```javascript
import { createNavigationService } from './src/infrastructure/navigation/NavigationServiceFactory.js';

// Test with in-memory implementations
const navigationService = createNavigationService({
  repository: { type: 'memory' },
  eventBus: { type: 'memory' },
  auditLogger: { enabled: false },
  performanceMonitor: { enabled: false }
});

// Load test configuration
const config = await navigationService.loadConfiguration('test');
expect(config.getAvailableDestinations()).toContain('HOME_URL');
```

### Integration Testing

```bash
# Test full system
npm run process-urls:test

# Dry run to validate
npm run process-urls:dry
```

## 🎉 Benefits Achieved

### ✅ 100% Domain-Driven Design
- Rich domain models with business logic
- Domain services for complex operations  
- Clear domain boundaries and ubiquitous language
- Repository pattern for data access abstraction

### ✅ 100% Event-Driven Architecture  
- All operations publish domain events
- Decoupled components via event bus
- Complete audit trail of all operations
- Extensible through event handlers

### ✅ 100% Service Agnostic with Abstraction Layers
- All external dependencies behind interfaces
- Pluggable implementations for different environments
- Fully testable with mock implementations
- No vendor lock-in for external services

### ✅ Clean Architecture
- No legacy code or compatibility layers
- Clear separation of concerns
- Maintainable and extensible codebase
- Production-ready with monitoring and logging

## 🚨 Migration Notes

The legacy `scripts/url-processor.js` has been completely removed and replaced with `src/scripts/domain-aware-url-processor.js`.

**Old commands** (removed):
- ❌ `npm run process-urls:dev` (legacy)
- ❌ `npm run process-urls:prod` (legacy)

**New commands** (clean DDD):
- ✅ `npm run process-urls:dev` (domain-driven)  
- ✅ `npm run process-urls:prod` (domain-driven)
- ✅ `npm run process-urls:dry` (domain-driven)
- ✅ `npm run process-urls:test` (domain-driven)

All functionality is preserved while following proper architectural patterns. The system is now maintainable, testable, and follows industry best practices for enterprise applications.