/**
 * Domain Events for diBoaS Platform
 * Event-Driven Architecture Foundation
 */

import { v4 as uuidv4 } from 'uuid'

/**
 * Base class for all domain events
 */
export class BaseDomainEvent {
  constructor(eventType, aggregateId, eventData = {}, userId = null) {
    this.eventId = uuidv4()
    this.eventType = eventType
    this.aggregateId = aggregateId
    this.userId = userId
    this.eventData = { ...eventData }
    this.timestamp = new Date()
    this.version = 1
    
    // Security: Mark as immutable
    Object.freeze(this.eventData)
    Object.freeze(this)
  }

  /**
   * Get event for serialization
   */
  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      userId: this.userId,
      eventData: this.eventData,
      timestamp: this.timestamp.toISOString(),
      version: this.version
    }
  }

  /**
   * Create event from serialized data
   */
  static fromJSON(data) {
    const event = Object.create(this.prototype)
    event.eventId = data.eventId
    event.eventType = data.eventType
    event.aggregateId = data.aggregateId
    event.userId = data.userId
    event.eventData = data.eventData
    event.timestamp = new Date(data.timestamp)
    event.version = data.version || 1
    return event
  }
}

// ============================================
// USER JOURNEY EVENTS
// ============================================

/**
 * User started their journey
 */
export class UserJourneyStartedEvent extends BaseDomainEvent {
  constructor(userId, initialPhase = 1) {
    super('UserJourneyStarted', userId, {
      initialPhase,
      mascot: 'aqua',
      welcomeMessage: 'Welcome to your OneFi journey!'
    }, userId)
  }
}

/**
 * User advanced to next phase
 */
export class UserPhaseAdvancedEvent extends BaseDomainEvent {
  constructor(userId, fromPhase, toPhase) {
    const phaseNames = { 1: 'aqua', 2: 'verde', 3: 'mystic', 4: 'coral' }
    
    super('UserPhaseAdvanced', userId, {
      fromPhase,
      toPhase,
      fromMascot: phaseNames[fromPhase],
      toMascot: phaseNames[toPhase],
      unlockMessage: `Congratulations! You've advanced to ${phaseNames[toPhase]} phase!`
    }, userId)
  }
}

/**
 * User achieved a milestone
 */
export class UserAchievementUnlockedEvent extends BaseDomainEvent {
  constructor(userId, achievementType, achievementData) {
    super('UserAchievementUnlocked', userId, {
      achievementType,
      ...achievementData,
      unlockedAt: new Date()
    }, userId)
  }
}

/**
 * User preferences updated
 */
export class UserPreferencesUpdatedEvent extends BaseDomainEvent {
  constructor(userId, preferences) {
    super('UserPreferencesUpdated', userId, {
      preferences,
      updatedFields: Object.keys(preferences)
    }, userId)
  }
}

// ============================================
// ASSET & PORTFOLIO EVENTS
// ============================================

/**
 * Asset selected by user
 */
export class AssetSelectedEvent extends BaseDomainEvent {
  constructor(userId, assetSymbol, assetType, selectionContext) {
    super('AssetSelected', userId, {
      assetSymbol,
      assetType,
      selectionContext,
      userPhase: selectionContext.userPhase || 1
    }, userId)
  }
}

/**
 * Portfolio balance updated
 */
export class PortfolioBalanceUpdatedEvent extends BaseDomainEvent {
  constructor(userId, balanceUpdate) {
    super('PortfolioBalanceUpdated', userId, {
      ...balanceUpdate,
      totalValue: balanceUpdate.totalValue || 0
    }, userId)
  }
}

/**
 * Investment transaction completed
 */
export class InvestmentTransactionCompletedEvent extends BaseDomainEvent {
  constructor(userId, transaction) {
    super('InvestmentTransactionCompleted', transaction.id, {
      userId,
      transactionType: transaction.type,
      assetSymbol: transaction.assetSymbol,
      amount: transaction.amount,
      value: transaction.value,
      fees: transaction.fees || 0
    }, userId)
  }
}

/**
 * Portfolio performance calculated
 */
export class PortfolioPerformanceCalculatedEvent extends BaseDomainEvent {
  constructor(userId, performanceData) {
    super('PortfolioPerformanceCalculated', userId, {
      ...performanceData,
      calculatedAt: new Date()
    }, userId)
  }
}

// ============================================
// MASCOT AI EVENTS
// ============================================

/**
 * Mascot interaction occurred
 */
export class MascotInteractionEvent extends BaseDomainEvent {
  constructor(userId, mascotType, interactionData) {
    super('MascotInteraction', userId, {
      mascotType,
      interactionType: interactionData.type,
      message: interactionData.message,
      context: interactionData.context,
      responseGenerated: !!interactionData.response
    }, userId)
  }
}

/**
 * AI guidance generated
 */
export class AIGuidanceGeneratedEvent extends BaseDomainEvent {
  constructor(userId, guidanceData) {
    super('AIGuidanceGenerated', userId, {
      mascotType: guidanceData.mascot,
      guidanceType: guidanceData.type,
      message: guidanceData.message,
      context: guidanceData.context,
      confidence: guidanceData.confidence || 0.8
    }, userId)
  }
}

/**
 * Mascot personality adapted
 */
export class MascotPersonalityAdaptedEvent extends BaseDomainEvent {
  constructor(userId, mascotType, adaptationData) {
    super('MascotPersonalityAdapted', userId, {
      mascotType,
      adaptationType: adaptationData.type,
      previousTraits: adaptationData.previous,
      newTraits: adaptationData.new,
      reason: adaptationData.reason
    }, userId)
  }
}

// ============================================
// LEARNING EVENTS
// ============================================

/**
 * Learning module started
 */
export class LearningModuleStartedEvent extends BaseDomainEvent {
  constructor(userId, moduleId, moduleData) {
    super('LearningModuleStarted', moduleId, {
      userId,
      moduleTitle: moduleData.title,
      moduleType: moduleData.type,
      estimatedDuration: moduleData.duration
    }, userId)
  }
}

/**
 * Learning module completed
 */
export class LearningModuleCompletedEvent extends BaseDomainEvent {
  constructor(userId, moduleId, completionData) {
    super('LearningModuleCompleted', moduleId, {
      userId,
      completionScore: completionData.score,
      timeSpent: completionData.timeSpent,
      completedAt: new Date()
    }, userId)
  }
}

/**
 * Learning progress updated
 */
export class LearningProgressUpdatedEvent extends BaseDomainEvent {
  constructor(userId, progressData) {
    super('LearningProgressUpdated', userId, {
      totalProgress: progressData.totalProgress,
      completedModules: progressData.completedModules,
      currentStreak: progressData.streak || 0
    }, userId)
  }
}

// ============================================
// SECURITY EVENTS
// ============================================

/**
 * Security violation detected
 */
export class SecurityViolationEvent extends BaseDomainEvent {
  constructor(userId, violationType, violationData) {
    super('SecurityViolation', userId, {
      violationType,
      severity: violationData.severity || 'medium',
      ipAddress: violationData.ipAddress,
      userAgent: violationData.userAgent,
      details: violationData.details
    }, userId)
  }
}

/**
 * User authentication event
 */
export class UserAuthenticationEvent extends BaseDomainEvent {
  constructor(userId, authData) {
    super('UserAuthentication', userId, {
      authType: authData.type,
      success: authData.success,
      method: authData.method,
      ipAddress: authData.ipAddress,
      timestamp: new Date()
    }, userId)
  }
}

/**
 * Sensitive action performed
 */
export class SensitiveActionPerformedEvent extends BaseDomainEvent {
  constructor(userId, actionType, actionData) {
    super('SensitiveActionPerformed', userId, {
      actionType,
      resource: actionData.resource,
      parameters: actionData.parameters,
      result: actionData.result,
      ipAddress: actionData.ipAddress
    }, userId)
  }
}

// ============================================
// SYSTEM EVENTS
// ============================================

/**
 * Feature flag toggled
 */
export class FeatureFlagToggledEvent extends BaseDomainEvent {
  constructor(flagName, userId, newValue) {
    super('FeatureFlagToggled', flagName, {
      userId,
      flagName,
      newValue,
      previousValue: !newValue // Assume toggle
    }, userId)
  }
}

/**
 * Performance metric recorded
 */
export class PerformanceMetricRecordedEvent extends BaseDomainEvent {
  constructor(metricName, value, context = {}) {
    super('PerformanceMetricRecorded', metricName, {
      metricName,
      value,
      unit: context.unit || 'ms',
      context,
      recordedAt: new Date()
    })
  }
}

/**
 * Error occurred in system
 */
export class SystemErrorEvent extends BaseDomainEvent {
  constructor(errorType, errorData, userId = null) {
    super('SystemError', errorData.id || uuidv4(), {
      errorType,
      message: errorData.message,
      stack: errorData.stack,
      context: errorData.context,
      severity: errorData.severity || 'error'
    }, userId)
  }
}

/**
 * Cache operation performed
 */
export class CacheOperationEvent extends BaseDomainEvent {
  constructor(operation, cacheKey, result) {
    super('CacheOperation', cacheKey, {
      operation, // 'hit', 'miss', 'set', 'invalidate'
      cacheKey,
      result,
      timestamp: new Date()
    })
  }
}

// ============================================
// INTERNATIONALIZATION EVENTS
// ============================================

/**
 * Language changed by user
 */
export class LanguageChangedEvent extends BaseDomainEvent {
  constructor(userId, fromLanguage, toLanguage) {
    super('LanguageChanged', userId, {
      fromLanguage,
      toLanguage,
      changedAt: new Date()
    }, userId)
  }
}

/**
 * Localization strings loaded
 */
export class LocalizationLoadedEvent extends BaseDomainEvent {
  constructor(language, stringCount) {
    super('LocalizationLoaded', language, {
      language,
      stringCount,
      loadedAt: new Date()
    })
  }
}

// ============================================
// EXPORT ALL EVENTS
// ============================================

export const DomainEvents = {
  // Base
  BaseDomainEvent,
  
  // User Journey
  UserJourneyStartedEvent,
  UserPhaseAdvancedEvent,
  UserAchievementUnlockedEvent,
  UserPreferencesUpdatedEvent,
  
  // Asset & Portfolio
  AssetSelectedEvent,
  PortfolioBalanceUpdatedEvent,
  InvestmentTransactionCompletedEvent,
  PortfolioPerformanceCalculatedEvent,
  
  // Mascot AI
  MascotInteractionEvent,
  AIGuidanceGeneratedEvent,
  MascotPersonalityAdaptedEvent,
  
  // Learning
  LearningModuleStartedEvent,
  LearningModuleCompletedEvent,
  LearningProgressUpdatedEvent,
  
  // Security
  SecurityViolationEvent,
  UserAuthenticationEvent,
  SensitiveActionPerformedEvent,
  
  // System
  FeatureFlagToggledEvent,
  PerformanceMetricRecordedEvent,
  SystemErrorEvent,
  CacheOperationEvent,
  
  // i18n
  LanguageChangedEvent,
  LocalizationLoadedEvent
}