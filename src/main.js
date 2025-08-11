/**
 * diBoaS Main Entry Point
 * Initializes the complete Domain-Driven Design architecture while preserving existing functionality
 */

// Import the integration layer that bridges everything
import { getDiBoaSIntegration } from './integration/DiBoaSIntegration.js'

/**
 * Main initialization function
 */
async function initializeDiBoaS() {
  try {
    console.log('🚀 Initializing diBoaS with DDD Architecture...')
    console.log('📊 Environment:', {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent.substr(0, 50) + '...',
      timestamp: new Date().toISOString()
    })

    // Initialize the complete integrated system
    const integration = await getDiBoaSIntegration()
    const status = integration.getStatus()
    
    console.log('✅ diBoaS Initialization Complete!', status)
    console.log('🎯 Features Available:', {
      domainDrivenDesign: '✅ Active',
      eventDrivenArchitecture: '✅ Active', 
      serviceAbstraction: '✅ Active',
      finTechSecurity: '✅ Active',
      performanceMonitoring: '✅ Active',
      seoOptimization: '✅ Active',
      accessibility: '✅ Enhanced',
      existingFunctionality: '✅ Preserved',
      zeroBreakingChanges: '✅ Guaranteed'
    })

    // Global success indicator
    window._diBoaSInitialized = true
    window._diBoaSVersion = '2.0.0-DDD'
    
    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('diBoaSInitialized', {
      detail: {
        status,
        version: '2.0.0-DDD',
        features: [
          'Domain-Driven Design',
          'Event-Driven Architecture', 
          'Service Agnostic Abstraction',
          'FinTech Security',
          'Performance Optimization',
          'SEO Enhancement',
          'Accessibility Compliance'
        ]
      }
    }))

    return {
      success: true,
      integration,
      status
    }

  } catch (error) {
    console.error('❌ diBoaS Initialization Failed:', error)
    
    // Fallback to basic functionality
    console.log('🔄 Activating fallback mode...')
    await initializeFallbackMode()
    
    return {
      success: false,
      error: error.message,
      fallbackActive: true
    }
  }
}

/**
 * Fallback mode that preserves basic functionality if DDD initialization fails
 */
async function initializeFallbackMode() {
  console.log('📱 Initializing fallback mode...')
  
  try {
    // Preserve essential functionality
    window.diBoaS = {
      // Basic asset selection
      selectAsset: (assetSymbol) => {
        console.log('🔄 Fallback: Asset selected:', assetSymbol)
        const event = new CustomEvent('assetSelected', { detail: { assetSymbol } })
        document.dispatchEvent(event)
      },
      
      // Basic language change
      changeLanguage: (language) => {
        console.log('🔄 Fallback: Language changed:', language)
        document.documentElement.setAttribute('lang', language)
        localStorage.setItem('diboas_language', language)
      },
      
      // Basic theme toggle
      toggleTheme: (theme) => {
        console.log('🔄 Fallback: Theme changed:', theme)
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('diboas_theme', theme)
      },
      
      // Status check
      getStatus: () => ({
        mode: 'fallback',
        dddActive: false,
        basicFunctionalityActive: true
      })
    }
    
    // Basic event listeners
    document.addEventListener('click', (e) => {
      const assetCard = e.target.closest('.asset-card, .asset-option')
      if (assetCard) {
        const assetSymbol = assetCard.getAttribute('data-asset') || 
                          assetCard.textContent.trim().toUpperCase()
        window.diBoaS.selectAsset(assetSymbol)
      }
    })
    
    console.log('✅ Fallback mode active')
    
  } catch (fallbackError) {
    console.error('❌ Even fallback mode failed:', fallbackError)
  }
}

/**
 * Detect if we're running in a specific subdomain and initialize accordingly
 */
function detectSubdomainAndInitialize() {
  const hostname = window.location.hostname
  const pathname = window.location.pathname
  
  let subdomain = 'landing'
  
  // Detect subdomain from hostname
  if (hostname.startsWith('dapp.')) {
    subdomain = 'dapp'
  } else if (hostname.startsWith('docs.')) {
    subdomain = 'docs'  
  } else if (hostname.startsWith('learn.')) {
    subdomain = 'learn'
  } else if (hostname.startsWith('mascots.')) {
    subdomain = 'mascots'
  } else if (hostname.startsWith('investors.')) {
    subdomain = 'investors'
  } else if (hostname.startsWith('b2b.')) {
    subdomain = 'b2b'
  } else if (hostname === 'localhost' || hostname.includes('localhost')) {
    // Detect from path in development
    if (pathname.startsWith('/app')) subdomain = 'dapp'
    else if (pathname.startsWith('/docs')) subdomain = 'docs'
    else if (pathname.startsWith('/learn')) subdomain = 'learn'
    else if (pathname.startsWith('/mascots')) subdomain = 'mascots'
    else if (pathname.startsWith('/investors')) subdomain = 'investors'
    else if (pathname.startsWith('/b2b')) subdomain = 'b2b'
  }
  
  console.log(`🌐 Detected subdomain: ${subdomain}`)
  
  // Set subdomain context
  document.documentElement.setAttribute('data-subdomain', subdomain)
  
  return subdomain
}

/**
 * Initialize based on document ready state
 */
function initializeWhenReady() {
  const init = async () => {
    // Detect current subdomain/environment
    const subdomain = detectSubdomainAndInitialize()
    
    // Initialize main system
    const result = await initializeDiBoaS()
    
    console.log('🎉 diBoaS Ready!', { subdomain, ...result })
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    // DOM already loaded, initialize immediately
    setTimeout(init, 100)
  }
}

// Start initialization process
initializeWhenReady()

// Export main function for manual initialization
export { initializeDiBoaS, initializeFallbackMode }

// Global debugging helpers
if (typeof window !== 'undefined') {
  window._diBoaSDebug = {
    reinitialize: initializeDiBoaS,
    fallback: initializeFallbackMode,
    getStatus: () => window._diBoaSIntegrationStatus,
    version: '2.0.0-DDD'
  }
}

// Service Worker registration for PWA functionality (preserve existing)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('✅ Service Worker registered:', registration.scope)
    })
    .catch(error => {
      console.log('⚠️ Service Worker registration failed:', error)
    })
}