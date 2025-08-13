/**
 * In-Memory Cache Implementation
 * Simple in-memory implementation of CacheInterface
 */

import { CacheInterface } from '../../shared-kernel/common/interfaces/RepositoryContracts.js';

/**
 * In-memory cache with TTL support
 * Suitable for development and single-instance applications
 */
export class InMemoryCache extends CacheInterface {
  constructor(options = {}) {
    super();
    this._options = {
      defaultTtl: 3600, // 1 hour default TTL
      maxSize: 10000,   // Maximum number of entries
      cleanupInterval: 300000, // 5 minutes cleanup interval
      ...options
    };

    // Cache storage: key -> { value, expiry, accessCount, lastAccessed }
    this._cache = new Map();
    
    // Statistics
    this._stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      cleanups: 0
    };

    // Start cleanup timer
    this._startCleanupTimer();
  }

  async get(key) {
    this._validateKey(key);

    const entry = this._cache.get(key);
    
    if (!entry) {
      this._stats.misses++;
      return null;
    }

    // Check if entry has expired
    if (this._hasExpired(entry)) {
      this._cache.delete(key);
      this._stats.misses++;
      return null;
    }

    // Update access statistics
    entry.accessCount = (entry.accessCount || 0) + 1;
    entry.lastAccessed = new Date();
    
    this._stats.hits++;
    return this._cloneValue(entry.value);
  }

  async set(key, value, ttlSeconds = null) {
    this._validateKey(key);

    const ttl = ttlSeconds !== null ? ttlSeconds : this._options.defaultTtl;
    const expiry = ttl > 0 ? new Date(Date.now() + (ttl * 1000)) : null;

    const entry = {
      value: this._cloneValue(value),
      expiry,
      createdAt: new Date(),
      accessCount: 0,
      lastAccessed: new Date()
    };

    // Check if we need to evict entries
    if (this._cache.size >= this._options.maxSize && !this._cache.has(key)) {
      await this._evictLeastRecentlyUsed();
    }

    this._cache.set(key, entry);
    this._stats.sets++;
  }

  async delete(key) {
    this._validateKey(key);

    const existed = this._cache.has(key);
    if (existed) {
      this._cache.delete(key);
      this._stats.deletes++;
    }
    
    return existed;
  }

  async exists(key) {
    this._validateKey(key);

    const entry = this._cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (this._hasExpired(entry)) {
      this._cache.delete(key);
      return false;
    }

    return true;
  }

  async clear() {
    const size = this._cache.size;
    this._cache.clear();
    return size;
  }

  async getMultiple(keys) {
    if (!Array.isArray(keys)) {
      throw new Error('Keys must be an array');
    }

    const results = {};
    
    for (const key of keys) {
      results[key] = await this.get(key);
    }

    return results;
  }

  async setMultiple(values, ttlSeconds = null) {
    if (!values || typeof values !== 'object') {
      throw new Error('Values must be an object');
    }

    const promises = [];
    
    for (const [key, value] of Object.entries(values)) {
      promises.push(this.set(key, value, ttlSeconds));
    }

    await Promise.all(promises);
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const hitRate = this._stats.hits + this._stats.misses > 0 
      ? (this._stats.hits / (this._stats.hits + this._stats.misses)) * 100 
      : 0;

    return {
      ...this._stats,
      hitRate: Math.round(hitRate * 100) / 100,
      size: this._cache.size,
      maxSize: this._options.maxSize,
      memoryUsage: this._estimateMemoryUsage()
    };
  }

  /**
   * Get cache entries (for debugging)
   * @param {number} limit - Maximum entries to return
   * @returns {Array} Cache entries
   */
  getEntries(limit = 100) {
    const entries = [];
    let count = 0;

    for (const [key, entry] of this._cache) {
      if (count >= limit) break;

      entries.push({
        key,
        value: entry.value,
        expiry: entry.expiry,
        createdAt: entry.createdAt,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed,
        isExpired: this._hasExpired(entry)
      });

      count++;
    }

    return entries;
  }

  /**
   * Force cleanup of expired entries
   * @returns {number} Number of entries cleaned up
   */
  async cleanup() {
    let cleaned = 0;
    const now = new Date();

    for (const [key, entry] of this._cache) {
      if (this._hasExpired(entry)) {
        this._cache.delete(key);
        cleaned++;
      }
    }

    this._stats.cleanups++;
    return cleaned;
  }

  /**
   * Update cache options
   * @param {Object} options - New options to merge
   */
  updateOptions(options) {
    this._options = { ...this._options, ...options };
  }

  /**
   * Get current cache size
   * @returns {number} Current number of entries
   */
  size() {
    return this._cache.size;
  }

  // Private methods

  _validateKey(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache key must be a non-empty string');
    }
    
    if (key.length > 250) {
      throw new Error('Cache key too long (max 250 characters)');
    }
  }

  _hasExpired(entry) {
    return entry.expiry && entry.expiry <= new Date();
  }

  _cloneValue(value) {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'object') {
      try {
        return JSON.parse(JSON.stringify(value));
      } catch (error) {
        // If value is not serializable, return as-is (but this might cause issues)
        console.warn('Cache value is not serializable:', error.message);
        return value;
      }
    }

    return value;
  }

  async _evictLeastRecentlyUsed() {
    if (this._cache.size === 0) {
      return;
    }

    let lruKey = null;
    let lruTime = new Date();

    // Find the least recently used entry
    for (const [key, entry] of this._cache) {
      const accessTime = entry.lastAccessed || entry.createdAt;
      if (accessTime < lruTime) {
        lruTime = accessTime;
        lruKey = key;
      }
    }

    if (lruKey) {
      this._cache.delete(lruKey);
      this._stats.evictions++;
    }
  }

  _estimateMemoryUsage() {
    let totalSize = 0;

    for (const [key, entry] of this._cache) {
      // Rough estimate of memory usage
      totalSize += key.length * 2; // Key string size
      totalSize += this._estimateValueSize(entry.value);
      totalSize += 200; // Overhead for entry metadata
    }

    return {
      bytes: totalSize,
      kb: Math.round(totalSize / 1024 * 100) / 100,
      mb: Math.round(totalSize / (1024 * 1024) * 100) / 100
    };
  }

  _estimateValueSize(value) {
    if (value === null || value === undefined) {
      return 8;
    }

    if (typeof value === 'string') {
      return value.length * 2;
    }

    if (typeof value === 'number') {
      return 8;
    }

    if (typeof value === 'boolean') {
      return 4;
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value).length * 2;
      } catch (error) {
        return 1000; // Rough estimate for non-serializable objects
      }
    }

    return 100; // Default estimate
  }

  _startCleanupTimer() {
    if (this._options.cleanupInterval > 0) {
      setInterval(async () => {
        await this.cleanup();
      }, this._options.cleanupInterval);
    }
  }

  /**
   * Destroy the cache and cleanup resources
   */
  destroy() {
    this.clear();
    // Clear any timers if needed
    if (this._cleanupTimer) {
      clearInterval(this._cleanupTimer);
    }
  }
}