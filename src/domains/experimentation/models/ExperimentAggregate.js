/**
 * Experiment Aggregate Root
 * Domain model for A/B testing experiments
 */

import { AggregateRoot } from '../../../shared-kernel/common/models/ValueObjects.js';
import { ExperimentAssignmentEvent, VariantActivatedEvent } from '../events/ExperimentationEvents.js';

/**
 * Experiment aggregate root
 * Encapsulates experiment configuration and business rules
 */
export class ExperimentAggregate extends AggregateRoot {
  constructor(experimentId, configuration = {}) {
    super(experimentId);
    
    this._experimentId = experimentId;
    this._name = configuration.name || 'Unnamed Experiment';
    this._description = configuration.description || '';
    this._status = configuration.status || 'draft';
    
    // Properly initialize variants from array of objects
    this._variants = new Map();
    if (configuration.variants && Array.isArray(configuration.variants)) {
      configuration.variants.forEach(variant => {
        const variantData = {
          id: variant.id,
          name: variant.name || variant.id,
          description: variant.description || '',
          weight: variant.weight || 0.5,
          changes: variant.changes || {},
          isControl: variant.isControl || false,
          createdAt: Date.now()
        };
        this._variants.set(variant.id, variantData);
      });
    }
    
    this._trafficAllocation = configuration.trafficAllocation || 1.0;
    this._startDate = configuration.startDate || null;
    this._endDate = configuration.endDate || null;
    this._conversionGoals = configuration.conversionGoals || [];
    this._targetingRules = configuration.targetingRules || {};
    this._createdAt = configuration.createdAt || Date.now();
    this._updatedAt = configuration.updatedAt || Date.now();
  }

  /**
   * Add variant to experiment
   */
  addVariant(variantId, variantConfig) {
    if (this._status !== 'draft') {
      throw new Error('Cannot modify variants of active experiment');
    }
    
    if (this._variants.has(variantId)) {
      throw new Error(`Variant ${variantId} already exists`);
    }
    
    const variant = {
      id: variantId,
      name: variantConfig.name || variantId,
      description: variantConfig.description || '',
      weight: variantConfig.weight || 0.5,
      changes: variantConfig.changes || {},
      isControl: variantConfig.isControl || false,
      createdAt: Date.now()
    };
    
    this._variants.set(variantId, variant);
    this._updatedAt = Date.now();
    
    return variant;
  }

  /**
   * Assign user to experiment variant based on business rules
   */
  assignUserToVariant(userId, userContext = {}) {
    if (!this.isActive()) {
      return null;
    }
    
    // Check if user qualifies for experiment
    if (!this._userQualifies(userId, userContext)) {
      return null;
    }
    
    // Check traffic allocation
    if (!this._inTrafficAllocation(userId)) {
      return null;
    }
    
    // Assign to variant based on user ID hash
    const variantId = this._hashUserToVariant(userId);
    const variant = this._variants.get(variantId);
    
    if (!variant) {
      return null;
    }
    
    const assignment = {
      experimentId: this._experimentId,
      variantId: variantId,
      userId: userId,
      assignmentMethod: 'hash',
      timestamp: Date.now(),
      userContext: userContext
    };
    
    // Publish domain event
    this.addDomainEvent(new ExperimentAssignmentEvent(userId, assignment));
    
    return assignment;
  }

  /**
   * Activate variant for user (apply changes)
   */
  activateVariant(userId, variantId) {
    const variant = this._variants.get(variantId);
    if (!variant) {
      throw new Error(`Variant ${variantId} not found`);
    }
    
    const activation = {
      experimentId: this._experimentId,
      variantId: variantId,
      userId: userId,
      changes: variant.changes,
      timestamp: Date.now()
    };
    
    // Publish domain event
    this.addDomainEvent(new VariantActivatedEvent(userId, activation));
    
    return activation;
  }

  /**
   * Check if experiment is active
   */
  isActive() {
    if (this._status !== 'active') {
      return false;
    }
    
    const now = Date.now();
    
    if (this._startDate && now < this._startDate) {
      return false;
    }
    
    if (this._endDate && now > this._endDate) {
      return false;
    }
    
    return true;
  }

  /**
   * Check if user qualifies for experiment based on targeting rules
   */
  _userQualifies(userId, userContext) {
    // Simple qualification logic - can be extended
    if (this._targetingRules.userIds) {
      return this._targetingRules.userIds.includes(userId);
    }
    
    if (this._targetingRules.percentage) {
      const hash = this._hashString(userId);
      return hash < this._targetingRules.percentage;
    }
    
    // Default: all users qualify
    return true;
  }

  /**
   * Check if user is in traffic allocation
   */
  _inTrafficAllocation(userId) {
    if (this._trafficAllocation >= 1.0) {
      return true;
    }
    
    const hash = this._hashString(userId + this._experimentId);
    return hash < this._trafficAllocation;
  }

  /**
   * Hash user ID to variant using consistent hashing
   */
  _hashUserToVariant(userId) {
    const hash = this._hashString(userId + this._experimentId);
    const variants = Array.from(this._variants.keys());
    
    if (variants.length === 0) {
      return null;
    }
    
    // Find control variant (if exists)
    const controlVariant = variants.find(variantId => 
      this._variants.get(variantId).isControl
    );
    
    // Simple 50/50 split logic (can be enhanced for weighted distribution)
    if (variants.length === 2 && controlVariant) {
      return hash < 0.5 ? controlVariant : variants.find(v => v !== controlVariant);
    }
    
    // Equal distribution among all variants
    const variantIndex = Math.floor(hash * variants.length);
    return variants[variantIndex];
  }

  /**
   * Simple string hashing function (returns value between 0 and 1)
   */
  _hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Normalize to 0-1 range
    return Math.abs(hash) / Math.pow(2, 31);
  }

  /**
   * Start experiment
   */
  start(startDate = null) {
    if (this._status === 'active') {
      throw new Error('Experiment is already active');
    }
    
    if (this._variants.size < 2) {
      throw new Error('Experiment must have at least 2 variants');
    }
    
    this._status = 'active';
    this._startDate = startDate || Date.now();
    this._updatedAt = Date.now();
  }

  /**
   * Stop experiment
   */
  stop(endDate = null) {
    if (this._status !== 'active') {
      throw new Error('Can only stop active experiments');
    }
    
    this._status = 'completed';
    this._endDate = endDate || Date.now();
    this._updatedAt = Date.now();
  }

  /**
   * Get experiment configuration
   */
  getConfiguration() {
    return {
      experimentId: this._experimentId,
      name: this._name,
      description: this._description,
      status: this._status,
      variants: Object.fromEntries(this._variants),
      trafficAllocation: this._trafficAllocation,
      startDate: this._startDate,
      endDate: this._endDate,
      conversionGoals: this._conversionGoals,
      targetingRules: this._targetingRules,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  /**
   * Get variants
   */
  getVariants() {
    return Array.from(this._variants.values());
  }

  /**
   * Get specific variant
   */
  getVariant(variantId) {
    return this._variants.get(variantId) || null;
  }
}