/**
 * diBoaS Environment Utilities - CLIENT-SIDE
 * 
 * Purpose: Runtime client-side environment detection and navigation
 * Used by: Frontend applications, UI components, client-side routing
 * 
 * Note: Build-time environment configuration is in config/environment.js
 * This separation maintains clean architecture between build-time and runtime concerns.
 */

'use strict';

// Environment detection
const ENVIRONMENT = {
  isDevelopment: () => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isStaging: () => window.location.hostname.includes('staging'),
  isProduction: () => !ENVIRONMENT.isDevelopment() && !ENVIRONMENT.isStaging(),
  
  getCurrentEnvironment: () => {
    if (ENVIRONMENT.isDevelopment()) return 'development';
    if (ENVIRONMENT.isStaging()) return 'staging';
    return 'production';
  }
};

// URL Configuration based on environment
const URL_CONFIG = {
  development: {
    base: 'http://localhost:3000',
    assets: '/assets',
    api: '/api',
    subdomains: {
      landing: '/',
      dapp: '/app',
      docs: '/docs',
      learn: '/learn',
      mascots: '/mascots',
      investors: '/investors',
      b2b: '/b2b'
    }
  },
  staging: {
    base: 'https://staging.diboas.com',
    assets: 'https://cdn.staging.diboas.com',
    api: 'https://api.staging.diboas.com',
    subdomains: {
      landing: 'https://staging.diboas.com',
      dapp: 'https://dapp.staging.diboas.com',
      docs: 'https://docs.staging.diboas.com',
      learn: 'https://learn.staging.diboas.com',
      mascots: 'https://mascots.staging.diboas.com',
      investors: 'https://investors.staging.diboas.com',
      b2b: 'https://b2b.staging.diboas.com'
    }
  },
  production: {
    base: 'https://diboas.com',
    assets: 'https://cdn.diboas.com',
    api: 'https://api.diboas.com',
    subdomains: {
      landing: 'https://diboas.com',
      dapp: 'https://dapp.diboas.com',
      docs: 'https://docs.diboas.com',
      learn: 'https://learn.diboas.com',
      mascots: 'https://mascots.diboas.com',
      investors: 'https://investors.diboas.com',
      b2b: 'https://b2b.diboas.com'
    }
  }
};

/**
 * Get current URL configuration
 */
function getCurrentURLConfig() {
  const env = ENVIRONMENT.getCurrentEnvironment();
  return URL_CONFIG[env];
}

/**
 * Get URL for a specific subdomain
 */
function getSubdomainURL(subdomain) {
  const config = getCurrentURLConfig();
  return config.subdomains[subdomain] || config.subdomains.landing;
}

/**
 * Get asset URL with environment-aware path
 */
function getAssetURL(path) {
  const config = getCurrentURLConfig();
  return `${config.assets}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Get API URL with environment-aware path
 */
function getAPIURL(endpoint) {
  const config = getCurrentURLConfig();
  return `${config.api}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
}

/**
 * Navigate to subdomain (environment-aware)
 */
function navigateToSubdomain(subdomain, path = '') {
  const url = getSubdomainURL(subdomain);
  const fullURL = `${url}${path}`;
  
  // Track navigation
  if (window.DiBoaS && window.DiBoaS.trackEvent) {
    window.DiBoaS.trackEvent('subdomain_navigation', {
      from: getCurrentSubdomain(),
      to: subdomain,
      path: path,
      environment: ENVIRONMENT.getCurrentEnvironment()
    });
  }
  
  window.location.href = fullURL;
}

/**
 * Detect current subdomain
 */
function getCurrentSubdomain() {
  if (ENVIRONMENT.isDevelopment()) {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'landing';
    return path.split('/')[1] || 'landing';
  } else {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // Map subdomain to known subdomains
    const knownSubdomains = ['dapp', 'docs', 'learn', 'mascots', 'investors', 'b2b'];
    return knownSubdomains.includes(subdomain) ? subdomain : 'landing';
  }
}

/**
 * Update navigation links to use environment-aware URLs
 */
function updateNavigationLinks() {
  const navLinks = document.querySelectorAll('a[href^="/"], a[data-subdomain]');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const subdomain = link.getAttribute('data-subdomain');
    
    if (subdomain) {
      // Explicit subdomain specified
      link.href = getSubdomainURL(subdomain);
    } else if (href && href.startsWith('/')) {
      // Convert relative paths to environment-aware URLs
      const path = href.substring(1); // Remove leading slash
      
      // Determine subdomain from path
      let targetSubdomain = 'landing';
      if (path.startsWith('app')) targetSubdomain = 'dapp';
      else if (path.startsWith('docs')) targetSubdomain = 'docs';
      else if (path.startsWith('learn')) targetSubdomain = 'learn';
      else if (path.startsWith('mascots')) targetSubdomain = 'mascots';
      else if (path.startsWith('investors')) targetSubdomain = 'investors';
      else if (path.startsWith('b2b')) targetSubdomain = 'b2b';
      
      if (targetSubdomain !== 'landing') {
        const remainingPath = path.substring(targetSubdomain.length);
        link.href = getSubdomainURL(targetSubdomain) + remainingPath;
      }
    }
  });
}

/**
 * Update asset paths to use environment-aware URLs
 */
function updateAssetPaths() {
  // Update image sources
  document.querySelectorAll('img[src^="/assets"], img[src^="./assets"]').forEach(img => {
    const src = img.getAttribute('src');
    const cleanSrc = src.replace(/^\.?\//, '/');
    img.src = getAssetURL(cleanSrc);
  });
  
  // Update CSS links
  document.querySelectorAll('link[href^="/assets"], link[href^="./assets"]').forEach(link => {
    const href = link.getAttribute('href');
    const cleanHref = href.replace(/^\.?\//, '/');
    link.href = getAssetURL(cleanHref);
  });
  
  // Update script sources
  document.querySelectorAll('script[src^="/assets"], script[src^="./assets"]').forEach(script => {
    const src = script.getAttribute('src');
    const cleanSrc = src.replace(/^\.?\//, '/');
    script.src = getAssetURL(cleanSrc);
  });
}

/**
 * Initialize environment utilities
 */
function initializeEnvironment() {
  // Set global environment config
  window.DIBOAS_ENV = {
    environment: ENVIRONMENT.getCurrentEnvironment(),
    subdomain: getCurrentSubdomain(),
    urls: getCurrentURLConfig(),
    navigate: navigateToSubdomain,
    getAssetURL,
    getAPIURL
  };
  
  // Update DOM elements on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateNavigationLinks();
      updateAssetPaths();
    });
  } else {
    updateNavigationLinks();
    updateAssetPaths();
  }
  
  console.log(`🌍 Environment initialized: ${ENVIRONMENT.getCurrentEnvironment()}`);
  console.log(`📍 Current subdomain: ${getCurrentSubdomain()}`);
}

// Auto-initialize
initializeEnvironment();

// Export for use in other scripts
window.DiBoaS_Environment = {
  ENVIRONMENT,
  getCurrentURLConfig,
  getSubdomainURL,
  getAssetURL,
  getAPIURL,
  navigateToSubdomain,
  getCurrentSubdomain,
  updateNavigationLinks,
  updateAssetPaths
};