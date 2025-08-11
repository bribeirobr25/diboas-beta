/**
 * User Journey Domain Service
 * Orchestrates user progression and phase management
 */

import { UserJourneyAggregate } from '../models/UserJourneyAggregate.js'
import { UserPhase } from '../../../shared-kernel/common/models/ValueObjects.js'
import { 
  UserPreferencesUpdatedEvent,
  SecurityViolationEvent,
  PerformanceMetricRecordedEvent
} from '../../../shared-kernel/common/events/DomainEvents.js'

/**
 * Domain service for managing user journey operations
 */
export class UserJourneyService {
  constructor(userRepository, securityContext, auditLogger, performanceMonitor, eventBus) {
    this._userRepository = userRepository
    this._securityContext = securityContext
    this._auditLogger = auditLogger
    this._performanceMonitor = performanceMonitor
    this._eventBus = eventBus
    
    // Bind methods for consistent context
    this.startUserJourney = this.startUserJourney.bind(this)
    this.advanceUserPhase = this.advanceUserPhase.bind(this)
    this.updateUserPreferences = this.updateUserPreferences.bind(this)
  }

  /**
   * Start a new user journey
   * @param {string} userId - User identifier
   * @param {Object} initialData - Initial user data
   * @returns {Promise<UserJourneyAggregate>} Created user journey
   */
  async startUserJourney(userId, initialData = {}) {
    const timer = this._performanceMonitor?.startTimer('user_journey_start')
    
    try {
      // Security: Validate user permissions
      await this._securityContext.validateUserAction(userId, 'start_journey')
      
      // Business validation: Check if journey already exists
      const existingUser = await this._userRepository.findById(userId)
      if (existingUser) {
        throw new Error(`User journey already exists for user: ${userId}`)
      }

      // Create new user journey aggregate
      const userJourney = new UserJourneyAggregate(userId, {
        ...initialData,
        language: initialData.language || this._detectUserLanguage(),
        theme: initialData.theme || 'default'
      })

      // Start the journey (domain logic)
      userJourney.startJourney()

      // Persist the aggregate
      const savedUser = await this._userRepository.save(userJourney.toJSON())

      // Publish domain events
      await this._publishDomainEvents(userJourney)

      // Security audit
      await this._auditLogger.logBusinessAction(userId, 'user_journey_started', {
        phase: userJourney.currentPhase.level,
        mascot: userJourney.getCurrentMascot(),
        achievements: userJourney.achievements.length
      })

      timer?.end()
      return UserJourneyAggregate.fromJSON(savedUser)
      
    } catch (error) {
      timer?.end()
      await this._handleServiceError(userId, 'start_user_journey', error)
      throw error
    }
  }

  /**
   * Get user journey by ID
   * @param {string} userId - User identifier
   * @returns {Promise<UserJourneyAggregate|null>} User journey or null
   */
  async getUserJourney(userId) {
    const timer = this._performanceMonitor?.startTimer('get_user_journey')
    
    try {
      // Security: Validate user permissions
      await this._securityContext.validateUserAction(userId, 'read_journey')
      
      const userData = await this._userRepository.findById(userId)
      
      timer?.end()
      return userData ? UserJourneyAggregate.fromJSON(userData) : null
      
    } catch (error) {
      timer?.end()
      await this._handleServiceError(userId, 'get_user_journey', error)
      throw error
    }
  }

  /**
   * Advance user to next phase
   * @param {string} userId - User identifier
   * @returns {Promise<UserJourneyAggregate>} Updated user journey
   */
  async advanceUserPhase(userId) {
    const timer = this._performanceMonitor?.startTimer('advance_user_phase')
    
    try {
      // Security: Validate user permissions
      await this._securityContext.validateUserAction(userId, 'advance_phase')
      
      // Load user journey
      const userData = await this._userRepository.findById(userId)
      if (!userData) {
        throw new Error(`User journey not found: ${userId}`)
      }

      const userJourney = UserJourneyAggregate.fromJSON(userData)
      const currentPhase = userJourney.currentPhase.level

      // Advance phase (domain logic with validation)
      userJourney.advanceToNextPhase()

      // Persist changes
      const savedUser = await this._userRepository.save(userJourney.toJSON())

      // Publish domain events
      await this._publishDomainEvents(userJourney)

      // Security audit
      await this._auditLogger.logBusinessAction(userId, 'user_phase_advanced', {
        fromPhase: currentPhase,
        toPhase: userJourney.currentPhase.level,
        newMascot: userJourney.getCurrentMascot(),
        newAchievements: userJourney.achievements.length
      })

      timer?.end()
      return UserJourneyAggregate.fromJSON(savedUser)
      
    } catch (error) {
      timer?.end()
      await this._handleServiceError(userId, 'advance_user_phase', error)
      throw error
    }
  }

  /**
   * Complete a learning lesson
   * @param {string} userId - User identifier
   * @param {string} lessonId - Lesson identifier
   * @param {Object} completionData - Lesson completion data
   * @returns {Promise<UserJourneyAggregate>} Updated user journey
   */
  async completeLesson(userId, lessonId, completionData = {}) {
    const timer = this._performanceMonitor?.startTimer('complete_lesson')
    
    try {
      // Security: Validate user permissions and lesson access
      await this._securityContext.validateUserAction(userId, 'complete_lesson')
      await this._validateLessonAccess(userId, lessonId)
      
      // Load user journey
      const userData = await this._userRepository.findById(userId)
      if (!userData) {
        throw new Error(`User journey not found: ${userId}`)
      }

      const userJourney = UserJourneyAggregate.fromJSON(userData)

      // Complete lesson (domain logic)
      userJourney.completeLesson(lessonId, completionData)

      // Update behavior profile based on completion
      userJourney.updateBehaviorProfile({
        sessionDuration: completionData.timeSpent || 0,
        learningStyle: completionData.preferredStyle || userJourney.behaviorProfile.preferredLearningStyle
      })

      // Persist changes
      const savedUser = await this._userRepository.save(userJourney.toJSON())

      // Publish domain events
      await this._publishDomainEvents(userJourney)

      // Security audit
      await this._auditLogger.logBusinessAction(userId, 'lesson_completed', {
        lessonId,
        phase: userJourney.currentPhase.level,
        totalLessons: userJourney.completedLessons.length,
        timeSpent: completionData.timeSpent
      })

      timer?.end()
      return UserJourneyAggregate.fromJSON(savedUser)
      
    } catch (error) {
      timer?.end()
      await this._handleServiceError(userId, 'complete_lesson', error)
      throw error
    }
  }

  /**
   * Update user preferences
   * @param {string} userId - User identifier
   * @param {Object} preferences - New preferences
   * @returns {Promise<UserJourneyAggregate>} Updated user journey
   */
  async updateUserPreferences(userId, preferences) {
    const timer = this._performanceMonitor?.startTimer('update_user_preferences')
    
    try {
      // Security: Validate user permissions
      await this._securityContext.validateUserAction(userId, 'update_preferences')
      
      // Load user journey
      const userData = await this._userRepository.findById(userId)
      if (!userData) {
        throw new Error(`User journey not found: ${userId}`)
      }

      const userJourney = UserJourneyAggregate.fromJSON(userData)
      const oldPreferences = { ...userJourney.preferences }

      // Update preferences (domain logic with validation)
      userJourney.updatePreferences(preferences)

      // Persist changes
      const savedUser = await this._userRepository.save(userJourney.toJSON())

      // Publish preference update event
      await this._eventBus.publish(new UserPreferencesUpdatedEvent(userId, {
        old: oldPreferences,
        new: userJourney.preferences,
        changedFields: this._getChangedFields(oldPreferences, userJourney.preferences)
      }))

      // Publish other domain events
      await this._publishDomainEvents(userJourney)

      // Security audit
      await this._auditLogger.logBusinessAction(userId, 'preferences_updated', {
        updatedFields: Object.keys(preferences),
        newLanguage: preferences.language,
        newTheme: preferences.theme
      })

      timer?.end()
      return UserJourneyAggregate.fromJSON(savedUser)
      
    } catch (error) {
      timer?.end()
      await this._handleServiceError(userId, 'update_user_preferences', error)
      throw error
    }
  }

  /**
   * Check if user can advance to next phase
   * @param {string} userId - User identifier
   * @returns {Promise<Object>} Advancement readiness info
   */
  async checkAdvancementReadiness(userId) {
    const timer = this._performanceMonitor?.startTimer('check_advancement_readiness')
    
    try {
      // Security: Validate user permissions
      await this._securityContext.validateUserAction(userId, 'check_advancement')
      
      const userData = await this._userRepository.findById(userId)
      if (!userData) {
        throw new Error(`User journey not found: ${userId}`)
      }

      const userJourney = UserJourneyAggregate.fromJSON(userData)
      const nextPhase = userJourney.currentPhase.getNextPhase()

      if (!nextPhase) {
        return {
          canAdvance: false,
          reason: 'Already at highest phase',
          currentPhase: userJourney.currentPhase.level,
          nextPhase: null
        }
      }

      // Check advancement requirements
      const readiness = this._checkPhaseRequirements(userJourney, nextPhase)

      timer?.end()
      return {
        canAdvance: readiness.meetsRequirements,
        reason: readiness.reason,
        currentPhase: userJourney.currentPhase.level,
        nextPhase: nextPhase.level,
        requirements: readiness.requirements,
        progress: readiness.progress
      }
      
    } catch (error) {
      timer?.end()
      await this._handleServiceError(userId, 'check_advancement_readiness', error)
      throw error
    }
  }

  /**
   * Get user journey statistics
   * @param {string} userId - User identifier
   * @returns {Promise<Object>} Journey statistics
   */
  async getJourneyStatistics(userId) {
    const timer = this._performanceMonitor?.startTimer('get_journey_statistics')
    
    try {
      // Security: Validate user permissions
      await this._securityContext.validateUserAction(userId, 'read_statistics')
      
      const userData = await this._userRepository.findById(userId)
      if (!userData) {
        throw new Error(`User journey not found: ${userId}`)
      }

      const userJourney = UserJourneyAggregate.fromJSON(userData)
      const daysSinceStart = Math.floor((Date.now() - userJourney.startedAt.getTime()) / (1000 * 60 * 60 * 24))

      timer?.end()
      return {
        userId: userJourney.userId,
        currentPhase: userJourney.currentPhase.level,
        currentMascot: userJourney.getCurrentMascot(),
        journeyProgress: userJourney.getJourneyProgress(),
        daysSinceStart,
        achievementsUnlocked: userJourney.achievements.length,
        lessonsCompleted: userJourney.completedLessons.length,
        featuresUnlocked: userJourney.unlockedFeatures.length,
        behaviorProfile: userJourney.behaviorProfile,
        preferences: userJourney.preferences
      }
      
    } catch (error) {
      timer?.end()
      await this._handleServiceError(userId, 'get_journey_statistics', error)
      throw error
    }
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  async _publishDomainEvents(userJourney) {
    const events = userJourney.domainEvents
    
    for (const event of events) {
      try {
        await this._eventBus.publish(event)
      } catch (error) {
        // Log error but don't fail the operation
        await this._auditLogger.error('Failed to publish domain event', {
          eventType: event.eventType,
          eventId: event.eventId,
          userId: userJourney.userId,
          error: error.message
        })
      }
    }
    
    userJourney.clearDomainEvents()
  }

  async _validateLessonAccess(userId, lessonId) {
    // This would typically validate against lesson repository
    // For now, we'll do basic validation
    if (!lessonId || typeof lessonId !== 'string') {
      throw new Error('Invalid lesson ID')
    }
    
    // Additional validation could check if lesson is available for user's phase
    return true
  }

  _checkPhaseRequirements(userJourney, targetPhase) {
    const requirements = {
      2: { // Verde phase
        minLessons: 2,
        requiredAchievements: ['first_asset_selected'],
        description: 'Complete 2 lessons and select your first asset'
      },
      3: { // Mystic phase
        minLessons: 5,
        requiredAchievements: ['diversification_started'],
        description: 'Complete 5 lessons and start diversifying your portfolio'
      },
      4: { // Coral phase
        minLessons: 10,
        requiredAchievements: ['advanced_strategies_unlocked'],
        description: 'Complete 10 lessons and unlock advanced strategies'
      }
    }

    const phaseReqs = requirements[targetPhase.level]
    if (!phaseReqs) {
      return { meetsRequirements: true, reason: 'No specific requirements' }
    }

    const lessonsProgress = userJourney.completedLessons.length
    const hasRequiredAchievements = phaseReqs.requiredAchievements.every(
      achievement => userJourney.achievements.includes(achievement)
    )

    const meetsRequirements = 
      lessonsProgress >= phaseReqs.minLessons && hasRequiredAchievements

    return {
      meetsRequirements,
      reason: meetsRequirements 
        ? 'All requirements met' 
        : 'Missing required lessons or achievements',
      requirements: phaseReqs,
      progress: {
        lessons: {
          completed: lessonsProgress,
          required: phaseReqs.minLessons,
          percentage: Math.min((lessonsProgress / phaseReqs.minLessons) * 100, 100)
        },
        achievements: {
          completed: phaseReqs.requiredAchievements.filter(
            achievement => userJourney.achievements.includes(achievement)
          ).length,
          required: phaseReqs.requiredAchievements.length,
          missing: phaseReqs.requiredAchievements.filter(
            achievement => !userJourney.achievements.includes(achievement)
          )
        }
      }
    }
  }

  _getChangedFields(oldPrefs, newPrefs) {
    const changed = []
    
    for (const key of Object.keys(newPrefs)) {
      if (oldPrefs[key] !== newPrefs[key]) {
        changed.push(key)
      }
    }
    
    return changed
  }

  _detectUserLanguage() {
    // Default implementation - could be enhanced with browser detection
    return 'en'
  }

  async _handleServiceError(userId, operation, error) {
    // Log error for monitoring
    await this._auditLogger.error(`UserJourneyService.${operation} failed`, {
      userId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date()
    })

    // Publish performance metric
    if (this._performanceMonitor) {
      await this._eventBus.publish(new PerformanceMetricRecordedEvent(
        `user_journey_service_error`,
        1,
        { operation, userId, errorType: error.constructor.name }
      ))
    }

    // Check for security violations
    if (error.message.includes('Unauthorized') || error.message.includes('permission')) {
      await this._eventBus.publish(new SecurityViolationEvent(userId, 'unauthorized_access', {
        operation,
        error: error.message,
        severity: 'medium',
        timestamp: new Date()
      }))
    }
  }
}