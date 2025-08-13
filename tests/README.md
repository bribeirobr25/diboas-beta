# diBoaS Testing Suite

This directory contains testing utilities for the diBoaS platform's Pure DDD, Event-Driven, Service Agnostic architecture.

## Directory Structure

```
tests/
├── browser/                 # Browser-based testing
│   ├── test-browser.html   # Complete browser application test
│   └── test-ddd.html       # DDD architecture verification test
└── integration/            # Integration and module testing
    ├── test-dev-server.js  # Development server asset serving tests
    └── test-modules.js     # Module loading and dependency tests
```

## Browser Tests

### test-browser.html
- **Purpose**: Complete browser application testing interface
- **Usage**: Open directly in browser or serve via local server
- **Features**: 
  - System status checks
  - Console output capture
  - Real-time application monitoring
  - DDD architecture verification

### test-ddd.html  
- **Purpose**: Focused DDD architecture testing
- **Usage**: Validates proper loading of domain models, events, and services
- **Features**:
  - Domain module verification
  - Event-driven pattern testing
  - Service abstraction validation

## Integration Tests

### test-modules.js
- **Purpose**: Validates all critical module imports and dependencies
- **Usage**: `node tests/integration/test-modules.js`
- **Tests**:
  - Core Web Vitals Monitor
  - Global Error Handler
  - A/B Testing Service
  - Domain Events
  - Event Bus
  - Application Service
  - UI Manager
  - Integration Layer

### test-dev-server.js
- **Purpose**: Tests development server asset serving
- **Usage**: `node tests/integration/test-dev-server.js` (requires dev server running)
- **Tests**:
  - CSS file serving with correct MIME types
  - Image asset availability
  - JavaScript module serving
  - JSON configuration serving

## Running Tests

### Prerequisites
- Node.js 18+ with ES modules support
- pnpm for dependency management
- Local development server running (for integration tests)

### Quick Start
```bash
# Module dependency test
node tests/integration/test-modules.js

# Development server test (requires server running)
pnpm run dev  # In separate terminal
node tests/integration/test-dev-server.js

# Browser tests
# Option 1: Direct file access
open tests/browser/test-browser.html

# Option 2: Via development server
pnpm run dev
# Then visit: http://localhost:3000/tests/browser/test-browser.html
```

## Architecture Compliance

All tests maintain compliance with diBoaS architecture patterns:

✅ **Domain-Driven Design**: Tests validate proper domain model loading  
✅ **Event-Driven Architecture**: Tests verify EventBus and domain events  
✅ **Service Agnostic Pattern**: Tests confirm abstraction layer integrity  
✅ **Zero Legacy Code**: All tests use modern ES6+ patterns  
✅ **Production Ready**: Tests validate production monitoring systems

## Test Results Interpretation

### Success Indicators
- ✅ All modules load without errors
- ✅ DDD architecture components initialize properly
- ✅ Event-driven communication functions
- ✅ Service abstractions work correctly
- ✅ Browser console shows no critical errors

### Failure Indicators
- ❌ Module import errors
- ❌ Missing domain service methods
- ❌ EventBus communication failures
- ❌ Infrastructure adapter issues
- ❌ Asset serving problems

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Maintain architecture compliance
3. Use modern ES6+ JavaScript
4. Include proper error handling
5. Document test purpose and usage

---

**Note**: These testing utilities were moved from the project root to maintain a clean, professional project structure while preserving valuable development and debugging capabilities.