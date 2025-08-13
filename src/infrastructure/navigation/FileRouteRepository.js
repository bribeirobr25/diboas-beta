/**
 * File-based Route Repository Implementation
 * Concrete implementation that reads route configuration from build-urls.js
 */

import { RouteRepository } from '../../domains/navigation/repositories/RouteRepository.js';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * File-based implementation of RouteRepository
 * Reads configuration from /config/build-urls.js
 */
export class FileRouteRepository extends RouteRepository {
  constructor(configPath = null) {
    super();
    this._configPath = configPath || path.resolve(process.cwd(), 'config', 'build-urls.js');
    this._configCache = new Map();
    this._cacheExpiry = new Map();
    this._cacheTtl = 5 * 60 * 1000; // 5 minutes
  }

  async loadConfiguration(environment) {
    try {
      // Check cache first
      const cached = this._getCachedConfig(environment);
      if (cached) {
        return cached;
      }

      // Dynamically import the configuration module
      const configModule = await import(this._configPath + '?t=' + Date.now());
      
      if (!configModule.getUrlMappings || typeof configModule.getUrlMappings !== 'function') {
        throw new Error('Configuration file must export a getUrlMappings function');
      }

      // Get URL mappings for the environment
      const urlMappings = configModule.getUrlMappings(environment);
      
      // Transform URL mappings to our domain format
      const routes = {};
      for (const [placeholder, url] of Object.entries(urlMappings)) {
        // Convert {{HOME_URL}} to HOME_URL format
        const destination = placeholder.replace(/[{}]/g, '');
        routes[destination] = {
          url,
          metadata: {
            placeholder,
            source: 'file',
            loadedAt: new Date()
          }
        };
      }

      const configuration = {
        environment,
        version: configModule.CONFIG_VERSION || '1.0.0',
        lastModified: await this._getFileModifiedDate(),
        routes,
        metadata: {
          source: 'file',
          configPath: this._configPath,
          loadedAt: new Date()
        }
      };

      // Cache the configuration
      this._setCachedConfig(environment, configuration);

      return configuration;

    } catch (error) {
      throw new Error(`Failed to load configuration for ${environment}: ${error.message}`);
    }
  }

  async saveConfiguration(environment, configuration) {
    // For file-based implementation, we don't support saving back to the config file
    // This would be implemented for database-backed repositories
    throw new Error('FileRouteRepository does not support saving configurations. Configuration is read-only from build-urls.js');
  }

  async configurationExists(environment) {
    try {
      await this.loadConfiguration(environment);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAvailableEnvironments() {
    try {
      // Load the configuration module to check supported environments
      const configModule = await import(this._configPath + '?t=' + Date.now());
      
      if (configModule.SUPPORTED_ENVIRONMENTS && Array.isArray(configModule.SUPPORTED_ENVIRONMENTS)) {
        return configModule.SUPPORTED_ENVIRONMENTS;
      }

      // Default supported environments
      return ['development', 'production', 'staging', 'test'];

    } catch (error) {
      // Fallback to default environments
      return ['development', 'production'];
    }
  }

  async getConfigurationMetadata(environment) {
    try {
      const config = await this.loadConfiguration(environment);
      const stats = await fs.stat(this._configPath);

      return {
        environment,
        version: config.version,
        lastModified: stats.mtime,
        routeCount: Object.keys(config.routes).length,
        source: 'file',
        configPath: this._configPath,
        fileSize: stats.size,
        isReadOnly: true
      };

    } catch (error) {
      return null;
    }
  }

  /**
   * Clear configuration cache
   * @param {string} environment - Optional specific environment to clear
   */
  clearCache(environment = null) {
    if (environment) {
      this._configCache.delete(environment);
      this._cacheExpiry.delete(environment);
    } else {
      this._configCache.clear();
      this._cacheExpiry.clear();
    }
  }

  /**
   * Check if configuration file exists and is readable
   * @returns {Promise<boolean>} True if file exists and is readable
   */
  async isConfigurationFileAccessible() {
    try {
      await fs.access(this._configPath, fs.constants.R_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get configuration file path
   * @returns {string} Absolute path to configuration file
   */
  getConfigurationPath() {
    return this._configPath;
  }

  // Private methods

  _getCachedConfig(environment) {
    const cached = this._configCache.get(environment);
    const expiry = this._cacheExpiry.get(environment);

    if (cached && expiry && Date.now() < expiry) {
      return { ...cached }; // Return copy
    }

    // Clean up expired cache
    if (cached) {
      this._configCache.delete(environment);
      this._cacheExpiry.delete(environment);
    }

    return null;
  }

  _setCachedConfig(environment, configuration) {
    this._configCache.set(environment, { ...configuration });
    this._cacheExpiry.set(environment, Date.now() + this._cacheTtl);
  }

  async _getFileModifiedDate() {
    try {
      const stats = await fs.stat(this._configPath);
      return stats.mtime;
    } catch (error) {
      return new Date();
    }
  }
}