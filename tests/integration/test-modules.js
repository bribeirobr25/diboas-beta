#!/usr/bin/env node

/**
 * DDD Architecture Module Loading Test
 * Tests all critical imports and dependencies
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(dirname(__dirname)); // Go up two levels from tests/integration/ to project root

console.log('🧪 Testing diBoaS DDD Architecture Module Loading...\n');

const tests = [
  {
    name: 'Core Web Vitals Monitor',
    path: './src/infrastructure/performance/CoreWebVitalsMonitor.js',
    test: async () => {
      const { CoreWebVitalsMonitor } = await import('../../src/infrastructure/performance/CoreWebVitalsMonitor.js');
      return typeof CoreWebVitalsMonitor === 'function';
    }
  },
  {
    name: 'Global Error Handler',
    path: './src/infrastructure/monitoring/GlobalErrorHandler.js',
    test: async () => {
      const { GlobalErrorHandler } = await import('../../src/infrastructure/monitoring/GlobalErrorHandler.js');
      return typeof GlobalErrorHandler === 'function';
    }
  },
  {
    name: 'A/B Testing Service',
    path: './src/domains/experimentation/services/ABTestingService.js',
    test: async () => {
      const { ABTestingService } = await import('../../src/domains/experimentation/services/ABTestingService.js');
      return typeof ABTestingService === 'function';
    }
  },
  {
    name: 'Domain Events',
    path: './src/shared-kernel/common/events/DomainEvents.js',
    test: async () => {
      const module = await import('../../src/shared-kernel/common/events/DomainEvents.js');
      return typeof module.BaseDomainEvent === 'function';
    }
  },
  {
    name: 'Event Bus',
    path: './src/shared-kernel/common/events/EventBus.js',
    test: async () => {
      const module = await import('../../src/shared-kernel/common/events/EventBus.js');
      return typeof module.EventBus === 'function';
    }
  },
  {
    name: 'Application Service',
    path: './src/application/DiBoaSApplication.js',
    test: async () => {
      const { DiBoaSApplication } = await import('../../src/application/DiBoaSApplication.js');
      return typeof DiBoaSApplication === 'function';
    }
  },
  {
    name: 'UI Manager',
    path: './assets/js/ui/DiBoaSUIManager.js',
    test: async () => {
      const module = await import('../../assets/js/ui/DiBoaSUIManager.js');
      return typeof module.DiBoaSUIManager === 'function';
    }
  },
  {
    name: 'Integration Layer',
    path: './src/integration/DiBoaSIntegration.js',
    test: async () => {
      const { DiBoaSIntegration } = await import('../../src/integration/DiBoaSIntegration.js');
      return typeof DiBoaSIntegration === 'function';
    }
  }
];

let passed = 0;
let failed = 0;

for (const testCase of tests) {
  try {
    // Check if file exists
    const fullPath = join(projectRoot, testCase.path.replace('./', ''));
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ ${testCase.name}: File not found (${testCase.path})`);
      failed++;
      continue;
    }
    
    // Test the module
    const result = await testCase.test();
    if (result) {
      console.log(`✅ ${testCase.name}: Module loads correctly`);
      passed++;
    } else {
      console.log(`❌ ${testCase.name}: Module failed validation`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${testCase.name}: ${error.message}`);
    failed++;
  }
}

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All DDD modules are loading correctly!');
  console.log('✅ The architecture is ready for browser testing.');
} else {
  console.log('⚠️ Some modules have issues that need to be addressed.');
  process.exit(1);
}

// Additional file structure verification
console.log('\n📁 Verifying file structure...');

const criticalFiles = [
  'index.html',
  'assets/js/bootstrap.js',
  'src/integration/DiBoaSIntegration.js',
  'src/application/DiBoaSApplication.js',
  'src/shared-kernel/common/events/EventBus.js',
  'src/shared-kernel/common/events/DomainEvents.js'
];

let structureOk = true;

for (const file of criticalFiles) {
  const fullPath = join(projectRoot, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    structureOk = false;
  }
}

if (structureOk) {
  console.log('\n✅ File structure is correct!');
} else {
  console.log('\n❌ File structure has issues!');
  process.exit(1);
}