/**
 * Route Repository Interface
 * Abstract repository for route configuration persistence and retrieval
 */

/**
 * Abstract base class for route repositories
 * Defines the contract for route configuration storage
 */
export class RouteRepository {
  /**
   * Load route configuration for a specific environment
   * @param {string} environment - Target environment ('development', 'production', etc.)
   * @returns {Promise<Object>} Route configuration object
   */
  async loadConfiguration(environment) {
    throw new Error('RouteRepository.loadConfiguration must be implemented');
  }

  /**
   * Save route configuration for a specific environment
   * @param {string} environment - Target environment
   * @param {Object} configuration - Route configuration to save
   * @returns {Promise<void>}
   */
  async saveConfiguration(environment, configuration) {
    throw new Error('RouteRepository.saveConfiguration must be implemented');
  }

  /**
   * Check if configuration exists for environment
   * @param {string} environment - Target environment
   * @returns {Promise<boolean>} True if configuration exists
   */
  async configurationExists(environment) {
    throw new Error('RouteRepository.configurationExists must be implemented');
  }

  /**
   * Get all available environments
   * @returns {Promise<string[]>} Array of available environment names
   */
  async getAvailableEnvironments() {
    throw new Error('RouteRepository.getAvailableEnvironments must be implemented');
  }

  /**
   * Validate configuration format
   * @param {Object} configuration - Configuration to validate
   * @returns {Object} Validation result with isValid and errors
   */
  validateConfiguration(configuration) {
    const errors = [];

    if (!configuration) {
      errors.push('Configuration is required');
      return { isValid: false, errors };
    }

    if (!configuration.environment) {
      errors.push('Environment is required in configuration');
    }

    if (!configuration.routes || typeof configuration.routes !== 'object') {
      errors.push('Routes object is required in configuration');
    } else {
      // Validate each route
      for (const [destination, routeConfig] of Object.entries(configuration.routes)) {
        if (!routeConfig.url) {
          errors.push(`URL is required for route: ${destination}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get configuration metadata
   * @param {string} environment - Target environment
   * @returns {Promise<Object>} Configuration metadata
   */
  async getConfigurationMetadata(environment) {
    throw new Error('RouteRepository.getConfigurationMetadata must be implemented');
  }
}

/**
 * In-Memory Route Repository
 * Simple in-memory implementation for testing and development
 */
export class InMemoryRouteRepository extends RouteRepository {
  constructor() {
    super();
    this._configurations = new Map();
  }

  async loadConfiguration(environment) {
    const config = this._configurations.get(environment);
    if (!config) {
      throw new Error(`No configuration found for environment: ${environment}`);
    }
    return { ...config }; // Return copy
  }

  async saveConfiguration(environment, configuration) {
    const validation = this.validateConfiguration(configuration);
    if (!validation.isValid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    this._configurations.set(environment, {
      ...configuration,
      lastModified: new Date(),
      version: configuration.version || '1.0.0'
    });
  }

  async configurationExists(environment) {
    return this._configurations.has(environment);
  }

  async getAvailableEnvironments() {
    return Array.from(this._configurations.keys());
  }

  async getConfigurationMetadata(environment) {
    const config = this._configurations.get(environment);
    if (!config) {
      return null;
    }

    return {
      environment,
      version: config.version,
      lastModified: config.lastModified,
      routeCount: Object.keys(config.routes || {}).length
    };
  }

  // Helper methods for testing
  clear() {
    this._configurations.clear();
  }

  size() {
    return this._configurations.size;
  }
}