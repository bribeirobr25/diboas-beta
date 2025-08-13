/**
 * Global Error Handler
 * Production-grade error monitoring and reporting system
 * Captures uncaught exceptions, promise rejections, and network errors
 */

import { SystemErrorEvent } from '../../shared-kernel/common/events/DomainEvents.js';

/**
 * Global error handling and monitoring service
 * Provides comprehensive error capture, categorization, and reporting
 */
export class GlobalErrorHandler {
  constructor(options = {}) {
    this._eventBus = options.eventBus;
    this._auditLogger = options.auditLogger || console;
    this._reportingEndpoint = options.reportingEndpoint;
    this._maxErrors = options.maxErrors || 100;
    this._sampleRate = options.sampleRate || 1.0; // 100% error reporting by default
    
    // Error storage and management
    this._errors = [];
    this._errorCounts = new Map();
    this._sessionId = this._generateSessionId();
    this._startTime = Date.now();
    
    // Error categorization
    this._errorCategories = {
      javascript: 'JavaScript Runtime Error',
      promise: 'Unhandled Promise Rejection',
      network: 'Network Error', 
      resource: 'Resource Loading Error',
      security: 'Security Error',
      unknown: 'Unknown Error'
    };
    
    // Initialize error handling
    this._initializeErrorHandling();
  }

  /**
   * Initialize all global error handlers
   */
  _initializeErrorHandling() {
    try {
      // Catch JavaScript runtime errors
      this._setupJavaScriptErrorHandler();
      
      // Catch unhandled promise rejections
      this._setupPromiseRejectionHandler();
      
      // Catch resource loading errors
      this._setupResourceErrorHandler();
      
      // Network error monitoring
      this._setupNetworkErrorHandler();
      
      // Security error monitoring
      this._setupSecurityErrorHandler();
      
      this._auditLogger.info('Global error handling initialized', {
        sessionId: this._sessionId,
        sampleRate: this._sampleRate,
        maxErrors: this._maxErrors
      });
      
    } catch (error) {
      console.error('Failed to initialize global error handling:', error);
    }
  }

  /**
   * Setup JavaScript runtime error handler
   * Catches uncaught exceptions and syntax errors
   */
  _setupJavaScriptErrorHandler() {
    window.addEventListener('error', (event) => {
      const errorInfo = {
        category: 'javascript',
        message: event.message || 'Unknown JavaScript error',
        filename: event.filename || 'unknown',
        lineno: event.lineno || 0,
        colno: event.colno || 0,
        stack: event.error?.stack || null,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      this._handleError(errorInfo);
    }, true);
  }

  /**
   * Setup unhandled promise rejection handler
   * Catches promises that reject without .catch() handlers
   */
  _setupPromiseRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      const errorInfo = {
        category: 'promise',
        message: event.reason?.message || event.reason || 'Unhandled promise rejection',
        stack: event.reason?.stack || null,
        promise: event.promise,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      this._handleError(errorInfo);
    });
  }

  /**
   * Setup resource loading error handler
   * Catches failed script, image, CSS, and other resource loads
   */
  _setupResourceErrorHandler() {
    window.addEventListener('error', (event) => {
      // Only handle resource loading errors (not JavaScript errors)
      if (event.target !== window && event.target.tagName) {
        const errorInfo = {
          category: 'resource',
          message: `Failed to load ${event.target.tagName.toLowerCase()}: ${event.target.src || event.target.href}`,
          resourceType: event.target.tagName.toLowerCase(),
          resourceUrl: event.target.src || event.target.href || 'unknown',
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        };
        
        this._handleError(errorInfo);
      }
    }, true);
  }

  /**
   * Setup network error monitoring
   * Wraps fetch and XMLHttpRequest to catch network failures
   */
  _setupNetworkErrorHandler() {
    // Wrap fetch API
    if (window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        try {
          const response = await originalFetch(...args);
          
          // Log failed HTTP responses
          if (!response.ok) {
            const errorInfo = {
              category: 'network',
              message: `HTTP ${response.status}: ${response.statusText}`,
              method: 'fetch',
              url: args[0],
              status: response.status,
              statusText: response.statusText,
              timestamp: Date.now(),
              pageUrl: window.location.href,
              userAgent: navigator.userAgent
            };
            
            this._handleError(errorInfo);
          }
          
          return response;
        } catch (networkError) {
          const errorInfo = {
            category: 'network',
            message: `Network request failed: ${networkError.message}`,
            method: 'fetch',
            url: args[0],
            error: networkError.message,
            stack: networkError.stack,
            timestamp: Date.now(),
            pageUrl: window.location.href,
            userAgent: navigator.userAgent
          };
          
          this._handleError(errorInfo);
          throw networkError; // Re-throw to maintain original behavior
        }
      };
    }

    // Wrap XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._errorHandler_method = method;
      this._errorHandler_url = url;
      return originalXHROpen.call(this, method, url, ...args);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
      this.addEventListener('error', () => {
        const errorInfo = {
          category: 'network',
          message: `XMLHttpRequest failed: ${this._errorHandler_method} ${this._errorHandler_url}`,
          method: this._errorHandler_method || 'unknown',
          url: this._errorHandler_url || 'unknown',
          status: this.status,
          statusText: this.statusText,
          timestamp: Date.now(),
          pageUrl: window.location.href,
          userAgent: navigator.userAgent
        };
        
        this._handleError(errorInfo);
      });
      
      this.addEventListener('load', () => {
        if (this.status >= 400) {
          const errorInfo = {
            category: 'network',
            message: `HTTP ${this.status}: ${this.statusText}`,
            method: this._errorHandler_method || 'unknown',
            url: this._errorHandler_url || 'unknown',
            status: this.status,
            statusText: this.statusText,
            timestamp: Date.now(),
            pageUrl: window.location.href,
            userAgent: navigator.userAgent
          };
          
          this._handleError(errorInfo);
        }
      });
      
      return originalXHRSend.call(this, ...args);
    };
  }

  /**
   * Setup security error handler
   * Catches CORS, CSP, and other security-related errors
   */
  _setupSecurityErrorHandler() {
    // Security policy violations
    document.addEventListener('securitypolicyviolation', (event) => {
      const errorInfo = {
        category: 'security',
        message: `Security Policy Violation: ${event.violatedDirective}`,
        directive: event.violatedDirective,
        blockedUri: event.blockedURI,
        documentUri: event.documentURI,
        originalPolicy: event.originalPolicy,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      this._handleError(errorInfo);
    });
  }

  /**
   * Core error handling logic
   * Processes, categorizes, and reports errors
   */
  _handleError(errorInfo) {
    try {
      // Apply sampling rate
      if (Math.random() > this._sampleRate) {
        return;
      }
      
      // Add session and context information
      const enrichedError = {
        ...errorInfo,
        sessionId: this._sessionId,
        errorId: this._generateErrorId(),
        sessionUptime: Date.now() - this._startTime,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height
        },
        connection: this._getConnectionInfo()
      };
      
      // Track error frequency
      const errorKey = this._getErrorKey(errorInfo);
      const count = (this._errorCounts.get(errorKey) || 0) + 1;
      this._errorCounts.set(errorKey, count);
      enrichedError.occurrenceCount = count;
      
      // Store error (with rotation to prevent memory bloat)
      this._errors.push(enrichedError);
      if (this._errors.length > this._maxErrors) {
        this._errors.shift(); // Remove oldest error
      }
      
      // Determine severity
      enrichedError.severity = this._determineSeverity(errorInfo, count);
      
      // Log error
      const logLevel = enrichedError.severity === 'critical' ? 'error' : 'warn';
      this._auditLogger[logLevel](`${this._errorCategories[errorInfo.category]}`, enrichedError);
      
      // Publish domain event
      if (this._eventBus) {
        this._eventBus.publish(new SystemErrorEvent(
          errorInfo.category,
          enrichedError.message,
          {
            errorInfo: enrichedError,
            severity: enrichedError.severity
          }
        ));
      }
      
      // Report to monitoring service
      this._reportError(enrichedError);
      
    } catch (handlingError) {
      // Failsafe: don't let error handling itself cause issues
      console.error('Error in error handler:', handlingError);
    }
  }

  /**
   * Determine error severity based on category and frequency
   */
  _determineSeverity(errorInfo, occurrenceCount) {
    // Critical errors
    if (errorInfo.category === 'security') return 'critical';
    if (errorInfo.message?.includes('ReferenceError')) return 'critical';
    if (errorInfo.message?.includes('TypeError') && errorInfo.stack) return 'critical';
    
    // High frequency errors are critical
    if (occurrenceCount >= 10) return 'critical';
    
    // High severity errors
    if (errorInfo.category === 'network' && errorInfo.status >= 500) return 'high';
    if (errorInfo.category === 'promise') return 'high';
    if (occurrenceCount >= 5) return 'high';
    
    // Medium severity errors
    if (errorInfo.category === 'network') return 'medium';
    if (errorInfo.category === 'resource') return 'medium';
    
    // Default to low
    return 'low';
  }

  /**
   * Generate unique error key for deduplication
   */
  _getErrorKey(errorInfo) {
    return `${errorInfo.category}_${errorInfo.message}_${errorInfo.filename || 'unknown'}_${errorInfo.lineno || 0}`;
  }

  /**
   * Get network connection information
   */
  _getConnectionInfo() {
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
    return null;
  }

  /**
   * Report error to monitoring endpoint
   */
  _reportError(errorInfo) {
    try {
      if (this._reportingEndpoint) {
        // Use sendBeacon for reliability (works even during page unload)
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            this._reportingEndpoint,
            JSON.stringify(errorInfo)
          );
        } else {
          // Fallback to fetch with no-cors mode
          fetch(this._reportingEndpoint, {
            method: 'POST',
            body: JSON.stringify(errorInfo),
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            }
          }).catch(() => {
            // Silent failure for error reporting to avoid recursive errors
          });
        }
      }
    } catch (error) {
      // Silent failure for error reporting
    }
  }

  /**
   * Manual error reporting for application errors
   */
  reportError(message, details = {}) {
    const errorInfo = {
      category: 'javascript',
      message: message,
      manual: true,
      details: details,
      stack: new Error().stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this._handleError(errorInfo);
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {
      sessionId: this._sessionId,
      totalErrors: this._errors.length,
      sessionUptime: Date.now() - this._startTime,
      errorsByCategory: {},
      errorsBySeverity: {},
      mostFrequentErrors: [],
      recentErrors: this._errors.slice(-10)
    };
    
    // Group by category
    this._errors.forEach(error => {
      stats.errorsByCategory[error.category] = (stats.errorsByCategory[error.category] || 0) + 1;
      stats.errorsBySeverity[error.severity] = (stats.errorsBySeverity[error.severity] || 0) + 1;
    });
    
    // Most frequent errors
    const frequencyMap = Array.from(this._errorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    stats.mostFrequentErrors = frequencyMap.map(([errorKey, count]) => ({
      errorKey,
      count
    }));
    
    return stats;
  }

  /**
   * Generate unique error ID
   */
  _generateErrorId() {
    return 'err_' + Math.random().toString(36).substr(2, 12) + '_' + Date.now();
  }

  /**
   * Generate unique session ID
   */
  _generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
  }

  /**
   * Clear stored errors (useful for testing)
   */
  clearErrors() {
    this._errors = [];
    this._errorCounts.clear();
  }

  /**
   * Get all stored errors
   */
  getErrors() {
    return [...this._errors];
  }
}

/**
 * Create production-ready global error handler
 */
export function createGlobalErrorHandler(options = {}) {
  return new GlobalErrorHandler({
    sampleRate: 1.0, // 100% error reporting
    maxErrors: 100,
    ...options
  });
}