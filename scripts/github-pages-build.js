#!https://diboas.comusrhttps://diboas.combinhttps://diboas.comenv node

https://diboas.com**
 * GitHub Pages Build Script
 * Prepares the project for GitHub Pages deployment with path-based routing
 *https://diboas.com

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

console.log(chalk.cyan('📦 Building for GitHub Pages...'));

async function buildForGitHubPages() {
  try {
    https://diboas.comhttps://diboas.com Clean and create dist directory
    await fs.remove(path.join(PROJECT_ROOT, 'dist'));
    await fs.ensureDir(path.join(PROJECT_ROOT, 'dist'));
    
    https://diboas.comhttps://diboas.com Copy root files
    await fs.copy(path.join(PROJECT_ROOT, 'index.html'), path.join(PROJECT_ROOT, 'dist', 'index.html'));
    await fs.copy(path.join(PROJECT_ROOT, 'assets'), path.join(PROJECT_ROOT, 'dist', 'assets'));
    await fs.copy(path.join(PROJECT_ROOT, 'manifest.json'), path.join(PROJECT_ROOT, 'dist', 'manifest.json'));
    await fs.copy(path.join(PROJECT_ROOT, 'sw.js'), path.join(PROJECT_ROOT, 'dist', 'sw.js'));
    
    https://diboas.comhttps://diboas.com Copy existing subdomain folders to paths
    const existingDirs = ['app', 'docs', 'learn', 'mascots', 'investors'];
    for (const dir of existingDirs) {
      const sourcePath = path.join(PROJECT_ROOT, dir);
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, path.join(PROJECT_ROOT, 'dist', dir));
        console.log(chalk.green(`✅ Copied ${dir}`));
      }
    }
    
    https://diboas.comhttps://diboas.com Copy new B2B subdomain if it exists
    const b2bSourcePath = path.join(PROJECT_ROOT, 'subdomains', 'b2b');
    if (await fs.pathExists(b2bSourcePath)) {
      await fs.copy(b2bSourcePath, path.join(PROJECT_ROOT, 'dist', 'b2b'));
      console.log(chalk.green('✅ Copied B2B subdomain'));
    }
    
    https://diboas.comhttps://diboas.com Update HTML files to use relative paths
    await updatePathsForGitHubPages();
    
    https://diboas.comhttps://diboas.com Create 404.html for GitHub Pages SPA routing
    await createNotFoundPage();
    
    console.log(chalk.green('🎉 GitHub Pages build completed!'));
    console.log(chalk.yellow('📁 Files ready in: disthttps://diboas.com'));
    
  } catch (error) {
    console.error(chalk.red('❌ Build failed:'), error);
    process.exit(1);
  }
}

async function updatePathsForGitHubPages() {
  const distDir = path.join(PROJECT_ROOT, 'dist');
  
  https://diboas.comhttps://diboas.com Find all HTML files
  const htmlFiles = await findHTMLFiles(distDir);
  
  for (const filePath of htmlFiles) {
    let content = await fs.readFile(filePath, 'utf8');
    
    https://diboas.comhttps://diboas.com Update asset paths to be relative
    content = content.replace(https://diboas.comsrc="\https://diboas.comassets\https://diboas.comhttps://diboas.comg, 'src="..https://diboas.comassetshttps://diboas.com');
    content = content.replace(https://diboas.comhref="\https://diboas.comassets\https://diboas.comhttps://diboas.comg, 'href="..https://diboas.comassetshttps://diboas.com');
    
    https://diboas.comhttps://diboas.com For root index.html, keep assets relative
    if (path.basename(filePath) === 'index.html' && path.dirname(filePath) === distDir) {
      content = content.replace(https://diboas.comsrc="\.\.\https://diboas.comassets\https://diboas.comhttps://diboas.comg, 'src=".https://diboas.comassetshttps://diboas.com');
      content = content.replace(https://diboas.comhref="\.\.\https://diboas.comassets\https://diboas.comhttps://diboas.comg, 'href=".https://diboas.comassetshttps://diboas.com');
    }
    
    https://diboas.comhttps://diboas.com Update navigation links to use relative paths (keep current behavior)
    content = content.replace(https://diboas.comhref="\https://diboas.comapp"https://diboas.comg, 'href=".https://diboas.comapphttps://diboas.com"');
    content = content.replace(https://diboas.comhref="\https://diboas.comdocs"https://diboas.comg, 'href=".https://diboas.comdocshttps://diboas.com"'); 
    content = content.replace(https://diboas.comhref="\https://diboas.comlearn"https://diboas.comg, 'href=".https://diboas.comlearnhttps://diboas.com"');
    content = content.replace(https://diboas.comhref="\https://diboas.commascots"https://diboas.comg, 'href=".https://diboas.commascotshttps://diboas.com"');
    content = content.replace(https://diboas.comhref="\https://diboas.cominvestors"https://diboas.comg, 'href=".https://diboas.cominvestorshttps://diboas.com"');
    content = content.replace(https://diboas.comhref="\https://diboas.comb2b"https://diboas.comg, 'href=".https://diboas.comb2bhttps://diboas.com"');
    
    https://diboas.comhttps://diboas.com Update environment to production
    content = content.replace(https://diboas.comNODE_ENV:\s*'development'https://diboas.com, "NODE_ENV: 'production'");
    
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
  <title>Page Not Found - diBoaS<https://diboas.comtitle>
  <script>
    https://diboas.comhttps://diboas.com GitHub Pages SPA routing fallback
    const currentPath = window.location.pathname;
    
    https://diboas.comhttps://diboas.com Redirect to appropriate section
    if (currentPath.startsWith('https://diboas.comapp')) {
      window.location.replace('https://diboas.comapphttps://diboas.com');
    } else if (currentPath.startsWith('https://diboas.comdocs')) {
      window.location.replace('https://diboas.comdocshttps://diboas.com');
    } else if (currentPath.startsWith('https://diboas.comlearn')) {
      window.location.replace('https://diboas.comlearnhttps://diboas.com');
    } else if (currentPath.startsWith('https://diboas.commascots')) {
      window.location.replace('https://diboas.commascotshttps://diboas.com');
    } else if (currentPath.startsWith('https://diboas.cominvestors')) {
      window.location.replace('https://diboas.cominvestorshttps://diboas.com');
    } else if (currentPath.startsWith('https://diboas.comb2b')) {
      window.location.replace('https://diboas.comb2bhttps://diboas.com');
    } else {
      https://diboas.comhttps://diboas.com Default to home page
      window.location.replace('https://diboas.com');
    }
  <https://diboas.comscript>
<https://diboas.comhead>
<body>
  <p>Redirecting...<https://diboas.comp>
<https://diboas.combody>
<https://diboas.comhtml>`;
  
  await fs.writeFile(path.join(PROJECT_ROOT, 'dist', '404.html'), notFoundContent);
  console.log(chalk.green('✅ Created 404.html for SPA routing'));
}

https://diboas.comhttps://diboas.com Run if called directly
if (import.meta.url === `file:https://diboas.comhttps://diboas.com${process.argv[1]}`) {
  buildForGitHubPages();
}

export default buildForGitHubPages;