#!/usr/bin/env node

/**
 * Update Navigation to Use Subdomain URLs
 * Changes internal links from paths (/app) to subdomains (dapp.diboas.com)
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

// Mapping of paths to subdomain URLs
const URL_MAPPINGS = {
  '/app': 'https://dapp.diboas.com',
  './app': 'https://dapp.diboas.com',
  '/docs': 'https://docs.diboas.com',
  './docs': 'https://docs.diboas.com',
  '/learn': 'https://learn.diboas.com',
  './learn': 'https://learn.diboas.com',
  '/mascots': 'https://mascots.diboas.com',
  './mascots': 'https://mascots.diboas.com',
  '/investors': 'https://investors.diboas.com',
  './investors': 'https://investors.diboas.com',
  '/b2b': 'https://b2b.diboas.com',
  './b2b': 'https://b2b.diboas.com'
};

async function updateNavigationLinks() {
  console.log(chalk.cyan('🔄 Updating navigation to use subdomain URLs...'));
  
  try {
    // Find all HTML files
    const htmlFiles = await findHTMLFiles(PROJECT_ROOT);
    
    for (const filePath of htmlFiles) {
      // Skip node_modules and dist
      if (filePath.includes('node_modules') || filePath.includes('dist')) {
        continue;
      }
      
      let content = await fs.readFile(filePath, 'utf8');
      let modified = false;
      
      // Update href links
      Object.entries(URL_MAPPINGS).forEach(([oldPath, newUrl]) => {
        // Match href="/app" or href="./app" or href="/app/"
        const patterns = [
          new RegExp(`href="${oldPath}"`, 'g'),
          new RegExp(`href="${oldPath}/"`, 'g'),
          new RegExp(`href='${oldPath}'`, 'g'),
          new RegExp(`href='${oldPath}/'`, 'g')
        ];
        
        patterns.forEach(pattern => {
          if (pattern.test(content)) {
            content = content.replace(pattern, (match) => {
              const quote = match.includes('"') ? '"' : "'";
              return `href=${quote}${newUrl}${quote}`;
            });
            modified = true;
          }
        });
      });
      
      // Update JavaScript navigation
      const jsPatterns = [
        /window\.location\.href = ['"]\/app['"]/g,
        /window\.location\.href = ['"]\/docs['"]/g,
        /window\.location\.href = ['"]\/learn['"]/g,
        /window\.location\.href = ['"]\/mascots['"]/g,
        /window\.location\.href = ['"]\/investors['"]/g,
        /window\.location\.href = ['"]\/b2b['"]/g
      ];
      
      jsPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, (match) => {
            const path = match.match(/\/\w+/)[0];
            const quote = match.includes('"') ? '"' : "'";
            const newUrl = URL_MAPPINGS[path];
            return `window.location.href = ${quote}${newUrl}${quote}`;
          });
          modified = true;
        }
      });
      
      if (modified) {
        await fs.writeFile(filePath, content);
        console.log(chalk.green(`✅ Updated: ${path.relative(PROJECT_ROOT, filePath)}`));
      }
    }
    
    console.log(chalk.green('\n✨ Navigation links updated to use subdomains!'));
    console.log(chalk.yellow('\nNext steps:'));
    console.log('1. Test locally: npm run dev');
    console.log('2. Commit changes: git add . && git commit -m "Update navigation to use subdomain URLs"');
    console.log('3. Push to deploy: git push origin main');
    
  } catch (error) {
    console.error(chalk.red('❌ Error updating navigation:'), error);
    process.exit(1);
  }
}

async function findHTMLFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
      const subFiles = await findHTMLFiles(fullPath);
      files.push(...subFiles);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Also update JavaScript files
async function findJSFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
      const subFiles = await findJSFiles(fullPath);
      files.push(...subFiles);
    } else if (item.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateNavigationLinks();
}

export default updateNavigationLinks;