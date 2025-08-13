#!/usr/bin/env node

/**
 * Test script to verify dev server asset serving
 */

// Using built-in fetch (Node.js 18+) instead of node-fetch
// import chalk from 'chalk';

const BASE_URL = 'http://localhost:3000';

// Test cases for various asset types
const testCases = [
  {
    path: '/assets/css/main.css',
    expectedType: 'text/css',
    description: 'Main CSS file'
  },
  {
    path: '/assets/css/i18n.css',
    expectedType: 'text/css',
    description: 'i18n CSS file'
  },
  {
    path: '/assets/images/logo.png',
    expectedType: 'image/png',
    description: 'Logo image'
  },
  {
    path: '/assets/images/favicon.png',
    expectedType: 'image/png',
    description: 'Favicon image'
  },
  {
    path: '/assets/js/bootstrap.js',
    expectedType: 'application/javascript',
    description: 'Bootstrap JS'
  },
  {
    path: '/assets/icons/favicon.ico',
    expectedType: 'image/png', // Will be served as PNG fallback
    description: 'Favicon icon (fallback)'
  },
  {
    path: '/mascots',
    expectedType: 'text/html',
    description: 'Mascots page'
  },
  {
    path: '/mascots/mascots.css',
    expectedType: 'text/css',
    description: 'Mascots CSS'
  }
];

async function testAssetServing() {
  console.log('\n🧪 Testing diBoaS Dev Server Asset Serving\n');
  
  let passCount = 0;
  let failCount = 0;
  
  for (const test of testCases) {
    try {
      const response = await fetch(`${BASE_URL}${test.path}`);
      const contentType = response.headers.get('content-type');
      
      if (response.ok && contentType && contentType.includes(test.expectedType)) {
        console.log('✅', `${test.description}: ${test.path}`);
        console.log(`  Content-Type: ${contentType}`);
        passCount++;
      } else {
        console.log('❌', `${test.description}: ${test.path}`);
        console.log(`  Status: ${response.status}, Content-Type: ${contentType || 'none'}`);
        failCount++;
      }
    } catch (error) {
      console.log('❌', `${test.description}: ${test.path}`);
      console.log(`  Error: ${error.message}`);
      failCount++;
    }
  }
  
  console.log('\n' + '─'.repeat(50));
  console.log(`Passed: ${passCount} | Failed: ${failCount}`);
  
  if (failCount === 0) {
    console.log('\n✨ All tests passed! Dev server is serving assets correctly.\n');
  } else {
    console.log(`\n❌ ${failCount} test(s) failed. Please check the dev server configuration.\n`);
    process.exit(1);
  }
}

// Check if server is running before testing
fetch(`${BASE_URL}/health`)
  .then(() => {
    testAssetServing();
  })
  .catch(() => {
    console.log('\n❌ Dev server is not running!');
    console.log('Please start the dev server with: npm run dev\n');
    process.exit(1);
  });