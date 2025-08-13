/**
 * Mascot AI Domain Events
 * Events specific to mascot interactions and AI guidance
 */

import { BaseDomainEvent as DomainEvent } from '../../../shared-kernel/common/events/DomainEvents.js';

/**
 * Published when mascot personality adapts to user behavior
 */
export class MascotPersonalityAdaptedEvent extends DomainEvent {
  constructor(userId, mascotType, adaptationData) {
    super('MascotPersonalityAdapted', userId, {
      mascotType,
      adaptationType: adaptationData.type,
      previousTraits: adaptationData.previous,
      newTraits: adaptationData.new,
      reason: adaptationData.reason,
      adaptationVersion: adaptationData.version || 1,
      timestamp: new Date()
    }, userId);
  }

  get mascotType() { return this.eventData.mascotType; }
  get adaptationType() { return this.eventData.adaptationType; }
  get previousTraits() { return this.eventData.previousTraits; }
  get newTraits() { return this.eventData.newTraits; }
  get reason() { return this.eventData.reason; }
}

/**
 * Published when user interacts with mascot
 */
export class MascotInteractionEvent extends DomainEvent {
  constructor(userId, mascotType, interactionData) {
    super('MascotInteraction', userId, {
      mascotType,
      interactionType: interactionData.type,
      message: interactionData.message,
      context: interactionData.context,
      responseGenerated: !!interactionData.response,
      sessionId: interactionData.sessionId,
      timestamp: new Date()
    }, userId);
  }

  get mascotType() { return this.eventData.mascotType; }
  get interactionType() { return this.eventData.interactionType; }
  get message() { return this.eventData.message; }
  get context() { return this.eventData.context; }
  get responseGenerated() { return this.eventData.responseGenerated; }
}

/**
 * Published when AI generates guidance for user
 */
export class AIGuidanceGeneratedEvent extends DomainEvent {
  constructor(userId, guidanceData) {
    super('AIGuidanceGenerated', userId, {
      mascotType: guidanceData.mascot,
      guidanceType: guidanceData.type,
      message: guidanceData.message,
      context: guidanceData.context,
      confidence: guidanceData.confidence || 0.8,
      suggestions: guidanceData.suggestions || [],
      timestamp: new Date()
    }, userId);
  }

  get mascotType() { return this.eventData.mascotType; }
  get guidanceType() { return this.eventData.guidanceType; }
  get message() { return this.eventData.message; }
  get context() { return this.eventData.context; }
  get confidence() { return this.eventData.confidence; }
  get suggestions() { return this.eventData.suggestions; }
}