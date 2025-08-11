/**
 * diBoaS Integration Layer
 * Seamlessly integrates new DDD architecture with existing UI and preserves all functionality
 */

// Import new architecture components
import { getGlobalUIManager } from '../presentation/ui/DiBoaSUIManager.js'
import { getGlobalApplication } from '../application/DiBoaSApplication.js'

/**
 * Integration manager that bridges old and new systems
 */
class DiBoaSIntegration {
  constructor() {
    this.isInitialized = false
    this.preservedFunctions = new Map()
    this.uiManager = null
    this.application = null
  }

  /**
   * Initialize the integrated system
   */
  async initialize() {
    if (this.isInitialized) return

    try {
      console.log('🔄 Starting diBoaS Integration...')

      // 1. Preserve existing functionality
      await this._preserveExistingFunctionality()

      // 2. Initialize new architecture
      this.uiManager = await getGlobalUIManager()
      this.application = await getGlobalApplication()

      // 3. Bridge old and new systems
      await this._bridgeOldAndNewSystems()

      // 4. Enhance existing UI with new features
      await this._enhanceExistingUI()

      this.isInitialized = true
      console.log('✅ diBoaS Integration complete')

    } catch (error) {
      console.error('❌ Integration failed:', error)
      throw error
    }
  }

  /**
   * Preserve all existing JavaScript functionality
   */
  async _preserveExistingFunctionality() {
    console.log('📦 Preserving existing functionality...')

    // Preserve existing global functions
    const existingGlobals = [
      'showWelcomeMessage',
      'updateLanguage',
      'toggleTheme',
      'handleAssetSelection',
      'updatePersona',
      'initializeApp'
    ]

    existingGlobals.forEach(fnName => {
      if (window[fnName] && typeof window[fnName] === 'function') {
        this.preservedFunctions.set(fnName, window[fnName])
        console.log(`✅ Preserved function: ${fnName}`)
      }
    })

    // Preserve existing event listeners
    if (window._existingEventListeners) {
      this.preservedFunctions.set('_eventListeners', window._existingEventListeners)
    }

    // Preserve existing app instances
    if (window.App) {
      this.preservedFunctions.set('App', window.App)
      console.log('✅ Preserved App class')
    }

    if (window.MascotApp) {
      this.preservedFunctions.set('MascotApp', window.MascotApp)
      console.log('✅ Preserved MascotApp class')
    }

    if (window.LearnApp) {
      this.preservedFunctions.set('LearnApp', window.LearnApp)
      console.log('✅ Preserved LearnApp class')
    }

    // Preserve existing CSS classes and animations
    this._preserveExistingStyles()

    console.log(`📦 Preserved ${this.preservedFunctions.size} existing functions/objects`)
  }

  /**
   * Bridge old and new systems to work together
   */
  async _bridgeOldAndNewSystems() {
    console.log('🌉 Bridging old and new systems...')

    // Create enhanced global functions that use new architecture
    window.diBoaS = {
      // Enhanced asset selection
      selectAsset: async (assetSymbol) => {
        try {
          // Use new architecture
          const result = await this.uiManager.handleUserInteraction('asset_selection', {
            assetSymbol
          })
          
          // Call original function if it exists (for compatibility)
          const originalFn = this.preservedFunctions.get('handleAssetSelection')
          if (originalFn) {
            originalFn(assetSymbol)
          }
          
          return result
        } catch (error) {
          console.error('Asset selection error:', error)
        }
      },

      // Enhanced language change
      changeLanguage: async (language) => {
        try {
          // Use new architecture
          const result = await this.uiManager.handleUserInteraction('language_change', {
            language
          })
          
          // Call original function if it exists
          const originalFn = this.preservedFunctions.get('updateLanguage')
          if (originalFn) {
            originalFn(language)
          }
          
          return result
        } catch (error) {
          console.error('Language change error:', error)
        }
      },

      // Enhanced theme toggle
      toggleTheme: async (theme) => {
        try {
          // Use new architecture
          const result = await this.uiManager.handleUserInteraction('theme_change', {
            theme
          })
          
          // Call original function if it exists
          const originalFn = this.preservedFunctions.get('toggleTheme')
          if (originalFn) {
            originalFn(theme)
          }
          
          return result
        } catch (error) {
          console.error('Theme toggle error:', error)
        }
      },

      // New functions exposed to existing code
      startUserJourney: () => this.uiManager.startUserSession(),
      getUserStats: () => this.application.handleUserAction('get_journey_stats'),
      getMascotGuidance: (context) => this.uiManager.handleUserInteraction('mascot_interaction', context),
      
      // Utility functions
      getUIState: () => this.uiManager.getUIState(),
      getHealthStatus: () => this.application.getHealthStatus(),
      getMetrics: () => this.application.getApplicationMetrics()
    }

    // Enhance existing App classes
    await this._enhanceExistingAppClasses()

    console.log('🌉 Systems bridged successfully')
  }

  /**
   * Enhance existing App classes with new functionality
   */
  async _enhanceExistingAppClasses() {
    // Enhance main App class if it exists
    const OriginalApp = this.preservedFunctions.get('App')
    if (OriginalApp && typeof OriginalApp === 'function') {
      // Add new methods to existing App prototype
      if (OriginalApp.prototype) {
        OriginalApp.prototype.selectAssetEnhanced = async function(assetSymbol) {
          return await window.diBoaS.selectAsset(assetSymbol)
        }
        
        OriginalApp.prototype.getUserJourneyStats = async function() {
          return await window.diBoaS.getUserStats()
        }
        
        OriginalApp.prototype.getMascotGuidance = async function(context) {
          return await window.diBoaS.getMascotGuidance(context)
        }
      }
      
      console.log('✅ Enhanced App class with new functionality')
    }

    // Enhance MascotApp class if it exists
    const OriginalMascotApp = this.preservedFunctions.get('MascotApp')
    if (OriginalMascotApp && typeof OriginalMascotApp === 'function') {
      if (OriginalMascotApp.prototype) {
        OriginalMascotApp.prototype.getPersonalizedGuidance = async function(context) {
          return await window.diBoaS.getMascotGuidance(context)
        }
      }
      
      console.log('✅ Enhanced MascotApp class')
    }
  }

  /**
   * Enhance existing UI with new features while preserving appearance
   */
  async _enhanceExistingUI() {
    console.log('🎨 Enhancing existing UI...')

    // Add data attributes for new functionality
    this._addDataAttributesToExistingElements()

    // Enhance existing buttons with new handlers
    this._enhanceExistingButtons()

    // Add accessibility improvements
    this._addAccessibilityEnhancements()

    // Add performance monitoring to existing functions
    this._addPerformanceMonitoring()

    // Add error handling to existing functions
    this._addErrorHandling()

    console.log('🎨 UI enhancements complete')
  }

  /**
   * Add data attributes to existing elements for new functionality
   */
  _addDataAttributesToExistingElements() {
    // Add data attributes to asset cards
    const assetCards = document.querySelectorAll('.asset-card, .asset-option')
    assetCards.forEach(card => {
      // Try to determine asset type from existing content
      const assetText = card.textContent.toLowerCase()
      let assetSymbol = 'BTC' // default

      if (assetText.includes('bitcoin') || assetText.includes('btc')) {
        assetSymbol = 'BTC'
      } else if (assetText.includes('gold')) {
        assetSymbol = 'GOLD'
      } else if (assetText.includes('stock')) {
        assetSymbol = 'STOCKS'
      } else if (assetText.includes('defi')) {
        assetSymbol = 'DEFI'
      } else if (assetText.includes('ethereum')) {
        assetSymbol = 'ETH'
      } else if (assetText.includes('solana')) {
        assetSymbol = 'SOL'
      }

      card.setAttribute('data-asset', assetSymbol)
      card.setAttribute('data-enhanced', 'true')
    })

    // Add data attributes to mascot elements
    const mascotElements = document.querySelectorAll('.mascot-container, .mascot-image')
    mascotElements.forEach(element => {
      element.setAttribute('data-interactive', 'true')
      element.setAttribute('data-enhanced', 'true')
    })

    // Add data attributes to language/theme selectors
    const selectors = document.querySelectorAll('.language-selector, .theme-selector')
    selectors.forEach(selector => {
      selector.setAttribute('data-enhanced', 'true')
    })

    console.log('✅ Data attributes added to existing elements')
  }

  /**
   * Enhance existing buttons with new handlers
   */
  _enhanceExistingButtons() {
    // Enhance asset selection buttons
    const assetButtons = document.querySelectorAll('[data-asset]')
    assetButtons.forEach(button => {
      // Add new click handler while preserving existing ones
      const originalHandler = button.onclick
      button.addEventListener('click', async (e) => {
        const assetSymbol = button.getAttribute('data-asset')
        if (assetSymbol) {
          await window.diBoaS.selectAsset(assetSymbol)
        }
      })
      
      // Preserve original handler
      if (originalHandler) {
        button.addEventListener('click', originalHandler)
      }
    })

    // Enhance get started buttons
    const getStartedButtons = document.querySelectorAll('.cta-primary, .cta-primary-large, .cta-get-started')
    getStartedButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        // Start user journey with new architecture
        await window.diBoaS.startUserJourney()
      })
    })

    console.log('✅ Existing buttons enhanced')
  }

  /**
   * Add accessibility enhancements
   */
  _addAccessibilityEnhancements() {
    // Add ARIA labels where missing
    const interactiveElements = document.querySelectorAll('button, .asset-card, .mascot-container, .cta-primary')
    interactiveElements.forEach(element => {
      if (!element.getAttribute('aria-label')) {
        let label = element.textContent?.trim() || 'Interactive element'
        
        if (element.classList.contains('asset-card')) {
          const assetSymbol = element.getAttribute('data-asset') || 'asset'
          label = `Select ${assetSymbol} for investment`
        } else if (element.classList.contains('mascot-container')) {
          label = 'Interact with your AI guide for help and guidance'
        } else if (element.classList.contains('cta-primary')) {
          label = element.textContent?.trim() || 'Get started with diBoaS'
        }
        
        element.setAttribute('aria-label', label)
      }

      if (!element.getAttribute('role')) {
        element.setAttribute('role', 'button')
      }
    })

    // Add keyboard navigation
    const focusableElements = document.querySelectorAll('[data-enhanced="true"]')
    focusableElements.forEach(element => {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0')
      }
      
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          element.click()
        }
      })
    })

    console.log('✅ Accessibility enhancements added')
  }

  /**
   * Add performance monitoring to existing functions
   */
  _addPerformanceMonitoring() {
    // Wrap preserved functions with performance monitoring
    this.preservedFunctions.forEach((originalFn, fnName) => {
      if (typeof originalFn === 'function') {
        window[fnName] = async (...args) => {
          const startTime = performance.now()
          
          try {
            const result = await originalFn.apply(this, args)
            
            const duration = performance.now() - startTime
            console.debug(`⚡ ${fnName} executed in ${duration.toFixed(2)}ms`)
            
            return result
          } catch (error) {
            const duration = performance.now() - startTime
            console.error(`❌ ${fnName} failed after ${duration.toFixed(2)}ms:`, error)
            throw error
          }
        }
      }
    })

    console.log('✅ Performance monitoring added')
  }

  /**
   * Add error handling to existing functions
   */
  _addErrorHandling() {
    // Global error handler for unhandled promises
    window.addEventListener('unhandledrejection', (event) => {
      console.error('🚨 Unhandled promise rejection:', event.reason)
      
      // Show user-friendly error message
      this._showErrorNotification('Something went wrong. Please try again.')
      
      // Prevent the default behavior
      event.preventDefault()
    })

    // Global error handler for JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('🚨 JavaScript error:', event.error)
      
      // Log error for debugging
      console.debug('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    console.log('✅ Error handling enhanced')
  }

  /**
   * Preserve existing CSS classes and animations
   */
  _preserveExistingStyles() {
    // Add CSS to preserve existing animations and styles
    const preservationCSS = `
      /* Preserve existing animations */
      [data-enhanced="true"] {
        transition: all 0.3s ease;
      }
      
      /* Enhance hover states */
      [data-enhanced="true"]:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      /* Add focus states for accessibility */
      [data-enhanced="true"]:focus {
        outline: 2px solid var(--accent-color, #00d4aa);
        outline-offset: 2px;
      }
      
      /* Loading states */
      [data-loading="true"] {
        opacity: 0.7;
        pointer-events: none;
      }
      
      /* Error states */
      [data-error="true"] {
        border-color: #e74c3c;
        background-color: rgba(231, 76, 60, 0.1);
      }
    `

    // Add CSS to document
    const styleElement = document.createElement('style')
    styleElement.textContent = preservationCSS
    document.head.appendChild(styleElement)

    console.log('✅ Existing styles preserved and enhanced')
  }

  /**
   * Show error notification to user
   */
  _showErrorNotification(message) {
    let notification = document.querySelector('.error-notification')
    if (!notification) {
      notification = document.createElement('div')
      notification.className = 'error-notification'
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: inherit;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
      `
      document.body.appendChild(notification)
    }

    notification.textContent = message
    
    // Show with animation
    setTimeout(() => {
      notification.style.opacity = '1'
      notification.style.transform = 'translateX(0)'
    }, 100)

    // Auto-hide after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0'
      notification.style.transform = 'translateX(100%)'
    }, 5000)
  }

  /**
   * Get current integration status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      preservedFunctions: this.preservedFunctions.size,
      uiManagerReady: !!this.uiManager,
      applicationReady: !!this.application,
      enhancementsApplied: document.querySelectorAll('[data-enhanced="true"]').length
    }
  }
}

// Global integration instance
let globalIntegration = null

/**
 * Get or create the global integration instance
 */
export async function getDiBoaSIntegration() {
  if (!globalIntegration) {
    globalIntegration = new DiBoaSIntegration()
    await globalIntegration.initialize()
  }
  return globalIntegration
}

/**
 * Auto-initialize integration when DOM is ready
 */
function autoInitialize() {
  if (typeof document === 'undefined') return

  const initializeWhenReady = async () => {
    try {
      const integration = await getDiBoaSIntegration()
      console.log('✅ diBoaS Integration auto-initialized:', integration.getStatus())
      
      // Expose integration status to global scope for debugging
      window._diBoaSIntegrationStatus = integration.getStatus()
      
    } catch (error) {
      console.error('❌ Auto-initialization failed:', error)
      
      // Fallback to basic functionality
      console.log('🔄 Falling back to basic functionality...')
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWhenReady)
  } else {
    // DOM already loaded
    setTimeout(initializeWhenReady, 100)
  }
}

// Auto-initialize
autoInitialize()

// Export for manual initialization if needed
export { DiBoaSIntegration }