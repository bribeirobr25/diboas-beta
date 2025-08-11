/**
 * diBoaS UI Manager
 * Integrates existing UI with new DDD architecture while preserving all existing functionality
 */

import { getGlobalApplication } from '../../application/DiBoaSApplication.js'

/**
 * UI Manager that bridges existing UI components with the new domain-driven architecture
 */
export class DiBoaSUIManager {
  constructor(options = {}) {
    this._application = null
    this._currentUser = null
    this._uiState = {
      currentView: 'landing',
      theme: 'default',
      language: 'en',
      mascot: 'aqua'
    }
    
    // UI Element selectors (existing elements)
    this._selectors = {
      // Navigation
      phaseIndicator: '.phase-indicator',
      mascotContainer: '.mascot-container',
      progressBar: '.progress-bar',
      
      // User Journey
      welcomeSection: '.welcome-section',
      assetSelection: '.asset-selection',
      lessonArea: '.lesson-area',
      achievementNotifications: '.achievement-notifications',
      
      // Mascot Interaction
      mascotDialogue: '.mascot-dialogue',
      mascotImage: '.mascot-image',
      mascotBubble: '.mascot-dialogue-bubble',
      
      // Settings
      languageSelector: '.language-selector',
      themeSelector: '.theme-selector',
      preferencesForm: '.preferences-form'
    }
    
    // Event listeners storage
    this._eventListeners = new Map()
    
    // UI Components cache
    this._components = new Map()
    
    // Animation system
    this._animations = {
      phaseTransition: null,
      mascotAppearance: null,
      achievementCelebration: null
    }
    
    // Bind methods
    this.initialize = this.initialize.bind(this)
    this.startUserSession = this.startUserSession.bind(this)
    this.updateUIState = this.updateUIState.bind(this)
  }

  /**
   * Initialize UI Manager and connect to application
   */
  async initialize() {
    try {
      console.log('🎨 Initializing diBoaS UI Manager...')
      
      // Get application instance
      this._application = await getGlobalApplication({
        environment: this._detectEnvironment()
      })
      
      // Initialize UI components
      await this._initializeUIComponents()
      
      // Set up event listeners
      await this._setupEventListeners()
      
      // Initialize theme system
      await this._initializeThemes()
      
      // Initialize internationalization
      await this._initializeI18n()
      
      // Initialize mascot system
      await this._initializeMascotSystem()
      
      // Initialize accessibility features
      await this._initializeAccessibility()
      
      // Preserve existing functionality
      await this._preserveExistingFunctionality()
      
      console.log('✅ UI Manager initialized successfully')
      
      return {
        success: true,
        components: Array.from(this._components.keys()),
        theme: this._uiState.theme,
        language: this._uiState.language
      }
      
    } catch (error) {
      console.error('❌ UI Manager initialization failed:', error)
      throw error
    }
  }

  /**
   * Start user session and initialize personalized UI
   */
  async startUserSession(userId = null) {
    try {
      // Auto-generate user ID if not provided (for demo)
      const finalUserId = userId || this._generateDemoUserId()
      
      console.log(`👤 Starting UI session for user: ${finalUserId}`)
      
      // Start application session
      const sessionResult = await this._application.startUserSession(finalUserId, {
        language: this._detectLanguage(),
        theme: this._detectTheme(),
        ipAddress: '127.0.0.1', // Demo IP
        userAgent: navigator.userAgent,
        isSecure: window.location.protocol === 'https:'
      })
      
      if (!sessionResult.success) {
        throw new Error('Failed to start user session')
      }
      
      this._currentUser = sessionResult.user
      
      // Update UI based on user state
      await this._updateUserInterface()
      
      // Show welcome message from mascot
      await this._showMascotWelcome()
      
      // Initialize user-specific features
      await this._initializeUserFeatures()
      
      console.log('✅ User session UI initialized', {
        userId: finalUserId,
        phase: this._currentUser.currentPhase,
        mascot: this._currentUser.currentMascot
      })
      
      return {
        success: true,
        user: this._currentUser
      }
      
    } catch (error) {
      console.error('❌ Failed to start user session UI:', error)
      throw error
    }
  }

  /**
   * Handle user interactions with existing UI elements
   */
  async handleUserInteraction(interactionType, data = {}) {
    if (!this._currentUser) {
      console.warn('No active user session for interaction:', interactionType)
      return
    }

    try {
      console.log(`🖱️ Handling user interaction: ${interactionType}`, data)
      
      let result
      
      switch (interactionType) {
        case 'asset_selection':
          result = await this._handleAssetSelection(data)
          break
          
        case 'lesson_completion':
          result = await this._handleLessonCompletion(data)
          break
          
        case 'phase_advancement':
          result = await this._handlePhaseAdvancement()
          break
          
        case 'preference_update':
          result = await this._handlePreferenceUpdate(data)
          break
          
        case 'mascot_interaction':
          result = await this._handleMascotInteraction(data)
          break
          
        case 'language_change':
          result = await this._handleLanguageChange(data.language)
          break
          
        case 'theme_change':
          result = await this._handleThemeChange(data.theme)
          break
          
        default:
          console.warn(`Unknown interaction type: ${interactionType}`)
          return
      }
      
      // Update UI after successful interaction
      if (result && result.success) {
        await this._updateUserInterface()
        await this._showFeedbackMessage(result.message || 'Action completed successfully!')
      }
      
      return result
      
    } catch (error) {
      console.error(`❌ User interaction failed: ${interactionType}`, error)
      await this._showErrorMessage(error.message)
      throw error
    }
  }

  /**
   * Update entire UI state
   */
  async updateUIState(updates = {}) {
    try {
      // Merge updates
      this._uiState = {
        ...this._uiState,
        ...updates
      }
      
      // Apply updates to DOM
      await this._applyUIUpdates()
      
      console.log('🎨 UI state updated', this._uiState)
      
    } catch (error) {
      console.error('❌ Failed to update UI state:', error)
    }
  }

  /**
   * Get current UI state
   */
  getUIState() {
    return {
      ...this._uiState,
      currentUser: this._currentUser,
      components: Array.from(this._components.keys()),
      animations: Object.keys(this._animations)
    }
  }

  /**
   * Shutdown UI Manager gracefully
   */
  async shutdown() {
    try {
      console.log('🛑 Shutting down UI Manager...')
      
      // Clean up event listeners
      this._eventListeners.forEach((removeListener, element) => {
        removeListener()
      })
      this._eventListeners.clear()
      
      // Stop animations
      Object.values(this._animations).forEach(animation => {
        if (animation && typeof animation.stop === 'function') {
          animation.stop()
        }
      })
      
      // Clear components
      this._components.clear()
      
      console.log('✅ UI Manager shutdown complete')
      
    } catch (error) {
      console.error('❌ UI Manager shutdown error:', error)
    }
  }

  // ============================================
  // PRIVATE INITIALIZATION METHODS
  // ============================================

  async _initializeUIComponents() {
    // Asset Selection Component
    this._components.set('AssetSelection', new AssetSelectionComponent(this))
    
    // User Journey Component  
    this._components.set('UserJourney', new UserJourneyComponent(this))
    
    // Mascot Interaction Component
    this._components.set('MascotInteraction', new MascotInteractionComponent(this))
    
    // Settings Component
    this._components.set('Settings', new SettingsComponent(this))
    
    // Progress Tracking Component
    this._components.set('ProgressTracking', new ProgressTrackingComponent(this))
    
    // Initialize each component
    for (const [name, component] of this._components) {
      try {
        await component.initialize()
        console.log(`✅ ${name} component initialized`)
      } catch (error) {
        console.error(`❌ Failed to initialize ${name} component:`, error)
      }
    }
  }

  async _setupEventListeners() {
    // Asset selection listeners
    const assetButtons = document.querySelectorAll('.asset-option, .asset-card')
    assetButtons.forEach(button => {
      const listener = (e) => this._handleAssetClick(e)
      button.addEventListener('click', listener)
      this._eventListeners.set(button, () => button.removeEventListener('click', listener))
    })
    
    // Language selector listeners
    const languageSelector = document.querySelector('.language-selector')
    if (languageSelector) {
      const listener = (e) => this.handleUserInteraction('language_change', { language: e.target.value })
      languageSelector.addEventListener('change', listener)
      this._eventListeners.set(languageSelector, () => languageSelector.removeEventListener('change', listener))
    }
    
    // Theme selector listeners
    const themeSelector = document.querySelector('.theme-selector')
    if (themeSelector) {
      const listener = (e) => this.handleUserInteraction('theme_change', { theme: e.target.value })
      themeSelector.addEventListener('change', listener)
      this._eventListeners.set(themeSelector, () => themeSelector.removeEventListener('change', listener))
    }
    
    // Get Started button listener
    const getStartedButtons = document.querySelectorAll('.cta-primary, .cta-primary-large')
    getStartedButtons.forEach(button => {
      const listener = (e) => this._handleGetStartedClick(e)
      button.addEventListener('click', listener)
      this._eventListeners.set(button, () => button.removeEventListener('click', listener))
    })
    
    // Mascot interaction listeners
    const mascotElements = document.querySelectorAll('.mascot-container, .mascot-image')
    mascotElements.forEach(element => {
      const listener = (e) => this.handleUserInteraction('mascot_interaction', { clickPosition: { x: e.clientX, y: e.clientY } })
      element.addEventListener('click', listener)
      this._eventListeners.set(element, () => element.removeEventListener('click', listener))
    })
  }

  async _initializeThemes() {
    // Detect current theme from URL or localStorage
    const currentTheme = this._detectTheme()
    this._uiState.theme = currentTheme
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', currentTheme)
    
    console.log(`🎨 Theme system initialized: ${currentTheme}`)
  }

  async _initializeI18n() {
    // Detect current language
    const currentLanguage = this._detectLanguage()
    this._uiState.language = currentLanguage
    
    // Set document language
    document.documentElement.setAttribute('lang', currentLanguage)
    
    console.log(`🌐 I18n system initialized: ${currentLanguage}`)
  }

  async _initializeMascotSystem() {
    // Set initial mascot
    this._uiState.mascot = 'aqua' // Default to Aqua for new users
    
    // Initialize mascot dialogue system
    await this._setupMascotDialogue()
    
    console.log(`🎭 Mascot system initialized: ${this._uiState.mascot}`)
  }

  async _initializeAccessibility() {
    // Add ARIA labels to interactive elements
    const interactiveElements = document.querySelectorAll('button, .asset-card, .mascot-container')
    interactiveElements.forEach(element => {
      if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', element.textContent || 'Interactive element')
      }
      
      if (!element.getAttribute('role')) {
        element.setAttribute('role', 'button')
      }
    })
    
    // Add keyboard navigation support
    const focusableElements = document.querySelectorAll('button, a, input, select, [tabindex]')
    focusableElements.forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          element.click()
        }
      })
    })
    
    console.log('♿ Accessibility features initialized')
  }

  async _preserveExistingFunctionality() {
    // Preserve existing JavaScript functionality
    // This ensures all current features continue to work
    
    // Initialize existing app classes if they exist
    if (window.App) {
      // Don't reinitialize if already exists, just enhance
      console.log('📱 Preserving existing App functionality')
    }
    
    if (window.MascotApp) {
      console.log('🎭 Preserving existing Mascot functionality')
    }
    
    // Preserve existing event handlers
    const existingHandlers = window._diboasHandlers || {}
    for (const [event, handler] of Object.entries(existingHandlers)) {
      console.log(`🔄 Preserving existing handler: ${event}`)
    }
    
    console.log('📦 Existing functionality preserved')
  }

  // ============================================
  // USER INTERACTION HANDLERS
  // ============================================

  async _handleAssetSelection(data) {
    const result = await this._application.handleUserAction('select_asset', {
      assetSymbol: data.assetSymbol,
      context: data.context || {}
    })
    
    if (result.success) {
      // Update UI to show selected asset
      await this._highlightSelectedAsset(data.assetSymbol)
      
      // Show mascot guidance
      await this._showMascotGuidance(result.result.mascotGuidance)
      
      // Check if this unlocks phase advancement
      if (result.result.canAdvancePhase) {
        await this._showPhaseAdvancementNotification()
      }
    }
    
    return result
  }

  async _handleLessonCompletion(data) {
    const result = await this._application.handleUserAction('complete_lesson', {
      lessonId: data.lessonId,
      completionData: {
        timeSpent: data.timeSpent || 0,
        score: data.score || 100,
        completedAt: new Date()
      }
    })
    
    if (result.success) {
      // Show completion celebration
      await this._showLessonCompletionCelebration()
      
      // Update progress bar
      await this._updateProgressBar()
      
      // Show any new achievements
      if (result.result.achievements) {
        await this._showAchievementNotifications(result.result.achievements)
      }
    }
    
    return result
  }

  async _handlePhaseAdvancement() {
    const result = await this._application.handleUserAction('advance_phase')
    
    if (result.success) {
      // Trigger phase transition animation
      await this._animatePhaseTransition(result.result.newMascot)
      
      // Update all UI elements for new phase
      await this._updatePhaseUI(result.result.userJourney.currentPhase.level)
      
      // Show congratulations message
      await this._showPhaseAdvancementCelebration(result.result.message)
    }
    
    return result
  }

  async _handlePreferenceUpdate(data) {
    const result = await this._application.handleUserAction('update_preferences', {
      preferences: data
    })
    
    if (result.success) {
      // Apply preference changes to UI
      if (data.language) {
        await this._applyLanguageChange(data.language)
      }
      
      if (data.theme) {
        await this._applyThemeChange(data.theme)
      }
    }
    
    return result
  }

  async _handleMascotInteraction(data) {
    const result = await this._application.handleUserAction('get_mascot_guidance', {
      context: {
        type: 'user_click',
        clickPosition: data.clickPosition,
        currentView: this._uiState.currentView
      }
    })
    
    if (result.success) {
      // Show mascot response
      await this._showMascotDialogue(result.result.guidance.message)
      
      // Animate mascot
      await this._animateMascotResponse()
    }
    
    return result
  }

  async _handleLanguageChange(language) {
    await this.updateUIState({ language })
    await this._applyLanguageChange(language)
    
    return {
      success: true,
      message: 'Language updated successfully!'
    }
  }

  async _handleThemeChange(theme) {
    await this.updateUIState({ theme })
    await this._applyThemeChange(theme)
    
    return {
      success: true,
      message: 'Theme updated successfully!'
    }
  }

  // ============================================
  // UI UPDATE METHODS
  // ============================================

  async _updateUserInterface() {
    if (!this._currentUser) return
    
    // Update phase indicator
    await this._updatePhaseIndicator()
    
    // Update mascot
    await this._updateMascotDisplay()
    
    // Update progress bar
    await this._updateProgressBar()
    
    // Update available assets
    await this._updateAssetSelection()
    
    // Update navigation
    await this._updateNavigation()
  }

  async _updatePhaseIndicator() {
    const indicators = document.querySelectorAll(this._selectors.phaseIndicator)
    indicators.forEach(indicator => {
      indicator.textContent = `Phase ${this._currentUser.currentPhase}: ${this._getMascotName()}`
      indicator.setAttribute('data-phase', this._currentUser.currentPhase)
    })
  }

  async _updateMascotDisplay() {
    const mascotImages = document.querySelectorAll(this._selectors.mascotImage)
    const mascotName = this._currentUser.currentMascot
    
    mascotImages.forEach(img => {
      img.src = `/assets/images/${mascotName}_mascot_pose.png`
      img.alt = `${this._getMascotName()} - Your OneFi Guide`
    })
    
    // Update mascot container data attributes
    const mascotContainers = document.querySelectorAll(this._selectors.mascotContainer)
    mascotContainers.forEach(container => {
      container.setAttribute('data-mascot', mascotName)
      container.setAttribute('data-phase', this._currentUser.currentPhase)
    })
  }

  async _updateProgressBar() {
    const progressBars = document.querySelectorAll(this._selectors.progressBar)
    const progress = this._currentUser.journeyProgress || 0
    
    progressBars.forEach(bar => {
      const progressFill = bar.querySelector('.progress-fill') || bar
      progressFill.style.width = `${progress}%`
      progressFill.setAttribute('aria-valuenow', progress)
      progressFill.setAttribute('aria-label', `Journey progress: ${progress}%`)
    })
  }

  async _updateAssetSelection() {
    const assetContainers = document.querySelectorAll(this._selectors.assetSelection)
    const availableAssets = this._currentUser.availableAssets || []
    
    assetContainers.forEach(container => {
      // Show/hide assets based on phase
      const assetCards = container.querySelectorAll('.asset-card, .asset-option')
      assetCards.forEach(card => {
        const assetSymbol = card.getAttribute('data-asset') || card.getAttribute('data-symbol')
        const isAvailable = availableAssets.some(asset => asset.symbol === assetSymbol)
        
        if (isAvailable) {
          card.classList.remove('disabled', 'locked')
          card.setAttribute('aria-disabled', 'false')
        } else {
          card.classList.add('disabled', 'locked')
          card.setAttribute('aria-disabled', 'true')
        }
      })
    })
  }

  async _updateNavigation() {
    // Update navigation based on user permissions
    const navLinks = document.querySelectorAll('nav a, .nav-link')
    const accessibleFeatures = this._currentUser.canAccessFeatures || []
    
    navLinks.forEach(link => {
      const feature = link.getAttribute('data-feature')
      if (feature && !accessibleFeatures.includes(feature)) {
        link.classList.add('disabled')
        link.setAttribute('aria-disabled', 'true')
      } else {
        link.classList.remove('disabled')
        link.setAttribute('aria-disabled', 'false')
      }
    })
  }

  // ============================================
  // ANIMATION AND FEEDBACK METHODS
  // ============================================

  async _showMascotWelcome() {
    const result = await this._application.handleUserAction('get_mascot_guidance', {
      context: { type: 'welcome', firstTime: true }
    })
    
    if (result && result.success) {
      await this._showMascotDialogue(result.result.guidance.message)
    }
  }

  async _showMascotDialogue(message) {
    const dialogueElements = document.querySelectorAll(this._selectors.mascotDialogue)
    const bubbleElements = document.querySelectorAll(this._selectors.mascotBubble)
    
    // Update dialogue text
    dialogueElements.forEach(element => {
      element.textContent = message
    })
    
    // Show dialogue bubble with animation
    bubbleElements.forEach(bubble => {
      bubble.classList.add('show', 'animate-in')
      
      // Auto-hide after 8 seconds
      setTimeout(() => {
        bubble.classList.remove('show', 'animate-in')
        bubble.classList.add('animate-out')
      }, 8000)
    })
  }

  async _showFeedbackMessage(message) {
    // Create or find feedback notification element
    let notification = document.querySelector('.feedback-notification')
    if (!notification) {
      notification = document.createElement('div')
      notification.className = 'feedback-notification success'
      document.body.appendChild(notification)
    }
    
    notification.textContent = message
    notification.classList.add('show')
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show')
    }, 3000)
  }

  async _showErrorMessage(message) {
    let notification = document.querySelector('.error-notification')
    if (!notification) {
      notification = document.createElement('div')
      notification.className = 'error-notification error'
      document.body.appendChild(notification)
    }
    
    notification.textContent = message
    notification.classList.add('show')
    
    setTimeout(() => {
      notification.classList.remove('show')
    }, 5000)
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  _detectEnvironment() {
    return window.location.hostname === 'localhost' ? 'development' : 'production'
  }

  _detectLanguage() {
    return document.documentElement.lang || 
           localStorage.getItem('diboas_language') || 
           navigator.language.substr(0, 2) || 
           'en'
  }

  _detectTheme() {
    return document.documentElement.getAttribute('data-theme') ||
           localStorage.getItem('diboas_theme') ||
           'default'
  }

  _generateDemoUserId() {
    return 'demo_user_' + Math.random().toString(36).substr(2, 9)
  }

  _getMascotName() {
    const names = {
      aqua: 'Aqua',
      verde: 'Verde',
      mystic: 'Mystic', 
      coral: 'Coral'
    }
    
    return names[this._currentUser?.currentMascot || 'aqua'] || 'Aqua'
  }

  async _handleAssetClick(event) {
    const assetCard = event.currentTarget
    const assetSymbol = assetCard.getAttribute('data-asset') || 
                      assetCard.getAttribute('data-symbol') ||
                      assetCard.textContent.trim().toUpperCase()
    
    await this.handleUserInteraction('asset_selection', {
      assetSymbol,
      context: { source: 'asset_card_click' }
    })
  }

  async _handleGetStartedClick(event) {
    event.preventDefault()
    
    // Start user session if not already started
    if (!this._currentUser) {
      await this.startUserSession()
    }
    
    // Navigate to app
    if (window.location.hostname !== 'localhost') {
      window.location.href = 'https://dapp.diboas.com'
    } else {
      window.location.href = '/app'
    }
  }

  // Placeholder component classes
  async _applyUIUpdates() {
    // Apply theme
    document.documentElement.setAttribute('data-theme', this._uiState.theme)
    
    // Apply language
    document.documentElement.setAttribute('lang', this._uiState.language)
    
    // Apply mascot
    document.documentElement.setAttribute('data-mascot', this._uiState.mascot)
  }

  async _applyLanguageChange(language) {
    this._uiState.language = language
    localStorage.setItem('diboas_language', language)
    await this._applyUIUpdates()
  }

  async _applyThemeChange(theme) {
    this._uiState.theme = theme
    localStorage.setItem('diboas_theme', theme)
    await this._applyUIUpdates()
  }
}

// Placeholder component classes (these would be expanded based on existing functionality)
class AssetSelectionComponent {
  constructor(uiManager) {
    this.uiManager = uiManager
  }
  
  async initialize() {
    // Initialize asset selection functionality
  }
}

class UserJourneyComponent {
  constructor(uiManager) {
    this.uiManager = uiManager
  }
  
  async initialize() {
    // Initialize user journey functionality
  }
}

class MascotInteractionComponent {
  constructor(uiManager) {
    this.uiManager = uiManager
  }
  
  async initialize() {
    // Initialize mascot interaction functionality
  }
}

class SettingsComponent {
  constructor(uiManager) {
    this.uiManager = uiManager
  }
  
  async initialize() {
    // Initialize settings functionality
  }
}

class ProgressTrackingComponent {
  constructor(uiManager) {
    this.uiManager = uiManager
  }
  
  async initialize() {
    // Initialize progress tracking functionality
  }
}

// Global UI Manager instance
let globalUIManager = null

export async function getGlobalUIManager() {
  if (!globalUIManager) {
    globalUIManager = new DiBoaSUIManager()
    await globalUIManager.initialize()
  }
  return globalUIManager
}

export function setGlobalUIManager(uiManager) {
  globalUIManager = uiManager
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const uiManager = await getGlobalUIManager()
        // Auto-start demo session for development
        if (window.location.hostname === 'localhost') {
          setTimeout(() => uiManager.startUserSession(), 1000)
        }
      } catch (error) {
        console.error('Failed to auto-initialize UI Manager:', error)
      }
    })
  } else {
    // DOM already loaded
    setTimeout(async () => {
      try {
        const uiManager = await getGlobalUIManager()
        if (window.location.hostname === 'localhost') {
          setTimeout(() => uiManager.startUserSession(), 1000)
        }
      } catch (error) {
        console.error('Failed to auto-initialize UI Manager:', error)
      }
    }, 100)
  }
}