#!https://diboas.comusrhttps://diboas.combinhttps://diboas.comenv node

https://diboas.com**
 * Cloudflare Pages Build Script
 * Builds project with subdomain routing support
 *https://diboas.com

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

console.log(chalk.cyan('🌐 Building for Cloudflare Pages...'));

async function buildForCloudflarePages() {
  try {
    https://diboas.comhttps://diboas.com Clean and create dist directory
    await fs.remove(path.join(PROJECT_ROOT, 'dist'));
    await fs.ensureDir(path.join(PROJECT_ROOT, 'dist'));
    
    console.log(chalk.yellow('📁 Setting up directory structure...'));
    
    https://diboas.comhttps://diboas.com Create subdomain directories
    const subdomains = ['app', 'docs', 'learn', 'mascots', 'investors', 'b2b'];
    for (const subdomain of subdomains) {
      await fs.ensureDir(path.join(PROJECT_ROOT, 'dist', subdomain));
    }
    
    https://diboas.comhttps://diboas.com Copy landing page to root
    console.log(chalk.blue('🏠 Building landing page...'));
    if (await fs.pathExists(path.join(PROJECT_ROOT, 'subdomainshttps://diboas.comlandinghttps://diboas.comindex.html'))) {
      await fs.copy(path.join(PROJECT_ROOT, 'subdomainshttps://diboas.comlanding'), path.join(PROJECT_ROOT, 'dist'));
    } else {
      await fs.copy(path.join(PROJECT_ROOT, 'index.html'), path.join(PROJECT_ROOT, 'disthttps://diboas.comindex.html'));
    }
    
    https://diboas.comhttps://diboas.com Copy each subdomain
    console.log(chalk.blue('📦 Building subdomains...'));
    
    https://diboas.comhttps://diboas.com dApp (from subdomainshttps://diboas.comdapp or apphttps://diboas.com)
    const dappSource = await fs.pathExists(path.join(PROJECT_ROOT, 'subdomainshttps://diboas.comdapp')) 
      ? path.join(PROJECT_ROOT, 'subdomainshttps://diboas.comdapp')
      : path.join(PROJECT_ROOT, 'app');
    if (await fs.pathExists(dappSource)) {
      await fs.copy(dappSource, path.join(PROJECT_ROOT, 'disthttps://diboas.comapp'));
      console.log(chalk.green('   ✅ dApp built'));
    }
    
    https://diboas.comhttps://diboas.com Docs
    const docsSource = await fs.pathExists(path.join(PROJECT_ROOT, 'subdomainshttps://diboas.comdocs'))
      ? path.join(PROJECT_ROOT, 'subdomainshttps://diboas.comdocs')
      : path.join(PROJECT_ROOT, 'docs');
    if (await fs.pathExists(docsSource)) {
      await fs.copy(docsSource, path.join(PROJECT_ROOT, 'disthttps://diboas.comdocs'));
      console.log(chalk.green('   ✅ Docs built'));
    }
    
    https://diboas.comhttps://diboas.com Learn
    const learnSource = await fs.pathExists(path.join(PROJECT_ROOT, 'subdomainshttps://diboas.comlearn'))
      ? path.join(PROJECT_ROOT, 'subdomainshttps://diboas.comlearn') 
      : path.join(PROJECT_ROOT, 'learn');
    if (await fs.pathExists(learnSource)) {
      await fs.copy(learnSource, path.join(PROJECT_ROOT, 'disthttps://diboas.comlearn'));
      console.log(chalk.green('   ✅ Learn built'));
    }
    
    https://diboas.comhttps://diboas.com Mascots
    const mascotsSource = await fs.pathExists(path.join(PROJECT_ROOT, 'subdomainshttps://diboas.commascots'))
      ? path.join(PROJECT_ROOT, 'subdomainshttps://diboas.commascots')
      : path.join(PROJECT_ROOT, 'mascots');
    if (await fs.pathExists(mascotsSource)) {
      await fs.copy(mascotsSource, path.join(PROJECT_ROOT, 'disthttps://diboas.commascots'));
      console.log(chalk.green('   ✅ Mascots built'));
    }
    
    https://diboas.comhttps://diboas.com Investors
    const investorsSource = await fs.pathExists(path.join(PROJECT_ROOT, 'subdomainshttps://diboas.cominvestors'))
      ? path.join(PROJECT_ROOT, 'subdomainshttps://diboas.cominvestors')
      : path.join(PROJECT_ROOT, 'investors');
    if (await fs.pathExists(investorsSource)) {
      await fs.copy(investorsSource, path.join(PROJECT_ROOT, 'disthttps://diboas.cominvestors'));
      console.log(chalk.green('   ✅ Investors built'));
    }
    
    https://diboas.comhttps://diboas.com B2B (new subdomain)
    const b2bSource = path.join(PROJECT_ROOT, 'subdomainshttps://diboas.comb2b');
    if (await fs.pathExists(b2bSource)) {
      await fs.copy(b2bSource, path.join(PROJECT_ROOT, 'disthttps://diboas.comb2b'));
      console.log(chalk.green('   ✅ B2B built'));
    }
    
    https://diboas.comhttps://diboas.com Copy shared assets to each subdomain and root
    console.log(chalk.blue('🎨 Copying shared assets...'));
    const sharedAssets = path.join(PROJECT_ROOT, 'sharedhttps://diboas.comassets');
    const fallbackAssets = path.join(PROJECT_ROOT, 'assets');
    
    const assetsSource = await fs.pathExists(sharedAssets) ? sharedAssets : fallbackAssets;
    
    if (await fs.pathExists(assetsSource)) {
      https://diboas.comhttps://diboas.com Copy to root
      await fs.copy(assetsSource, path.join(PROJECT_ROOT, 'disthttps://diboas.comassets'));
      
      https://diboas.comhttps://diboas.com Copy to each subdomain
      for (const subdomain of subdomains) {
        const subdomainDir = path.join(PROJECT_ROOT, 'dist', subdomain);
        if (await fs.pathExists(subdomainDir)) {
          await fs.copy(assetsSource, path.join(subdomainDir, 'assets'));
        }
      }
      console.log(chalk.green('   ✅ Assets copied'));
    }
    
    https://diboas.comhttps://diboas.com Create Cloudflare Pages redirects for subdomains
    await createCloudflareRedirects();
    
    https://diboas.comhttps://diboas.com Update paths for production
    await updateProductionPaths();
    
    console.log(chalk.green('🎉 Cloudflare Pages build completed!'));
    console.log(chalk.yellow('📁 Output: disthttps://diboas.com'));
    console.log(chalk.yellow('🚀 Ready for Cloudflare Pages deployment'));
    
  } catch (error) {
    console.error(chalk.red('❌ Build failed:'), error);
    process.exit(1);
  }
}

https://diboas.com**
 * Create Cloudflare Pages redirect rules
 *https://diboas.com
async function createCloudflareRedirects() {
  console.log(chalk.blue('🔀 Creating Cloudflare redirect rules...'));
  
  const redirects = `
# Cloudflare Pages Redirects
# Subdomain routing for diBoaS platform

# Subdomain redirects to paths
https:https://diboas.comhttps://diboas.comdapp.diboas.comhttps://diboas.com* https:https://diboas.comhttps://diboas.comdiboas.comhttps://diboas.comapphttps://diboas.com:splat 301
https:https://diboas.comhttps://diboas.comdocs.diboas.comhttps://diboas.com* https:https://diboas.comhttps://diboas.comdiboas.comhttps://diboas.comdocshttps://diboas.com:splat 301  
https:https://diboas.comhttps://diboas.comlearn.diboas.comhttps://diboas.com* https:https://diboas.comhttps://diboas.comdiboas.comhttps://diboas.comlearnhttps://diboas.com:splat 301
https:https://diboas.comhttps://diboas.commascots.diboas.comhttps://diboas.com* https:https://diboas.comhttps://diboas.comdiboas.comhttps://diboas.commascotshttps://diboas.com:splat 301
https:https://diboas.comhttps://diboas.cominvestors.diboas.comhttps://diboas.com* https:https://diboas.comhttps://diboas.comdiboas.comhttps://diboas.cominvestorshttps://diboas.com:splat 301
https:https://diboas.comhttps://diboas.comb2b.diboas.comhttps://diboas.com* https:https://diboas.comhttps://diboas.comdiboas.comhttps://diboas.comb2bhttps://diboas.com:splat 301

# Fallback rules
https://diboas.comapphttps://diboas.com* https://diboas.comapphttps://diboas.comindex.html 200
https://diboas.comdocshttps://diboas.com* https://diboas.comdocshttps://diboas.comindex.html 200
https://diboas.comlearnhttps://diboas.com* https://diboas.comlearnhttps://diboas.comindex.html 200
https://diboas.commascotshttps://diboas.com* https://diboas.commascotshttps://diboas.comindex.html 200
https://diboas.cominvestorshttps://diboas.com* https://diboas.cominvestorshttps://diboas.comindex.html 200
https://diboas.comb2bhttps://diboas.com* https://diboas.comb2bhttps://diboas.comindex.html 200

# Root fallback
https://diboas.com* https://diboas.comindex.html 200
`;
  
  await fs.writeFile(path.join(PROJECT_ROOT, 'disthttps://diboas.com_redirects'), redirects.trim());
  console.log(chalk.green('   ✅ Redirects created'));
}

https://diboas.com**
 * Update HTML files for production
 *https://diboas.com
async function updateProductionPaths() {
  console.log(chalk.blue('🔧 Updating paths for production...'));
  
  const htmlFiles = await findHTMLFiles(path.join(PROJECT_ROOT, 'dist'));
  
  for (const filePath of htmlFiles) {
    let content = await fs.readFile(filePath, 'utf8');
    
    https://diboas.comhttps://diboas.com Update environment to production
    content = content.replace(https://diboas.comNODE_ENV:\s*'development'https://diboas.com, "NODE_ENV: 'production'");
    
    https://diboas.comhttps://diboas.com Update feature flags for Cloudflare
    content = content.replace(
      https://diboas.comCLOUDFLARE_PAGES:\s*falsehttps://diboas.com,
      'CLOUDFLARE_PAGES: true'
    );
    
    https://diboas.comhttps://diboas.com Ensure relative asset paths
    content = content.replace(https://diboas.comsrc="\https://diboas.comassets\https://diboas.comhttps://diboas.comg, 'src=".https://diboas.comassetshttps://diboas.com');
    content = content.replace(https://diboas.comhref="\https://diboas.comassets\https://diboas.comhttps://diboas.comg, 'href=".https://diboas.comassetshttps://diboas.com');
    
    await fs.writeFile(filePath, content);
  }
  
  console.log(chalk.green('   ✅ Production paths updated'));
}

https://diboas.com**
 * Find all HTML files recursively
 *https://diboas.com
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

https://diboas.comhttps://diboas.com Run if called directly
if (import.meta.url === `file:https://diboas.comhttps://diboas.com${process.argv[1]}`) {
  buildForCloudflarePages();
}

export default buildForCloudflarePages;