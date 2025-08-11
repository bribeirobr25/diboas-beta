/**
 * Mascot AI Personality Models
 * Manages AI-guided interactions for each journey phase
 */

import { UserPhase } from '../../../shared-kernel/common/models/ValueObjects.js'
import { 
  MascotInteractionEvent,
  AIGuidanceGeneratedEvent,
  MascotPersonalityAdaptedEvent 
} from '../../../shared-kernel/common/events/DomainEvents.js'

/**
 * Base mascot personality with adaptive behavior
 */
export class BaseMascotPersonality {
  constructor(mascotType, personalityConfig = {}) {
    this._mascotType = mascotType
    this._version = personalityConfig.version || 1
    
    // Core personality traits
    this._traits = {
      encouragement: personalityConfig.encouragement || 0.8,
      patience: personalityConfig.patience || 0.7,
      enthusiasm: personalityConfig.enthusiasm || 0.6,
      directness: personalityConfig.directness || 0.5,
      humor: personalityConfig.humor || 0.4,
      supportiveness: personalityConfig.supportiveness || 0.9,
      ...personalityConfig.traits
    }
    
    // Communication style
    this._communicationStyle = {
      tone: personalityConfig.tone || 'friendly',
      formality: personalityConfig.formality || 'casual',
      verbosity: personalityConfig.verbosity || 'moderate',
      emotionalExpression: personalityConfig.emotionalExpression || 'warm'
    }
    
    // Behavioral patterns
    this._behaviorPatterns = {
      respondToSuccess: personalityConfig.respondToSuccess || 'celebrate',
      respondToStruggle: personalityConfig.respondToStruggle || 'encourage',
      adaptationSpeed: personalityConfig.adaptationSpeed || 'moderate',
      memoryRetention: personalityConfig.memoryRetention || 'high'
    }
    
    // Interaction history for learning
    this._interactionHistory = []
    this._adaptationCount = 0
    this._lastAdaptation = null
    
    // Domain events
    this._domainEvents = []
  }

  // ============================================
  // GETTERS
  // ============================================

  get mascotType() { return this._mascotType }
  get version() { return this._version }
  get traits() { return { ...this._traits } }
  get communicationStyle() { return { ...this._communicationStyle } }
  get behaviorPatterns() { return { ...this._behaviorPatterns } }
  get domainEvents() { return [...this._domainEvents] }

  // ============================================
  // PERSONALITY METHODS
  // ============================================

  /**
   * Generate contextual greeting message
   */
  generateGreeting(userContext) {
    const greetings = this._getGreetingTemplates()
    const selectedGreeting = this._selectMessage(greetings, userContext)
    
    return this._personalizeMessage(selectedGreeting, userContext)
  }

  /**
   * Generate guidance message based on context
   */
  generateGuidance(context) {
    const guidance = this._getGuidanceTemplates(context.type)
    const selectedGuidance = this._selectMessage(guidance, context)
    const personalizedMessage = this._personalizeMessage(selectedGuidance, context)
    
    // Record interaction
    this._recordInteraction(context.type, personalizedMessage, context)
    
    return {
      message: personalizedMessage,
      tone: this._communicationStyle.tone,
      confidence: this._calculateConfidence(context),
      suggestions: this._generateSuggestions(context)
    }
  }

  /**
   * Generate encouragement message
   */
  generateEncouragement(achievementType, userProgress) {
    const encouragements = this._getEncouragementTemplates(achievementType)
    const context = { achievementType, userProgress, type: 'encouragement' }
    const selectedMessage = this._selectMessage(encouragements, context)
    
    return this._personalizeMessage(selectedMessage, context)
  }

  /**
   * Generate help message when user is struggling
   */
  generateHelpMessage(strugglingContext) {
    const helpMessages = this._getHelpTemplates(strugglingContext.area)
    const context = { ...strugglingContext, type: 'help' }
    const selectedMessage = this._selectMessage(helpMessages, context)
    
    return this._personalizeMessage(selectedMessage, context)
  }

  /**
   * Adapt personality based on user interactions
   */
  adaptToUserBehavior(userBehaviorData) {
    if (!this._shouldAdapt(userBehaviorData)) {
      return false
    }

    const previousTraits = { ...this._traits }
    const adaptationApplied = this._applyAdaptation(userBehaviorData)
    
    if (adaptationApplied) {
      this._adaptationCount++
      this._lastAdaptation = new Date()
      this._version++
      
      // Emit domain event
      this._addDomainEvent(new MascotPersonalityAdaptedEvent(
        userBehaviorData.userId,
        this._mascotType,
        {
          type: 'behavioral_adaptation',
          previous: previousTraits,
          new: this._traits,
          reason: userBehaviorData.adaptationReason || 'user_behavior_analysis'
        }
      ))
      
      return true
    }
    
    return false
  }

  /**
   * Reset personality to default state
   */
  resetPersonality() {
    const defaultPersonality = this._getDefaultPersonality()
    this._traits = { ...defaultPersonality.traits }
    this._communicationStyle = { ...defaultPersonality.communicationStyle }
    this._behaviorPatterns = { ...defaultPersonality.behaviorPatterns }
    this._version++
    
    return this
  }

  /**
   * Get interaction statistics
   */
  getInteractionStats() {
    return {
      totalInteractions: this._interactionHistory.length,
      adaptationCount: this._adaptationCount,
      lastAdaptation: this._lastAdaptation,
      averageConfidence: this._calculateAverageConfidence(),
      mostCommonInteractionType: this._getMostCommonInteractionType(),
      personalityStability: this._calculatePersonalityStability()
    }
  }

  /**
   * Serialize for persistence
   */
  toJSON() {
    return {
      mascotType: this._mascotType,
      version: this._version,
      traits: this._traits,
      communicationStyle: this._communicationStyle,
      behaviorPatterns: this._behaviorPatterns,
      adaptationCount: this._adaptationCount,
      lastAdaptation: this._lastAdaptation?.toISOString(),
      interactionHistory: this._interactionHistory.slice(-50) // Keep last 50 interactions
    }
  }

  /**
   * Create from serialized data
   */
  static fromJSON(data) {
    const personality = new this(data.mascotType, {
      version: data.version,
      traits: data.traits,
      tone: data.communicationStyle?.tone,
      formality: data.communicationStyle?.formality,
      verbosity: data.communicationStyle?.verbosity,
      emotionalExpression: data.communicationStyle?.emotionalExpression,
      ...data.communicationStyle,
      ...data.behaviorPatterns
    })
    
    personality._adaptationCount = data.adaptationCount || 0
    personality._lastAdaptation = data.lastAdaptation ? new Date(data.lastAdaptation) : null
    personality._interactionHistory = data.interactionHistory || []
    
    return personality
  }

  // ============================================
  // PROTECTED METHODS (Override in subclasses)
  // ============================================

  _getGreetingTemplates() {
    return [
      "Hello! I'm {mascotName}, your {phase} guide. Ready to explore OneFi together?",
      "Welcome back! I'm excited to continue our journey in the {phase} phase!",
      "Hi there! {mascotName} here, ready to help you grow your wealth with confidence!"
    ]
  }

  _getGuidanceTemplates(type) {
    const templates = {
      asset_selection: [
        "Great choice on exploring {asset}! This is perfect for your {phase} phase.",
        "Let me tell you why {asset} is an excellent fit for where you are in your journey.",
        "{asset} is one of my favorite recommendations for {phase} investors!"
      ],
      lesson_start: [
        "This lesson will help you understand {topic} better. Let's dive in!",
        "Perfect timing to learn about {topic}! I'll be here to guide you through it.",
        "Ready to master {topic}? I believe in you!"
      ],
      phase_advancement: [
        "Congratulations! You're ready to advance to the {nextPhase} phase!",
        "Your progress has been amazing! Let's unlock the next level together.",
        "Time to level up! You've earned access to {nextPhase} features!"
      ]
    }
    
    return templates[type] || [
      "I'm here to help you succeed on your OneFi journey!",
      "Every step you take brings you closer to your financial goals.",
      "Together, we'll make wealth-building simple and rewarding!"
    ]
  }

  _getEncouragementTemplates(achievementType) {
    return [
      "Amazing work! You've just unlocked {achievement}! 🎉",
      "I'm so proud of your progress! {achievement} is a big milestone!",
      "You're doing fantastic! {achievement} shows how much you've learned!"
    ]
  }

  _getHelpTemplates(area) {
    return [
      "Don't worry, {area} can be tricky at first. Let me break it down for you.",
      "I see you're having trouble with {area}. That's totally normal! Here's what I recommend:",
      "Let's tackle {area} together. I have some tips that will make this much easier!"
    ]
  }

  _getDefaultPersonality() {
    return {
      traits: {
        encouragement: 0.8,
        patience: 0.7,
        enthusiasm: 0.6,
        directness: 0.5,
        humor: 0.4,
        supportiveness: 0.9
      },
      communicationStyle: {
        tone: 'friendly',
        formality: 'casual',
        verbosity: 'moderate',
        emotionalExpression: 'warm'
      },
      behaviorPatterns: {
        respondToSuccess: 'celebrate',
        respondToStruggle: 'encourage',
        adaptationSpeed: 'moderate',
        memoryRetention: 'high'
      }
    }
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  _selectMessage(templates, context) {
    // Simple selection based on context and personality
    const appropriateTemplates = templates.filter(template => 
      this._isTemplateAppropriate(template, context)
    )
    
    if (appropriateTemplates.length === 0) {
      return templates[0] // Fallback to first template
    }
    
    // Select based on personality traits
    const index = Math.floor(Math.random() * appropriateTemplates.length)
    return appropriateTemplates[index]
  }

  _personalizeMessage(template, context) {
    let message = template
    
    // Replace placeholders
    const replacements = {
      mascotName: this._getMascotDisplayName(),
      phase: context.phase || 'current',
      asset: context.asset || 'this asset',
      topic: context.topic || 'this topic',
      nextPhase: context.nextPhase || 'next',
      achievement: context.achievementType || 'this achievement',
      area: context.area || 'this area'
    }
    
    for (const [key, value] of Object.entries(replacements)) {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value)
    }
    
    // Apply personality adjustments
    message = this._applyPersonalityToMessage(message)
    
    return message
  }

  _applyPersonalityToMessage(message) {
    // Add enthusiasm markers based on enthusiasm trait
    if (this._traits.enthusiasm > 0.7) {
      if (!message.includes('!') && Math.random() < 0.5) {
        message = message.replace(/\.$/, '!')
      }
    }
    
    // Add supportive language based on supportiveness trait
    if (this._traits.supportiveness > 0.8) {
      const supportivePhrases = [
        "I believe in you! ",
        "You've got this! ",
        "I'm here to support you! "
      ]
      
      if (Math.random() < 0.3) {
        const phrase = supportivePhrases[Math.floor(Math.random() * supportivePhrases.length)]
        message = phrase + message
      }
    }
    
    return message
  }

  _isTemplateAppropriate(template, context) {
    // Simple appropriateness check
    return true // For now, all templates are considered appropriate
  }

  _recordInteraction(type, message, context) {
    this._interactionHistory.push({
      type,
      message,
      context,
      timestamp: new Date(),
      confidence: this._calculateConfidence(context)
    })
    
    // Keep only recent interactions
    if (this._interactionHistory.length > 100) {
      this._interactionHistory = this._interactionHistory.slice(-50)
    }
  }

  _calculateConfidence(context) {
    // Base confidence on personality stability and context familiarity
    let confidence = 0.7
    
    // Increase confidence based on interaction history
    const similarInteractions = this._interactionHistory.filter(
      interaction => interaction.type === context.type
    )
    
    confidence += Math.min(similarInteractions.length * 0.05, 0.25)
    
    // Adjust based on personality traits
    confidence += (this._traits.directness - 0.5) * 0.2
    confidence += (this._traits.supportiveness - 0.5) * 0.1
    
    return Math.max(0.1, Math.min(1.0, confidence))
  }

  _generateSuggestions(context) {
    const suggestions = []
    
    if (context.type === 'asset_selection') {
      suggestions.push(`Learn more about ${context.asset}`)
      suggestions.push('Compare with other assets')
      suggestions.push('Set investment goals')
    }
    
    if (context.type === 'lesson_start') {
      suggestions.push('Take notes as you learn')
      suggestions.push('Ask questions if confused')
      suggestions.push('Apply what you learn')
    }
    
    return suggestions
  }

  _shouldAdapt(userBehaviorData) {
    // Don't adapt too frequently
    if (this._lastAdaptation) {
      const timeSinceLastAdaptation = Date.now() - this._lastAdaptation.getTime()
      const minAdaptationInterval = 24 * 60 * 60 * 1000 // 24 hours
      
      if (timeSinceLastAdaptation < minAdaptationInterval) {
        return false
      }
    }
    
    // Require significant behavioral indicators
    return userBehaviorData.confidence > 0.7 && 
           userBehaviorData.interactionCount >= 5
  }

  _applyAdaptation(userBehaviorData) {
    let adapted = false
    
    // Adapt based on user response to encouragement
    if (userBehaviorData.responseToEncouragement) {
      if (userBehaviorData.responseToEncouragement === 'positive') {
        this._traits.encouragement = Math.min(1.0, this._traits.encouragement + 0.1)
        adapted = true
      } else if (userBehaviorData.responseToEncouragement === 'negative') {
        this._traits.encouragement = Math.max(0.1, this._traits.encouragement - 0.1)
        adapted = true
      }
    }
    
    // Adapt based on user learning style
    if (userBehaviorData.learningStyle === 'direct') {
      this._traits.directness = Math.min(1.0, this._traits.directness + 0.1)
      this._communicationStyle.verbosity = 'concise'
      adapted = true
    } else if (userBehaviorData.learningStyle === 'detailed') {
      this._traits.directness = Math.max(0.1, this._traits.directness - 0.1)
      this._communicationStyle.verbosity = 'detailed'
      adapted = true
    }
    
    return adapted
  }

  _calculateAverageConfidence() {
    if (this._interactionHistory.length === 0) return 0
    
    const totalConfidence = this._interactionHistory.reduce(
      (sum, interaction) => sum + interaction.confidence, 0
    )
    
    return totalConfidence / this._interactionHistory.length
  }

  _getMostCommonInteractionType() {
    if (this._interactionHistory.length === 0) return null
    
    const typeCounts = {}
    this._interactionHistory.forEach(interaction => {
      typeCounts[interaction.type] = (typeCounts[interaction.type] || 0) + 1
    })
    
    return Object.entries(typeCounts).reduce(
      (max, [type, count]) => count > max.count ? { type, count } : max,
      { type: null, count: 0 }
    ).type
  }

  _calculatePersonalityStability() {
    // Higher number means more stable personality
    const maxTraitChange = Math.max(...Object.values(this._traits)) - 
                          Math.min(...Object.values(this._traits))
    
    return Math.max(0, 1 - (maxTraitChange / 2))
  }

  _getMascotDisplayName() {
    const names = {
      aqua: 'Aqua',
      verde: 'Verde', 
      mystic: 'Mystic',
      coral: 'Coral'
    }
    
    return names[this._mascotType] || 'Your Guide'
  }

  _addDomainEvent(event) {
    this._domainEvents.push(event)
  }

  /**
   * Clear domain events (called after persistence)
   */
  clearDomainEvents() {
    this._domainEvents = []
  }
}

/**
 * Specialized mascot personalities for each phase
 */

export class AquaMascotPersonality extends BaseMascotPersonality {
  constructor(config = {}) {
    super('aqua', {
      encouragement: 0.9,
      patience: 0.9,
      enthusiasm: 0.8,
      directness: 0.3,
      humor: 0.6,
      supportiveness: 1.0,
      tone: 'very-friendly',
      formality: 'very-casual',
      verbosity: 'detailed',
      emotionalExpression: 'very-warm',
      ...config
    })
  }

  _getGreetingTemplates() {
    return [
      "Hi there! I'm Aqua, your friendly OneFi guide! 🌊 Welcome to your wealth-building adventure!",
      "Hello! Aqua here! I'm SO excited to help you start your investment journey! Let's make it fun and simple! 💙",
      "Welcome to diBoaS! I'm Aqua, and I'll be your supportive companion every step of the way! Ready to dive in? 🏊‍♀️"
    ]
  }
}

export class VerdeMascotPersonality extends BaseMascotPersonality {
  constructor(config = {}) {
    super('verde', {
      encouragement: 0.8,
      patience: 0.8,
      enthusiasm: 0.7,
      directness: 0.5,
      humor: 0.5,
      supportiveness: 0.9,
      tone: 'encouraging',
      formality: 'casual',
      verbosity: 'moderate',
      emotionalExpression: 'warm',
      ...config
    })
  }

  _getGreetingTemplates() {
    return [
      "Hello! Verde here! 🌱 You're growing so well in your OneFi journey! Ready for the next step?",
      "Hey there! I'm Verde, your growth mentor! Let's cultivate your financial knowledge together! 🌿",
      "Welcome back! Verde speaking! I love seeing your confidence bloom! What shall we explore today? 🌳"
    ]
  }
}

export class MysticMascotPersonality extends BaseMascotPersonality {
  constructor(config = {}) {
    super('mystic', {
      encouragement: 0.7,
      patience: 0.7,
      enthusiasm: 0.6,
      directness: 0.7,
      humor: 0.3,
      supportiveness: 0.8,
      tone: 'wise',
      formality: 'semi-formal',
      verbosity: 'detailed',
      emotionalExpression: 'calm',
      ...config
    })
  }

  _getGreetingTemplates() {
    return [
      "Greetings! I am Mystic, your strategic advisor. 🔮 Ready to unlock advanced investment wisdom?",
      "Hello, wise investor! Mystic here. Your journey has brought you to the realm of sophisticated strategies! ✨",
      "Welcome! I'm Mystic, guardian of advanced OneFi knowledge. Let us explore the deeper mysteries of wealth creation! 🌟"
    ]
  }
}

export class CoralMascotPersonality extends BaseMascotPersonality {
  constructor(config = {}) {
    super('coral', {
      encouragement: 0.6,
      patience: 0.6,
      enthusiasm: 0.5,
      directness: 0.9,
      humor: 0.2,
      supportiveness: 0.7,
      tone: 'professional',
      formality: 'formal',
      verbosity: 'concise',
      emotionalExpression: 'confident',
      ...config
    })
  }

  _getGreetingTemplates() {
    return [
      "Good day. Coral here, your executive wealth strategist. 🪸 Ready to optimize your portfolio?",
      "Hello. I'm Coral, your advanced investment partner. Let's maximize your wealth potential with precision. 📈",
      "Greetings, expert investor. Coral at your service. Time to leverage sophisticated strategies for optimal returns. 💼"
    ]
  }
}

/**
 * Factory to create appropriate mascot personality
 */
export class MascotPersonalityFactory {
  static createPersonality(mascotType, config = {}) {
    switch (mascotType.toLowerCase()) {
      case 'aqua':
        return new AquaMascotPersonality(config)
      case 'verde':
        return new VerdeMascotPersonality(config)
      case 'mystic':
        return new MysticMascotPersonality(config)
      case 'coral':
        return new CoralMascotPersonality(config)
      default:
        return new AquaMascotPersonality(config)
    }
  }

  static getAvailableMascots() {
    return ['aqua', 'verde', 'mystic', 'coral']
  }

  static getMascotForPhase(phase) {
    const phaseToMascot = {
      1: 'aqua',
      2: 'verde', 
      3: 'mystic',
      4: 'coral'
    }
    
    return phaseToMascot[phase] || 'aqua'
  }
}