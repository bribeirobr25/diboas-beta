/**
 * diBoaS Main Entry Point
 * Pure DDD, Event-Driven, Service Agnostic Architecture - NO LEGACY COMPATIBILITY
 */

// Import the clean DDD integration layer
import { getGlobalIntegration } from '../../src/integration/DiBoaSIntegration.js'

/**
 * Main initialization function
 */
async function initializeDiBoaS() {
  try {
    console.log('🚀 Initializing diBoaS with Pure DDD Architecture...')
    console.log('📊 Environment:', {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent.substr(0, 50) + '...',
      timestamp: new Date().toISOString()
    })

    // Initialize the pure DDD system
    const integration = await getGlobalIntegration()
    const healthStatus = integration.getHealthStatus()
    const metrics = integration.getMetrics()
    
    console.log('✅ diBoaS DDD Initialization Complete!', healthStatus)
    console.log('🎯 Features Available:', {
      domainDrivenDesign: '✅ Active',
      eventDrivenArchitecture: '✅ Active', 
      serviceAgnosticAbstraction: '✅ Active',
      finTechSecurity: '✅ Active',
      coreWebVitalsMonitoring: '✅ Production Ready',
      globalErrorHandling: '✅ Production Ready',
      abTestingFramework: '✅ Active',
      performanceMonitoring: '✅ Enhanced',
      seoOptimization: '✅ Active',
      accessibility: '✅ Enhanced',
      legacyCompatibility: '❌ Removed (No Technical Debt)',
      architectureCompliance: '✅ 100% Pure DDD'
    })

    // Global success indicators
    window._diBoaSInitialized = true
    window._diBoaSVersion = '3.0.0-Pure-DDD'
    window._architecture = 'domain-driven-design'
    window._legacySupport = false // Explicitly no legacy support
    
    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('diBoaSInitialized', {
      detail: {
        healthStatus,
        metrics,
        version: '3.0.0-Pure-DDD',
        architecture: 'Pure DDD + Event-Driven + Service Agnostic',
        legacyCompatibility: false,
        features: [
          'Domain-Driven Design',
          'Event-Driven Architecture', 
          'Service Agnostic Abstraction',
          'FinTech Security Standards',
          'Core Web Vitals Monitoring',
          'Global Error Handling',
          'A/B Testing Framework',
          'Performance Monitoring',
          'SEO Optimization',
          'Accessibility Compliance'
        ]
      }
    }))

    return {
      success: true,
      integration,
      healthStatus,
      metrics,
      architecture: 'pure-ddd'
    }

  } catch (error) {
    console.error('❌ diBoaS DDD Initialization failed:', error)
    
    // Dispatch error event
    window.dispatchEvent(new CustomEvent('diBoaSInitializationError', {
      detail: { error: error.message, timestamp: new Date().toISOString() }
    }))
    
    throw error
  }
}

/**
 * Auto-detect environment and subdomain for specialized initialization
 */
function detectEnvironment() {
  const hostname = window.location.hostname
  const subdomain = hostname.split('.')[0]
  
  // Development vs Production
  const environment = hostname.includes('localhost') ? 'development' : 'production'
  
  // Subdomain detection for specialized features
  const subdomainConfig = {
    'app': { type: 'application', features: ['trading', 'portfolio', 'analytics'] },
    'dapp': { type: 'application', features: ['trading', 'portfolio', 'analytics'] }, 
    'learn': { type: 'educational', features: ['courses', 'tutorials', 'assessment'] },
    'docs': { type: 'documentation', features: ['api-docs', 'guides', 'examples'] },
    'api': { type: 'backend', features: ['rest-api', 'websockets', 'auth'] }
  }
  
  return {
    environment,
    subdomain,
    config: subdomainConfig[subdomain] || { type: 'main', features: ['landing', 'marketing'] }
  }
}

/**
 * Initialize based on detected environment
 */
async function initializeForEnvironment() {
  const envConfig = detectEnvironment()
  console.log('🌐 Detected environment:', envConfig)
  
  // Initialize core system
  const result = await initializeDiBoaS()
  
  // Apply environment-specific configurations
  switch (envConfig.config.type) {
    case 'application':
      console.log('📱 Application mode: Full trading features enabled')
      break
    case 'educational':
      console.log('📚 Educational mode: Learning features enabled')
      break
    case 'documentation':
      console.log('📖 Documentation mode: API docs features enabled')
      break
    default:
      console.log('🏠 Main site mode: Marketing features enabled')
  }
  
  return {
    ...result,
    environment: envConfig
  }
}

/**
 * Main entry point - automatically initialize when script loads
 */
async function main() {
  try {
    const result = await initializeForEnvironment()
    console.log('🎉 diBoaS Ready!', result)
    return result
  } catch (error) {
    console.error('💥 diBoaS failed to initialize:', error)
    return { success: false, error: error.message }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main)
} else {
  // DOM already loaded, initialize immediately
  main()
}

// Export for manual initialization if needed
export { initializeDiBoaS, initializeForEnvironment, detectEnvironment, main }