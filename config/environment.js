/**
 * diBoaS Environment Configuration
 * Centralized configuration for all subdomains and environments
 */

export const ENVIRONMENTS = {
  development: {
    name: 'development',
    host: 'localhost:3000',
    protocol: 'http',
    cdnUrl: '/assets',
    apiUrl: '/api',
    routing: 'path-based', // Use paths like /app, /docs
    subdomains: {
      landing: { url: 'http://localhost:3000/', path: '/' },
      dapp: { url: 'http://localhost:3000/app', path: '/app' },
      docs: { url: 'http://localhost:3000/docs', path: '/docs' },
      learn: { url: 'http://localhost:3000/learn', path: '/learn' },
      mascots: { url: 'http://localhost:3000/mascots', path: '/mascots' },
      investors: { url: 'http://localhost:3000/investors', path: '/investors' },
      b2b: { url: 'http://localhost:3000/b2b', path: '/b2b' }
    }
  },
  
  staging: {
    name: 'staging',
    host: 'staging.diboas.com',
    protocol: 'https',
    cdnUrl: 'https://cdn.staging.diboas.com',
    apiUrl: 'https://api.staging.diboas.com',
    routing: 'subdomain-based',
    subdomains: {
      landing: { url: 'https://staging.diboas.com', path: '/' },
      dapp: { url: 'https://dapp.staging.diboas.com', path: '/' },
      docs: { url: 'https://docs.staging.diboas.com', path: '/' },
      learn: { url: 'https://learn.staging.diboas.com', path: '/' },
      mascots: { url: 'https://mascots.staging.diboas.com', path: '/' },
      investors: { url: 'https://investors.staging.diboas.com', path: '/' },
      b2b: { url: 'https://b2b.staging.diboas.com', path: '/' }
    }
  },
  
  production: {
    name: 'production',
    host: 'diboas.com',
    protocol: 'https',
    cdnUrl: 'https://cdn.diboas.com',
    apiUrl: 'https://api.diboas.com',
    routing: 'subdomain-based',
    subdomains: {
      landing: { url: 'https://diboas.com', path: '/' },
      dapp: { url: 'https://dapp.diboas.com', path: '/' },
      docs: { url: 'https://docs.diboas.com', path: '/' },
      learn: { url: 'https://learn.diboas.com', path: '/' },
      mascots: { url: 'https://mascots.diboas.com', path: '/' },
      investors: { url: 'https://investors.diboas.com', path: '/' },
      b2b: { url: 'https://b2b.diboas.com', path: '/' }
    }
  }
};

/**
 * Get current environment configuration
 */
export function getCurrentEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  return ENVIRONMENTS[env] || ENVIRONMENTS.development;
}

/**
 * Get URL for a specific subdomain in current environment
 */
export function getSubdomainUrl(subdomain, currentEnv = null) {
  const env = currentEnv || getCurrentEnvironment();
  return env.subdomains[subdomain]?.url || env.subdomains.landing.url;
}

/**
 * Check if current environment uses subdomain routing
 */
export function isSubdomainRouting(currentEnv = null) {
  const env = currentEnv || getCurrentEnvironment();
  return env.routing === 'subdomain-based';
}

/**
 * Generate environment-aware URLs for client-side use
 */
export function generateClientConfig(currentEnv = null) {
  const env = currentEnv || getCurrentEnvironment();
  
  return {
    environment: env.name,
    routing: env.routing,
    cdnUrl: env.cdnUrl,
    apiUrl: env.apiUrl,
    subdomains: env.subdomains,
    navigation: {
      // Cross-subdomain navigation helpers
      goToDapp: () => {
        if (env.routing === 'path-based') {
          window.location.href = '/app';
        } else {
          window.location.href = env.subdomains.dapp.url;
        }
      },
      goToDocs: () => {
        if (env.routing === 'path-based') {
          window.location.href = '/docs';
        } else {
          window.location.href = env.subdomains.docs.url;
        }
      },
      goToLearn: () => {
        if (env.routing === 'path-based') {
          window.location.href = '/learn';
        } else {
          window.location.href = env.subdomains.learn.url;
        }
      },
      goToMascots: () => {
        if (env.routing === 'path-based') {
          window.location.href = '/mascots';
        } else {
          window.location.href = env.subdomains.mascots.url;
        }
      },
      goToInvestors: () => {
        if (env.routing === 'path-based') {
          window.location.href = '/investors';
        } else {
          window.location.href = env.subdomains.investors.url;
        }
      },
      goToB2B: () => {
        if (env.routing === 'path-based') {
          window.location.href = '/b2b';
        } else {
          window.location.href = env.subdomains.b2b.url;
        }
      }
    }
  };
}

/**
 * Feature flags per environment
 */
export const FEATURE_FLAGS = {
  development: {
    debugging: true,
    analytics: false,
    errorTracking: false,
    performanceMonitoring: true,
    abTesting: false
  },
  staging: {
    debugging: true,
    analytics: true,
    errorTracking: true,
    performanceMonitoring: true,
    abTesting: true
  },
  production: {
    debugging: false,
    analytics: true,
    errorTracking: true,
    performanceMonitoring: true,
    abTesting: true
  }
};

export default {
  ENVIRONMENTS,
  getCurrentEnvironment,
  getSubdomainUrl,
  isSubdomainRouting,
  generateClientConfig,
  FEATURE_FLAGS
};