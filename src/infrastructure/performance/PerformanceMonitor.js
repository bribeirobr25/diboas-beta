/**
 * Performance Monitoring for diBoaS Platform
 * High-performance metrics collection and optimization
 */

import { 
  PerformanceMetricRecordedEvent,
  CacheOperationEvent 
} from '../../shared-kernel/common/events/DomainEvents.js'

/**
 * Performance monitoring and optimization system
 */
export class PerformanceMonitor {
  constructor(options = {}) {
    this._eventBus = options.eventBus
    this._auditLogger = options.auditLogger || console
    
    // Configuration
    this._config = {
      enableMetrics: options.enableMetrics !== false,
      enableRealTimeAlerts: options.enableRealTimeAlerts !== false,
      metricsBufferSize: options.metricsBufferSize || 1000,
      performanceThresholds: {
        slow_operation: options.slowOperationThreshold || 1000, // 1 second
        very_slow_operation: options.verySlowOperationThreshold || 3000, // 3 seconds
        memory_warning: options.memoryWarningThreshold || 50 * 1024 * 1024, // 50MB
        memory_critical: options.memoryCriticalThreshold || 100 * 1024 * 1024 // 100MB
      },
      ...options
    }
    
    // Metrics storage
    this._metrics = {
      timers: new Map(),
      counters: new Map(), 
      histograms: new Map(),
      gauges: new Map(),
      errors: new Map()
    }
    
    // Performance optimization state
    this._optimizations = {
      cacheHitRate: 0,
      averageResponseTime: 0,
      operationsPerSecond: 0,
      memoryUsage: 0
    }
    
    // Real-time monitoring
    this._activeTimers = new Map()
    this._metricsBuffer = []
    this._lastFlush = Date.now()
    
    // Browser performance API support
    this._supportsPerformanceAPI = typeof performance !== 'undefined'
    this._supportsMemoryAPI = this._supportsPerformanceAPI && 
                              'memory' in performance
    
    // Start background monitoring
    this._startBackgroundMonitoring()
  }

  /**
   * Start a performance timer
   */
  startTimer(operationName, metadata = {}) {
    if (!this._config.enableMetrics) {
      return { end: () => {} } // No-op timer
    }
    
    const timerId = `${operationName}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    const startTime = this._getHighResolutionTime()
    
    const timer = {
      id: timerId,
      operationName,
      startTime,
      metadata,
      end: () => this._endTimer(timerId, operationName, startTime, metadata)
    }
    
    this._activeTimers.set(timerId, timer)
    return timer
  }

  /**
   * Record a performance metric
   */
  async recordMetric(metricName, value, unit = 'ms', metadata = {}) {
    if (!this._config.enableMetrics) return
    
    try {
      const metric = {
        name: metricName,
        value,
        unit,
        metadata,
        timestamp: Date.now()
      }
      
      // Store in appropriate metric type
      this._updateMetricStore(metricName, value, metadata)
      
      // Add to buffer
      this._metricsBuffer.push(metric)
      
      // Check for performance alerts
      await this._checkPerformanceAlerts(metricName, value)
      
      // Publish metric event
      if (this._eventBus) {
        await this._eventBus.publish(new PerformanceMetricRecordedEvent(
          metricName, 
          value, 
          { unit, metadata }
        ))
      }
      
      // Auto-flush buffer if needed
      if (this._metricsBuffer.length >= this._config.metricsBufferSize) {
        await this._flushMetrics()
      }
      
    } catch (error) {
      await this._auditLogger.error('Failed to record metric', {
        metricName,
        value,
        error: error.message
      })
    }
  }

  /**
   * Record operation count
   */
  async incrementCounter(counterName, increment = 1, metadata = {}) {
    if (!this._config.enableMetrics) return
    
    const currentValue = this._metrics.counters.get(counterName) || 0
    const newValue = currentValue + increment
    
    this._metrics.counters.set(counterName, newValue)
    
    await this.recordMetric(`counter_${counterName}`, newValue, 'count', metadata)
  }

  /**
   * Record gauge value (current state)
   */
  async recordGauge(gaugeName, value, metadata = {}) {
    if (!this._config.enableMetrics) return
    
    this._metrics.gauges.set(gaugeName, {
      value,
      metadata,
      timestamp: Date.now()
    })
    
    await this.recordMetric(`gauge_${gaugeName}`, value, 'value', metadata)
  }

  /**
   * Record error occurrence
   */
  async recordError(errorType, errorDetails = {}) {
    const errorKey = `error_${errorType}`
    const currentCount = this._metrics.errors.get(errorKey) || 0
    
    this._metrics.errors.set(errorKey, currentCount + 1)
    
    await this.recordMetric(errorKey, currentCount + 1, 'count', {
      errorDetails,
      severity: errorDetails.severity || 'error'
    })
  }

  /**
   * Get current performance statistics
   */
  getPerformanceStats() {
    const now = Date.now()
    
    return {
      // Current optimizations
      optimizations: { ...this._optimizations },
      
      // Metric counts
      totalTimers: this._metrics.timers.size,
      totalCounters: this._metrics.counters.size,
      totalGauges: this._metrics.gauges.size,
      totalErrors: Array.from(this._metrics.errors.values()).reduce((sum, count) => sum + count, 0),
      
      // System performance
      memoryUsage: this._getMemoryUsage(),
      uptime: now - (this._startTime || now),
      activeTimers: this._activeTimers.size,
      
      // Buffer status
      bufferSize: this._metricsBuffer.length,
      bufferCapacity: this._config.metricsBufferSize,
      lastFlush: new Date(this._lastFlush),
      
      // Recent performance
      recentMetrics: this._metricsBuffer.slice(-10)
    }
  }

  /**
   * Get detailed metrics for specific operation
   */
  getOperationMetrics(operationName) {
    const timers = this._metrics.timers.get(operationName) || []
    
    if (timers.length === 0) {
      return null
    }
    
    const durations = timers.map(timer => timer.duration)
    const sorted = durations.sort((a, b) => a - b)
    
    return {
      operationName,
      totalCalls: timers.length,
      averageDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      medianDuration: sorted[Math.floor(sorted.length / 2)],
      p95Duration: sorted[Math.floor(sorted.length * 0.95)],
      p99Duration: sorted[Math.floor(sorted.length * 0.99)],
      recentCalls: timers.slice(-10)
    }
  }

  /**
   * Get system health status
   */
  getSystemHealth() {
    const memoryUsage = this._getMemoryUsage()
    const errorRate = this._calculateErrorRate()
    const avgResponseTime = this._calculateAverageResponseTime()
    
    let healthStatus = 'healthy'
    const issues = []
    
    // Check memory usage
    if (memoryUsage > this._config.performanceThresholds.memory_critical) {
      healthStatus = 'critical'
      issues.push('Critical memory usage')
    } else if (memoryUsage > this._config.performanceThresholds.memory_warning) {
      healthStatus = 'warning'
      issues.push('High memory usage')
    }
    
    // Check error rate
    if (errorRate > 0.1) { // 10% error rate
      healthStatus = healthStatus === 'healthy' ? 'warning' : 'critical'
      issues.push('High error rate')
    }
    
    // Check response time
    if (avgResponseTime > this._config.performanceThresholds.very_slow_operation) {
      healthStatus = healthStatus === 'healthy' ? 'warning' : 'critical'
      issues.push('Very slow response times')
    }
    
    return {
      status: healthStatus,
      issues,
      metrics: {
        memoryUsage,
        errorRate,
        avgResponseTime,
        cacheHitRate: this._optimizations.cacheHitRate,
        operationsPerSecond: this._optimizations.operationsPerSecond
      },
      timestamp: new Date()
    }
  }

  /**
   * Optimize performance based on collected metrics
   */
  async optimizePerformance() {
    const optimizations = []
    
    // Analyze cache performance
    const cacheOptimization = await this._optimizeCachePerformance()
    if (cacheOptimization) {
      optimizations.push(cacheOptimization)
    }
    
    // Analyze slow operations
    const slowOpOptimization = await this._optimizeSlowOperations()
    if (slowOpOptimization) {
      optimizations.push(slowOpOptimization)
    }
    
    // Memory optimization
    const memoryOptimization = await this._optimizeMemoryUsage()
    if (memoryOptimization) {
      optimizations.push(memoryOptimization)
    }
    
    // Log optimizations applied
    if (optimizations.length > 0) {
      await this._auditLogger.info('Performance optimizations applied', {
        optimizations,
        beforeStats: this.getPerformanceStats(),
        timestamp: new Date()
      })
    }
    
    return optimizations
  }

  /**
   * Flush metrics buffer
   */
  async _flushMetrics() {
    if (this._metricsBuffer.length === 0) return
    
    try {
      // In production, this would send metrics to monitoring service
      await this._auditLogger.debug('Flushing performance metrics', {
        count: this._metricsBuffer.length,
        timestamp: new Date()
      })
      
      this._metricsBuffer = []
      this._lastFlush = Date.now()
      
    } catch (error) {
      await this._auditLogger.error('Failed to flush metrics', {
        error: error.message,
        bufferSize: this._metricsBuffer.length
      })
    }
  }

  /**
   * Clean up old metrics
   */
  cleanupOldMetrics(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    const cutoff = Date.now() - maxAge
    
    // Clean up timer metrics
    for (const [operation, timers] of this._metrics.timers) {
      const recentTimers = timers.filter(timer => timer.timestamp > cutoff)
      if (recentTimers.length > 0) {
        this._metrics.timers.set(operation, recentTimers)
      } else {
        this._metrics.timers.delete(operation)
      }
    }
    
    // Clean up buffer
    this._metricsBuffer = this._metricsBuffer.filter(metric => metric.timestamp > cutoff)
  }

  /**
   * Shutdown monitor gracefully
   */
  async shutdown() {
    await this._flushMetrics()
    
    if (this._backgroundInterval) {
      clearInterval(this._backgroundInterval)
    }
    
    await this._auditLogger.info('Performance monitor shutdown complete')
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  _endTimer(timerId, operationName, startTime, metadata) {
    if (!this._activeTimers.has(timerId)) return
    
    const endTime = this._getHighResolutionTime()
    const duration = endTime - startTime
    
    // Remove from active timers
    this._activeTimers.delete(timerId)
    
    // Store timer result
    const timerResult = {
      operationName,
      duration,
      startTime,
      endTime,
      metadata,
      timestamp: Date.now()
    }
    
    if (!this._metrics.timers.has(operationName)) {
      this._metrics.timers.set(operationName, [])
    }
    
    const timers = this._metrics.timers.get(operationName)
    timers.push(timerResult)
    
    // Keep only recent timers (last 1000)
    if (timers.length > 1000) {
      this._metrics.timers.set(operationName, timers.slice(-500))
    }
    
    // Record metric asynchronously
    this.recordMetric(operationName, duration, 'ms', metadata)
    
    return duration
  }

  _getHighResolutionTime() {
    return this._supportsPerformanceAPI ? performance.now() : Date.now()
  }

  _updateMetricStore(metricName, value, metadata) {
    // Update histograms for timing data
    if (metadata.unit === 'ms' || metricName.includes('_time')) {
      if (!this._metrics.histograms.has(metricName)) {
        this._metrics.histograms.set(metricName, [])
      }
      
      const histogram = this._metrics.histograms.get(metricName)
      histogram.push({ value, timestamp: Date.now() })
      
      // Keep only recent values
      if (histogram.length > 100) {
        this._metrics.histograms.set(metricName, histogram.slice(-50))
      }
    }
  }

  async _checkPerformanceAlerts(metricName, value) {
    if (!this._config.enableRealTimeAlerts) return
    
    // Check for slow operations
    if (metricName.includes('_time') || metricName.includes('timer_')) {
      if (value > this._config.performanceThresholds.very_slow_operation) {
        await this._auditLogger.warn('Very slow operation detected', {
          operation: metricName,
          duration: value,
          threshold: this._config.performanceThresholds.very_slow_operation
        })
      }
    }
    
    // Check for error spikes
    if (metricName.startsWith('error_')) {
      if (value > 10) { // More than 10 errors of same type
        await this._auditLogger.warn('Error spike detected', {
          errorType: metricName,
          count: value
        })
      }
    }
  }

  _getMemoryUsage() {
    if (this._supportsMemoryAPI) {
      return performance.memory.usedJSHeapSize
    }
    
    // Fallback estimation
    return this._metricsBuffer.length * 100 + this._activeTimers.size * 50
  }

  _calculateErrorRate() {
    const totalErrors = Array.from(this._metrics.errors.values()).reduce((sum, count) => sum + count, 0)
    const totalOperations = this._metrics.counters.get('total_operations') || 1
    
    return totalErrors / totalOperations
  }

  _calculateAverageResponseTime() {
    const allTimers = Array.from(this._metrics.timers.values()).flat()
    if (allTimers.length === 0) return 0
    
    const totalTime = allTimers.reduce((sum, timer) => sum + timer.duration, 0)
    return totalTime / allTimers.length
  }

  async _optimizeCachePerformance() {
    // Analyze cache hit rates
    const cacheHits = this._metrics.counters.get('cache_hits') || 0
    const cacheMisses = this._metrics.counters.get('cache_misses') || 0
    const total = cacheHits + cacheMisses
    
    if (total === 0) return null
    
    const hitRate = cacheHits / total
    this._optimizations.cacheHitRate = hitRate
    
    if (hitRate < 0.7) { // Less than 70% hit rate
      return {
        type: 'cache_optimization',
        description: 'Increase cache size or timeout to improve hit rate',
        currentHitRate: hitRate,
        recommendedAction: 'increase_cache_size'
      }
    }
    
    return null
  }

  async _optimizeSlowOperations() {
    const slowOperations = []
    
    for (const [operation, timers] of this._metrics.timers) {
      const avgDuration = timers.reduce((sum, t) => sum + t.duration, 0) / timers.length
      
      if (avgDuration > this._config.performanceThresholds.slow_operation) {
        slowOperations.push({
          operation,
          avgDuration,
          callCount: timers.length
        })
      }
    }
    
    if (slowOperations.length > 0) {
      return {
        type: 'slow_operation_optimization',
        description: 'Optimize slow operations',
        slowOperations: slowOperations.slice(0, 5), // Top 5
        recommendedAction: 'profile_and_optimize'
      }
    }
    
    return null
  }

  async _optimizeMemoryUsage() {
    const memoryUsage = this._getMemoryUsage()
    
    if (memoryUsage > this._config.performanceThresholds.memory_warning) {
      // Clean up old metrics
      this.cleanupOldMetrics()
      
      return {
        type: 'memory_optimization',
        description: 'Cleaned up old metrics to reduce memory usage',
        memoryBeforeCleanup: memoryUsage,
        memoryAfterCleanup: this._getMemoryUsage(),
        recommendedAction: 'increase_cleanup_frequency'
      }
    }
    
    return null
  }

  _startBackgroundMonitoring() {
    this._startTime = Date.now()
    
    // Start background metrics collection
    this._backgroundInterval = setInterval(async () => {
      try {
        // Record system metrics
        await this.recordGauge('memory_usage', this._getMemoryUsage())
        await this.recordGauge('active_timers', this._activeTimers.size)
        await this.recordGauge('metrics_buffer_size', this._metricsBuffer.length)
        
        // Auto-flush if needed
        const timeSinceLastFlush = Date.now() - this._lastFlush
        if (timeSinceLastFlush > 60000) { // 1 minute
          await this._flushMetrics()
        }
        
        // Auto-cleanup if needed
        if (Date.now() % (5 * 60 * 1000) === 0) { // Every 5 minutes
          this.cleanupOldMetrics()
        }
        
      } catch (error) {
        await this._auditLogger.error('Background monitoring error', {
          error: error.message
        })
      }
    }, 30000) // Every 30 seconds
  }
}

/**
 * Create production-ready performance monitor
 */
export function createPerformanceMonitor(options = {}) {
  return new PerformanceMonitor({
    enableMetrics: true,
    enableRealTimeAlerts: true,
    metricsBufferSize: 1000,
    slowOperationThreshold: 1000,
    verySlowOperationThreshold: 3000,
    memoryWarningThreshold: 50 * 1024 * 1024,
    memoryCriticalThreshold: 100 * 1024 * 1024,
    ...options
  })
}