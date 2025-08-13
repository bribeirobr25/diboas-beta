/**
 * Console Audit Logger Implementation
 * Simple console-based implementation of AuditLoggerInterface
 */

import { AuditLoggerInterface } from '../../shared-kernel/common/interfaces/RepositoryContracts.js';

/**
 * Console-based audit logger
 * Suitable for development and simple production environments
 */
export class ConsoleAuditLogger extends AuditLoggerInterface {
  constructor(options = {}) {
    super();
    this._options = {
      includeTimestamp: true,
      includeLevel: true,
      colorized: true,
      logLevel: 'debug', // debug, info, warn, error
      ...options
    };

    // Log level hierarchy
    this._logLevels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    // Console colors
    this._colors = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m',  // green
      warn: '\x1b[33m',  // yellow
      error: '\x1b[31m', // red
      reset: '\x1b[0m'   // reset
    };
  }

  async logBusinessAction(userId, action, data) {
    const logEntry = {
      type: 'business_action',
      timestamp: new Date(),
      userId: userId || 'system',
      action,
      data: data || {},
      source: 'audit'
    };

    this._writeLog('info', `[BUSINESS ACTION] ${action}`, {
      userId: logEntry.userId,
      data: logEntry.data
    });
  }

  async info(message, data = {}) {
    this._writeLog('info', message, data);
  }

  async warn(message, data = {}) {
    this._writeLog('warn', message, data);
  }

  async error(message, data = {}) {
    this._writeLog('error', message, data);
  }

  async debug(message, data = {}) {
    this._writeLog('debug', message, data);
  }

  /**
   * Write log entry to console
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  _writeLog(level, message, data = {}) {
    // Check if this log level should be output
    if (this._logLevels[level] < this._logLevels[this._options.logLevel]) {
      return;
    }

    let logLine = '';

    // Add timestamp
    if (this._options.includeTimestamp) {
      const timestamp = new Date().toISOString();
      logLine += `[${timestamp}] `;
    }

    // Add level
    if (this._options.includeLevel) {
      const levelText = level.toUpperCase().padEnd(5);
      // Browser-compatible TTY check
      const isTTY = typeof process !== 'undefined' && process.stdout && process.stdout.isTTY;
      if (this._options.colorized && isTTY) {
        logLine += `${this._colors[level]}${levelText}${this._colors.reset} `;
      } else {
        logLine += `${levelText} `;
      }
    }

    // Add message
    logLine += message;

    // Choose console method based on level
    const consoleMethod = this._getConsoleMethod(level);
    
    // Output log line
    if (Object.keys(data).length > 0) {
      consoleMethod(logLine, this._formatData(data));
    } else {
      consoleMethod(logLine);
    }
  }

  /**
   * Get appropriate console method for log level
   * @param {string} level - Log level
   * @returns {Function} Console method
   */
  _getConsoleMethod(level) {
    switch (level) {
      case 'error':
        return console.error;
      case 'warn':
        return console.warn;
      case 'debug':
        return console.debug || console.log;
      case 'info':
      default:
        return console.log;
    }
  }

  /**
   * Format data object for display
   * @param {Object} data - Data to format
   * @returns {any} Formatted data
   */
  _formatData(data) {
    if (typeof data === 'object' && data !== null) {
      // Don't stringify if it's a simple object with few keys
      if (Object.keys(data).length <= 3 && this._isSimpleObject(data)) {
        return data;
      }
      
      // Pretty print JSON for complex objects
      try {
        return JSON.stringify(data, null, 2);
      } catch (error) {
        return data;
      }
    }
    
    return data;
  }

  /**
   * Check if object is simple (only primitive values)
   * @param {Object} obj - Object to check
   * @returns {boolean} True if object is simple
   */
  _isSimpleObject(obj) {
    return Object.values(obj).every(value => {
      const type = typeof value;
      return type === 'string' || type === 'number' || type === 'boolean' || value === null;
    });
  }

  /**
   * Update logger options
   * @param {Object} options - New options to merge
   */
  updateOptions(options) {
    this._options = { ...this._options, ...options };
  }

  /**
   * Get current options
   * @returns {Object} Current options
   */
  getOptions() {
    return { ...this._options };
  }

  /**
   * Set log level
   * @param {string} level - New log level
   */
  setLogLevel(level) {
    if (this._logLevels.hasOwnProperty(level)) {
      this._options.logLevel = level;
    } else {
      throw new Error(`Invalid log level: ${level}. Valid levels: ${Object.keys(this._logLevels).join(', ')}`);
    }
  }

  /**
   * Enable or disable colorized output
   * @param {boolean} enabled - True to enable colors
   */
  setColorized(enabled) {
    this._options.colorized = enabled;
  }
}