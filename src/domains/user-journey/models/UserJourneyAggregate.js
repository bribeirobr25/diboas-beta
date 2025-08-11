/**
 * User Journey Domain Models
 * Manages user progression through diBoaS phases
 */

import { UserPhase, ConfidenceLevel } from '../../../shared-kernel/common/models/ValueObjects.js'
import { 
  UserJourneyStartedEvent,
  UserPhaseAdvancedEvent, 
  UserAchievementUnlockedEvent 
} from '../../../shared-kernel/common/events/DomainEvents.js'

/**
 * User entity within the journey context
 */
export class UserJourneyAggregate {
  constructor(userId, initialData = {}) {
    // Core identity
    this._userId = userId
    this._version = initialData.version || 1
    
    // Journey state
    this._currentPhase = UserPhase.fromLevel(initialData.currentPhase || 1)
    this._confidenceLevel = ConfidenceLevel.fromLevel(initialData.confidenceLevel || 1)
    this._startedAt = initialData.startedAt ? new Date(initialData.startedAt) : new Date()
    this._lastActiveAt = new Date()
    
    // Progress tracking
    this._achievements = new Set(initialData.achievements || [])
    this._completedLessons = new Set(initialData.completedLessons || [])
    this._unlockedFeatures = new Set(initialData.unlockedFeatures || [])
    
    // User preferences
    this._preferences = {
      language: initialData.language || 'en',
      theme: initialData.theme || 'default',
      notifications: initialData.notifications !== false,
      riskTolerance: initialData.riskTolerance || 'moderate',
      investmentGoals: initialData.investmentGoals || [],
      communicationStyle: initialData.communicationStyle || 'friendly',
      ...initialData.preferences
    }
    
    // Behavior tracking for AI personalization
    this._behaviorProfile = {
      interactionCount: initialData.interactionCount || 0,
      avgSessionDuration: initialData.avgSessionDuration || 0,
      preferredLearningStyle: initialData.preferredLearningStyle || 'visual',
      responseToEncouragement: initialData.responseToEncouragement || 'positive',
      decisionMakingSpeed: initialData.decisionMakingSpeed || 'moderate'
    }
    
    // Domain events
    this._domainEvents = []
    
    // Validation
    this._validateState()
  }

  // ============================================
  // GETTERS
  // ============================================

  get userId() { return this._userId }
  get version() { return this._version }
  get currentPhase() { return this._currentPhase }
  get confidenceLevel() { return this._confidenceLevel }
  get startedAt() { return this._startedAt }
  get lastActiveAt() { return this._lastActiveAt }
  get preferences() { return { ...this._preferences } }
  get behaviorProfile() { return { ...this._behaviorProfile } }
  
  get achievements() { 
    return Array.from(this._achievements) 
  }
  
  get completedLessons() { 
    return Array.from(this._completedLessons) 
  }
  
  get unlockedFeatures() { 
    return Array.from(this._unlockedFeatures) 
  }

  get domainEvents() { 
    return [...this._domainEvents] 
  }

  // ============================================
  // BUSINESS METHODS
  // ============================================

  /**
   * Start the user journey
   */
  startJourney() {
    if (this._currentPhase.level > 1) {
      throw new Error('Journey has already been started')
    }

    this._lastActiveAt = new Date()
    this._addDomainEvent(new UserJourneyStartedEvent(this._userId, 1))
    
    // Unlock initial features
    this._unlockFeature('asset_selection')
    this._unlockFeature('mascot_interaction')
    
    return this
  }

  /**
   * Advance to next phase with validation
   */
  advanceToNextPhase() {
    const nextPhase = this._currentPhase.getNextPhase()
    
    if (!nextPhase) {
      throw new Error('User is already at the highest phase')
    }

    if (!this._canAdvanceToPhase(nextPhase)) {
      throw new Error(`Cannot advance to phase ${nextPhase.level}. Requirements not met.`)
    }

    const previousPhase = this._currentPhase
    this._currentPhase = nextPhase
    this._confidenceLevel = ConfidenceLevel.fromLevel(nextPhase.level)
    this._lastActiveAt = new Date()
    this._version++

    // Unlock new features for this phase
    this._unlockFeaturesForPhase(nextPhase)
    
    // Add achievement
    this._addAchievement(`phase_${nextPhase.level}_unlocked`)
    
    // Emit domain event
    this._addDomainEvent(new UserPhaseAdvancedEvent(
      this._userId, 
      previousPhase.level, 
      nextPhase.level
    ))

    return this
  }

  /**
   * Complete a learning lesson
   */
  completeLesson(lessonId, completionData = {}) {
    if (this._completedLessons.has(lessonId)) {
      throw new Error(`Lesson ${lessonId} already completed`)
    }

    this._completedLessons.add(lessonId)
    this._lastActiveAt = new Date()
    this._version++

    // Update behavior profile
    this._behaviorProfile.interactionCount++
    
    // Check if this unlocks achievements
    this._checkLearningAchievements()
    
    // Check if user can advance phase
    if (this._canAdvanceToNextPhase()) {
      // Auto-advance or trigger notification
      this._addAchievement('ready_to_advance')
    }

    return this
  }

  /**
   * Add achievement to user
   */
  addAchievement(achievementId, achievementData = {}) {
    if (this._achievements.has(achievementId)) {
      return this // Already has achievement
    }

    this._achievements.add(achievementId)
    this._lastActiveAt = new Date()
    this._version++

    this._addDomainEvent(new UserAchievementUnlockedEvent(
      this._userId,
      achievementId,
      achievementData
    ))

    return this
  }

  /**
   * Update user preferences
   */
  updatePreferences(newPreferences) {
    const validPreferences = this._validatePreferences(newPreferences)
    
    this._preferences = {
      ...this._preferences,
      ...validPreferences
    }
    
    this._lastActiveAt = new Date()
    this._version++

    return this
  }

  /**
   * Update behavior profile based on interactions
   */
  updateBehaviorProfile(behaviorData) {
    if (behaviorData.sessionDuration) {
      this._behaviorProfile.avgSessionDuration = 
        (this._behaviorProfile.avgSessionDuration + behaviorData.sessionDuration) / 2
    }

    if (behaviorData.learningStyle) {
      this._behaviorProfile.preferredLearningStyle = behaviorData.learningStyle
    }

    if (behaviorData.responseToEncouragement) {
      this._behaviorProfile.responseToEncouragement = behaviorData.responseToEncouragement
    }

    if (behaviorData.decisionMakingSpeed) {
      this._behaviorProfile.decisionMakingSpeed = behaviorData.decisionMakingSpeed
    }

    this._behaviorProfile.interactionCount++
    this._lastActiveAt = new Date()
    this._version++

    return this
  }

  /**
   * Check if user can access a feature
   */
  canAccessFeature(featureName) {
    return this._unlockedFeatures.has(featureName) || 
           this._isFeatureAvailableForPhase(featureName, this._currentPhase)
  }

  /**
   * Get available assets for current phase
   */
  getAvailableAssets() {
    return this._currentPhase.getAvailableAssets()
  }

  /**
   * Get mascot type for current phase
   */
  getCurrentMascot() {
    return this._confidenceLevel.getMascotType()
  }

  /**
   * Get journey progress percentage
   */
  getJourneyProgress() {
    const totalPhases = 4
    const baseProgress = ((this._currentPhase.level - 1) / totalPhases) * 100
    
    // Add bonus progress for achievements
    const achievementBonus = Math.min(this._achievements.size * 2, 25)
    const lessonBonus = Math.min(this._completedLessons.size * 1, 25)
    
    return Math.min(baseProgress + achievementBonus + lessonBonus, 100)
  }

  /**
   * Reset domain events (called after persistence)
   */
  clearDomainEvents() {
    this._domainEvents = []
  }

  /**
   * Serialize for persistence
   */
  toJSON() {
    return {
      userId: this._userId,
      version: this._version,
      currentPhase: this._currentPhase.level,
      confidenceLevel: this._confidenceLevel.level,
      startedAt: this._startedAt.toISOString(),
      lastActiveAt: this._lastActiveAt.toISOString(),
      achievements: Array.from(this._achievements),
      completedLessons: Array.from(this._completedLessons),
      unlockedFeatures: Array.from(this._unlockedFeatures),
      preferences: this._preferences,
      behaviorProfile: this._behaviorProfile
    }
  }

  /**
   * Create from serialized data
   */
  static fromJSON(data) {
    return new UserJourneyAggregate(data.userId, data)
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  _validateState() {
    if (!this._userId || typeof this._userId !== 'string') {
      throw new Error('User ID is required and must be a string')
    }
    
    if (!this._currentPhase) {
      throw new Error('Current phase is required')
    }
    
    if (!this._confidenceLevel) {
      throw new Error('Confidence level is required')
    }
  }

  _canAdvanceToPhase(targetPhase) {
    // Basic validation
    if (!this._currentPhase.canAdvanceTo(targetPhase)) {
      return false
    }

    // Phase-specific requirements
    switch (targetPhase.level) {
      case 2: // Verde phase
        return this._completedLessons.size >= 2 && 
               this._achievements.has('first_asset_selected')
      
      case 3: // Mystic phase  
        return this._completedLessons.size >= 5 && 
               this._achievements.has('diversification_started')
      
      case 4: // Coral phase
        return this._completedLessons.size >= 10 && 
               this._achievements.has('advanced_strategies_unlocked')
      
      default:
        return true
    }
  }

  _canAdvanceToNextPhase() {
    const nextPhase = this._currentPhase.getNextPhase()
    return nextPhase ? this._canAdvanceToPhase(nextPhase) : false
  }

  _unlockFeaturesForPhase(phase) {
    const phaseFeatures = {
      1: ['asset_selection', 'mascot_interaction', 'basic_learning'],
      2: ['portfolio_tracking', 'goal_setting', 'market_data'],
      3: ['advanced_assets', 'strategy_templates', 'community_access'],
      4: ['all_features', 'expert_mode', 'custom_strategies', 'b2b_access']
    }

    const features = phaseFeatures[phase.level] || []
    features.forEach(feature => this._unlockFeature(feature))
  }

  _unlockFeature(featureName) {
    this._unlockedFeatures.add(featureName)
  }

  _isFeatureAvailableForPhase(featureName, phase) {
    const phaseFeatures = {
      1: ['asset_selection', 'mascot_interaction', 'basic_learning'],
      2: ['portfolio_tracking', 'goal_setting', 'market_data'],
      3: ['advanced_assets', 'strategy_templates', 'community_access'],
      4: ['all_features', 'expert_mode', 'custom_strategies', 'b2b_access']
    }

    // Check if feature is available for current or lower phases
    for (let i = 1; i <= phase.level; i++) {
      if (phaseFeatures[i]?.includes(featureName)) {
        return true
      }
    }
    
    return false
  }

  _addAchievement(achievementId) {
    this.addAchievement(achievementId, {
      unlockedAt: new Date(),
      phase: this._currentPhase.level
    })
  }

  _checkLearningAchievements() {
    const lessonCount = this._completedLessons.size
    
    const achievements = [
      { count: 1, id: 'first_lesson_completed' },
      { count: 3, id: 'learning_streak_started' },
      { count: 5, id: 'knowledge_builder' },
      { count: 10, id: 'learning_expert' },
      { count: 20, id: 'master_student' }
    ]

    achievements.forEach(({ count, id }) => {
      if (lessonCount >= count && !this._achievements.has(id)) {
        this._addAchievement(id)
      }
    })
  }

  _validatePreferences(preferences) {
    const validPreferences = {}
    
    if (preferences.language && typeof preferences.language === 'string') {
      validPreferences.language = preferences.language
    }
    
    if (preferences.theme && ['default', 'dark', 'light'].includes(preferences.theme)) {
      validPreferences.theme = preferences.theme
    }
    
    if (typeof preferences.notifications === 'boolean') {
      validPreferences.notifications = preferences.notifications
    }
    
    if (preferences.riskTolerance && 
        ['conservative', 'moderate', 'aggressive'].includes(preferences.riskTolerance)) {
      validPreferences.riskTolerance = preferences.riskTolerance
    }

    return validPreferences
  }

  _addDomainEvent(event) {
    this._domainEvents.push(event)
  }
}