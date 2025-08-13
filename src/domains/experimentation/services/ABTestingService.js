/**
 * A/B Testing Domain Service
 * Core business logic for experiment management and user assignment
 */

import { ExperimentAggregate } from '../models/ExperimentAggregate.js';
import { ExperimentRepository } from '../repositories/ExperimentRepository.js';
import { ExperimentAssignmentEvent, VariantActivatedEvent, ExperimentConversionEvent } from '../events/ExperimentationEvents.js';

/**
 * A/B Testing service for experiment management and variant assignment
 */
export class ABTestingService {
  constructor(experimentRepository = null, eventBus = null, options = {}) {
    this._repository = experimentRepository || new ExperimentRepository();
    this._eventBus = eventBus;
    this._options = {
      enableAutoAssignment: options.enableAutoAssignment !== false,
      persistAssignments: options.persistAssignments !== false,
      debugMode: options.debugMode || false,
      ...options
    };
    
    // Cache for active experiments
    this._activeExperimentsCache = null;
    this._cacheExpiry = null;
    this._cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Create new experiment
   */
  async createExperiment(experimentConfig) {
    // Create experiment (constructor handles variants automatically)
    const experiment = new ExperimentAggregate(experimentConfig.id, experimentConfig);
    
    // Save to repository
    await this._repository.save(experiment);
    
    if (this._options.debugMode) {
      console.log('📊 A/B Test Created:', {
        experimentId: experimentConfig.id,
        variants: experiment.getVariants().length
      });
    }
    
    return experiment;
  }

  /**
   * Get experiment by ID
   */
  async getExperiment(experimentId) {
    return await this._repository.findById(experimentId);
  }

  /**
   * Start experiment
   */
  async startExperiment(experimentId, startDate = null) {
    const experiment = await this._repository.findById(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }
    
    experiment.start(startDate);
    await this._repository.save(experiment);
    
    // Invalidate cache
    this._invalidateActiveExperimentsCache();
    
    if (this._options.debugMode) {
      console.log('🚀 A/B Test Started:', { experimentId });
    }
    
    return experiment;
  }

  /**
   * Stop experiment
   */
  async stopExperiment(experimentId, endDate = null) {
    const experiment = await this._repository.findById(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }
    
    experiment.stop(endDate);
    await this._repository.save(experiment);
    
    // Invalidate cache
    this._invalidateActiveExperimentsCache();
    
    if (this._options.debugMode) {
      console.log('⏹️ A/B Test Stopped:', { experimentId });
    }
    
    return experiment;
  }

  /**
   * Assign user to experiment variants (main entry point)
   */
  async assignUserToExperiments(userId, userContext = {}) {
    const activeExperiments = await this._getActiveExperiments();
    const assignments = [];
    
    for (const experiment of activeExperiments) {
      try {
        const assignment = await this._assignUserToExperiment(userId, experiment, userContext);
        if (assignment) {
          assignments.push(assignment);
        }
      } catch (error) {
        if (this._options.debugMode) {
          console.warn('❌ Assignment failed:', {
            experimentId: experiment.getConfiguration().experimentId,
            userId,
            error: error.message
          });
        }
      }
    }
    
    if (this._options.debugMode && assignments.length > 0) {
      console.log('🎯 User Assigned to Experiments:', {
        userId,
        assignments: assignments.length,
        experiments: assignments.map(a => a.experimentId)
      });
    }
    
    return assignments;
  }

  /**
   * Assign user to specific experiment
   */
  async assignUserToExperiment(userId, experimentId, userContext = {}) {
    const experiment = await this._repository.findById(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }
    
    return await this._assignUserToExperiment(userId, experiment, userContext);
  }

  /**
   * Get user's current assignments
   */
  async getUserAssignments(userId) {
    return await this._repository.getUserAssignments(userId);
  }

  /**
   * Get user's assignment for specific experiment
   */
  async getUserExperimentAssignment(userId, experimentId) {
    return await this._repository.getUserAssignment(userId, experimentId);
  }

  /**
   * Apply variant changes for user (activate experiments)
   */
  async activateUserVariants(userId) {
    const assignments = await this.getUserAssignments(userId);
    const activatedVariants = [];
    
    for (const assignment of assignments) {
      try {
        const experiment = await this._repository.findById(assignment.experimentId);
        if (experiment && experiment.isActive()) {
          const activation = experiment.activateVariant(userId, assignment.variantId);
          activatedVariants.push(activation);
          
          // Publish domain events
          if (this._eventBus) {
            const events = experiment.getUncommittedEvents();
            for (const event of events) {
              await this._eventBus.publish(event);
            }
            experiment.markEventsAsCommitted();
          }
        }
      } catch (error) {
        if (this._options.debugMode) {
          console.warn('❌ Variant activation failed:', {
            experimentId: assignment.experimentId,
            variantId: assignment.variantId,
            userId,
            error: error.message
          });
        }
      }
    }
    
    if (this._options.debugMode && activatedVariants.length > 0) {
      console.log('✨ Variants Activated:', {
        userId,
        variants: activatedVariants.length
      });
    }
    
    return activatedVariants;
  }

  /**
   * Track conversion event
   */
  async trackConversion(userId, conversionType, conversionValue = null, metadata = {}) {
    const assignments = await this.getUserAssignments(userId);
    
    for (const assignment of assignments) {
      const conversionData = {
        experimentId: assignment.experimentId,
        variantId: assignment.variantId,
        conversionType,
        value: conversionValue,
        metadata,
        userId
      };
      
      if (this._eventBus) {
        await this._eventBus.publish(new ExperimentConversionEvent(userId, conversionData));
      }
      
      if (this._options.debugMode) {
        console.log('📈 Conversion Tracked:', {
          userId,
          experimentId: assignment.experimentId,
          variantId: assignment.variantId,
          conversionType
        });
      }
    }
  }

  /**
   * Get experiment statistics
   */
  async getExperimentStats(experimentId) {
    return await this._repository.getExperimentStats(experimentId);
  }

  /**
   * Get all experiments (active and inactive)
   */
  async getAllExperiments() {
    return await this._repository.findAll();
  }

  /**
   * Get all active experiments
   */
  async getActiveExperiments() {
    return await this._getActiveExperiments();
  }

  /**
   * Check if feature flag is enabled for user (simple variant of A/B testing)
   */
  async isFeatureEnabled(userId, featureName) {
    const assignment = await this.getUserExperimentAssignment(userId, featureName);
    
    if (assignment && assignment.variantId === 'enabled') {
      return true;
    }
    
    // Check if user should be assigned to feature flag experiment
    const experiment = await this._repository.findById(featureName);
    if (experiment && experiment.isActive()) {
      const newAssignment = await this._assignUserToExperiment(userId, experiment);
      return newAssignment && newAssignment.variantId === 'enabled';
    }
    
    return false;
  }

  // ===============================
  // PRIVATE METHODS
  // ===============================

  /**
   * Internal method to assign user to experiment
   */
  async _assignUserToExperiment(userId, experiment, userContext = {}) {
    const experimentId = experiment.getConfiguration().experimentId;
    
    // Check if user already assigned
    if (this._options.persistAssignments) {
      const existingAssignment = await this._repository.getUserAssignment(userId, experimentId);
      if (existingAssignment) {
        return existingAssignment;
      }
    }
    
    // Assign user to variant
    const assignment = experiment.assignUserToVariant(userId, userContext);
    if (!assignment) {
      return null; // User doesn't qualify or experiment not active
    }
    
    // Save assignment
    if (this._options.persistAssignments) {
      await this._repository.saveUserAssignment(userId, experimentId, assignment);
    }
    
    // Publish domain events
    if (this._eventBus) {
      const events = experiment.getUncommittedEvents();
      for (const event of events) {
        await this._eventBus.publish(event);
      }
      experiment.markEventsAsCommitted();
    }
    
    return assignment;
  }

  /**
   * Get active experiments with caching
   */
  async _getActiveExperiments() {
    const now = Date.now();
    
    // Return cached experiments if still valid
    if (this._activeExperimentsCache && this._cacheExpiry && now < this._cacheExpiry) {
      return this._activeExperimentsCache;
    }
    
    // Refresh cache
    this._activeExperimentsCache = await this._repository.findActiveExperiments();
    this._cacheExpiry = now + this._cacheTimeout;
    
    return this._activeExperimentsCache;
  }

  /**
   * Invalidate active experiments cache
   */
  _invalidateActiveExperimentsCache() {
    this._activeExperimentsCache = null;
    this._cacheExpiry = null;
  }
}

/**
 * Create A/B testing service with default configuration
 */
export function createABTestingService(options = {}) {
  return new ABTestingService(null, null, {
    enableAutoAssignment: true,
    persistAssignments: true,
    debugMode: false,
    ...options
  });
}