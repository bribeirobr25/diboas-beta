#!/usr/bin/env node

/**
 * Build script for individual subdomains
 * Maintains DDD architecture while preparing static files for Cloudflare Pages
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { replaceUrlPlaceholders } from '../config/build-urls.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const subdomainArg = args.find(arg => arg.startsWith('--subdomain='));
const subdomain = subdomainArg ? subdomainArg.split('=')[1] : null;

if (!subdomain) {
  console.error('Error: --subdomain parameter is required');
  console.error('Usage: node build-subdomain.js --subdomain=<name>');
  process.exit(1);
}

// Map subdomains to their source directories
const subdomainMap = {
  'landing': '',  // Root index.html
  'dapp': 'frontend/dapp',
  'docs': 'frontend/docs',
  'learn': 'frontend/learn',
  'mascots': 'frontend/mascots',
  'investors': 'frontend/investors',
  'b2b': 'frontend/b2b'
};

if (!subdomainMap.hasOwnProperty(subdomain)) {
  console.error(`Error: Unknown subdomain '${subdomain}'`);
  console.error(`Valid subdomains: ${Object.keys(subdomainMap).join(', ')}`);
  process.exit(1);
}

async function ensureDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    throw error;
  }
}

async function copyFile(src, dest) {
  try {
    await fs.copyFile(src, dest);
    console.log(`Copied: ${src} → ${dest}`);
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error);
    throw error;
  }
}

async function copyAndProcessHtml(src, dest) {
  try {
    // Read the HTML file
    const content = await fs.readFile(src, 'utf8');
    
    // Process URL placeholders for production
    const processedContent = replaceUrlPlaceholders(content);
    
    // Write the processed content
    await fs.writeFile(dest, processedContent, 'utf8');
    console.log(`Processed: ${src} → ${dest}`);
  } catch (error) {
    console.error(`Error processing ${src} to ${dest}:`, error);
    throw error;
  }
}

async function copyAndProcessJson(src, dest) {
  try {
    // Read the JSON file
    const content = await fs.readFile(src, 'utf8');
    
    // Process URL placeholders for production
    const processedContent = replaceUrlPlaceholders(content);
    
    // Write the processed content
    await fs.writeFile(dest, processedContent, 'utf8');
    console.log(`Processed: ${src} → ${dest}`);
  } catch (error) {
    console.error(`Error processing ${src} to ${dest}:`, error);
    throw error;
  }
}

async function copyDirectory(src, dest) {
  await ensureDirectory(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      // Process HTML, JSON, and webmanifest files to replace URL placeholders
      if (entry.name.endsWith('.html')) {
        await copyAndProcessHtml(srcPath, destPath);
      } else if (entry.name.endsWith('.json') || entry.name.endsWith('.webmanifest')) {
        await copyAndProcessJson(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  }
}

async function buildSubdomain() {
  console.log(`Building ${subdomain} subdomain...`);
  
  // Cloudflare expects output in subdomain/dist structure
  const distDir = path.join(projectRoot, subdomain, 'dist');
  await ensureDirectory(distDir);
  
  if (subdomain === 'landing') {
    // Special case for landing page (root index.html)
    const indexPath = path.join(projectRoot, 'index.html');
    await copyAndProcessHtml(indexPath, path.join(distDir, 'index.html'));
    
    // Copy shared assets for landing page
    const assetsSource = path.join(projectRoot, 'assets');
    const assetsDest = path.join(distDir, 'assets');
    await copyDirectory(assetsSource, assetsDest);
    
    // Copy DDD src for landing page
    const srcSource = path.join(projectRoot, 'src');
    const srcDest = path.join(distDir, 'src');
    await copyDirectory(srcSource, srcDest);
  } else {
    // Copy subdomain files
    const subdomainSource = path.join(projectRoot, subdomainMap[subdomain]);
    await copyDirectory(subdomainSource, distDir);
    
    // Copy shared assets (maintaining relative paths)
    const assetsSource = path.join(projectRoot, 'assets');
    const assetsDest = path.join(distDir, 'assets');
    await copyDirectory(assetsSource, assetsDest);
    
    // Copy DDD src directory (maintaining relative paths)
    const srcSource = path.join(projectRoot, 'src');
    const srcDest = path.join(distDir, 'src');
    await copyDirectory(srcSource, srcDest);
  }
  
  console.log(`✅ Build complete for ${subdomain} subdomain`);
  console.log(`📁 Output directory: ${distDir}`);
}

// Run the build
buildSubdomain().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});