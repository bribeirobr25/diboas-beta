/**
 * diBoaS Application Layer
 * Central orchestration of all domain services and infrastructure
 */

import { getGlobalEventBus } from '../shared-kernel/common/events/EventBus.js'
import { UserJourneyService } from '../domains/user-journey/services/UserJourneyService.js'
import { createRepositories } from '../infrastructure/persistence/LocalStorageRepository.js'
import { createSecurityContext } from '../infrastructure/security/SecurityContext.js'
import { createPerformanceMonitor } from '../infrastructure/performance/PerformanceMonitor.js'
import { MascotPersonalityFactory } from '../domains/mascot-ai/models/MascotPersonality.js'

/**
 * Main application class that bootstraps the entire diBoaS platform
 */
export class DiBoaSApplication {
  constructor(options = {}) {
    this._environment = options.environment || 'development'
    this._config = options.config || {}
    this._isInitialized = false
    
    // Core infrastructure
    this._eventBus = null
    this._securityContext = null
    this._performanceMonitor = null
    this._auditLogger = options.auditLogger || console
    
    // Repositories
    this._repositories = null
    
    // Domain services
    this._services = {}
    
    // Application state
    this._currentUser = null
    this._applicationMetrics = {
      startTime: Date.now(),
      requestCount: 0,
      errorCount: 0,
      userSessions: 0
    }
    
    // Feature flags
    this._featureFlags = new Map()
    
    // UI components registry
    this._uiComponents = new Map()
  }

  /**
   * Initialize the entire application
   */
  async initialize() {
    if (this._isInitialized) {
      throw new Error('Application is already initialized')
    }

    try {
      await this._auditLogger.info('🚀 Starting diBoaS Application initialization...')
      
      // 1. Initialize core infrastructure
      await this._initializeInfrastructure()
      
      // 2. Initialize repositories
      await this._initializeRepositories()
      
      // 3. Initialize domain services
      await this._initializeDomainServices()
      
      // 4. Initialize feature flags
      await this._initializeFeatureFlags()
      
      // 5. Set up event handlers
      await this._setupEventHandlers()
      
      // 6. Initialize UI system
      await this._initializeUISystem()
      
      // 7. Perform health checks
      await this._performHealthChecks()
      
      this._isInitialized = true
      
      await this._auditLogger.info('✅ diBoaS Application initialized successfully', {
        environment: this._environment,
        features: Array.from(this._featureFlags.keys()),
        services: Object.keys(this._services),
        initializationTime: Date.now() - this._applicationMetrics.startTime
      })
      
      return {
        success: true,
        environment: this._environment,
        version: this._getApplicationVersion(),
        features: Array.from(this._featureFlags.keys())
      }
      
    } catch (error) {
      await this._auditLogger.error('❌ Application initialization failed', {
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  /**
   * Start user session
   */
  async startUserSession(userId, context = {}) {
    if (!this._isInitialized) {
      throw new Error('Application must be initialized before starting user session')
    }

    const timer = this._performanceMonitor.startTimer('start_user_session')
    
    try {
      // Security: Authenticate user
      const authResult = await this._securityContext.authenticateUser(userId, {
        method: 'demo',
        password: 'demo_password'
      }, context)

      // Load or create user journey
      let userJourney = await this._services.userJourney.getUserJourney(userId)
      
      if (!userJourney) {
        userJourney = await this._services.userJourney.startUserJourney(userId, {
          language: context.language || 'en',
          theme: context.theme || 'default'
        })
      }

      // Set current user
      this._currentUser = {
        userId,
        userJourney,
        sessionStarted: new Date(),
        context
      }

      this._applicationMetrics.userSessions++
      
      timer.end()
      
      await this._auditLogger.info('User session started', {
        userId,
        phase: userJourney.currentPhase.level,
        mascot: userJourney.getCurrentMascot()
      })

      return {
        success: true,
        user: {
          userId: userJourney.userId,
          currentPhase: userJourney.currentPhase.level,
          currentMascot: userJourney.getCurrentMascot(),
          journeyProgress: userJourney.getJourneyProgress(),
          preferences: userJourney.preferences,
          availableAssets: userJourney.getAvailableAssets(),
          canAccessFeatures: this._getUserAccessibleFeatures(userJourney)
        },
        session: {
          token: authResult.sessionToken,
          expiresAt: authResult.expiresAt
        }
      }
      
    } catch (error) {
      timer.end()
      this._applicationMetrics.errorCount++
      await this._auditLogger.error('Failed to start user session', {
        userId,
        error: error.message
      })
      throw error
    }
  }

  /**
   * Handle user action
   */
  async handleUserAction(action, params = {}) {
    if (!this._currentUser) {
      throw new Error('No active user session')
    }

    const timer = this._performanceMonitor.startTimer(`user_action_${action}`)
    this._applicationMetrics.requestCount++
    
    try {
      await this._auditLogger.debug(`Handling user action: ${action}`, {
        userId: this._currentUser.userId,
        params
      })

      let result
      
      switch (action) {
        case 'advance_phase':
          result = await this._handleAdvancePhase()
          break
          
        case 'complete_lesson':
          result = await this._handleCompleteLesson(params.lessonId, params.completionData)
          break
          
        case 'select_asset':
          result = await this._handleSelectAsset(params.assetSymbol, params.context)
          break
          
        case 'update_preferences':
          result = await this._handleUpdatePreferences(params.preferences)
          break
          
        case 'get_mascot_guidance':
          result = await this._handleGetMascotGuidance(params.context)
          break
          
        case 'get_journey_stats':
          result = await this._handleGetJourneyStats()
          break
          
        default:
          throw new Error(`Unknown user action: ${action}`)
      }
      
      timer.end()
      
      // Update current user state if needed
      if (result.userJourney) {
        this._currentUser.userJourney = result.userJourney
      }
      
      return {
        success: true,
        action,
        result,
        user: this._getCurrentUserState()
      }
      
    } catch (error) {
      timer.end()
      this._applicationMetrics.errorCount++
      
      await this._auditLogger.error(`User action failed: ${action}`, {
        userId: this._currentUser.userId,
        error: error.message,
        params
      })
      
      throw error
    }
  }

  /**
   * Get application health status
   */
  async getHealthStatus() {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      uptime: Date.now() - this._applicationMetrics.startTime,
      version: this._getApplicationVersion(),
      environment: this._environment
    }

    try {
      // Check infrastructure health
      const performanceHealth = this._performanceMonitor.getSystemHealth()
      const securityContext = this._securityContext.getSecurityContext()
      
      // Check repositories
      const repositoryHealth = await this._checkRepositoryHealth()
      
      // Determine overall health
      if (performanceHealth.status === 'critical' || !repositoryHealth.healthy) {
        health.status = 'unhealthy'
      } else if (performanceHealth.status === 'warning') {
        health.status = 'degraded'
      }
      
      health.details = {
        performance: performanceHealth,
        security: securityContext,
        repositories: repositoryHealth,
        metrics: this._applicationMetrics,
        features: Array.from(this._featureFlags.entries())
      }
      
    } catch (error) {
      health.status = 'unhealthy'
      health.error = error.message
    }
    
    return health
  }

  /**
   * Get application metrics
   */
  getApplicationMetrics() {
    return {
      ...this._applicationMetrics,
      performance: this._performanceMonitor.getPerformanceStats(),
      uptime: Date.now() - this._applicationMetrics.startTime,
      currentUser: this._currentUser ? {
        userId: this._currentUser.userId,
        sessionDuration: Date.now() - this._currentUser.sessionStarted.getTime(),
        phase: this._currentUser.userJourney.currentPhase.level
      } : null
    }
  }

  /**
   * Shutdown application gracefully
   */
  async shutdown() {
    await this._auditLogger.info('🛑 Shutting down diBoaS Application...')
    
    try {
      // Logout current user
      if (this._currentUser) {
        await this._securityContext.logout(this._currentUser.userId)
      }
      
      // Shutdown infrastructure
      await this._performanceMonitor.shutdown()
      await this._eventBus.shutdown()
      
      // Clear state
      this._currentUser = null
      this._isInitialized = false
      
      await this._auditLogger.info('✅ Application shutdown complete')
      
    } catch (error) {
      await this._auditLogger.error('Error during application shutdown', {
        error: error.message
      })
      throw error
    }
  }

  // ============================================
  // PRIVATE INITIALIZATION METHODS
  // ============================================

  async _initializeInfrastructure() {
    // Initialize event bus
    this._eventBus = getGlobalEventBus()
    
    // Initialize security context
    this._securityContext = createSecurityContext({
      eventBus: this._eventBus,
      auditLogger: this._auditLogger
    })
    
    // Initialize performance monitor
    this._performanceMonitor = createPerformanceMonitor({
      eventBus: this._eventBus,
      auditLogger: this._auditLogger
    })
    
    await this._auditLogger.info('✅ Core infrastructure initialized')
  }

  async _initializeRepositories() {
    this._repositories = createRepositories({
      eventBus: this._eventBus,
      securityContext: this._securityContext,
      performanceMonitor: this._performanceMonitor,
      encryptionService: null // Could add encryption service here
    })
    
    await this._auditLogger.info('✅ Repositories initialized')
  }

  async _initializeDomainServices() {
    // User Journey Service
    this._services.userJourney = new UserJourneyService(
      this._repositories.userRepository,
      this._securityContext,
      this._auditLogger,
      this._performanceMonitor,
      this._eventBus
    )
    
    await this._auditLogger.info('✅ Domain services initialized')
  }

  async _initializeFeatureFlags() {
    // Load feature flags from configuration repository
    const defaultFlags = {
      enableMascotAI: true,
      enablePortfolioTracking: true,
      enableAdvancedAssets: false,
      enableB2BAccess: false,
      enableRealTimeData: false,
      enableAnalytics: false, // Privacy-first
      enablePerformanceOptimization: true
    }

    for (const [flag, defaultValue] of Object.entries(defaultFlags)) {
      const value = await this._repositories.configRepository.getFeatureFlag(flag)
      this._featureFlags.set(flag, value !== null ? value : defaultValue)
    }
    
    await this._auditLogger.info('✅ Feature flags initialized', {
      flags: Array.from(this._featureFlags.entries())
    })
  }

  async _setupEventHandlers() {
    // User Journey event handlers
    this._eventBus.subscribe('UserPhaseAdvanced', async (event) => {
      await this._handlePhaseAdvancedEvent(event)
    })
    
    this._eventBus.subscribe('UserAchievementUnlocked', async (event) => {
      await this._handleAchievementUnlockedEvent(event)
    })
    
    // Security event handlers
    this._eventBus.subscribe('SecurityViolation', async (event) => {
      await this._handleSecurityViolationEvent(event)
    })
    
    // Performance event handlers
    this._eventBus.subscribe('PerformanceMetricRecorded', async (event) => {
      await this._handlePerformanceMetricEvent(event)
    })
    
    await this._auditLogger.info('✅ Event handlers set up')
  }

  async _initializeUISystem() {
    // Register UI component handlers
    this._registerUIComponents()
    
    // Initialize internationalization
    await this._initializeI18n()
    
    // Initialize theme system
    await this._initializeThemes()
    
    await this._auditLogger.info('✅ UI system initialized')
  }

  async _performHealthChecks() {
    // Test repository connections
    try {
      await this._repositories.userRepository.findById('health_check')
      await this._repositories.configRepository.getFeatureFlag('health_check')
    } catch (error) {
      throw new Error(`Repository health check failed: ${error.message}`)
    }
    
    // Test event bus
    try {
      await this._eventBus.publish({ 
        eventType: 'HealthCheck', 
        eventId: 'health_' + Date.now(),
        timestamp: new Date()
      })
    } catch (error) {
      throw new Error(`Event bus health check failed: ${error.message}`)
    }
    
    await this._auditLogger.info('✅ Health checks passed')
  }

  // ============================================
  // USER ACTION HANDLERS
  // ============================================

  async _handleAdvancePhase() {
    const userJourney = await this._services.userJourney.advanceUserPhase(
      this._currentUser.userId
    )
    
    return { 
      userJourney,
      message: `Congratulations! You've advanced to ${userJourney.currentPhase.title}!`,
      newMascot: userJourney.getCurrentMascot(),
      unlockedFeatures: userJourney.unlockedFeatures
    }
  }

  async _handleCompleteLesson(lessonId, completionData) {
    const userJourney = await this._services.userJourney.completeLesson(
      this._currentUser.userId,
      lessonId,
      completionData
    )
    
    return {
      userJourney,
      lessonId,
      achievements: userJourney.achievements,
      canAdvancePhase: userJourney.getJourneyProgress() >= 75 // Example threshold
    }
  }

  async _handleSelectAsset(assetSymbol, context) {
    const userJourney = this._currentUser.userJourney
    const availableAssets = userJourney.getAvailableAssets()
    
    const selectedAsset = availableAssets.find(asset => asset.symbol === assetSymbol)
    if (!selectedAsset) {
      throw new Error(`Asset ${assetSymbol} is not available for your current phase`)
    }
    
    // Add achievement if this is first asset selection
    if (!userJourney.achievements.includes('first_asset_selected')) {
      await this._services.userJourney.updateUserJourney(userJourney.userId, {
        achievements: [...userJourney.achievements, 'first_asset_selected']
      })
    }
    
    return {
      selectedAsset,
      message: `Great choice! ${selectedAsset.name} is perfect for your ${userJourney.currentPhase.title} phase.`,
      mascotGuidance: await this._getMascotGuidanceForAsset(selectedAsset, userJourney)
    }
  }

  async _handleUpdatePreferences(preferences) {
    const userJourney = await this._services.userJourney.updateUserPreferences(
      this._currentUser.userId,
      preferences
    )
    
    return {
      userJourney,
      updatedPreferences: userJourney.preferences,
      message: 'Your preferences have been updated successfully!'
    }
  }

  async _handleGetMascotGuidance(context) {
    const userJourney = this._currentUser.userJourney
    const mascotType = userJourney.getCurrentMascot()
    const personality = MascotPersonalityFactory.createPersonality(mascotType)
    
    const guidance = personality.generateGuidance({
      ...context,
      phase: userJourney.currentPhase.title,
      userProgress: userJourney.getJourneyProgress()
    })
    
    return {
      mascot: mascotType,
      guidance,
      personalityTraits: personality.traits
    }
  }

  async _handleGetJourneyStats() {
    const stats = await this._services.userJourney.getJourneyStatistics(
      this._currentUser.userId
    )
    
    return stats
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  async _handlePhaseAdvancedEvent(event) {
    await this._auditLogger.info('User phase advanced', {
      userId: event.userId,
      fromPhase: event.eventData.fromPhase,
      toPhase: event.eventData.toPhase,
      newMascot: event.eventData.toMascot
    })
    
    // Could trigger additional actions like sending notifications
  }

  async _handleAchievementUnlockedEvent(event) {
    await this._auditLogger.info('Achievement unlocked', {
      userId: event.userId,
      achievement: event.eventData.achievementType
    })
    
    // Could trigger celebration animations or notifications
  }

  async _handleSecurityViolationEvent(event) {
    await this._auditLogger.warn('Security violation detected', {
      userId: event.userId,
      violationType: event.eventData.violationType,
      severity: event.eventData.severity
    })
    
    // Could trigger additional security measures
  }

  async _handlePerformanceMetricEvent(event) {
    // Automatically optimize performance based on metrics
    if (event.eventData.value > 3000) { // Slow operation
      await this._performanceMonitor.optimizePerformance()
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  _getCurrentUserState() {
    if (!this._currentUser) return null
    
    const userJourney = this._currentUser.userJourney
    
    return {
      userId: userJourney.userId,
      currentPhase: userJourney.currentPhase.level,
      currentMascot: userJourney.getCurrentMascot(),
      journeyProgress: userJourney.getJourneyProgress(),
      achievements: userJourney.achievements,
      availableAssets: userJourney.getAvailableAssets(),
      preferences: userJourney.preferences,
      sessionDuration: Date.now() - this._currentUser.sessionStarted.getTime()
    }
  }

  _getUserAccessibleFeatures(userJourney) {
    const features = []
    
    this._featureFlags.forEach((enabled, feature) => {
      if (enabled && userJourney.canAccessFeature(feature)) {
        features.push(feature)
      }
    })
    
    return features
  }

  async _getMascotGuidanceForAsset(asset, userJourney) {
    const mascotType = userJourney.getCurrentMascot()
    const personality = MascotPersonalityFactory.createPersonality(mascotType)
    
    return personality.generateGuidance({
      type: 'asset_selection',
      asset: asset.name,
      phase: userJourney.currentPhase.title,
      userProgress: userJourney.getJourneyProgress()
    })
  }

  async _checkRepositoryHealth() {
    try {
      // Test each repository
      const tests = await Promise.all([
        this._repositories.userRepository.findById('test'),
        this._repositories.configRepository.getFeatureFlag('test')
      ])
      
      return { healthy: true, tests: tests.length }
      
    } catch (error) {
      return { healthy: false, error: error.message }
    }
  }

  _registerUIComponents() {
    // This would register UI component factories
    // For now, it's a placeholder for the UI system
    this._uiComponents.set('UserJourneyWidget', 'UserJourneyWidget')
    this._uiComponents.set('MascotInteraction', 'MascotInteraction')
    this._uiComponents.set('AssetSelection', 'AssetSelection')
  }

  async _initializeI18n() {
    // Load localization strings
    const language = this._currentUser?.userJourney?.preferences?.language || 'en'
    await this._repositories.configRepository.getLocalizationStrings(language)
  }

  async _initializeThemes() {
    // Load theme configuration
    const theme = this._currentUser?.userJourney?.preferences?.theme || 'default'
    // Theme initialization would happen here
  }

  _getApplicationVersion() {
    return '1.0.0-ddd-architecture'
  }
}

/**
 * Create and initialize diBoaS application
 */
export async function createDiBoaSApplication(options = {}) {
  const app = new DiBoaSApplication(options)
  await app.initialize()
  return app
}

// Global application instance for easy access
let globalApplication = null

export async function getGlobalApplication(options = {}) {
  if (!globalApplication) {
    globalApplication = await createDiBoaSApplication(options)
  }
  return globalApplication
}

export function setGlobalApplication(application) {
  globalApplication = application
}