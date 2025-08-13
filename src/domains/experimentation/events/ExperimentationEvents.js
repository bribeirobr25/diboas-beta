/**
 * Experimentation Domain Events
 * Domain events for A/B testing and experimentation
 */

import { BaseDomainEvent } from '../../../shared-kernel/common/events/DomainEvents.js';

/**
 * Event fired when user is assigned to an experiment variant
 */
export class ExperimentAssignmentEvent extends BaseDomainEvent {
  constructor(userId, experimentData) {
    super('ExperimentAssignment', userId, {
      eventType: 'ExperimentAssignment',
      experimentId: experimentData.experimentId,
      variantId: experimentData.variantId,
      assignmentMethod: experimentData.assignmentMethod,
      timestamp: Date.now(),
      ...experimentData
    });
  }
}

/**
 * Event fired when experiment variant is activated/applied
 */
export class VariantActivatedEvent extends BaseDomainEvent {
  constructor(userId, variantData) {
    super('VariantActivated', userId, {
      eventType: 'VariantActivated',
      experimentId: variantData.experimentId,
      variantId: variantData.variantId,
      changes: variantData.changes,
      timestamp: Date.now(),
      ...variantData
    });
  }
}

/**
 * Event fired when experiment conversion goal is reached
 */
export class ExperimentConversionEvent extends BaseDomainEvent {
  constructor(userId, conversionData) {
    super('ExperimentConversion', userId, {
      eventType: 'ExperimentConversion',
      experimentId: conversionData.experimentId,
      variantId: conversionData.variantId,
      conversionType: conversionData.conversionType,
      value: conversionData.value,
      timestamp: Date.now(),
      ...conversionData
    });
  }
}