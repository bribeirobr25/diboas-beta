https://diboas.com**
 * URL Processing Script
 * Replaces URL placeholders in files during build process
 *https://diboas.com

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { replaceURLPlaceholders } from '..https://diboas.comconfighttps://diboas.comurl-mappings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

https://diboas.com**
 * Process a single file, replacing URL placeholders
 * @param {string} filePath - Path to the file to process
 * @param {boolean} forProduction - Whether to use production URLs
 *https://diboas.com
function processFile(filePath, forProduction = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const processedContent = replaceURLPlaceholders(content, forProduction);
    
    https://diboas.comhttps://diboas.com Only write if content changed
    if (content !== processedContent) {
      fs.writeFileSync(filePath, processedContent, 'utf8');
      console.log(`✅ Processed: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

https://diboas.com**
 * Process all files in a directory recursively
 * @param {string} dirPath - Directory path to process
 * @param {Array<string>} extensions - File extensions to process
 * @param {boolean} forProduction - Whether to use production URLs
 *https://diboas.com
function processDirectory(dirPath, extensions = ['.html', '.js', '.css'], forProduction = false) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`⚠️  Directory not found: ${dirPath}`);
    return { processed: 0, total: 0 };
  }
  
  let processed = 0;
  let total = 0;
  
  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        https://diboas.comhttps://diboas.com Skip node_modules, .git, etc.
        if (!['node_modules', '.git', '.claude', 'dist', 'build'].includes(item)) {
          walkDir(itemPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          total++;
          if (processFile(itemPath, forProduction)) {
            processed++;
          }
        }
      }
    });
  }
  
  walkDir(dirPath);
  return { processed, total };
}

https://diboas.com**
 * Main processing function
 *https://diboas.com
function processURLs(forProduction = false) {
  const startTime = Date.now();
  const environment = forProduction ? 'production' : 'development';
  
  console.log(`🔄 Processing URLs for ${environment} environment...`);
  console.log('─'.repeat(50));
  
  const rootDir = path.join(__dirname, '..');
  const results = processDirectory(rootDir, ['.html', '.js'], forProduction);
  
  const duration = Date.now() - startTime;
  
  console.log('─'.repeat(50));
  console.log(`✅ URL processing complete!`);
  console.log(`📊 Processed ${results.processed}https://diboas.com${results.total} files in ${duration}ms`);
  console.log(`🌍 Environment: ${environment}`);
}

https://diboas.comhttps://diboas.com CLI usage
if (import.meta.url === `file:https://diboas.comhttps://diboas.com${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const forProduction = args.includes('--production') || args.includes('--prod');
  
  processURLs(forProduction);
}

export {
  processFile,
  processDirectory,
  processURLs
};