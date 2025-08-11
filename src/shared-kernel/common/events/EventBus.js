/**
 * Event Bus for diBoaS Platform
 * Secure, High-Performance Event Management
 */

/**
 * High-performance event bus with security, monitoring, and error handling
 */
export class SecureEventBus {
  constructor(options = {}) {
    this._handlers = new Map() // eventType -> Set of handlers
    this._middleware = new Set() // Middleware functions
    this._eventHistory = new Map() // Limited event history for debugging
    this._metrics = {
      eventsPublished: 0,
      eventsHandled: 0,
      errors: 0,
      averageProcessingTime: 0
    }
    
    // Configuration
    this._config = {
      maxHistorySize: options.maxHistorySize || 1000,
      enableMetrics: options.enableMetrics !== false,
      enableErrorRecovery: options.enableErrorRecovery !== false,
      maxHandlerExecutionTime: options.maxHandlerExecutionTime || 5000, // 5 seconds
      enableSecurityValidation: options.enableSecurityValidation !== false,
      logLevel: options.logLevel || 'warn' // 'debug', 'info', 'warn', 'error', 'none'
    }
    
    // Security context for validation
    this._securityContext = options.securityContext || null
    this._auditLogger = options.auditLogger || console
    
    // Performance monitoring
    this._performanceMonitor = options.performanceMonitor || null
    
    // Bind methods for consistent context
    this.publish = this.publish.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)
  }

  /**
   * Subscribe to events with security validation
   * @param {string} eventType - Event type to subscribe to
   * @param {Function} handler - Event handler function
   * @param {Object} options - Handler options (priority, once, security)
   * @returns {string} Subscription ID for unsubscribing
   */
  subscribe(eventType, handler, options = {}) {
    this._validateEventType(eventType)
    this._validateHandler(handler)
    
    // Security: Validate handler permissions if security context provided
    if (this._config.enableSecurityValidation && this._securityContext) {
      if (!this._securityContext.canSubscribeToEvent(eventType, handler)) {
        this._auditLogger.warn('Security violation: Unauthorized event subscription', {
          eventType,
          handler: handler.name,
          timestamp: new Date()
        })
        throw new SecurityError(`Unauthorized subscription to event type: ${eventType}`)
      }
    }

    if (!this._handlers.has(eventType)) {
      this._handlers.set(eventType, new Set())
    }

    const subscriptionId = this._generateSubscriptionId(eventType)
    const wrappedHandler = this._wrapHandler(handler, options, subscriptionId)
    
    // Store handler with metadata
    const handlerInfo = {
      id: subscriptionId,
      handler: wrappedHandler,
      originalHandler: handler,
      options: { ...options },
      subscribedAt: new Date(),
      callCount: 0,
      errorCount: 0,
      totalExecutionTime: 0
    }

    this._handlers.get(eventType).add(handlerInfo)
    
    this._log('debug', `Handler subscribed to ${eventType}`, { subscriptionId, options })
    return subscriptionId
  }

  /**
   * Unsubscribe from events
   * @param {string} subscriptionId - Subscription ID returned from subscribe
   * @returns {boolean} Success status
   */
  unsubscribe(subscriptionId) {
    for (const [eventType, handlers] of this._handlers) {
      for (const handlerInfo of handlers) {
        if (handlerInfo.id === subscriptionId) {
          handlers.delete(handlerInfo)
          this._log('debug', `Handler unsubscribed from ${eventType}`, { subscriptionId })
          return true
        }
      }
    }
    return false
  }

  /**
   * Publish event with security validation and performance monitoring
   * @param {BaseDomainEvent} event - Domain event to publish
   * @returns {Promise<PublishResult>} Publish result with metrics
   */
  async publish(event) {
    const startTime = performance.now()
    
    try {
      // Validation
      this._validateEvent(event)
      
      // Security: Validate event publishing permissions
      if (this._config.enableSecurityValidation && this._securityContext) {
        if (!this._securityContext.canPublishEvent(event)) {
          this._auditLogger.warn('Security violation: Unauthorized event publishing', {
            eventType: event.eventType,
            userId: event.userId,
            timestamp: new Date()
          })
          throw new SecurityError(`Unauthorized publishing of event type: ${event.eventType}`)
        }
      }

      // Execute middleware
      await this._executeMiddleware(event)
      
      // Store in history (for debugging)
      this._addToHistory(event)
      
      // Get handlers for this event type
      const handlers = this._handlers.get(event.eventType) || new Set()
      
      if (handlers.size === 0) {
        this._log('debug', `No handlers for event ${event.eventType}`)
        return this._createPublishResult(event, [], startTime, 'no_handlers')
      }

      // Execute handlers with error isolation
      const handlerResults = await this._executeHandlers(event, handlers)
      
      // Update metrics
      this._updateMetrics(startTime, handlerResults)
      
      // Log successful publication
      this._log('debug', `Event ${event.eventType} published successfully`, {
        eventId: event.eventId,
        handlerCount: handlers.size,
        processingTime: performance.now() - startTime
      })

      return this._createPublishResult(event, handlerResults, startTime, 'success')
      
    } catch (error) {
      this._metrics.errors++
      
      // Security audit for errors
      this._auditLogger.error('Event publication failed', {
        eventType: event.eventType,
        eventId: event.eventId,
        error: error.message,
        userId: event.userId,
        timestamp: new Date()
      })
      
      if (this._config.enableErrorRecovery) {
        return this._createPublishResult(event, [], startTime, 'error', error)
      } else {
        throw error
      }
    }
  }

  /**
   * Add middleware for event processing
   * @param {Function} middleware - Middleware function
   */
  addMiddleware(middleware) {
    this._validateHandler(middleware)
    this._middleware.add(middleware)
    this._log('debug', 'Middleware added to event bus')
  }

  /**
   * Remove middleware
   * @param {Function} middleware - Middleware function to remove
   */
  removeMiddleware(middleware) {
    this._middleware.delete(middleware)
    this._log('debug', 'Middleware removed from event bus')
  }

  /**
   * Get event bus metrics
   * @returns {Object} Current metrics
   */
  getMetrics() {
    return { ...this._metrics }
  }

  /**
   * Get event history (for debugging)
   * @param {number} limit - Number of recent events to return
   * @returns {Array} Recent events
   */
  getEventHistory(limit = 100) {
    const events = Array.from(this._eventHistory.values())
    return events.slice(-limit)
  }

  /**
   * Clear event history
   */
  clearHistory() {
    this._eventHistory.clear()
    this._log('debug', 'Event history cleared')
  }

  /**
   * Get handler statistics
   * @returns {Object} Handler performance statistics
   */
  getHandlerStats() {
    const stats = {}
    
    for (const [eventType, handlers] of this._handlers) {
      stats[eventType] = Array.from(handlers).map(handlerInfo => ({
        id: handlerInfo.id,
        callCount: handlerInfo.callCount,
        errorCount: handlerInfo.errorCount,
        averageExecutionTime: handlerInfo.callCount > 0 
          ? handlerInfo.totalExecutionTime / handlerInfo.callCount 
          : 0,
        subscribedAt: handlerInfo.subscribedAt
      }))
    }
    
    return stats
  }

  /**
   * Shutdown event bus gracefully
   */
  async shutdown() {
    this._log('info', 'Shutting down event bus')
    this._handlers.clear()
    this._middleware.clear()
    this._eventHistory.clear()
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  _validateEventType(eventType) {
    if (!eventType || typeof eventType !== 'string') {
      throw new Error('Event type must be a non-empty string')
    }
  }

  _validateHandler(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function')
    }
  }

  _validateEvent(event) {
    if (!event || typeof event !== 'object') {
      throw new Error('Event must be an object')
    }
    if (!event.eventType || !event.eventId) {
      throw new Error('Event must have eventType and eventId properties')
    }
  }

  _generateSubscriptionId(eventType) {
    return `${eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  _wrapHandler(handler, options, subscriptionId) {
    return async (event) => {
      const handlerStartTime = performance.now()
      
      try {
        // Execute handler with timeout protection
        const result = await this._executeWithTimeout(
          handler, 
          [event], 
          this._config.maxHandlerExecutionTime
        )
        
        // Update handler statistics
        this._updateHandlerStats(subscriptionId, handlerStartTime, false)
        
        // Remove if 'once' option is set
        if (options.once) {
          this.unsubscribe(subscriptionId)
        }
        
        return result
      } catch (error) {
        this._updateHandlerStats(subscriptionId, handlerStartTime, true)
        throw error
      }
    }
  }

  async _executeMiddleware(event) {
    for (const middleware of this._middleware) {
      try {
        await middleware(event)
      } catch (error) {
        this._log('error', `Middleware execution failed`, { error: error.message })
        throw error
      }
    }
  }

  _addToHistory(event) {
    if (this._eventHistory.size >= this._config.maxHistorySize) {
      // Remove oldest event
      const firstKey = this._eventHistory.keys().next().value
      this._eventHistory.delete(firstKey)
    }
    
    this._eventHistory.set(event.eventId, {
      ...event.toJSON(),
      publishedAt: new Date()
    })
  }

  async _executeHandlers(event, handlers) {
    const results = []
    
    // Sort handlers by priority (if specified)
    const sortedHandlers = Array.from(handlers).sort((a, b) => {
      const priorityA = a.options.priority || 0
      const priorityB = b.options.priority || 0
      return priorityB - priorityA // Higher priority first
    })

    // Execute handlers (parallel by default, sequential if specified)
    if (event.sequential || false) {
      // Sequential execution
      for (const handlerInfo of sortedHandlers) {
        try {
          const result = await handlerInfo.handler(event)
          results.push({ handlerId: handlerInfo.id, result, success: true })
        } catch (error) {
          results.push({ handlerId: handlerInfo.id, error, success: false })
          this._log('error', `Handler ${handlerInfo.id} failed`, { error: error.message })
        }
      }
    } else {
      // Parallel execution (default)
      const promises = sortedHandlers.map(async (handlerInfo) => {
        try {
          const result = await handlerInfo.handler(event)
          return { handlerId: handlerInfo.id, result, success: true }
        } catch (error) {
          this._log('error', `Handler ${handlerInfo.id} failed`, { error: error.message })
          return { handlerId: handlerInfo.id, error, success: false }
        }
      })
      
      results.push(...await Promise.allSettled(promises))
    }
    
    return results
  }

  async _executeWithTimeout(fn, args, timeout) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Handler execution timeout (${timeout}ms)`))
      }, timeout)
      
      Promise.resolve(fn(...args))
        .then(result => {
          clearTimeout(timer)
          resolve(result)
        })
        .catch(error => {
          clearTimeout(timer)
          reject(error)
        })
    })
  }

  _updateMetrics(startTime, handlerResults) {
    if (!this._config.enableMetrics) return

    this._metrics.eventsPublished++
    this._metrics.eventsHandled += handlerResults.length
    
    const processingTime = performance.now() - startTime
    this._metrics.averageProcessingTime = 
      (this._metrics.averageProcessingTime + processingTime) / 2
  }

  _updateHandlerStats(subscriptionId, startTime, hasError) {
    for (const handlers of this._handlers.values()) {
      for (const handlerInfo of handlers) {
        if (handlerInfo.id === subscriptionId) {
          handlerInfo.callCount++
          handlerInfo.totalExecutionTime += performance.now() - startTime
          if (hasError) {
            handlerInfo.errorCount++
          }
          return
        }
      }
    }
  }

  _createPublishResult(event, handlerResults, startTime, status, error = null) {
    const processingTime = performance.now() - startTime
    
    return {
      eventId: event.eventId,
      eventType: event.eventType,
      status,
      handlerCount: handlerResults.length,
      successfulHandlers: handlerResults.filter(r => r.success).length,
      failedHandlers: handlerResults.filter(r => !r.success).length,
      processingTime,
      error: error?.message || null,
      publishedAt: new Date()
    }
  }

  _log(level, message, data = {}) {
    if (this._config.logLevel === 'none') return
    
    const levels = { debug: 0, info: 1, warn: 2, error: 3 }
    const configLevel = levels[this._config.logLevel] || 2
    const messageLevel = levels[level] || 2
    
    if (messageLevel >= configLevel) {
      const logMethod = this._auditLogger[level] || this._auditLogger.log
      logMethod.call(this._auditLogger, `[EventBus] ${message}`, data)
    }
  }
}

/**
 * Security Error for unauthorized event operations
 */
export class SecurityError extends Error {
  constructor(message) {
    super(message)
    this.name = 'SecurityError'
  }
}

/**
 * Create a production-ready event bus instance
 * @param {Object} options - Configuration options
 * @returns {SecureEventBus} Configured event bus
 */
export function createEventBus(options = {}) {
  return new SecureEventBus({
    maxHistorySize: 1000,
    enableMetrics: true,
    enableErrorRecovery: true,
    maxHandlerExecutionTime: 5000,
    enableSecurityValidation: true,
    logLevel: 'warn',
    ...options
  })
}

/**
 * Singleton event bus for global use
 */
let globalEventBus = null

export function getGlobalEventBus() {
  if (!globalEventBus) {
    globalEventBus = createEventBus()
  }
  return globalEventBus
}

export function setGlobalEventBus(eventBus) {
  globalEventBus = eventBus
}