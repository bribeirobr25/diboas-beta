/**
 * Local Storage Repository Implementation
 * Zero-budget persistence layer using browser localStorage
 */

import { 
  UserRepositoryContract,
  AssetRepositoryContract,
  PortfolioRepositoryContract,
  MascotRepositoryContract,
  LearningRepositoryContract,
  SecurityAuditRepositoryContract,
  ConfigurationRepositoryContract
} from '../../shared-kernel/common/interfaces/RepositoryContracts.js'
import { 
  CacheOperationEvent,
  SystemErrorEvent 
} from '../../shared-kernel/common/events/DomainEvents.js'

/**
 * Base localStorage repository with encryption and caching
 */
class BaseLocalStorageRepository {
  constructor(keyPrefix, options = {}) {
    this._keyPrefix = keyPrefix
    this._eventBus = options.eventBus
    this._securityContext = options.securityContext
    this._performanceMonitor = options.performanceMonitor
    this._encryptionService = options.encryptionService
    
    // Cache configuration
    this._enableCache = options.enableCache !== false
    this._cacheTimeout = options.cacheTimeout || 300000 // 5 minutes
    this._cache = new Map()
    this._cacheTimestamps = new Map()
    
    // Performance tracking
    this._metrics = {
      reads: 0,
      writes: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0
    }
  }

  /**
   * Get item from localStorage with caching and encryption
   */
  async _getItem(key) {
    const timer = this._performanceMonitor?.startTimer('repo_read')
    const fullKey = `${this._keyPrefix}_${key}`
    
    try {
      // Check cache first
      if (this._enableCache && this._isCacheValid(fullKey)) {
        const cachedValue = this._cache.get(fullKey)
        await this._publishCacheEvent('hit', fullKey, true)
        timer?.end()
        this._metrics.reads++
        this._metrics.cacheHits++
        return cachedValue
      }

      // Read from localStorage
      const encryptedData = localStorage.getItem(fullKey)
      if (!encryptedData) {
        await this._publishCacheEvent('miss', fullKey, false)
        timer?.end()
        this._metrics.reads++
        this._metrics.cacheMisses++
        return null
      }

      // Decrypt if encryption service available
      const data = this._encryptionService 
        ? await this._encryptionService.decrypt(encryptedData)
        : encryptedData

      const parsedData = JSON.parse(data)

      // Update cache
      if (this._enableCache) {
        this._cache.set(fullKey, parsedData)
        this._cacheTimestamps.set(fullKey, Date.now())
      }

      await this._publishCacheEvent('miss', fullKey, true)
      timer?.end()
      this._metrics.reads++
      this._metrics.cacheMisses++
      return parsedData

    } catch (error) {
      timer?.end()
      this._metrics.errors++
      await this._handleError('_getItem', { key, error })
      return null
    }
  }

  /**
   * Set item in localStorage with encryption and cache invalidation
   */
  async _setItem(key, value) {
    const timer = this._performanceMonitor?.startTimer('repo_write')
    const fullKey = `${this._keyPrefix}_${key}`
    
    try {
      const serializedData = JSON.stringify(value)
      
      // Encrypt if encryption service available
      const dataToStore = this._encryptionService 
        ? await this._encryptionService.encrypt(serializedData)
        : serializedData

      // Store in localStorage
      localStorage.setItem(fullKey, dataToStore)

      // Update cache
      if (this._enableCache) {
        this._cache.set(fullKey, value)
        this._cacheTimestamps.set(fullKey, Date.now())
        await this._publishCacheEvent('set', fullKey, true)
      }

      timer?.end()
      this._metrics.writes++
      return true

    } catch (error) {
      timer?.end()
      this._metrics.errors++
      await this._handleError('_setItem', { key, error })
      throw error
    }
  }

  /**
   * Remove item from localStorage and cache
   */
  async _removeItem(key) {
    const fullKey = `${this._keyPrefix}_${key}`
    
    try {
      localStorage.removeItem(fullKey)
      
      if (this._enableCache) {
        this._cache.delete(fullKey)
        this._cacheTimestamps.delete(fullKey)
        await this._publishCacheEvent('invalidate', fullKey, true)
      }
      
      return true
    } catch (error) {
      this._metrics.errors++
      await this._handleError('_removeItem', { key, error })
      throw error
    }
  }

  /**
   * Get all keys with prefix
   */
  _getAllKeys() {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`${this._keyPrefix}_`)) {
        keys.push(key.substring(`${this._keyPrefix}_`.length))
      }
    }
    return keys
  }

  /**
   * Check if cache entry is valid
   */
  _isCacheValid(key) {
    if (!this._cache.has(key)) return false
    
    const timestamp = this._cacheTimestamps.get(key)
    const age = Date.now() - timestamp
    
    return age < this._cacheTimeout
  }

  /**
   * Clear cache
   */
  clearCache() {
    this._cache.clear()
    this._cacheTimestamps.clear()
  }

  /**
   * Get repository metrics
   */
  getMetrics() {
    return { ...this._metrics }
  }

  async _publishCacheEvent(operation, key, success) {
    if (this._eventBus) {
      try {
        await this._eventBus.publish(new CacheOperationEvent(operation, key, success))
      } catch (error) {
        // Ignore event publishing errors
      }
    }
  }

  async _handleError(method, context) {
    if (this._eventBus) {
      try {
        await this._eventBus.publish(new SystemErrorEvent('repository_error', {
          method,
          repository: this.constructor.name,
          context,
          severity: 'error'
        }))
      } catch (error) {
        // Ignore event publishing errors
      }
    }
  }
}

/**
 * User repository implementation using localStorage
 */
export class LocalStorageUserRepository extends UserRepositoryContract {
  constructor(options = {}) {
    super()
    this._storage = new BaseLocalStorageRepository('diboas_users', options)
  }

  async findById(id) {
    return await this._storage._getItem(id)
  }

  async save(entity) {
    const id = entity.userId || entity.id
    if (!id) throw new Error('Entity must have userId or id property')
    
    const dataToSave = {
      ...entity,
      id,
      updatedAt: new Date().toISOString(),
      version: (entity.version || 0) + 1
    }
    
    await this._storage._setItem(id, dataToSave)
    return dataToSave
  }

  async delete(id) {
    return await this._storage._removeItem(id)
  }

  async findAll(filters = {}) {
    const keys = this._storage._getAllKeys()
    const users = []
    
    for (const key of keys) {
      const user = await this._storage._getItem(key)
      if (user && this._matchesFilters(user, filters)) {
        users.push(user)
      }
    }
    
    return users.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }

  async findByEmail(email) {
    const users = await this.findAll()
    return users.find(user => user.email === email) || null
  }

  async updateUserPreferences(userId, preferences) {
    const user = await this.findById(userId)
    if (!user) throw new Error(`User not found: ${userId}`)
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      }
    }
    
    return await this.save(updatedUser)
  }

  async getUserJourneyProgress(userId) {
    const user = await this.findById(userId)
    if (!user) return null
    
    return {
      currentPhase: user.currentPhase || 1,
      completedLessons: user.completedLessons || [],
      achievements: user.achievements || [],
      journeyProgress: this._calculateProgress(user)
    }
  }

  async updateUserPhase(userId, phase) {
    const user = await this.findById(userId)
    if (!user) throw new Error(`User not found: ${userId}`)
    
    const updatedUser = {
      ...user,
      currentPhase: phase,
      phaseUpdatedAt: new Date().toISOString()
    }
    
    return await this.save(updatedUser)
  }

  _matchesFilters(user, filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (user[key] !== value) return false
    }
    return true
  }

  _calculateProgress(user) {
    const phase = user.currentPhase || 1
    const baseProgress = ((phase - 1) / 4) * 100
    const achievementBonus = Math.min((user.achievements?.length || 0) * 2, 25)
    return Math.min(baseProgress + achievementBonus, 100)
  }
}

/**
 * Asset repository implementation using localStorage and external APIs
 */
export class LocalStorageAssetRepository extends AssetRepositoryContract {
  constructor(options = {}) {
    super()
    this._storage = new BaseLocalStorageRepository('diboas_assets', options)
    this._marketDataProvider = options.marketDataProvider
  }

  async findById(id) {
    return await this._storage._getItem(id)
  }

  async save(entity) {
    const id = entity.symbol || entity.id
    if (!id) throw new Error('Asset must have symbol or id property')
    
    const dataToSave = {
      ...entity,
      id,
      updatedAt: new Date().toISOString()
    }
    
    await this._storage._setItem(id, dataToSave)
    return dataToSave
  }

  async delete(id) {
    return await this._storage._removeItem(id)
  }

  async findAll(filters = {}) {
    const keys = this._storage._getAllKeys()
    const assets = []
    
    for (const key of keys) {
      const asset = await this._storage._getItem(key)
      if (asset && this._matchesFilters(asset, filters)) {
        assets.push(asset)
      }
    }
    
    return assets
  }

  async findBySymbol(symbol) {
    return await this._storage._getItem(symbol.toUpperCase())
  }

  async getPriceHistory(symbol, period) {
    if (this._marketDataProvider) {
      return await this._marketDataProvider.getPriceHistory(symbol, period)
    }
    
    // Fallback to cached data
    const cacheKey = `price_history_${symbol}_${period}`
    return await this._storage._getItem(cacheKey) || []
  }

  async getMarketData(symbol) {
    if (this._marketDataProvider) {
      const marketData = await this._marketDataProvider.getMarketData(symbol)
      
      // Cache the result
      const cacheKey = `market_data_${symbol}`
      await this._storage._setItem(cacheKey, {
        ...marketData,
        cachedAt: new Date().toISOString()
      })
      
      return marketData
    }
    
    // Fallback to cached data
    const cacheKey = `market_data_${symbol}`
    const cached = await this._storage._getItem(cacheKey)
    
    if (cached && this._isMarketDataFresh(cached)) {
      return cached
    }
    
    return null
  }

  async getAssetsForPhase(userPhase) {
    const allAssets = await this.findAll()
    return allAssets.filter(asset => this._isAssetAvailableForPhase(asset, userPhase))
  }

  _matchesFilters(asset, filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (asset[key] !== value) return false
    }
    return true
  }

  _isMarketDataFresh(data) {
    if (!data.cachedAt) return false
    const cacheAge = Date.now() - new Date(data.cachedAt).getTime()
    return cacheAge < 300000 // 5 minutes
  }

  _isAssetAvailableForPhase(asset, phase) {
    const phaseAssets = {
      1: ['BTC'],
      2: ['BTC', 'GOLD'],
      3: ['BTC', 'GOLD', 'STOCKS'],
      4: ['BTC', 'ETH', 'SOL', 'SUI', 'GOLD', 'STOCKS', 'DEFI']
    }
    
    return phaseAssets[phase]?.includes(asset.symbol) || false
  }
}

/**
 * Configuration repository for feature flags and settings
 */
export class LocalStorageConfigRepository extends ConfigurationRepositoryContract {
  constructor(options = {}) {
    super()
    this._storage = new BaseLocalStorageRepository('diboas_config', options)
    
    // Default configuration
    this._defaultConfig = {
      features: {
        enableMascotAI: true,
        enablePortfolioTracking: true,
        enableAdvancedAssets: false,
        enableB2BAccess: false,
        enableRealTimeData: false
      },
      settings: {
        cacheTimeout: 300000,
        maxRetries: 3,
        apiTimeout: 10000,
        enableAnalytics: false // Privacy-first
      },
      localization: {
        defaultLanguage: 'en',
        supportedLanguages: ['en', 'de', 'pt', 'es'],
        autoDetect: true
      }
    }
  }

  async findById(id) {
    return await this._storage._getItem(id)
  }

  async save(entity) {
    const id = entity.key || entity.id
    if (!id) throw new Error('Config must have key or id property')
    
    const dataToSave = {
      ...entity,
      id,
      updatedAt: new Date().toISOString()
    }
    
    await this._storage._setItem(id, dataToSave)
    return dataToSave
  }

  async delete(id) {
    return await this._storage._removeItem(id)
  }

  async findAll(filters = {}) {
    const keys = this._storage._getAllKeys()
    const configs = []
    
    for (const key of keys) {
      const config = await this._storage._getItem(key)
      if (config) {
        configs.push(config)
      }
    }
    
    return configs
  }

  async getFeatureFlag(flagName, userId = null) {
    // Check user-specific flag first
    if (userId) {
      const userFlag = await this._storage._getItem(`user_flag_${userId}_${flagName}`)
      if (userFlag !== null) return userFlag.value
    }
    
    // Check global flag
    const globalFlag = await this._storage._getItem(`feature_${flagName}`)
    if (globalFlag !== null) return globalFlag.value
    
    // Return default value
    return this._defaultConfig.features[flagName] || false
  }

  async getConfigValue(key, defaultValue = null) {
    const config = await this._storage._getItem(`setting_${key}`)
    if (config !== null) return config.value
    
    // Check nested default config
    const keyParts = key.split('.')
    let value = this._defaultConfig
    
    for (const part of keyParts) {
      value = value?.[part]
      if (value === undefined) break
    }
    
    return value !== undefined ? value : defaultValue
  }

  async getEnvironmentConfig(environment) {
    const config = await this._storage._getItem(`env_${environment}`)
    return config || this._getDefaultEnvironmentConfig(environment)
  }

  async getLocalizationStrings(language) {
    const strings = await this._storage._getItem(`i18n_${language}`)
    return strings || {}
  }

  _getDefaultEnvironmentConfig(environment) {
    const defaults = {
      development: {
        apiBaseUrl: 'http://localhost:3000',
        enableDebug: true,
        enableMockData: true
      },
      production: {
        apiBaseUrl: 'https://api.diboas.com',
        enableDebug: false,
        enableMockData: false
      }
    }
    
    return defaults[environment] || defaults.production
  }
}

// Export convenience function to create repositories
export function createRepositories(options = {}) {
  return {
    userRepository: new LocalStorageUserRepository(options),
    assetRepository: new LocalStorageAssetRepository(options),
    configRepository: new LocalStorageConfigRepository(options)
  }
}