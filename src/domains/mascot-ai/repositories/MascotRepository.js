/**
 * Mascot Domain Repository Interface
 * Repository for mascot personalities and interactions
 */

import { BaseRepository } from '../../../shared-kernel/common/interfaces/RepositoryContracts.js';

/**
 * In-memory mascot repository implementation
 */
export class InMemoryMascotRepository extends BaseRepository {
  constructor() {
    super();
    this._personalities = new Map(); // userId:mascotType -> personality data
    this._interactions = new Map(); // userId:mascotType -> array of interactions
  }

  async findById(id) {
    return this._personalities.get(id) || null;
  }

  async save(personalityData) {
    const id = `${personalityData.userId}:${personalityData.mascotType}`;
    this._personalities.set(id, {
      ...personalityData,
      lastSaved: new Date()
    });
    return personalityData;
  }

  async delete(id) {
    const existed = this._personalities.has(id);
    if (existed) {
      this._personalities.delete(id);
      // Also delete related interactions
      this._interactions.delete(id);
    }
    return existed;
  }

  async findAll(filters = {}) {
    const results = [];
    for (const [id, personality] of this._personalities) {
      let include = true;
      
      if (filters.userId && !id.startsWith(filters.userId + ':')) {
        include = false;
      }
      
      if (filters.mascotType && !id.endsWith(':' + filters.mascotType)) {
        include = false;
      }
      
      if (include) {
        results.push(personality);
      }
    }
    return results;
  }

  /**
   * Get mascot interactions for user
   * @param {string} userId - User ID
   * @param {string} mascotType - Mascot type
   * @returns {Promise<Array>} Interaction history
   */
  async getUserInteractions(userId, mascotType) {
    const key = `${userId}:${mascotType}`;
    return this._interactions.get(key) || [];
  }

  /**
   * Save mascot interaction
   * @param {string} userId - User ID
   * @param {Object} interaction - Interaction data
   * @returns {Promise<Object>} Saved interaction
   */
  async saveInteraction(userId, interaction) {
    const key = `${userId}:${interaction.mascotType}`;
    
    if (!this._interactions.has(key)) {
      this._interactions.set(key, []);
    }
    
    const interactions = this._interactions.get(key);
    interactions.push({
      ...interaction,
      savedAt: new Date()
    });
    
    // Keep only last 100 interactions per user/mascot
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100);
    }
    
    return interaction;
  }

  /**
   * Get mascot personality data
   * @param {string} mascotType - Mascot type
   * @returns {Promise<Object>} Personality configuration
   */
  async getMascotPersonality(mascotType) {
    // For now, return null - personalities are user-specific
    // This could be enhanced to return default personality templates
    return null;
  }

  /**
   * Get mascot dialogue templates
   * @param {string} mascotType - Mascot type
   * @param {string} context - Interaction context
   * @returns {Promise<Array>} Dialogue templates
   */
  async getDialogueTemplates(mascotType, context) {
    // This would typically load from a template repository
    // For now, return empty array - templates are in personality classes
    return [];
  }

  /**
   * Get interaction statistics
   * @param {string} userId - User ID
   * @param {string} mascotType - Mascot type
   * @returns {Promise<Object>} Interaction statistics
   */
  async getInteractionStatistics(userId, mascotType) {
    const interactions = await this.getUserInteractions(userId, mascotType);
    
    const stats = {
      totalInteractions: interactions.length,
      interactionTypes: {},
      averageResponseTime: 0,
      lastInteraction: null
    };
    
    if (interactions.length > 0) {
      stats.lastInteraction = interactions[interactions.length - 1].timestamp;
      
      // Count interaction types
      interactions.forEach(interaction => {
        const type = interaction.type || 'unknown';
        stats.interactionTypes[type] = (stats.interactionTypes[type] || 0) + 1;
      });
    }
    
    return stats;
  }

  /**
   * Clear old interactions
   * @param {number} daysOld - Days old to keep
   * @returns {Promise<number>} Number of interactions cleared
   */
  async clearOldInteractions(daysOld = 30) {
    const cutoffDate = new Date(Date.now() - (daysOld * 24 * 60 * 60 * 1000));
    let cleared = 0;
    
    for (const [key, interactions] of this._interactions) {
      const originalLength = interactions.length;
      const filtered = interactions.filter(
        interaction => new Date(interaction.timestamp) > cutoffDate
      );
      
      this._interactions.set(key, filtered);
      cleared += originalLength - filtered.length;
    }
    
    return cleared;
  }
}