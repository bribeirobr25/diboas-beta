/**
 * Security Context for diBoaS Platform
 * FinTech-grade security with audit trails
 */

import { 
  SecurityViolationEvent,
  UserAuthenticationEvent,
  SensitiveActionPerformedEvent 
} from '../../shared-kernel/common/events/DomainEvents.js'

/**
 * Security context for validating user actions and maintaining security state
 */
export class SecurityContext {
  constructor(options = {}) {
    this._eventBus = options.eventBus
    this._auditLogger = options.auditLogger || console
    this._encryptionService = options.encryptionService
    this._rateLimiter = options.rateLimiter
    
    // Security configuration
    this._config = {
      sessionTimeout: options.sessionTimeout || 30 * 60 * 1000, // 30 minutes
      maxLoginAttempts: options.maxLoginAttempts || 5,
      lockoutDuration: options.lockoutDuration || 15 * 60 * 1000, // 15 minutes
      sensitiveActions: new Set([
        'advance_phase',
        'update_preferences', 
        'complete_lesson',
        'asset_selection',
        'portfolio_update'
      ]),
      allowedIPs: options.allowedIPs || [],
      requireSecureConnection: options.requireSecureConnection !== false,
      enableRateLimit: options.enableRateLimit !== false
    }
    
    // Runtime security state
    this._currentUser = null
    this._sessionData = null
    this._permissions = new Set()
    this._securityEvents = []
    this._rateLimitState = new Map()
  }

  /**
   * Validate user action with comprehensive security checks
   */
  async validateUserAction(userId, action, context = {}) {
    const startTime = performance.now()
    
    try {
      // Basic validation
      this._validateInputs(userId, action)
      
      // Security checks
      await this._checkRateLimit(userId, action)
      await this._checkSessionSecurity(userId)
      await this._checkActionPermissions(userId, action)
      await this._checkIPWhitelist(context.ipAddress)
      await this._checkSecureConnection(context.isSecure)
      
      // Log successful validation
      await this._logSecurityEvent('action_validated', userId, {
        action,
        context,
        processingTime: performance.now() - startTime,
        success: true
      })
      
      return true
      
    } catch (error) {
      // Log security violation
      await this._logSecurityViolation(userId, action, error, context)
      throw error
    }
  }

  /**
   * Authenticate user session
   */
  async authenticateUser(userId, credentials, context = {}) {
    try {
      this._validateInputs(userId, 'authentication')
      
      // Check for account lockout
      if (await this._isAccountLocked(userId)) {
        throw new SecurityError('Account temporarily locked due to multiple failed attempts')
      }
      
      // Validate credentials (simplified for demo)
      const isValid = await this._validateCredentials(userId, credentials)
      
      if (isValid) {
        await this._createSecureSession(userId, context)
        await this._clearFailedAttempts(userId)
        
        // Publish authentication event
        if (this._eventBus) {
          await this._eventBus.publish(new UserAuthenticationEvent(userId, {
            type: 'login',
            success: true,
            method: credentials.method || 'password',
            ipAddress: context.ipAddress,
            userAgent: context.userAgent
          }))
        }
        
        return {
          success: true,
          sessionToken: this._generateSecureToken(),
          expiresAt: new Date(Date.now() + this._config.sessionTimeout)
        }
        
      } else {
        await this._recordFailedAttempt(userId)
        
        // Publish failed authentication event
        if (this._eventBus) {
          await this._eventBus.publish(new UserAuthenticationEvent(userId, {
            type: 'login',
            success: false,
            method: credentials.method || 'password',
            ipAddress: context.ipAddress,
            userAgent: context.userAgent
          }))
        }
        
        throw new SecurityError('Invalid credentials')
      }
      
    } catch (error) {
      await this._logSecurityViolation(userId, 'authentication', error, context)
      throw error
    }
  }

  /**
   * Validate event publishing permissions
   */
  async canPublishEvent(event) {
    try {
      // Check if user can publish this type of event
      if (event.userId && !this._canUserPublishEvent(event.userId, event.eventType)) {
        return false
      }
      
      // Check for sensitive data in event
      if (this._containsSensitiveData(event)) {
        return this._hasPermission(event.userId, 'publish_sensitive_events')
      }
      
      return true
      
    } catch (error) {
      await this._auditLogger.warn('Event publishing validation failed', {
        eventType: event.eventType,
        eventId: event.eventId,
        error: error.message
      })
      return false
    }
  }

  /**
   * Validate event subscription permissions
   */
  async canSubscribeToEvent(eventType, handler) {
    try {
      // Check if handler is authorized for this event type
      const restrictedEvents = [
        'SecurityViolation',
        'SensitiveActionPerformed',
        'SystemError'
      ]
      
      if (restrictedEvents.includes(eventType)) {
        return this._hasPermission(this._currentUser?.userId, 'subscribe_to_security_events')
      }
      
      return true
      
    } catch (error) {
      await this._auditLogger.warn('Event subscription validation failed', {
        eventType,
        handlerName: handler.name,
        error: error.message
      })
      return false
    }
  }

  /**
   * Create encrypted route for sensitive operations
   */
  async createEncryptedRoute(route, userId) {
    if (!this._encryptionService) {
      return route // Return original if no encryption service
    }
    
    try {
      const routeData = {
        originalRoute: route,
        userId,
        timestamp: Date.now(),
        nonce: this._generateNonce()
      }
      
      const encryptedRoute = await this._encryptionService.encrypt(JSON.stringify(routeData))
      return `/secure/${encryptedRoute}`
      
    } catch (error) {
      await this._auditLogger.error('Route encryption failed', {
        route,
        userId,
        error: error.message
      })
      throw new SecurityError('Failed to create secure route')
    }
  }

  /**
   * Decrypt and validate encrypted route
   */
  async validateEncryptedRoute(encryptedRoute, userId) {
    if (!this._encryptionService) {
      return encryptedRoute // Return original if no encryption service
    }
    
    try {
      const encryptedData = encryptedRoute.replace('/secure/', '')
      const decryptedData = await this._encryptionService.decrypt(encryptedData)
      const routeData = JSON.parse(decryptedData)
      
      // Validate route data
      if (routeData.userId !== userId) {
        throw new SecurityError('Route user mismatch')
      }
      
      // Check if route hasn't expired (30 minutes)
      const routeAge = Date.now() - routeData.timestamp
      if (routeAge > 30 * 60 * 1000) {
        throw new SecurityError('Encrypted route expired')
      }
      
      return routeData.originalRoute
      
    } catch (error) {
      await this._logSecurityViolation(userId, 'route_validation', error)
      throw new SecurityError('Invalid encrypted route')
    }
  }

  /**
   * Get current security context
   */
  getSecurityContext() {
    return {
      userId: this._currentUser?.userId,
      permissions: Array.from(this._permissions),
      sessionActive: this._isSessionActive(),
      securityLevel: this._calculateSecurityLevel(),
      lastActivity: this._sessionData?.lastActivity
    }
  }

  /**
   * Update security permissions
   */
  async updatePermissions(userId, permissions) {
    if (!this._hasPermission(this._currentUser?.userId, 'manage_permissions')) {
      throw new SecurityError('Insufficient permissions to update permissions')
    }
    
    this._permissions.clear()
    permissions.forEach(permission => this._permissions.add(permission))
    
    await this._auditLogger.info('User permissions updated', {
      userId,
      newPermissions: permissions,
      updatedBy: this._currentUser?.userId
    })
  }

  /**
   * Logout and clear session
   */
  async logout(userId) {
    try {
      if (this._currentUser?.userId === userId) {
        this._currentUser = null
        this._sessionData = null
        this._permissions.clear()
        
        // Publish logout event
        if (this._eventBus) {
          await this._eventBus.publish(new UserAuthenticationEvent(userId, {
            type: 'logout',
            success: true,
            method: 'manual'
          }))
        }
        
        await this._auditLogger.info('User logged out', { userId })
      }
      
    } catch (error) {
      await this._auditLogger.error('Logout error', {
        userId,
        error: error.message
      })
      throw error
    }
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  _validateInputs(userId, action) {
    if (!userId || typeof userId !== 'string') {
      throw new SecurityError('Invalid user ID')
    }
    
    if (!action || typeof action !== 'string') {
      throw new SecurityError('Invalid action')
    }
  }

  async _checkRateLimit(userId, action) {
    if (!this._config.enableRateLimit) return
    
    const key = `${userId}_${action}`
    const now = Date.now()
    const windowSize = 60000 // 1 minute
    const maxRequests = this._getRateLimit(action)
    
    if (!this._rateLimitState.has(key)) {
      this._rateLimitState.set(key, [])
    }
    
    const requests = this._rateLimitState.get(key)
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowSize)
    
    if (validRequests.length >= maxRequests) {
      throw new SecurityError(`Rate limit exceeded for action: ${action}`)
    }
    
    validRequests.push(now)
    this._rateLimitState.set(key, validRequests)
  }

  async _checkSessionSecurity(userId) {
    if (!this._sessionData || this._sessionData.userId !== userId) {
      throw new SecurityError('No valid session for user')
    }
    
    const now = Date.now()
    const sessionAge = now - this._sessionData.createdAt
    const lastActivity = now - this._sessionData.lastActivity
    
    if (sessionAge > this._config.sessionTimeout) {
      throw new SecurityError('Session expired')
    }
    
    if (lastActivity > this._config.sessionTimeout) {
      throw new SecurityError('Session inactive timeout')
    }
    
    // Update last activity
    this._sessionData.lastActivity = now
  }

  async _checkActionPermissions(userId, action) {
    // Check if action requires special permissions
    if (this._config.sensitiveActions.has(action)) {
      if (!this._hasPermission(userId, `action_${action}`)) {
        // For demo purposes, allow basic actions for authenticated users
        if (!this._isSessionActive()) {
          throw new SecurityError(`Permission denied for action: ${action}`)
        }
      }
      
      // Log sensitive action
      if (this._eventBus) {
        await this._eventBus.publish(new SensitiveActionPerformedEvent(userId, action, {
          resource: 'user_journey',
          parameters: { action },
          result: 'authorized'
        }))
      }
    }
  }

  async _checkIPWhitelist(ipAddress) {
    if (this._config.allowedIPs.length === 0) return // No IP restrictions
    
    if (ipAddress && !this._config.allowedIPs.includes(ipAddress)) {
      throw new SecurityError(`IP address not authorized: ${ipAddress}`)
    }
  }

  async _checkSecureConnection(isSecure) {
    if (this._config.requireSecureConnection && isSecure === false) {
      throw new SecurityError('Secure connection required')
    }
  }

  async _validateCredentials(userId, credentials) {
    // Simplified credential validation for demo
    // In production, this would hash and compare passwords
    return credentials && credentials.password === 'demo_password'
  }

  async _createSecureSession(userId, context) {
    this._currentUser = { userId }
    this._sessionData = {
      userId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      sessionId: this._generateSessionId()
    }
    
    // Set default permissions
    this._permissions.add('read_journey')
    this._permissions.add('action_start_journey')
    this._permissions.add('action_advance_phase')
    this._permissions.add('action_complete_lesson')
    this._permissions.add('action_update_preferences')
    this._permissions.add('action_asset_selection')
  }

  async _isAccountLocked(userId) {
    const attempts = await this._getFailedAttempts(userId)
    return attempts >= this._config.maxLoginAttempts
  }

  async _getFailedAttempts(userId) {
    // In production, this would check a persistent store
    return 0
  }

  async _recordFailedAttempt(userId) {
    // In production, this would increment failed attempts in persistent store
    await this._auditLogger.warn('Failed login attempt', { userId })
  }

  async _clearFailedAttempts(userId) {
    // In production, this would clear failed attempts from persistent store
    await this._auditLogger.info('Failed attempts cleared', { userId })
  }

  _generateSecureToken() {
    return 'secure_token_' + Math.random().toString(36).substr(2, 20)
  }

  _generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 16)
  }

  _generateNonce() {
    return Math.random().toString(36).substr(2, 16)
  }

  _hasPermission(userId, permission) {
    if (!this._isSessionActive()) return false
    return this._permissions.has(permission)
  }

  _isSessionActive() {
    return this._sessionData && 
           this._currentUser && 
           (Date.now() - this._sessionData.lastActivity) < this._config.sessionTimeout
  }

  _calculateSecurityLevel() {
    let level = 'low'
    
    if (this._isSessionActive()) {
      level = 'medium'
    }
    
    if (this._permissions.size > 5) {
      level = 'high'
    }
    
    return level
  }

  _canUserPublishEvent(userId, eventType) {
    // Basic event publishing permissions
    const restrictedEvents = ['SecurityViolation', 'SystemError']
    return !restrictedEvents.includes(eventType) || this._hasPermission(userId, 'publish_system_events')
  }

  _containsSensitiveData(event) {
    const sensitiveFields = ['password', 'token', 'ssn', 'creditCard']
    const eventData = JSON.stringify(event)
    
    return sensitiveFields.some(field => 
      eventData.toLowerCase().includes(field.toLowerCase())
    )
  }

  _getRateLimit(action) {
    const rateLimits = {
      authentication: 5,
      advance_phase: 3,
      update_preferences: 10,
      complete_lesson: 20,
      asset_selection: 15
    }
    
    return rateLimits[action] || 30 // Default rate limit
  }

  async _logSecurityEvent(eventType, userId, details) {
    const event = {
      eventType,
      userId,
      details,
      timestamp: new Date(),
      severity: 'info'
    }
    
    this._securityEvents.push(event)
    
    // Keep only recent events
    if (this._securityEvents.length > 1000) {
      this._securityEvents = this._securityEvents.slice(-500)
    }
    
    await this._auditLogger.info(`Security event: ${eventType}`, {
      userId,
      details
    })
  }

  async _logSecurityViolation(userId, action, error, context) {
    if (this._eventBus) {
      await this._eventBus.publish(new SecurityViolationEvent(userId, 'unauthorized_action', {
        action,
        error: error.message,
        context,
        severity: 'high',
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      }))
    }
    
    await this._auditLogger.error('Security violation', {
      userId,
      action,
      error: error.message,
      context
    })
  }
}

/**
 * Security error class
 */
export class SecurityError extends Error {
  constructor(message) {
    super(message)
    this.name = 'SecurityError'
  }
}

/**
 * Create production-ready security context
 */
export function createSecurityContext(options = {}) {
  return new SecurityContext({
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    requireSecureConnection: true,
    enableRateLimit: true,
    ...options
  })
}