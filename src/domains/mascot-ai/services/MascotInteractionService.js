/**
 * Mascot Interaction Domain Service
 * Manages AI-guided mascot interactions and personality adaptation
 */

import { MascotPersonalityFactory } from '../models/MascotPersonality.js';
import { MascotInteractionEvent, AIGuidanceGeneratedEvent } from '../events/MascotEvents.js';

/**
 * Domain service for managing mascot interactions
 */
export class MascotInteractionService {
  constructor(mascotRepository, userRepository, eventBus, auditLogger, performanceMonitor) {
    this._mascotRepository = mascotRepository;
    this._userRepository = userRepository;
    this._eventBus = eventBus;
    this._auditLogger = auditLogger;
    this._performanceMonitor = performanceMonitor;
    
    // Personality cache for performance
    this._personalityCache = new Map();
  }

  /**
   * Generate AI guidance for user context
   * @param {string} userId - User identifier
   * @param {string} mascotType - Mascot type
   * @param {Object} context - Interaction context
   * @returns {Promise<Object>} Generated guidance
   */
  async generateGuidance(userId, mascotType, context) {
    const timer = this._performanceMonitor?.startTimer('generate_mascot_guidance');
    
    try {
      // Get or create mascot personality
      const personality = await this._getMascotPersonality(userId, mascotType);
      
      // Generate guidance using personality
      const guidance = personality.generateGuidance(context);
      
      // Save interaction
      await this._saveInteraction(userId, mascotType, {
        type: 'guidance_generation',
        context,
        guidance
      });

      // Publish domain event
      await this._eventBus.publish(new AIGuidanceGeneratedEvent(userId, {
        mascot: mascotType,
        type: context.type || 'general',
        message: guidance.message,
        context,
        confidence: guidance.confidence,
        suggestions: guidance.suggestions
      }));

      // Audit log
      await this._auditLogger.logBusinessAction(userId, 'ai_guidance_generated', {
        mascotType,
        contextType: context.type,
        confidence: guidance.confidence
      });

      timer?.end();
      return guidance;
      
    } catch (error) {
      timer?.end();
      await this._handleServiceError(userId, 'generate_guidance', error);
      throw error;
    }
  }

  /**
   * Process user interaction with mascot
   * @param {string} userId - User identifier
   * @param {string} mascotType - Mascot type
   * @param {Object} interaction - Interaction data
   * @returns {Promise<Object>} Interaction response
   */
  async processInteraction(userId, mascotType, interaction) {
    const timer = this._performanceMonitor?.startTimer('process_mascot_interaction');
    
    try {
      // Get mascot personality
      const personality = await this._getMascotPersonality(userId, mascotType);
      
      // Generate response based on interaction type
      let response;
      switch (interaction.type) {
        case 'greeting':
          response = personality.generateGreeting(interaction.context);
          break;
        case 'help_request':
          response = personality.generateHelpMessage(interaction.context);
          break;
        case 'encouragement_needed':
          response = personality.generateEncouragement(
            interaction.context.achievementType,
            interaction.context.userProgress
          );
          break;
        default:
          response = personality.generateGuidance(interaction.context);
      }

      // Save interaction with response
      await this._saveInteraction(userId, mascotType, {
        ...interaction,
        response,
        timestamp: new Date()
      });

      // Publish domain event
      await this._eventBus.publish(new MascotInteractionEvent(userId, mascotType, {
        type: interaction.type,
        message: interaction.message,
        context: interaction.context,
        response,
        sessionId: interaction.sessionId
      }));

      // Check if personality should adapt
      await this._checkPersonalityAdaptation(userId, personality, interaction);

      // Audit log
      await this._auditLogger.logBusinessAction(userId, 'mascot_interaction_processed', {
        mascotType,
        interactionType: interaction.type,
        hasResponse: !!response
      });

      timer?.end();
      return {
        response,
        mascotType,
        personality: {
          traits: personality.traits,
          communicationStyle: personality.communicationStyle
        }
      };
      
    } catch (error) {
      timer?.end();
      await this._handleServiceError(userId, 'process_interaction', error);
      throw error;
    }
  }

  /**
   * Adapt mascot personality based on user behavior
   * @param {string} userId - User identifier
   * @param {string} mascotType - Mascot type
   * @param {Object} behaviorData - User behavior data
   * @returns {Promise<boolean>} True if adaptation occurred
   */
  async adaptPersonality(userId, mascotType, behaviorData) {
    const timer = this._performanceMonitor?.startTimer('adapt_mascot_personality');
    
    try {
      const personality = await this._getMascotPersonality(userId, mascotType);
      
      // Attempt to adapt personality
      const adapted = personality.adaptToUserBehavior({
        ...behaviorData,
        userId
      });

      if (adapted) {
        // Save updated personality
        await this._saveMascotPersonality(userId, mascotType, personality);
        
        // Clear cache
        this._personalityCache.delete(`${userId}:${mascotType}`);
        
        // Publish domain events
        const events = personality.domainEvents;
        for (const event of events) {
          await this._eventBus.publish(event);
        }
        personality.clearDomainEvents();

        // Audit log
        await this._auditLogger.logBusinessAction(userId, 'mascot_personality_adapted', {
          mascotType,
          adaptationReason: behaviorData.adaptationReason,
          newVersion: personality.version
        });
      }

      timer?.end();
      return adapted;
      
    } catch (error) {
      timer?.end();
      await this._handleServiceError(userId, 'adapt_personality', error);
      throw error;
    }
  }

  /**
   * Get interaction history for user and mascot
   * @param {string} userId - User identifier
   * @param {string} mascotType - Mascot type
   * @param {number} limit - Maximum interactions to return
   * @returns {Promise<Array>} Interaction history
   */
  async getInteractionHistory(userId, mascotType, limit = 50) {
    const timer = this._performanceMonitor?.startTimer('get_interaction_history');
    
    try {
      const interactions = await this._mascotRepository.getUserInteractions(userId, mascotType);
      
      // Sort by timestamp and limit
      const sortedInteractions = interactions
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);

      timer?.end();
      return sortedInteractions;
      
    } catch (error) {
      timer?.end();
      await this._handleServiceError(userId, 'get_interaction_history', error);
      throw error;
    }
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  async _getMascotPersonality(userId, mascotType) {
    const cacheKey = `${userId}:${mascotType}`;
    
    if (this._personalityCache.has(cacheKey)) {
      return this._personalityCache.get(cacheKey);
    }

    try {
      // Try to load existing personality
      const personalityData = await this._mascotRepository.getMascotPersonality(mascotType);
      let personality;
      
      if (personalityData && personalityData.userId === userId) {
        personality = MascotPersonalityFactory.createPersonality(mascotType, personalityData);
      } else {
        // Create new personality for user
        personality = MascotPersonalityFactory.createPersonality(mascotType);
        await this._saveMascotPersonality(userId, mascotType, personality);
      }
      
      this._personalityCache.set(cacheKey, personality);
      return personality;
      
    } catch (error) {
      // Fallback to default personality
      const personality = MascotPersonalityFactory.createPersonality(mascotType);
      this._personalityCache.set(cacheKey, personality);
      return personality;
    }
  }

  async _saveMascotPersonality(userId, mascotType, personality) {
    const personalityData = {
      ...personality.toJSON(),
      userId,
      mascotType,
      lastUpdated: new Date()
    };
    
    await this._mascotRepository.save(personalityData);
  }

  async _saveInteraction(userId, mascotType, interaction) {
    const interactionData = {
      userId,
      mascotType,
      ...interaction,
      id: `${userId}_${mascotType}_${Date.now()}_${Math.random()}`,
      timestamp: interaction.timestamp || new Date()
    };
    
    await this._mascotRepository.saveInteraction(userId, interactionData);
  }

  async _checkPersonalityAdaptation(userId, personality, interaction) {
    // Simple adaptation logic based on interaction patterns
    const stats = personality.getInteractionStats();
    
    if (stats.totalInteractions > 0 && stats.totalInteractions % 10 === 0) {
      // Every 10 interactions, check for adaptation
      const behaviorData = {
        userId,
        interactionCount: stats.totalInteractions,
        confidence: 0.8,
        adaptationReason: 'periodic_interaction_analysis'
      };
      
      await this.adaptPersonality(userId, personality.mascotType, behaviorData);
    }
  }

  async _handleServiceError(userId, operation, error) {
    await this._auditLogger.error(`MascotInteractionService.${operation} failed`, {
      userId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
  }
}