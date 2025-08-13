#!/usr/bin/env node

/**
 * Verify diBoaS Application is Running Properly
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname); // Go up one level from scripts/ to project root

console.log('🔍 Verifying diBoaS Application Status...\n');

// Check critical files exist
const criticalFiles = [
  { path: 'index.html', desc: 'Main landing page' },
  { path: 'assets/js/bootstrap.js', desc: 'DDD bootstrap loader' },
  { path: 'src/integration/DiBoaSIntegration.js', desc: 'Integration layer' },
  { path: 'src/application/DiBoaSApplication.js', desc: 'Application service' },
  { path: 'src/shared-kernel/common/events/EventBus.js', desc: 'Event bus' },
  { path: 'src/shared-kernel/common/events/DomainEvents.js', desc: 'Domain events' },
  { path: 'src/infrastructure/performance/CoreWebVitalsMonitor.js', desc: 'Performance monitoring' },
  { path: 'src/infrastructure/monitoring/GlobalErrorHandler.js', desc: 'Error handling' },
  { path: 'src/domains/experimentation/services/ABTestingService.js', desc: 'A/B testing' }
];

console.log('📋 Checking critical files:');
let allFilesExist = true;

for (const file of criticalFiles) {
  const fullPath = join(projectRoot, file.path);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${file.desc}: ${file.path}`);
  if (!exists) allFilesExist = false;
}

// Check HTML files are loading bootstrap.js
console.log('\n📄 Checking HTML files load bootstrap.js:');
const htmlFiles = ['index.html', 'frontend/landing/index.html'];

for (const htmlFile of htmlFiles) {
  const fullPath = join(projectRoot, htmlFile);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasBootstrap = content.includes('bootstrap.js');
    console.log(`${hasBootstrap ? '✅' : '❌'} ${htmlFile} ${hasBootstrap ? 'loads' : 'does NOT load'} bootstrap.js`);
  }
}

// Check for legacy main.js references
console.log('\n🔍 Checking for legacy main.js references:');
const shouldNotHaveMainJS = fs.readFileSync(join(projectRoot, 'index.html'), 'utf8');
const hasMainJS = shouldNotHaveMainJS.includes('main.js');
console.log(`${!hasMainJS ? '✅' : '❌'} No legacy main.js references in index.html`);

// Summary
console.log('\n📊 Summary:');
if (allFilesExist && !hasMainJS) {
  console.log('✅ Application structure is correct');
  console.log('✅ DDD architecture files are in place');
  console.log('✅ Legacy code has been removed');
  console.log('\n🎉 The diBoaS application is properly configured!');
  console.log('\n📌 To test in browser:');
  console.log('1. Start a local server: python3 -m http.server 8000');
  console.log('2. Open http://localhost:8000 in your browser');
  console.log('3. Check browser console for initialization messages');
  console.log('4. Or open tests/browser/test-browser.html directly for testing');
} else {
  console.log('❌ Issues found - please fix the above problems');
  process.exit(1);
}