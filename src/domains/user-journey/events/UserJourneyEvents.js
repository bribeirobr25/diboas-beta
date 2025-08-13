/**
 * User Journey Domain Events
 * Events specific to user journey progression and achievements
 */

import { BaseDomainEvent as DomainEvent } from '../../../shared-kernel/common/events/DomainEvents.js';

/**
 * Published when user starts their journey
 */
export class UserJourneyStartedEvent extends DomainEvent {
  constructor(userId, initialPhase = 1) {
    super('UserJourneyStarted', userId, {
      initialPhase,
      mascot: 'aqua',
      welcomeMessage: 'Welcome to your OneFi journey!',
      startedAt: new Date(),
      version: 1
    }, userId);
  }

  get initialPhase() { return this.eventData.initialPhase; }
  get mascot() { return this.eventData.mascot; }
  get welcomeMessage() { return this.eventData.welcomeMessage; }
  get startedAt() { return this.eventData.startedAt; }
}

/**
 * Published when user advances to next phase
 */
export class UserPhaseAdvancedEvent extends DomainEvent {
  constructor(userId, fromPhase, toPhase) {
    const phaseNames = { 1: 'aqua', 2: 'verde', 3: 'mystic', 4: 'coral' };
    
    super('UserPhaseAdvanced', userId, {
      fromPhase,
      toPhase,
      fromMascot: phaseNames[fromPhase],
      toMascot: phaseNames[toPhase],
      unlockMessage: `Congratulations! You've advanced to ${phaseNames[toPhase]} phase!`,
      advancedAt: new Date()
    }, userId);
  }

  get fromPhase() { return this.eventData.fromPhase; }
  get toPhase() { return this.eventData.toPhase; }
  get fromMascot() { return this.eventData.fromMascot; }
  get toMascot() { return this.eventData.toMascot; }
  get unlockMessage() { return this.eventData.unlockMessage; }
  get advancedAt() { return this.eventData.advancedAt; }
}

/**
 * Published when user achieves a milestone
 */
export class UserAchievementUnlockedEvent extends DomainEvent {
  constructor(userId, achievementType, achievementData) {
    super('UserAchievementUnlocked', userId, {
      achievementType,
      ...achievementData,
      unlockedAt: new Date()
    }, userId);
  }

  get achievementType() { return this.eventData.achievementType; }
  get unlockedAt() { return this.eventData.unlockedAt; }
  get achievementData() { 
    const { achievementType, unlockedAt, ...data } = this.eventData;
    return data;
  }
}

/**
 * Published when user preferences are updated
 */
export class UserPreferencesUpdatedEvent extends DomainEvent {
  constructor(userId, preferences) {
    super('UserPreferencesUpdated', userId, {
      preferences,
      updatedFields: Object.keys(preferences),
      updatedAt: new Date()
    }, userId);
  }

  get preferences() { return this.eventData.preferences; }
  get updatedFields() { return this.eventData.updatedFields; }
  get updatedAt() { return this.eventData.updatedAt; }
}

/**
 * Published when user completes a lesson
 */
export class LessonCompletedEvent extends DomainEvent {
  constructor(userId, lessonId, completionData) {
    super('LessonCompleted', userId, {
      lessonId,
      completionScore: completionData.score,
      timeSpent: completionData.timeSpent,
      completedAt: new Date(),
      phase: completionData.phase,
      totalLessonsCompleted: completionData.totalCompleted || 1
    }, userId);
  }

  get lessonId() { return this.eventData.lessonId; }
  get completionScore() { return this.eventData.completionScore; }
  get timeSpent() { return this.eventData.timeSpent; }
  get completedAt() { return this.eventData.completedAt; }
  get phase() { return this.eventData.phase; }
  get totalLessonsCompleted() { return this.eventData.totalLessonsCompleted; }
}

/**
 * Published when user behavior profile is updated
 */
export class UserBehaviorUpdatedEvent extends DomainEvent {
  constructor(userId, behaviorData) {
    super('UserBehaviorUpdated', userId, {
      previousProfile: behaviorData.previous,
      newProfile: behaviorData.new,
      changedAttributes: behaviorData.changed || [],
      adaptationTrigger: behaviorData.trigger || 'manual',
      updatedAt: new Date()
    }, userId);
  }

  get previousProfile() { return this.eventData.previousProfile; }
  get newProfile() { return this.eventData.newProfile; }
  get changedAttributes() { return this.eventData.changedAttributes; }
  get adaptationTrigger() { return this.eventData.adaptationTrigger; }
  get updatedAt() { return this.eventData.updatedAt; }
}

/**
 * Published when user unlocks new features
 */
export class FeaturesUnlockedEvent extends DomainEvent {
  constructor(userId, features, triggerContext) {
    super('FeaturesUnlocked', userId, {
      unlockedFeatures: features,
      triggerContext,
      unlockedAt: new Date(),
      phase: triggerContext.phase
    }, userId);
  }

  get unlockedFeatures() { return this.eventData.unlockedFeatures; }
  get triggerContext() { return this.eventData.triggerContext; }
  get unlockedAt() { return this.eventData.unlockedAt; }
  get phase() { return this.eventData.phase; }
}