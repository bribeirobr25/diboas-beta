/**
 * Build-time URL Configuration for diBoaS
 * Environment-aware URL mapping for development vs production
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

// Configuration version for cache invalidation
export const CONFIG_VERSION = '1.1.0';

// Supported environments
export const SUPPORTED_ENVIRONMENTS = ['development', 'production', 'staging', 'test'];

/**
 * URL mappings for build-time replacement
 * Development: Uses relative paths for local development server
 * Production: Uses absolute subdomain URLs for Cloudflare Pages deployment
 */
const urlMappings = {
  // Home/Landing page
  '{{HOME_URL}}': isDevelopment ? '/' : 'https://diboas.com',
  
  // Application subdomain
  '{{APP_URL}}': isDevelopment ? '/app' : 'https://dapp.diboas.com',
  
  // Documentation subdomain
  '{{DOCS_URL}}': isDevelopment ? '/docs' : 'https://docs.diboas.com',
  
  // Learning platform subdomain
  '{{LEARN_URL}}': isDevelopment ? '/learn' : 'https://learn.diboas.com',
  
  // Mascots showcase subdomain
  '{{MASCOTS_URL}}': isDevelopment ? '/mascots' : 'https://mascots.diboas.com',
  
  // Investors portal subdomain
  '{{INVESTORS_URL}}': isDevelopment ? '/investors' : 'https://investors.diboas.com',
  
  // B2B portal subdomain
  '{{B2B_URL}}': isDevelopment ? '/b2b' : 'https://b2b.diboas.com',
  
  // API and CDN URLs
  '{{API_URL}}': isDevelopment ? 'http://localhost:3000' : 'https://api.diboas.com',
  '{{CDN_URL}}': isDevelopment ? 'http://localhost:3000' : 'https://cdn.diboas.com',
  
  // Social Media URLs
  '{{TWITTER_URL}}': 'https://twitter.com/diboasfi',
  '{{LINKEDIN_URL}}': 'https://linkedin.com/company/diboasfi',
  
  // Repository URL
  '{{GITHUB_URL}}': 'https://github.com/bribeirobr25/diboas-beta'
};

/**
 * Get current environment configuration
 */
function getEnvironmentConfig() {
  return {
    isDevelopment,
    isProduction: !isDevelopment,
    nodeEnv: process.env.NODE_ENV || 'development',
    urls: Object.fromEntries(
      Object.entries(urlMappings).map(([key, value]) => [
        key.replace(/[{}]/g, '').toLowerCase(),
        value
      ])
    )
  };
}

/**
 * Replace URL placeholders in content
 */
function replaceUrlPlaceholders(content) {
  let processedContent = content;
  
  for (const [placeholder, url] of Object.entries(urlMappings)) {
    // Escape placeholder for regex (convert {{APP_URL}} to \\{\\{APP_URL\\}\\})
    const escapedPlaceholder = placeholder.replace(/[{}]/g, '\\$&');
    const regex = new RegExp(escapedPlaceholder, 'g');
    processedContent = processedContent.replace(regex, url);
  }
  
  return processedContent;
}

/**
 * Get URL for specific destination
 */
function getUrlFor(destination) {
  const key = `{{${destination.toUpperCase()}_URL}}`;
  return urlMappings[key] || '#';
}

/**
 * Get URL mappings for specific environment
 * This function returns environment-aware URL mappings
 */
function getUrlMappings(environment = null) {
  // If no environment specified, detect from NODE_ENV
  const targetEnv = environment || (process.env.NODE_ENV || 'development');
  
  // For staging, use production-like URLs but with staging subdomains
  if (targetEnv === 'staging') {
    const stagingMappings = {};
    for (const [key, prodUrl] of Object.entries(urlMappings)) {
      if (typeof prodUrl === 'string' && prodUrl.includes('diboas.com')) {
        stagingMappings[key] = prodUrl.replace('diboas.com', 'staging.diboas.com');
      } else {
        stagingMappings[key] = prodUrl;
      }
    }
    return stagingMappings;
  }
  
  // For test environment, use localhost with different ports
  if (targetEnv === 'test') {
    return {
      '{{HOME_URL}}': 'http://localhost:3000',
      '{{APP_URL}}': 'http://localhost:3001',
      '{{DOCS_URL}}': 'http://localhost:3002',
      '{{LEARN_URL}}': 'http://localhost:3003',
      '{{MASCOTS_URL}}': 'http://localhost:3004',
      '{{INVESTORS_URL}}': 'http://localhost:3005',
      '{{B2B_URL}}': 'http://localhost:3006'
    };
  }
  
  // For development and production, use the existing logic
  const isDevEnv = targetEnv === 'development';
  const mappings = {};
  
  for (const [key, value] of Object.entries(urlMappings)) {
    if (isDevEnv) {
      // Use development paths
      mappings[key] = value.includes('diboas.com') ? value.replace('https://diboas.com', '/').replace('https://dapp.diboas.com', '/app').replace('https://docs.diboas.com', '/docs').replace('https://learn.diboas.com', '/learn').replace('https://mascots.diboas.com', '/mascots').replace('https://investors.diboas.com', '/investors').replace('https://b2b.diboas.com', '/b2b') : value;
    } else {
      // Use production URLs
      mappings[key] = value.includes('/') && !value.includes('http') ? `https://diboas.com${value}` : value;
    }
  }
  
  return mappings;
}

/**
 * Validate that all placeholders have mappings
 */
function validatePlaceholders(content) {
  const placeholderRegex = /\{\{[A-Z_]+_URL\}\}/g;
  const foundPlaceholders = content.match(placeholderRegex) || [];
  const unmappedPlaceholders = foundPlaceholders.filter(
    placeholder => !urlMappings.hasOwnProperty(placeholder)
  );
  
  if (unmappedPlaceholders.length > 0) {
    console.warn('⚠️  Unmapped URL placeholders found:', unmappedPlaceholders);
    return false;
  }
  
  return true;
}

export {
  urlMappings,
  getEnvironmentConfig,
  replaceUrlPlaceholders,
  getUrlFor,
  getUrlMappings,
  validatePlaceholders,
  isDevelopment
};