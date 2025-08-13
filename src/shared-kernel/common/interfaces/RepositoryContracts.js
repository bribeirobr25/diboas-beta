/**
 * Repository Contracts for diBoaS Platform
 * Service Agnostic Abstraction Layer
 */

/**
 * Repository Interface for Service Agnostic pattern
 */
export class RepositoryInterface {
  async findById(id) {
    throw new Error('findById must be implemented by concrete repository');
  }

  async save(entity) {
    throw new Error('save must be implemented by concrete repository');
  }

  async delete(id) {
    throw new Error('delete must be implemented by concrete repository');
  }

  async findAll() {
    throw new Error('findAll must be implemented by concrete repository');
  }
}

/**
 * Base repository interface with common operations
 */
export class BaseRepository {
  /**
   * Find entity by ID
   * @param {string} id - Entity identifier
   * @returns {Promise<Object|null>} Entity or null if not found
   */
  async findById(id) {
    throw new Error('findById must be implemented by concrete repository')
  }

  /**
   * Save entity (create or update)
   * @param {Object} entity - Entity to save
   * @returns {Promise<Object>} Saved entity
   */
  async save(entity) {
    throw new Error('save must be implemented by concrete repository')
  }

  /**
   * Delete entity by ID
   * @param {string} id - Entity identifier
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    throw new Error('delete must be implemented by concrete repository')
  }

  /**
   * Find all entities with optional filters
   * @param {Object} filters - Query filters
   * @returns {Promise<Array>} Array of entities
   */
  async findAll(filters = {}) {
    throw new Error('findAll must be implemented by concrete repository')
  }

  /**
   * Check if entity exists
   * @param {string} id - Entity identifier
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id) {
    const entity = await this.findById(id)
    return entity !== null
  }

  /**
   * Count entities with optional filters
   * @param {Object} filters - Query filters
   * @returns {Promise<number>} Entity count
   */
  async count(filters = {}) {
    const entities = await this.findAll(filters)
    return entities.length
  }
}

/**
 * Contract for user data repository
 */
export class UserRepositoryContract extends BaseRepository {
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User or null
   */
  async findByEmail(email) {
    throw new Error('findByEmail must be implemented by concrete repository')
  }

  /**
   * Update user preferences
   * @param {string} userId - User ID
   * @param {Object} preferences - User preferences
   * @returns {Promise<Object>} Updated user
   */
  async updateUserPreferences(userId, preferences) {
    throw new Error('updateUserPreferences must be implemented by concrete repository')
  }

  /**
   * Get user journey progress
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Journey progress data
   */
  async getUserJourneyProgress(userId) {
    throw new Error('getUserJourneyProgress must be implemented by concrete repository')
  }

  /**
   * Update user phase
   * @param {string} userId - User ID
   * @param {number} phase - New phase level
   * @returns {Promise<Object>} Updated user
   */
  async updateUserPhase(userId, phase) {
    throw new Error('updateUserPhase must be implemented by concrete repository')
  }
}

/**
 * Contract for asset data repository
 */
export class AssetRepositoryContract extends BaseRepository {
  /**
   * Find asset by symbol
   * @param {string} symbol - Asset symbol
   * @returns {Promise<Object|null>} Asset or null
   */
  async findBySymbol(symbol) {
    throw new Error('findBySymbol must be implemented by concrete repository')
  }

  /**
   * Get asset price history
   * @param {string} symbol - Asset symbol
   * @param {string} period - Time period
   * @returns {Promise<Array>} Price history data
   */
  async getPriceHistory(symbol, period) {
    throw new Error('getPriceHistory must be implemented by concrete repository')
  }

  /**
   * Get current market data for asset
   * @param {string} symbol - Asset symbol
   * @returns {Promise<Object>} Market data
   */
  async getMarketData(symbol) {
    throw new Error('getMarketData must be implemented by concrete repository')
  }

  /**
   * Get all supported assets for user phase
   * @param {number} userPhase - User journey phase
   * @returns {Promise<Array>} Available assets
   */
  async getAssetsForPhase(userPhase) {
    throw new Error('getAssetsForPhase must be implemented by concrete repository')
  }
}

/**
 * Contract for portfolio data repository
 */
export class PortfolioRepositoryContract extends BaseRepository {
  /**
   * Get user portfolio
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Portfolio or null
   */
  async getByUserId(userId) {
    throw new Error('getByUserId must be implemented by concrete repository')
  }

  /**
   * Update portfolio balance
   * @param {string} userId - User ID
   * @param {Object} balanceUpdate - Balance update data
   * @returns {Promise<Object>} Updated portfolio
   */
  async updateBalance(userId, balanceUpdate) {
    throw new Error('updateBalance must be implemented by concrete repository')
  }

  /**
   * Add transaction to portfolio
   * @param {string} userId - User ID
   * @param {Object} transaction - Transaction data
   * @returns {Promise<Object>} Updated portfolio
   */
  async addTransaction(userId, transaction) {
    throw new Error('addTransaction must be implemented by concrete repository')
  }

  /**
   * Get portfolio performance
   * @param {string} userId - User ID
   * @param {string} period - Time period
   * @returns {Promise<Object>} Performance data
   */
  async getPerformance(userId, period) {
    throw new Error('getPerformance must be implemented by concrete repository')
  }
}

/**
 * Contract for mascot interaction repository
 */
export class MascotRepositoryContract extends BaseRepository {
  /**
   * Get mascot interactions for user
   * @param {string} userId - User ID
   * @param {string} mascotType - Mascot type (aqua, verde, etc.)
   * @returns {Promise<Array>} Interaction history
   */
  async getUserInteractions(userId, mascotType) {
    throw new Error('getUserInteractions must be implemented by concrete repository')
  }

  /**
   * Save mascot interaction
   * @param {string} userId - User ID
   * @param {Object} interaction - Interaction data
   * @returns {Promise<Object>} Saved interaction
   */
  async saveInteraction(userId, interaction) {
    throw new Error('saveInteraction must be implemented by concrete repository')
  }

  /**
   * Get mascot personality data
   * @param {string} mascotType - Mascot type
   * @returns {Promise<Object>} Personality configuration
   */
  async getMascotPersonality(mascotType) {
    throw new Error('getMascotPersonality must be implemented by concrete repository')
  }

  /**
   * Get mascot dialogue templates
   * @param {string} mascotType - Mascot type
   * @param {string} context - Interaction context
   * @returns {Promise<Array>} Dialogue templates
   */
  async getDialogueTemplates(mascotType, context) {
    throw new Error('getDialogueTemplates must be implemented by concrete repository')
  }
}

/**
 * Contract for learning content repository
 */
export class LearningRepositoryContract extends BaseRepository {
  /**
   * Get learning modules for user phase
   * @param {number} userPhase - User journey phase
   * @returns {Promise<Array>} Learning modules
   */
  async getModulesForPhase(userPhase) {
    throw new Error('getModulesForPhase must be implemented by concrete repository')
  }

  /**
   * Get user learning progress
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Learning progress
   */
  async getUserProgress(userId) {
    throw new Error('getUserProgress must be implemented by concrete repository')
  }

  /**
   * Update learning progress
   * @param {string} userId - User ID
   * @param {string} moduleId - Module ID
   * @param {Object} progress - Progress data
   * @returns {Promise<Object>} Updated progress
   */
  async updateProgress(userId, moduleId, progress) {
    throw new Error('updateProgress must be implemented by concrete repository')
  }

  /**
   * Get achievements for user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User achievements
   */
  async getUserAchievements(userId) {
    throw new Error('getUserAchievements must be implemented by concrete repository')
  }
}

/**
 * Contract for security audit repository
 */
export class SecurityAuditRepositoryContract extends BaseRepository {
  /**
   * Log security event
   * @param {Object} securityEvent - Security event data
   * @returns {Promise<Object>} Logged event
   */
  async logSecurityEvent(securityEvent) {
    throw new Error('logSecurityEvent must be implemented by concrete repository')
  }

  /**
   * Get security events for user
   * @param {string} userId - User ID
   * @param {Object} filters - Event filters
   * @returns {Promise<Array>} Security events
   */
  async getSecurityEvents(userId, filters = {}) {
    throw new Error('getSecurityEvents must be implemented by concrete repository')
  }

  /**
   * Log business action for audit trail
   * @param {Object} auditEvent - Audit event data
   * @returns {Promise<Object>} Logged audit event
   */
  async logAuditEvent(auditEvent) {
    throw new Error('logAuditEvent must be implemented by concrete repository')
  }

  /**
   * Get audit trail for user actions
   * @param {string} userId - User ID
   * @param {Object} filters - Audit filters
   * @returns {Promise<Array>} Audit trail
   */
  async getAuditTrail(userId, filters = {}) {
    throw new Error('getAuditTrail must be implemented by concrete repository')
  }
}

/**
 * Contract for configuration repository
 */
export class ConfigurationRepositoryContract extends BaseRepository {
  /**
   * Get feature flag value
   * @param {string} flagName - Feature flag name
   * @param {string} userId - User ID (for user-specific flags)
   * @returns {Promise<boolean>} Flag value
   */
  async getFeatureFlag(flagName, userId = null) {
    throw new Error('getFeatureFlag must be implemented by concrete repository')
  }

  /**
   * Get configuration value
   * @param {string} key - Configuration key
   * @param {any} defaultValue - Default value if not found
   * @returns {Promise<any>} Configuration value
   */
  async getConfigValue(key, defaultValue = null) {
    throw new Error('getConfigValue must be implemented by concrete repository')
  }

  /**
   * Get environment-specific configuration
   * @param {string} environment - Environment name
   * @returns {Promise<Object>} Environment configuration
   */
  async getEnvironmentConfig(environment) {
    throw new Error('getEnvironmentConfig must be implemented by concrete repository')
  }

  /**
   * Get localization strings
   * @param {string} language - Language code
   * @returns {Promise<Object>} Localization strings
   */
  async getLocalizationStrings(language) {
    throw new Error('getLocalizationStrings must be implemented by concrete repository')
  }
}

/**
 * Contract for audit logger interface
 */
export class AuditLoggerInterface {
  /**
   * Log business action
   * @param {string} userId - User ID
   * @param {string} action - Action name
   * @param {Object} data - Action data
   * @returns {Promise<void>}
   */
  async logBusinessAction(userId, action, data) {
    throw new Error('logBusinessAction must be implemented by concrete logger')
  }

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   * @returns {Promise<void>}
   */
  async info(message, data = {}) {
    throw new Error('info must be implemented by concrete logger')
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   * @returns {Promise<void>}
   */
  async warn(message, data = {}) {
    throw new Error('warn must be implemented by concrete logger')
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   * @returns {Promise<void>}
   */
  async error(message, data = {}) {
    throw new Error('error must be implemented by concrete logger')
  }

  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   * @returns {Promise<void>}
   */
  async debug(message, data = {}) {
    throw new Error('debug must be implemented by concrete logger')
  }
}

/**
 * Contract for performance monitor interface
 */
export class PerformanceMonitorInterface {
  /**
   * Start a timer
   * @param {string} metricName - Metric name
   * @returns {Object} Timer object with end() method
   */
  startTimer(metricName) {
    throw new Error('startTimer must be implemented by concrete monitor')
  }

  /**
   * Record a metric
   * @param {string} metricName - Metric name
   * @param {number} value - Metric value
   * @param {Object} tags - Optional tags
   * @returns {Promise<void>}
   */
  async recordMetric(metricName, value, tags = {}) {
    throw new Error('recordMetric must be implemented by concrete monitor')
  }

  /**
   * Increment a counter
   * @param {string} metricName - Counter name
   * @param {number} value - Increment value
   * @param {Object} tags - Optional tags
   * @returns {Promise<void>}
   */
  async increment(metricName, value = 1, tags = {}) {
    throw new Error('increment must be implemented by concrete monitor')
  }

  /**
   * Record histogram value
   * @param {string} metricName - Histogram name
   * @param {number} value - Value to record
   * @param {Object} tags - Optional tags
   * @returns {Promise<void>}
   */
  async histogram(metricName, value, tags = {}) {
    throw new Error('histogram must be implemented by concrete monitor')
  }

  /**
   * Get performance statistics
   * @returns {Object} Performance statistics
   */
  getStatistics() {
    throw new Error('getStatistics must be implemented by concrete monitor')
  }
}

/**
 * Contract for cache interface
 */
export class CacheInterface {
  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} Cached value or null
   */
  async get(key) {
    throw new Error('get must be implemented by concrete cache')
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttlSeconds - Time to live in seconds
   * @returns {Promise<void>}
   */
  async set(key, value, ttlSeconds = null) {
    throw new Error('set must be implemented by concrete cache')
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(key) {
    throw new Error('delete must be implemented by concrete cache')
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} True if exists
   */
  async exists(key) {
    throw new Error('exists must be implemented by concrete cache')
  }

  /**
   * Clear all cached values
   * @returns {Promise<number>} Number of cleared entries
   */
  async clear() {
    throw new Error('clear must be implemented by concrete cache')
  }

  /**
   * Get multiple values from cache
   * @param {Array<string>} keys - Cache keys
   * @returns {Promise<Object>} Object with key-value pairs
   */
  async getMultiple(keys) {
    throw new Error('getMultiple must be implemented by concrete cache')
  }

  /**
   * Set multiple values in cache
   * @param {Object} values - Object with key-value pairs
   * @param {number} ttlSeconds - Time to live in seconds
   * @returns {Promise<void>}
   */
  async setMultiple(values, ttlSeconds = null) {
    throw new Error('setMultiple must be implemented by concrete cache')
  }
}