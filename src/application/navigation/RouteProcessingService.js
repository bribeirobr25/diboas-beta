/**
 * Route Processing Application Service
 * Orchestrates URL processing using domain services with event-driven approach
 */

import { promises as fs } from 'fs';
import path from 'path';
import { createNavigationService } from '../../infrastructure/navigation/NavigationServiceFactory.js';
import { 
  RouteProcessingStartedEvent, 
  RouteProcessingCompletedEvent 
} from '../../domains/navigation/events/NavigationEvents.js';

/**
 * Application service for processing routes in files
 */
export class RouteProcessingService {
  constructor(navigationService = null, eventBus = null) {
    this._navigationService = navigationService || createNavigationService();
    this._eventBus = eventBus || this._navigationService._eventBus;
    
    // Subscribe to domain events
    this._subscribeToEvents();
  }

  /**
   * Process all files in a directory to replace URL placeholders
   * @param {string} targetPath - Path to process
   * @param {string} environment - Target environment
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} Processing results
   */
  async processDirectory(targetPath, environment, options = {}) {
    const startTime = Date.now();
    
    try {
      // Publish processing started event
      await this._eventBus.publish(new RouteProcessingStartedEvent(
        environment,
        targetPath,
        options.processingType || 'build'
      ));

      // Get all routes for the environment
      const routes = await this._navigationService.getAllRoutes(environment);
      
      // Find files to process
      const filesToProcess = await this._findFilesToProcess(targetPath, options);
      
      let processedCount = 0;
      const results = [];

      for (const filePath of filesToProcess) {
        try {
          const result = await this._processFile(filePath, routes, options);
          if (result.processed) {
            processedCount++;
          }
          results.push(result);
        } catch (error) {
          results.push({
            file: filePath,
            processed: false,
            error: error.message
          });
        }
      }

      const duration = Date.now() - startTime;

      // Publish processing completed event
      await this._eventBus.publish(new RouteProcessingCompletedEvent(
        environment,
        targetPath,
        options.processingType || 'build',
        processedCount,
        duration
      ));

      return {
        success: true,
        processedFiles: processedCount,
        totalFiles: filesToProcess.length,
        duration,
        results
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        success: false,
        error: error.message,
        duration,
        processedFiles: 0,
        totalFiles: 0,
        results: []
      };
    }
  }

  /**
   * Process a single file
   * @param {string} filePath - Path to file
   * @param {Object} routes - Route mappings
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} Processing result
   */
  async _processFile(filePath, routes, options = {}) {
    try {
      // Skip configuration files to prevent corruption
      const fileName = path.basename(filePath);
      const skipFiles = [
        'build-urls.js',
        'url-processor.js',
        'RouteProcessingService.js',
        'NavigationService.js',
        'FileRouteRepository.js'
      ];
      
      if (skipFiles.includes(fileName)) {
        return {
          file: filePath,
          processed: false,
          reason: 'Configuration file skipped'
        };
      }

      // Read file content
      const content = await fs.readFile(filePath, 'utf8');
      
      // Check if file contains URL placeholders
      const placeholderRegex = /\{\{[A-Z_]+_URL\}\}/g;
      const placeholders = content.match(placeholderRegex);
      
      if (!placeholders || placeholders.length === 0) {
        return {
          file: filePath,
          processed: false,
          reason: 'No placeholders found'
        };
      }

      // Replace placeholders with actual URLs
      let processedContent = content;
      let replacementCount = 0;

      for (const placeholder of placeholders) {
        const destination = placeholder.replace(/[{}]/g, '');
        
        if (routes[destination]) {
          const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
          const matches = processedContent.match(regex);
          
          if (matches) {
            processedContent = processedContent.replace(regex, routes[destination]);
            replacementCount += matches.length;
          }
        }
      }

      // Write back to file if changes were made
      if (replacementCount > 0 && !options.dryRun) {
        await fs.writeFile(filePath, processedContent, 'utf8');
      }

      return {
        file: filePath,
        processed: replacementCount > 0,
        replacements: replacementCount,
        placeholders: placeholders.length,
        dryRun: options.dryRun || false
      };

    } catch (error) {
      throw new Error(`Failed to process file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Find files to process in directory
   * @param {string} targetPath - Target directory
   * @param {Object} options - Processing options
   * @returns {Promise<string[]>} Array of file paths
   */
  async _findFilesToProcess(targetPath, options = {}) {
    const files = [];
    const extensions = options.extensions || ['.html', '.js', '.css', '.json'];
    const excludePatterns = options.excludePatterns || [
      /node_modules/,
      /\.git/,
      /config\/build-urls\.js$/,
      /scripts\/url-processor\.js$/,
      /infrastructure.*\.js$/
    ];

    async function scanDirectory(dirPath) {
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);
          
          // Check exclusion patterns
          const shouldExclude = excludePatterns.some(pattern => 
            pattern.test(fullPath.replace(/\\/g, '/'))
          );
          
          if (shouldExclude) {
            continue;
          }

          if (entry.isDirectory()) {
            // Recursively scan subdirectories
            await scanDirectory(fullPath);
          } else if (entry.isFile()) {
            // Check file extension
            const ext = path.extname(entry.name);
            if (extensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories that can't be read
        console.warn(`Cannot read directory ${dirPath}: ${error.message}`);
      }
    }

    await scanDirectory(targetPath);
    return files;
  }

  /**
   * Subscribe to domain events for additional processing
   */
  _subscribeToEvents() {
    // Handle route resolution events
    this._eventBus.subscribe('RouteResolved', async (event) => {
      // Log successful route resolutions
      console.debug(`Route resolved: ${event.destination} -> ${event.resolvedRoute.url}`);
    });

    // Handle route processing events
    this._eventBus.subscribe('RouteProcessingStarted', async (event) => {
      console.log(`Started processing routes for ${event.environment} in ${event.targetPath}`);
    });

    this._eventBus.subscribe('RouteProcessingCompleted', async (event) => {
      console.log(`Completed processing: ${event.processedFileCount} files in ${event.duration}ms`);
    });

    // Handle configuration validation failures
    this._eventBus.subscribe('RouteConfigurationValidationFailed', async (event) => {
      console.error(`Configuration validation failed for ${event.environment}:`, event.errors);
    });

    // Handle route resolution failures
    this._eventBus.subscribe('RouteResolutionFailed', async (event) => {
      console.error(`Route resolution failed: ${event.destination} in ${event.environment}`, event.error.message);
    });
  }

  /**
   * Validate routes before processing
   * @param {string} environment - Target environment
   * @returns {Promise<Object>} Validation result
   */
  async validateRoutes(environment) {
    try {
      // Load configuration to trigger validation
      await this._navigationService.loadConfiguration(environment);
      
      // Get all routes to ensure they're resolvable
      const routes = await this._navigationService.getAllRoutes(environment);
      
      const validation = {
        isValid: true,
        routes: Object.keys(routes),
        errors: []
      };

      // Check that all expected routes are present
      const expectedRoutes = ['HOME_URL', 'APP_URL', 'DOCS_URL', 'LEARN_URL', 'MASCOTS_URL', 'INVESTORS_URL', 'B2B_URL'];
      const missingRoutes = expectedRoutes.filter(route => !routes[route]);
      
      if (missingRoutes.length > 0) {
        validation.isValid = false;
        validation.errors.push(`Missing routes: ${missingRoutes.join(', ')}`);
      }

      // Validate URLs format
      for (const [destination, url] of Object.entries(routes)) {
        if (!url || typeof url !== 'string') {
          validation.isValid = false;
          validation.errors.push(`Invalid URL for ${destination}: ${url}`);
        }
      }

      return validation;

    } catch (error) {
      return {
        isValid: false,
        routes: [],
        errors: [error.message]
      };
    }
  }

  /**
   * Get processing statistics
   * @returns {Object} Processing statistics
   */
  getStatistics() {
    const eventHistory = this._eventBus.getEventHistory?.() || [];
    
    const processingEvents = eventHistory.filter(event => 
      event.eventType.startsWith('RouteProcessing')
    );

    return {
      totalProcessingRuns: processingEvents.filter(e => e.eventType === 'RouteProcessingStarted').length,
      totalEventsPublished: eventHistory.length,
      lastProcessingTime: processingEvents.length > 0 ? 
        Math.max(...processingEvents.map(e => e.occurredAt.getTime())) : null
    };
  }
}