#!/usr/bin/env node

/**
 * GitHub Pages Build Script
 * Prepares the project for GitHub Pages deployment with path-based routing
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

console.log(chalk.cyan('📦 Building for GitHub Pages...'));

async function buildForGitHubPages() {
  try {
    // Clean and create dist directory
    await fs.remove(path.join(PROJECT_ROOT, 'dist'));
    await fs.ensureDir(path.join(PROJECT_ROOT, 'dist'));
    
    // Copy root files
    await fs.copy(path.join(PROJECT_ROOT, 'index.html'), path.join(PROJECT_ROOT, 'dist', 'index.html'));
    await fs.copy(path.join(PROJECT_ROOT, 'assets'), path.join(PROJECT_ROOT, 'dist', 'assets'));
    await fs.copy(path.join(PROJECT_ROOT, 'manifest.json'), path.join(PROJECT_ROOT, 'dist', 'manifest.json'));
    await fs.copy(path.join(PROJECT_ROOT, 'sw.js'), path.join(PROJECT_ROOT, 'dist', 'sw.js'));
    
    // Copy existing subdomain folders to paths
    const existingDirs = ['app', 'docs', 'learn', 'mascots', 'investors'];
    for (const dir of existingDirs) {
      const sourcePath = path.join(PROJECT_ROOT, dir);
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, path.join(PROJECT_ROOT, 'dist', dir));
        console.log(chalk.green(`✅ Copied ${dir}`));
      }
    }
    
    // Copy new B2B subdomain if it exists
    const b2bSourcePath = path.join(PROJECT_ROOT, 'subdomains', 'b2b');
    if (await fs.pathExists(b2bSourcePath)) {
      await fs.copy(b2bSourcePath, path.join(PROJECT_ROOT, 'dist', 'b2b'));
      console.log(chalk.green('✅ Copied B2B subdomain'));
    }
    
    // Update HTML files to use relative paths
    await updatePathsForGitHubPages();
    
    // Create 404.html for GitHub Pages SPA routing
    await createNotFoundPage();
    
    console.log(chalk.green('🎉 GitHub Pages build completed!'));
    console.log(chalk.yellow('📁 Files ready in: dist/'));
    
  } catch (error) {
    console.error(chalk.red('❌ Build failed:'), error);
    process.exit(1);
  }
}

async function updatePathsForGitHubPages() {
  const distDir = path.join(PROJECT_ROOT, 'dist');
  
  // Find all HTML files
  const htmlFiles = await findHTMLFiles(distDir);
  
  for (const filePath of htmlFiles) {
    let content = await fs.readFile(filePath, 'utf8');
    
    // Update asset paths to be relative
    content = content.replace(/src="\/assets\//g, 'src="../assets/');
    content = content.replace(/href="\/assets\//g, 'href="../assets/');
    
    // For root index.html, keep assets relative
    if (path.basename(filePath) === 'index.html' && path.dirname(filePath) === distDir) {
      content = content.replace(/src="\.\.\/assets\//g, 'src="./assets/');
      content = content.replace(/href="\.\.\/assets\//g, 'href="./assets/');
    }
    
    // Update navigation links to use relative paths (keep current behavior)
    content = content.replace(/href="\/app"/g, 'href="./app/"');
    content = content.replace(/href="\/docs"/g, 'href="./docs/"'); 
    content = content.replace(/href="\/learn"/g, 'href="./learn/"');
    content = content.replace(/href="\/mascots"/g, 'href="./mascots/"');
    content = content.replace(/href="\/investors"/g, 'href="./investors/"');
    content = content.replace(/href="\/b2b"/g, 'href="./b2b/"');
    
    // Update environment to production
    content = content.replace(/NODE_ENV:\s*'development'/, "NODE_ENV: 'production'");
    
    await fs.writeFile(filePath, content);
  }
  
  console.log(chalk.green('✅ Updated paths for GitHub Pages'));
}

async function findHTMLFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      const subFiles = await findHTMLFiles(fullPath);
      files.push(...subFiles);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function createNotFoundPage() {
  const notFoundContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found - diBoaS</title>
  <script>
    // GitHub Pages SPA routing fallback
    const currentPath = window.location.pathname;
    
    // Redirect to appropriate section
    if (currentPath.startsWith('/app')) {
      window.location.replace('/app/');
    } else if (currentPath.startsWith('/docs')) {
      window.location.replace('/docs/');
    } else if (currentPath.startsWith('/learn')) {
      window.location.replace('/learn/');
    } else if (currentPath.startsWith('/mascots')) {
      window.location.replace('/mascots/');
    } else if (currentPath.startsWith('/investors')) {
      window.location.replace('/investors/');
    } else if (currentPath.startsWith('/b2b')) {
      window.location.replace('/b2b/');
    } else {
      // Default to home page
      window.location.replace('/');
    }
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`;
  
  await fs.writeFile(path.join(PROJECT_ROOT, 'dist', '404.html'), notFoundContent);
  console.log(chalk.green('✅ Created 404.html for SPA routing'));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildForGitHubPages();
}

export default buildForGitHubPages;