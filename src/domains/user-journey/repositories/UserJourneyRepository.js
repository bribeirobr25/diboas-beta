/**
 * User Journey Domain Repository Interface
 * Repository for user journey data and progression
 */

import { BaseRepository } from '../../../shared-kernel/common/interfaces/RepositoryContracts.js';

/**
 * In-memory user journey repository implementation
 */
export class InMemoryUserJourneyRepository extends BaseRepository {
  constructor() {
    super();
    this._users = new Map(); // userId -> user journey data
    this._achievements = new Map(); // userId -> achievements array
    this._lessons = new Map(); // userId -> completed lessons array
  }

  async findById(userId) {
    return this._users.get(userId) || null;
  }

  async save(userJourneyData) {
    this._users.set(userJourneyData.userId, {
      ...userJourneyData,
      lastSaved: new Date()
    });
    return userJourneyData;
  }

  async delete(userId) {
    const existed = this._users.has(userId);
    if (existed) {
      this._users.delete(userId);
      this._achievements.delete(userId);
      this._lessons.delete(userId);
    }
    return existed;
  }

  async findAll(filters = {}) {
    const results = [];
    for (const [userId, userData] of this._users) {
      let include = true;
      
      if (filters.phase && userData.currentPhase !== filters.phase) {
        include = false;
      }
      
      if (filters.minAchievements && userData.achievements.length < filters.minAchievements) {
        include = false;
      }
      
      if (filters.language && userData.preferences?.language !== filters.language) {
        include = false;
      }
      
      if (include) {
        results.push(userData);
      }
    }
    return results;
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User or null
   */
  async findByEmail(email) {
    for (const [userId, userData] of this._users) {
      if (userData.email === email) {
        return userData;
      }
    }
    return null;
  }

  /**
   * Update user preferences
   * @param {string} userId - User ID
   * @param {Object} preferences - User preferences
   * @returns {Promise<Object>} Updated user
   */
  async updateUserPreferences(userId, preferences) {
    const userData = await this.findById(userId);
    if (!userData) {
      throw new Error(`User not found: ${userId}`);
    }

    userData.preferences = {
      ...userData.preferences,
      ...preferences
    };

    return await this.save(userData);
  }

  /**
   * Get user journey progress
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Journey progress data
   */
  async getUserJourneyProgress(userId) {
    const userData = await this.findById(userId);
    if (!userData) {
      return null;
    }

    const daysSinceStart = Math.floor(
      (Date.now() - new Date(userData.startedAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      userId,
      currentPhase: userData.currentPhase,
      journeyProgress: this._calculateProgress(userData),
      daysSinceStart,
      achievements: userData.achievements.length,
      lessonsCompleted: userData.completedLessons.length,
      featuresUnlocked: userData.unlockedFeatures.length
    };
  }

  /**
   * Update user phase
   * @param {string} userId - User ID
   * @param {number} phase - New phase level
   * @returns {Promise<Object>} Updated user
   */
  async updateUserPhase(userId, phase) {
    const userData = await this.findById(userId);
    if (!userData) {
      throw new Error(`User not found: ${userId}`);
    }

    userData.currentPhase = phase;
    userData.confidenceLevel = phase; // Sync confidence with phase
    userData.lastActiveAt = new Date().toISOString();
    userData.version = (userData.version || 1) + 1;

    return await this.save(userData);
  }

  /**
   * Add achievement to user
   * @param {string} userId - User ID
   * @param {string} achievementId - Achievement identifier
   * @param {Object} achievementData - Achievement data
   * @returns {Promise<Object>} Updated user
   */
  async addUserAchievement(userId, achievementId, achievementData = {}) {
    const userData = await this.findById(userId);
    if (!userData) {
      throw new Error(`User not found: ${userId}`);
    }

    if (!userData.achievements.includes(achievementId)) {
      userData.achievements.push(achievementId);
      userData.lastActiveAt = new Date().toISOString();
      userData.version = (userData.version || 1) + 1;
    }

    return await this.save(userData);
  }

  /**
   * Complete lesson for user
   * @param {string} userId - User ID
   * @param {string} lessonId - Lesson identifier
   * @param {Object} completionData - Completion data
   * @returns {Promise<Object>} Updated user
   */
  async completeUserLesson(userId, lessonId, completionData = {}) {
    const userData = await this.findById(userId);
    if (!userData) {
      throw new Error(`User not found: ${userId}`);
    }

    if (!userData.completedLessons.includes(lessonId)) {
      userData.completedLessons.push(lessonId);
      userData.lastActiveAt = new Date().toISOString();
      userData.version = (userData.version || 1) + 1;

      // Update behavior profile if provided
      if (completionData.timeSpent || completionData.learningStyle) {
        userData.behaviorProfile = {
          ...userData.behaviorProfile,
          interactionCount: (userData.behaviorProfile.interactionCount || 0) + 1
        };

        if (completionData.timeSpent) {
          const avgDuration = userData.behaviorProfile.avgSessionDuration || 0;
          userData.behaviorProfile.avgSessionDuration = 
            (avgDuration + completionData.timeSpent) / 2;
        }

        if (completionData.learningStyle) {
          userData.behaviorProfile.preferredLearningStyle = completionData.learningStyle;
        }
      }
    }

    return await this.save(userData);
  }

  /**
   * Get users by phase
   * @param {number} phase - Phase level
   * @returns {Promise<Array>} Users in specified phase
   */
  async getUsersByPhase(phase) {
    return await this.findAll({ phase });
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} Platform statistics
   */
  async getUserStatistics() {
    const allUsers = await this.findAll();
    
    const stats = {
      totalUsers: allUsers.length,
      usersByPhase: { 1: 0, 2: 0, 3: 0, 4: 0 },
      averageAchievements: 0,
      averageLessonsCompleted: 0,
      activeUsers: 0, // Active in last 7 days
      languageDistribution: {}
    };

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    allUsers.forEach(user => {
      // Phase distribution
      stats.usersByPhase[user.currentPhase] = 
        (stats.usersByPhase[user.currentPhase] || 0) + 1;

      // Achievements
      stats.averageAchievements += user.achievements.length;

      // Lessons
      stats.averageLessonsCompleted += user.completedLessons.length;

      // Active users
      if (new Date(user.lastActiveAt) > oneWeekAgo) {
        stats.activeUsers++;
      }

      // Language distribution
      const language = user.preferences?.language || 'en';
      stats.languageDistribution[language] = 
        (stats.languageDistribution[language] || 0) + 1;
    });

    if (allUsers.length > 0) {
      stats.averageAchievements = Math.round(stats.averageAchievements / allUsers.length);
      stats.averageLessonsCompleted = Math.round(stats.averageLessonsCompleted / allUsers.length);
    }

    return stats;
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  _calculateProgress(userData) {
    const totalPhases = 4;
    const baseProgress = ((userData.currentPhase - 1) / totalPhases) * 100;
    
    // Add bonus progress for achievements and lessons
    const achievementBonus = Math.min(userData.achievements.length * 2, 25);
    const lessonBonus = Math.min(userData.completedLessons.length * 1, 25);
    
    return Math.min(baseProgress + achievementBonus + lessonBonus, 100);
  }
}