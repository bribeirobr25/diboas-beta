/**
 * Experiment Repository Interface
 * Domain repository contract for experiment persistence
 */

import { RepositoryInterface } from '../../../shared-kernel/common/interfaces/RepositoryContracts.js';

/**
 * Repository interface for experiment aggregates
 */
export class ExperimentRepository extends RepositoryInterface {
  constructor() {
    super();
    this._experiments = new Map();
    this._userAssignments = new Map(); // userId -> experimentId -> assignment
  }

  /**
   * Find experiment by ID
   */
  async findById(experimentId) {
    return this._experiments.get(experimentId) || null;
  }

  /**
   * Find all active experiments
   */
  async findActiveExperiments() {
    return Array.from(this._experiments.values()).filter(experiment => 
      experiment.isActive()
    );
  }

  /**
   * Find experiments by status
   */
  async findByStatus(status) {
    return Array.from(this._experiments.values()).filter(experiment => 
      experiment.getConfiguration().status === status
    );
  }

  /**
   * Save experiment
   */
  async save(experimentAggregate) {
    if (!experimentAggregate) {
      throw new Error('Experiment aggregate is required');
    }
    
    const config = experimentAggregate.getConfiguration();
    this._experiments.set(config.experimentId, experimentAggregate);
    
    return experimentAggregate;
  }

  /**
   * Delete experiment
   */
  async delete(experimentId) {
    const deleted = this._experiments.delete(experimentId);
    
    // Clean up user assignments
    this._userAssignments.forEach((experiments, userId) => {
      experiments.delete(experimentId);
      if (experiments.size === 0) {
        this._userAssignments.delete(userId);
      }
    });
    
    return deleted;
  }

  /**
   * Find all experiments
   */
  async findAll() {
    return Array.from(this._experiments.values());
  }

  /**
   * Save user experiment assignment
   */
  async saveUserAssignment(userId, experimentId, assignment) {
    if (!this._userAssignments.has(userId)) {
      this._userAssignments.set(userId, new Map());
    }
    
    this._userAssignments.get(userId).set(experimentId, {
      ...assignment,
      savedAt: Date.now()
    });
  }

  /**
   * Get user experiment assignment
   */
  async getUserAssignment(userId, experimentId) {
    const userExperiments = this._userAssignments.get(userId);
    if (!userExperiments) {
      return null;
    }
    
    return userExperiments.get(experimentId) || null;
  }

  /**
   * Get all user assignments
   */
  async getUserAssignments(userId) {
    const userExperiments = this._userAssignments.get(userId);
    if (!userExperiments) {
      return [];
    }
    
    return Array.from(userExperiments.entries()).map(([experimentId, assignment]) => ({
      experimentId,
      ...assignment
    }));
  }

  /**
   * Find experiments user is assigned to
   */
  async findUserExperiments(userId) {
    const assignments = await this.getUserAssignments(userId);
    const experiments = [];
    
    for (const assignment of assignments) {
      const experiment = await this.findById(assignment.experimentId);
      if (experiment) {
        experiments.push({
          experiment,
          assignment
        });
      }
    }
    
    return experiments;
  }

  /**
   * Check if user is in experiment
   */
  async isUserInExperiment(userId, experimentId) {
    const assignment = await this.getUserAssignment(userId, experimentId);
    return assignment !== null;
  }

  /**
   * Get experiment statistics
   */
  async getExperimentStats(experimentId) {
    const experiment = await this.findById(experimentId);
    if (!experiment) {
      return null;
    }
    
    // Count assignments per variant
    const variantCounts = new Map();
    experiment.getVariants().forEach(variant => {
      variantCounts.set(variant.id, 0);
    });
    
    // Count user assignments
    let totalAssignments = 0;
    this._userAssignments.forEach((experiments) => {
      const assignment = experiments.get(experimentId);
      if (assignment) {
        totalAssignments++;
        const currentCount = variantCounts.get(assignment.variantId) || 0;
        variantCounts.set(assignment.variantId, currentCount + 1);
      }
    });
    
    return {
      experimentId,
      totalAssignments,
      variantCounts: Object.fromEntries(variantCounts),
      lastUpdated: Date.now()
    };
  }

  /**
   * Clear all data (for testing)
   */
  async clear() {
    this._experiments.clear();
    this._userAssignments.clear();
  }

  /**
   * Get repository size
   */
  async size() {
    return this._experiments.size;
  }
}