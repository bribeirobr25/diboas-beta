/**
 * diBoaS OneFi Platform - Clean Implementation
 * Phase 3: Enterprise Development - Complete Rewrite
 * 
 * Features: Clean behavioral intelligence, Progressive disclosure, Reliable initialization
 * Performance: Optimized, error-resistant, minimal complexity
 * Accessibility: WCAG 2.1 AA compliant
 */

'use strict';

// ===========================
// CLEAN ONEFI PLATFORM
// ===========================

class DiBoaSCleanApp {
  constructor() {
    this.initialized = false;
    this.state = {
      // Core State
      currentView: 'dashboard',
      theme: localStorage.getItem('diboas_theme') || 'light',
      
      // User Progress
      userLevel: localStorage.getItem('diboas_user_level') || 'beginner',
      interactionCount: parseInt(localStorage.getItem('diboas_interactions')) || 0,
      
      // UI State
      sidebarCollapsed: false,
      mobileNavOpen: false,
      
      // Mascot State
      mascotMessages: {
        beginner: "Welcome! I'm Aqua. Let's start your crypto journey together.",
        intermediate: "Great progress! Ready to explore more features?",
        advanced: "You're becoming a pro! Let's unlock advanced tools."
      }
    };
    
    this.config = {
      levelThresholds: {
        intermediate: 50,
        advanced: 200
      },
      saveInterval: 30000 // 30 seconds
    };
    
    this.init();
  }
  
  /**
   * Initialize application
   */
  async init() {
    try {
      console.log('🚀 Initializing diBoaS Clean Platform');
      
      // Wait for DOM
      await this.waitForDOM();
      
      // Initialize components step by step
      this.initializeTheme();
      this.initializeNavigation();
      this.initializeMascot();
      this.initializeUserInterface();
      this.initializeInteractionTracking();
      this.startPeriodicSave();
      
      // Hide loading screen
      this.hideLoadingScreen();
      
      this.initialized = true;
      console.log('✅ Clean platform initialized successfully');
      
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      this.initializeFallbackMode();
    }
  }
  
  /**
   * Wait for DOM to be ready
   */
  waitForDOM() {
    return new Promise(resolve => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }
  
  /**
   * Initialize theme system
   */
  initializeTheme() {
    document.documentElement.setAttribute('data-theme', this.state.theme);
    document.body.setAttribute('data-confidence-level', this.state.userLevel);
    
    console.log(`🎨 Theme initialized: ${this.state.theme}, Level: ${this.state.userLevel}`);
  }
  
  /**
   * Initialize navigation system
   */
  initializeNavigation() {
    // Setup navigation clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        if (view) {
          this.navigateToView(view);
          this.trackInteraction('navigation', view);
        }
      });
    });
    
    // Setup sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }
    
    // Setup mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    console.log('🧭 Navigation initialized');
  }
  
  /**
   * Initialize mascot system
   */
  initializeMascot() {
    this.updateMascotDisplay();
    
    // Setup mascot chat button
    const chatBtn = document.getElementById('mascotChatBtn');
    if (chatBtn) {
      chatBtn.addEventListener('click', () => {
        this.showMascotMessage();
        this.trackInteraction('mascot_chat');
      });
    }
    
    console.log('🌊 Mascot system initialized');
  }
  
  /**
   * Initialize user interface
   */
  initializeUserInterface() {
    // Setup action buttons
    this.setupActionButtons();
    
    // Setup profile dropdown
    this.setupProfileDropdown();
    
    // Setup search
    this.setupSearchSystem();
    
    // Update progress indicators
    this.updateProgressIndicators();
    
    console.log('🎯 User interface initialized');
  }
  
  /**
   * Setup action buttons
   */
  setupActionButtons() {
    // Buy crypto button
    const buyBtns = document.querySelectorAll('[onclick*="openQuickBuyModal"], .action-simple.primary');
    buyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openBuyModal();
        this.trackInteraction('buy_crypto_click');
      });
    });
    
    // Learn buttons
    const learnBtns = document.querySelectorAll('[onclick*="openLearningModal"], .action-simple:not(.primary)');
    learnBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLearningModal();
        this.trackInteraction('learn_click');
      });
    });
  }
  
  /**
   * Setup profile dropdown
   */
  setupProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = profileDropdown.style.display === 'block';
        profileDropdown.style.display = isOpen ? 'none' : 'block';
        profileBtn.setAttribute('aria-expanded', !isOpen);
      });
      
      // Close on outside click
      document.addEventListener('click', () => {
        profileDropdown.style.display = 'none';
        profileBtn.setAttribute('aria-expanded', 'false');
      });
    }
  }
  
  /**
   * Setup search system
   */
  setupSearchSystem() {
    const searchInput = document.getElementById('globalSearch');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (searchInput) {
      searchInput.addEventListener('focus', () => {
        if (searchSuggestions) {
          searchSuggestions.style.display = 'block';
        }
      });
      
      searchInput.addEventListener('blur', () => {
        setTimeout(() => {
          if (searchSuggestions) {
            searchSuggestions.style.display = 'none';
          }
        }, 200);
      });
      
      searchInput.addEventListener('input', (e) => {
        if (e.target.value) {
          this.trackInteraction('search', e.target.value);
        }
      });
    }
  }
  
  /**
   * Initialize interaction tracking
   */
  initializeInteractionTracking() {
    // Track general clicks
    document.addEventListener('click', (e) => {
      this.trackInteraction('click', e.target.tagName);
    });
    
    // Track form interactions
    document.addEventListener('submit', (e) => {
      this.trackInteraction('form_submit', e.target.id || 'unknown');
    });
    
    console.log('📊 Interaction tracking initialized');
  }
  
  /**
   * Navigate to a specific view
   */
  navigateToView(view) {
    // Update active navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-view="${view}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
      pageTitle.textContent = this.getViewTitle(view);
    }
    
    // Update state
    this.state.currentView = view;
    
    // Show view (if multiple views exist)
    this.showView(view);
    
    console.log(`📱 Navigated to: ${view}`);
  }
  
  /**
   * Get title for view
   */
  getViewTitle(view) {
    const titles = {
      'dashboard': 'Dashboard',
      'buy': 'Buy Crypto',
      'learn': 'Learn & Earn',
      'settings': 'Settings',
      'portfolio': 'Portfolio'
    };
    return titles[view] || 'Dashboard';
  }
  
  /**
   * Show specific view (if multiple content views exist)
   */
  showView(view) {
    const views = document.querySelectorAll('.content-view');
    views.forEach(v => {
      v.style.display = 'none';
      v.classList.remove('active');
    });
    
    const activeView = document.getElementById(`${view}View`) || document.querySelector(`[data-view="${view}"]`);
    if (activeView) {
      activeView.style.display = 'block';
      activeView.classList.add('active');
    }
  }
  
  /**
   * Track user interactions
   */
  trackInteraction(type, data = null) {
    this.state.interactionCount++;
    
    // Check for level progression
    const oldLevel = this.state.userLevel;
    const newLevel = this.calculateUserLevel();
    
    if (newLevel !== oldLevel) {
      this.levelUp(oldLevel, newLevel);
    }
    
    // Update UI
    this.updateProgressIndicators();
    
    console.log(`📊 Interaction: ${type}`, data);
  }
  
  /**
   * Calculate user level based on interactions
   */
  calculateUserLevel() {
    const count = this.state.interactionCount;
    
    if (count >= this.config.levelThresholds.advanced) {
      return 'advanced';
    } else if (count >= this.config.levelThresholds.intermediate) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }
  
  /**
   * Handle level up
   */
  levelUp(oldLevel, newLevel) {
    this.state.userLevel = newLevel;
    
    // Update UI attributes
    document.body.setAttribute('data-confidence-level', newLevel);
    
    // Update mascot
    this.updateMascotDisplay();
    
    // Show celebration notification
    this.showLevelUpNotification(oldLevel, newLevel);
    
    // Save progress
    this.saveProgress();
    
    console.log(`🎉 Level up! ${oldLevel} → ${newLevel}`);
  }
  
  /**
   * Update mascot display
   */
  updateMascotDisplay() {
    const mascotSpeech = document.getElementById('mascotSpeech');
    const mascotName = document.getElementById('currentMascotName');
    const mascotLevel = document.getElementById('currentMascotLevel');
    
    if (mascotSpeech) {
      mascotSpeech.textContent = this.state.mascotMessages[this.state.userLevel];
    }
    
    if (mascotName) {
      mascotName.textContent = 'Aqua';
    }
    
    if (mascotLevel) {
      const levels = {
        'beginner': 'Beginner Guide',
        'intermediate': 'Growth Partner',
        'advanced': 'Expert Advisor'
      };
      mascotLevel.textContent = levels[this.state.userLevel];
    }
  }
  
  /**
   * Show mascot message
   */
  showMascotMessage() {
    const responses = [
      "Hi! How can I help you today?",
      "Ready to learn something new about crypto?",
      "Want to know about your next steps?",
      "I'm here to guide you every step of the way!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const speechBubble = document.getElementById('mascotSpeech');
    if (speechBubble) {
      speechBubble.textContent = randomResponse;
      
      // Add animation
      speechBubble.parentElement.classList.add('message-update');
      setTimeout(() => {
        speechBubble.parentElement.classList.remove('message-update');
      }, 2000);
    }
  }
  
  /**
   * Update progress indicators
   */
  updateProgressIndicators() {
    const progressPercentage = document.getElementById('progressPercentage');
    const phaseProgress = document.getElementById('phaseProgress');
    
    // Calculate progress percentage
    let progress = 0;
    const count = this.state.interactionCount;
    
    if (this.state.userLevel === 'beginner') {
      progress = Math.min((count / this.config.levelThresholds.intermediate) * 100, 100);
    } else if (this.state.userLevel === 'intermediate') {
      progress = Math.min(((count - this.config.levelThresholds.intermediate) / 
                          (this.config.levelThresholds.advanced - this.config.levelThresholds.intermediate)) * 100 + 100, 200);
    } else {
      progress = 100;
    }
    
    if (progressPercentage) {
      progressPercentage.textContent = `${Math.round(progress)}%`;
    }
    
    if (phaseProgress) {
      phaseProgress.style.width = `${Math.min(progress, 100)}%`;
    }
    
    // Update phase description
    const phaseDescription = document.querySelector('.phase-description');
    if (phaseDescription) {
      const descriptions = {
        'beginner': 'Learning the basics',
        'intermediate': 'Building confidence',
        'advanced': 'Mastering strategies'
      };
      phaseDescription.textContent = descriptions[this.state.userLevel];
    }
  }
  
  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) {
      this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
      sidebar.classList.toggle('collapsed', this.state.sidebarCollapsed);
    }
  }
  
  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) {
      this.state.mobileNavOpen = !this.state.mobileNavOpen;
      sidebar.classList.toggle('mobile-open', this.state.mobileNavOpen);
    }
  }
  
  /**
   * Open buy modal
   */
  openBuyModal() {
    this.showNotification('Buy Crypto', 'Feature coming soon! Start with just $10.', 'info');
  }
  
  /**
   * Open learning modal
   */
  openLearningModal() {
    this.showNotification('Learn & Earn', 'Educational content coming soon!', 'info');
  }
  
  /**
   * Show notification
   */
  showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-header">
          <strong>${title}</strong>
          <button class="notification-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="notification-message">${message}</div>
      </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      z-index: 10000;
      max-width: 350px;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add CSS for animation
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .notification-close {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s ease;
        }
        .notification-close:hover {
          background: #f0f0f0;
        }
        .notification-message {
          color: #666;
          font-size: 14px;
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
  
  /**
   * Show level up notification
   */
  showLevelUpNotification(oldLevel, newLevel) {
    this.showNotification(
      '🎉 Level Up!', 
      `Congratulations! You've progressed from ${oldLevel} to ${newLevel}!`,
      'success'
    );
  }
  
  /**
   * Hide loading screen
   */
  hideLoadingScreen() {
    const loadingElement = document.getElementById('appLoading');
    if (loadingElement) {
      loadingElement.classList.add('hidden');
      setTimeout(() => {
        loadingElement.style.display = 'none';
      }, 500);
    }
  }
  
  /**
   * Start periodic save
   */
  startPeriodicSave() {
    setInterval(() => {
      this.saveProgress();
    }, this.config.saveInterval);
  }
  
  /**
   * Save progress to localStorage
   */
  saveProgress() {
    localStorage.setItem('diboas_user_level', this.state.userLevel);
    localStorage.setItem('diboas_interactions', this.state.interactionCount);
    localStorage.setItem('diboas_theme', this.state.theme);
  }
  
  /**
   * Initialize fallback mode
   */
  initializeFallbackMode() {
    console.log('🔄 Initializing fallback mode');
    
    // Hide loading screen
    this.hideLoadingScreen();
    
    // Show fallback notification
    this.showNotification(
      '⚡ Simplified Mode',
      'Running in simplified mode for optimal performance.',
      'info'
    );
    
    // Basic navigation setup
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Navigation clicked:', link.getAttribute('data-view'));
      });
    });
    
    this.initialized = true;
  }
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.state.theme);
    this.saveProgress();
  }
  
  /**
   * Get current state for debugging
   */
  getState() {
    return {
      ...this.state,
      initialized: this.initialized
    };
  }
}

// ===========================
// INITIALIZATION
// ===========================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.diBoaSApp = new DiBoaSCleanApp();
});

// Add global helper functions
window.navigateToView = (view) => {
  if (window.diBoaSApp) {
    window.diBoaSApp.navigateToView(view);
  }
};

window.openQuickBuyModal = () => {
  if (window.diBoaSApp) {
    window.diBoaSApp.openBuyModal();
  }
};

window.openLearningModal = () => {
  if (window.diBoaSApp) {
    window.diBoaSApp.openLearningModal();
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiBoaSCleanApp;
}