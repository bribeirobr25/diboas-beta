#!/usr/bin/env node

/**
 * Cloudflare Pages Build Script
 * Builds project with subdomain routing support
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

console.log(chalk.cyan('🌐 Building for Cloudflare Pages...'));

async function buildForCloudflarePages() {
  try {
    // Clean and create dist directory
    await fs.remove(path.join(PROJECT_ROOT, 'dist'));
    await fs.ensureDir(path.join(PROJECT_ROOT, 'dist'));
    
    console.log(chalk.yellow('📁 Setting up directory structure...'));
    
    // Create subdomain directories
    const subdomains = ['app', 'docs', 'learn', 'mascots', 'investors', 'b2b'];
    for (const subdomain of subdomains) {
      await fs.ensureDir(path.join(PROJECT_ROOT, 'dist', subdomain));
    }
    
    // Copy landing page to root
    console.log(chalk.blue('🏠 Building landing page...'));
    if (await fs.pathExists(path.join(PROJECT_ROOT, 'subdomains/landing/index.html'))) {
      await fs.copy(path.join(PROJECT_ROOT, 'subdomains/landing'), path.join(PROJECT_ROOT, 'dist'));
    } else {
      await fs.copy(path.join(PROJECT_ROOT, 'index.html'), path.join(PROJECT_ROOT, 'dist/index.html'));
    }
    
    // Copy each subdomain
    console.log(chalk.blue('📦 Building subdomains...'));
    
    // dApp (from subdomains/dapp or app/)
    const dappSource = await fs.pathExists(path.join(PROJECT_ROOT, 'subdomains/dapp')) 
      ? path.join(PROJECT_ROOT, 'subdomains/dapp')
      : path.join(PROJECT_ROOT, 'app');
    if (await fs.pathExists(dappSource)) {
      await fs.copy(dappSource, path.join(PROJECT_ROOT, 'dist/app'));
      console.log(chalk.green('   ✅ dApp built'));
    }
    
    // Docs
    const docsSource = await fs.pathExists(path.join(PROJECT_ROOT, 'subdomains/docs'))
      ? path.join(PROJECT_ROOT, 'subdomains/docs')
      : path.join(PROJECT_ROOT, 'docs');
    if (await fs.pathExists(docsSource)) {
      await fs.copy(docsSource, path.join(PROJECT_ROOT, 'dist/docs'));
      console.log(chalk.green('   ✅ Docs built'));
    }
    
    // Learn
    const learnSource = await fs.pathExists(path.join(PROJECT_ROOT, 'subdomains/learn'))
      ? path.join(PROJECT_ROOT, 'subdomains/learn') 
      : path.join(PROJECT_ROOT, 'learn');
    if (await fs.pathExists(learnSource)) {
      await fs.copy(learnSource, path.join(PROJECT_ROOT, 'dist/learn'));
      console.log(chalk.green('   ✅ Learn built'));
    }
    
    // Mascots
    const mascotsSource = await fs.pathExists(path.join(PROJECT_ROOT, 'subdomains/mascots'))
      ? path.join(PROJECT_ROOT, 'subdomains/mascots')
      : path.join(PROJECT_ROOT, 'mascots');
    if (await fs.pathExists(mascotsSource)) {
      await fs.copy(mascotsSource, path.join(PROJECT_ROOT, 'dist/mascots'));
      console.log(chalk.green('   ✅ Mascots built'));
    }
    
    // Investors
    const investorsSource = await fs.pathExists(path.join(PROJECT_ROOT, 'subdomains/investors'))
      ? path.join(PROJECT_ROOT, 'subdomains/investors')
      : path.join(PROJECT_ROOT, 'investors');
    if (await fs.pathExists(investorsSource)) {
      await fs.copy(investorsSource, path.join(PROJECT_ROOT, 'dist/investors'));
      console.log(chalk.green('   ✅ Investors built'));
    }
    
    // B2B (new subdomain)
    const b2bSource = path.join(PROJECT_ROOT, 'subdomains/b2b');
    if (await fs.pathExists(b2bSource)) {
      await fs.copy(b2bSource, path.join(PROJECT_ROOT, 'dist/b2b'));
      console.log(chalk.green('   ✅ B2B built'));
    }
    
    // Copy shared assets to each subdomain and root
    console.log(chalk.blue('🎨 Copying shared assets...'));
    const sharedAssets = path.join(PROJECT_ROOT, 'shared/assets');
    const fallbackAssets = path.join(PROJECT_ROOT, 'assets');
    
    const assetsSource = await fs.pathExists(sharedAssets) ? sharedAssets : fallbackAssets;
    
    if (await fs.pathExists(assetsSource)) {
      // Copy to root
      await fs.copy(assetsSource, path.join(PROJECT_ROOT, 'dist/assets'));
      
      // Copy to each subdomain
      for (const subdomain of subdomains) {
        const subdomainDir = path.join(PROJECT_ROOT, 'dist', subdomain);
        if (await fs.pathExists(subdomainDir)) {
          await fs.copy(assetsSource, path.join(subdomainDir, 'assets'));
        }
      }
      console.log(chalk.green('   ✅ Assets copied'));
    }
    
    // Create Cloudflare Pages redirects for subdomains
    await createCloudflareRedirects();
    
    // Update paths for production
    await updateProductionPaths();
    
    console.log(chalk.green('🎉 Cloudflare Pages build completed!'));
    console.log(chalk.yellow('📁 Output: dist/'));
    console.log(chalk.yellow('🚀 Ready for Cloudflare Pages deployment'));
    
  } catch (error) {
    console.error(chalk.red('❌ Build failed:'), error);
    process.exit(1);
  }
}

/**
 * Create Cloudflare Pages redirect rules
 */
async function createCloudflareRedirects() {
  console.log(chalk.blue('🔀 Creating Cloudflare redirect rules...'));
  
  const redirects = `
# Cloudflare Pages Redirects
# Subdomain routing for diBoaS platform

# Subdomain redirects to paths
https://dapp.diboas.com/* https://diboas.com/app/:splat 301
https://docs.diboas.com/* https://diboas.com/docs/:splat 301  
https://learn.diboas.com/* https://diboas.com/learn/:splat 301
https://mascots.diboas.com/* https://diboas.com/mascots/:splat 301
https://investors.diboas.com/* https://diboas.com/investors/:splat 301
https://b2b.diboas.com/* https://diboas.com/b2b/:splat 301

# Fallback rules
/app/* /app/index.html 200
/docs/* /docs/index.html 200
/learn/* /learn/index.html 200
/mascots/* /mascots/index.html 200
/investors/* /investors/index.html 200
/b2b/* /b2b/index.html 200

# Root fallback
/* /index.html 200
`;
  
  await fs.writeFile(path.join(PROJECT_ROOT, 'dist/_redirects'), redirects.trim());
  console.log(chalk.green('   ✅ Redirects created'));
}

/**
 * Update HTML files for production
 */
async function updateProductionPaths() {
  console.log(chalk.blue('🔧 Updating paths for production...'));
  
  const htmlFiles = await findHTMLFiles(path.join(PROJECT_ROOT, 'dist'));
  
  for (const filePath of htmlFiles) {
    let content = await fs.readFile(filePath, 'utf8');
    
    // Update environment to production
    content = content.replace(/NODE_ENV:\s*'development'/, "NODE_ENV: 'production'");
    
    // Update feature flags for Cloudflare
    content = content.replace(
      /CLOUDFLARE_PAGES:\s*false/,
      'CLOUDFLARE_PAGES: true'
    );
    
    // Ensure relative asset paths
    content = content.replace(/src="\/assets\//g, 'src="./assets/');
    content = content.replace(/href="\/assets\//g, 'href="./assets/');
    
    await fs.writeFile(filePath, content);
  }
  
  console.log(chalk.green('   ✅ Production paths updated'));
}

/**
 * Find all HTML files recursively
 */
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

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildForCloudflarePages();
}

export default buildForCloudflarePages;