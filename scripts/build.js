#!/usr/bin/env node

/**
 * diBoaS Build Script
 * Builds all subdomains for production deployment
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

// Build configuration
const BUILD_CONFIG = {
  source: path.join(PROJECT_ROOT, 'subdomains'),
  output: path.join(PROJECT_ROOT, 'dist'),
  shared: path.join(PROJECT_ROOT, 'shared'),
  subdomains: ['landing', 'dapp', 'docs', 'learn', 'mascots', 'investors', 'b2b']
};

/**
 * Main build process
 */
async function build() {
  console.log(chalk.cyan('🏗️  Starting diBoaS Build Process'));
  console.log(chalk.gray('─'.repeat(50)));
  
  try {
    // Clean previous build
    await cleanBuild();
    
    // Build all subdomains
    for (const subdomain of BUILD_CONFIG.subdomains) {
      await buildSubdomain(subdomain);
    }
    
    // Copy shared assets
    await copySharedAssets();
    
    // Generate deployment configuration
    await generateDeploymentConfig();
    
    console.log(chalk.green('\n✅ Build completed successfully!'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.yellow('📁 Output directory: dist/'));
    console.log(chalk.yellow('🚀 Ready for deployment'));
    
  } catch (error) {
    console.error(chalk.red('❌ Build failed:'), error.message);
    process.exit(1);
  }
}

/**
 * Clean previous build
 */
async function cleanBuild() {
  console.log(chalk.yellow('🧹 Cleaning previous build...'));
  await fs.remove(BUILD_CONFIG.output);
  await fs.ensureDir(BUILD_CONFIG.output);
}

/**
 * Build a specific subdomain
 */
async function buildSubdomain(subdomain) {
  console.log(chalk.blue(`📦 Building ${subdomain} subdomain...`));
  
  const sourceDir = path.join(BUILD_CONFIG.source, subdomain);
  const outputDir = path.join(BUILD_CONFIG.output, subdomain);
  
  // Check if subdomain exists
  if (!await fs.pathExists(sourceDir)) {
    console.log(chalk.gray(`   ⚠️  ${subdomain} subdomain not found, skipping...`));
    return;
  }
  
  // Copy subdomain files
  await fs.copy(sourceDir, outputDir);
  
  // Update paths for production
  await updateProductionPaths(outputDir, subdomain);
  
  console.log(chalk.green(`   ✅ ${subdomain} built successfully`));
}

/**
 * Copy shared assets
 */
async function copySharedAssets() {
  console.log(chalk.blue('📁 Copying shared assets...'));
  
  // Copy assets to each subdomain's build output
  for (const subdomain of BUILD_CONFIG.subdomains) {
    const subdomainOutput = path.join(BUILD_CONFIG.output, subdomain);
    const assetsOutput = path.join(subdomainOutput, 'assets');
    
    if (await fs.pathExists(subdomainOutput)) {
      await fs.copy(path.join(BUILD_CONFIG.shared, 'assets'), assetsOutput);
      
      // Copy shared utilities
      const utilsOutput = path.join(assetsOutput, 'js', 'utils');
      await fs.ensureDir(utilsOutput);
      await fs.copy(path.join(BUILD_CONFIG.shared, 'utils'), utilsOutput);
    }
  }
  
  console.log(chalk.green('   ✅ Shared assets copied'));
}

/**
 * Update paths for production deployment
 */
async function updateProductionPaths(subdomainDir, subdomain) {
  const indexPath = path.join(subdomainDir, 'index.html');
  
  if (await fs.pathExists(indexPath)) {
    let html = await fs.readFile(indexPath, 'utf8');
    
    // Update asset paths to be relative
    html = html.replace(/src="\/assets\//g, 'src="./assets/');
    html = html.replace(/href="\/assets\//g, 'href="./assets/');
    
    // Update navigation links for production subdomains
    const subdomainMap = {
      landing: 'https://diboas.com',
      dapp: 'https://dapp.diboas.com',
      docs: 'https://docs.diboas.com',
      learn: 'https://learn.diboas.com',
      mascots: 'https://mascots.diboas.com',
      investors: 'https://investors.diboas.com',
      b2b: 'https://b2b.diboas.com'
    };
    
    // Update navigation links
    Object.entries(subdomainMap).forEach(([name, url]) => {
      if (name !== subdomain) {
        html = html.replace(new RegExp(`href="/${name}"`, 'g'), `href="${url}"`);
        html = html.replace(new RegExp(`href="./${name}/"`, 'g'), `href="${url}"`);
      }
    });
    
    // Update environment config
    html = html.replace(/NODE_ENV:\s*'development'/, "NODE_ENV: 'production'");
    
    await fs.writeFile(indexPath, html);
  }
}

/**
 * Generate deployment configuration
 */
async function generateDeploymentConfig() {
  console.log(chalk.blue('⚙️  Generating deployment configuration...'));
  
  // Generate nginx configuration
  const nginxConfig = `
# diBoaS OneFi Platform - Nginx Configuration
# Generated automatically by build script

# Main domain - Landing page
server {
    listen 80;
    server_name diboas.com www.diboas.com;
    root /var/www/diboas/landing;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# dApp subdomain
server {
    listen 80;
    server_name dapp.diboas.com;
    root /var/www/diboas/dapp;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Documentation subdomain
server {
    listen 80;
    server_name docs.diboas.com;
    root /var/www/diboas/docs;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Learning Center subdomain  
server {
    listen 80;
    server_name learn.diboas.com;
    root /var/www/diboas/learn;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Mascots subdomain
server {
    listen 80;
    server_name mascots.diboas.com;
    root /var/www/diboas/mascots;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Investors subdomain
server {
    listen 80;
    server_name investors.diboas.com;
    root /var/www/diboas/investors;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# B2B subdomain
server {
    listen 80;
    server_name b2b.diboas.com;
    root /var/www/diboas/b2b;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
`;

  await fs.writeFile(path.join(BUILD_CONFIG.output, 'nginx.conf'), nginxConfig);
  
  // Generate deployment README
  const deploymentReadme = `
# diBoaS Deployment Guide

## Subdomain Structure
- \`diboas.com\` → \`dist/landing/\`
- \`dapp.diboas.com\` → \`dist/dapp/\`  
- \`docs.diboas.com\` → \`dist/docs/\`
- \`learn.diboas.com\` → \`dist/learn/\`
- \`mascots.diboas.com\` → \`dist/mascots/\`
- \`investors.diboas.com\` → \`dist/investors/\`
- \`b2b.diboas.com\` → \`dist/b2b/\`

## Deployment Steps
1. Upload subdomain directories to respective server locations
2. Configure DNS to point subdomains to server
3. Apply nginx configuration from \`nginx.conf\`
4. Enable SSL certificates for all domains
5. Test all subdomain routing

## Environment Variables
- All subdomains are built for production environment
- API endpoints point to \`https://api.diboas.com\`
- CDN assets point to \`https://cdn.diboas.com\`

Generated: ${new Date().toISOString()}
`;

  await fs.writeFile(path.join(BUILD_CONFIG.output, 'DEPLOYMENT.md'), deploymentReadme);
  
  console.log(chalk.green('   ✅ Deployment configuration generated'));
}

// Run build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  build();
}

export default build;