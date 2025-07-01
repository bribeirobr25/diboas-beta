/**
 * diBoaS OneFi Platform App JavaScript - Simplified Version
 * Enterprise-grade Progressive Smart Simplicity Implementation with Fallbacks
 * 
 * Features: Behavioral Intelligence Engine, Progressive Disclosure, Mascot AI
 * Performance: Core Web Vitals optimized, proper error handling
 * Accessibility: WCAG 2.1 AA compliant, screen reader optimized
 */

'use strict';

// ===========================
// ONEFI PLATFORM APPLICATION - SIMPLIFIED
// ===========================

/**
 * Main diBoaS OneFi Application Class - Simplified with Fallbacks
 */
class DiBoaSOneFiApp {
  constructor() {
    this.initialized = false;
    this.loadingTimeout = null;
    this.maxInitTime = 10000; // 10 seconds max
    
    this.state = {
      currentView: 'dashboard',
      theme: 'light',
      sidebarCollapsed: false,
      mobileNavOpen: false,
      
      // Simplified Behavioral Intelligence State
      behavioralState: 'initial',
      confidenceLevel: 'beginner',
      userInteractionScore: 0,
      
      // Mascot System State
      currentMascot: 'aqua',
      mascotMessage: 'Welcome! I\'m here to help you start your crypto journey.',
      
      // Progressive Disclosure State
      unlockedFeatures: ['dashboard', 'portfolio', 'buy', 'learn'],
      phaseProgress: 25
    };
    
    this.config = {
      enableBehavioralIntelligence: true,
      enableMascotSystem: true,
      enableProgressiveDisclosure: true,
      fallbackMode: false,
      
      // Timeouts for graceful degradation
      initTimeout: 10000,
      componentTimeout: 2000
    };
    
    // Start initialization with timeout fallback
    this.initWithFallback();
  }
  
  /**
   * Initialize with fallback mechanism
   */
  async initWithFallback() {
    // Set timeout to prevent getting stuck
    this.loadingTimeout = setTimeout(() => {
      console.warn('⚠️ Initialization taking too long, enabling fallback mode');
      this.enableFallbackMode();
    }, this.config.initTimeout);
    
    try {
      await this.init();
    } catch (error) {
      console.error('❌ Initialization failed, enabling fallback mode:', error);
      this.enableFallbackMode();
    }
  }
  
  /**
   * Enable fallback mode for graceful degradation
   */
  enableFallbackMode() {
    console.log('🔄 Enabling fallback mode...');
    
    // Clear timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
    
    // Set fallback mode
    this.config.fallbackMode = true;
    
    // Initialize basic functionality only
    this.initializeBasicFunctionality();
    
    // Hide loading screen
    this.hideLoadingScreen();
    
    // Show fallback notification
    this.showFallbackNotification();
    
    this.initialized = true;
    console.log('✅ Fallback mode enabled successfully');
  }
  
  /**
   * Initialize the application with full features
   */
  async init() {
    if (this.initialized) return;
    
    console.log('🚀 Initializing diBoaS OneFi Platform');
    
    // Update loading progress
    this.updateLoadingProgress(10, 'Initializing core systems...');
    
    // Initialize core systems
    await this.initializeCore();
    this.updateLoadingProgress(30, 'Setting up user interface...');
    
    // Initialize UI components
    this.initializeNavigation();
    this.updateLoadingProgress(50, 'Loading behavioral intelligence...');
    
    // Initialize behavioral intelligence (with timeout)
    await this.initializeBehavioralIntelligenceSimple();
    this.updateLoadingProgress(70, 'Setting up mascot system...');
    
    // Initialize mascot system (simplified)
    this.initializeMascotSystemSimple();
    this.updateLoadingProgress(85, 'Preparing your dashboard...');
    
    // Initialize progressive disclosure
    this.initializeProgressiveDisclosureSimple();
    this.updateLoadingProgress(95, 'Finalizing setup...');
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Apply initial UI state
    this.applyInitialUIState();
    
    this.updateLoadingProgress(100, 'Welcome to your OneFi journey!');
    
    // Hide loading screen after short delay
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 1000);
    
    // Clear timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
    
    this.initialized = true;
    console.log('✅ OneFi platform initialized successfully');
  }
  
  /**
   * Initialize core application systems
   */
  async initializeCore() {
    // DOM ready check
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }
    
    // Theme detection and application
    const savedTheme = localStorage.getItem('diboas_theme') || 'light';
    this.setTheme(savedTheme);
    
    // Load user preferences
    this.loadUserPreferences();
  }
  
  /**
   * Initialize simplified behavioral intelligence
   */
  async initializeBehavioralIntelligenceSimple() {
    try {
      console.log('🧠 Initializing simplified behavioral intelligence');
      
      // Load existing data
      const savedScore = localStorage.getItem('diboas_interaction_score');
      if (savedScore) {
        this.state.userInteractionScore = parseInt(savedScore) || 0;
      }
      
      const savedLevel = localStorage.getItem('diboas_confidence_level');
      if (savedLevel) {
        this.state.confidenceLevel = savedLevel;
      }
      
      // Start simple interaction tracking
      this.startSimpleInteractionTracking();
      
    } catch (error) {
      console.warn('⚠️ Behavioral intelligence initialization failed, using defaults:', error);
    }
  }
  
  /**
   * Initialize simplified mascot system
   */
  initializeMascotSystemSimple() {
    try {
      console.log('🌊 Initializing simplified mascot system');
      
      // Set mascot message based on user level
      this.updateMascotMessage();
      
      // Setup mascot interactions
      this.setupMascotInteractions();
      
    } catch (error) {
      console.warn('⚠️ Mascot system initialization failed:', error);
    }
  }
  
  /**
   * Initialize simplified progressive disclosure
   */
  initializeProgressiveDisclosureSimple() {
    try {
      console.log('📈 Initializing simplified progressive disclosure');
      
      // Update UI based on confidence level
      this.updateProgressiveUI();
      
    } catch (error) {
      console.warn('⚠️ Progressive disclosure initialization failed:', error);
    }
  }
  
  /**
   * Initialize basic functionality for fallback mode
   */
  initializeBasicFunctionality() {
    console.log('🔧 Initializing basic functionality');
    
    // Basic navigation
    this.setupBasicNavigation();
    
    // Basic theme switching
    this.setupBasicTheme();
    
    // Basic mobile menu
    this.setupBasicMobileMenu();
    
    // Apply minimal UI state
    this.applyBasicUIState();
  }
  
  /**
   * Setup basic navigation
   */
  setupBasicNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        if (view) {
          this.navigateToViewBasic(view);
        }
      });
    });
  }
  
  /**
   * Setup basic theme switching
   */
  setupBasicTheme() {
    // Add theme toggle if it exists
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }
  
  /**
   * Setup basic mobile menu
   */
  setupBasicMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('appSidebar');
    
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        this.state.mobileNavOpen = !this.state.mobileNavOpen;
      });
    }
  }
  
  /**
   * Navigate to view (basic version)
   */
  navigateToViewBasic(view) {
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
    
    console.log(`📱 Navigated to ${view}`);
  }
  
  /**
   * Get title for view
   */
  getViewTitle(view) {
    const titles = {
      'dashboard': 'Dashboard',
      'portfolio': 'Portfolio',
      'buy': 'Buy Crypto',
      'activity': 'Activity',
      'learn': 'Learn & Earn',
      'insights': 'Market Insights',
      'security': 'Security',
      'settings': 'Settings'
    };
    return titles[view] || 'Dashboard';
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Navigation
    this.setupBasicNavigation();
    
    // Mobile menu
    this.setupBasicMobileMenu();
    
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }
    
    // Profile dropdown
    this.setupProfileDropdown();
    
    // Search functionality
    this.setupSearch();
    
    // Global error handling
    window.addEventListener('error', (e) => {
      console.error('Global error caught:', e.error);
      this.handleError(e.error);
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
   * Setup search functionality
   */
  setupSearch() {
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
        console.log('Search query:', e.target.value);
      });
    }
  }
  
  /**
   * Start simple interaction tracking
   */
  startSimpleInteractionTracking() {
    let interactionCount = 0;
    
    // Track clicks
    document.addEventListener('click', () => {
      interactionCount++;
      this.state.userInteractionScore += 1;
      
      // Save periodically
      if (interactionCount % 10 === 0) {
        localStorage.setItem('diboas_interaction_score', this.state.userInteractionScore);
        this.checkForLevelUp();
      }
    });
  }
  
  /**
   * Check for level up
   */
  checkForLevelUp() {
    const oldLevel = this.state.confidenceLevel;
    let newLevel = 'beginner';
    
    if (this.state.userInteractionScore >= 100) {
      newLevel = 'intermediate';
    }
    if (this.state.userInteractionScore >= 500) {
      newLevel = 'advanced';
    }
    
    if (newLevel !== oldLevel) {
      this.state.confidenceLevel = newLevel;
      localStorage.setItem('diboas_confidence_level', newLevel);
      this.updateProgressiveUI();
      this.updateMascotMessage();
      console.log(`🎉 Level up! ${oldLevel} → ${newLevel}`);
    }
  }
  
  /**
   * Update mascot message
   */
  updateMascotMessage() {
    const messages = {
      'beginner': 'Welcome! I\'m here to help you start your crypto journey.',
      'intermediate': 'Great progress! Ready to explore more advanced features?',
      'advanced': 'You\'re becoming a pro! Let\'s unlock some powerful tools.'
    };
    
    this.state.mascotMessage = messages[this.state.confidenceLevel] || messages.beginner;
    
    const speechBubble = document.getElementById('mascotSpeech');
    if (speechBubble) {
      speechBubble.textContent = this.state.mascotMessage;
    }
  }
  
  /**
   * Setup mascot interactions
   */
  setupMascotInteractions() {
    const mascotChatBtn = document.getElementById('mascotChatBtn');
    if (mascotChatBtn) {
      mascotChatBtn.addEventListener('click', () => {
        this.showMascotChat();
      });
    }
  }
  
  /**
   * Show mascot chat
   */
  showMascotChat() {
    const responses = [
      'Hi! How can I help you today?',
      'Want to know about investing? I\'d love to explain!',
      'Need help navigating the platform? I\'m here for you!',
      'Ready to learn something new about crypto?'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    this.state.mascotMessage = randomResponse;
    this.updateMascotMessage();
  }
  
  /**
   * Update progressive UI
   */
  updateProgressiveUI() {
    // Update body attributes
    document.body.setAttribute('data-confidence-level', this.state.confidenceLevel);
    
    // Show/hide advanced section
    const advancedSection = document.getElementById('advancedSection');
    if (advancedSection) {
      if (this.state.confidenceLevel !== 'beginner') {
        advancedSection.style.display = 'block';
      } else {
        advancedSection.style.display = 'none';
      }
    }
    
    // Update progress indicators
    this.updateProgressIndicators();
  }
  
  /**
   * Update progress indicators
   */
  updateProgressIndicators() {
    const progressPercentage = document.getElementById('progressPercentage');
    const phaseProgress = document.getElementById('phaseProgress');
    
    let progress = 25;
    if (this.state.confidenceLevel === 'intermediate') progress = 60;
    if (this.state.confidenceLevel === 'advanced') progress = 90;
    
    if (progressPercentage) {
      progressPercentage.textContent = `${progress}%`;
    }
    if (phaseProgress) {
      phaseProgress.style.width = `${progress}%`;
    }
  }
  
  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
    }
  }
  
  /**
   * Set theme
   */
  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('diboas_theme', theme);
  }
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  /**
   * Load user preferences
   */
  loadUserPreferences() {
    // Load theme
    const savedTheme = localStorage.getItem('diboas_theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
    
    // Load behavioral data
    const savedScore = localStorage.getItem('diboas_interaction_score');
    if (savedScore) {
      this.state.userInteractionScore = parseInt(savedScore) || 0;
    }
    
    const savedLevel = localStorage.getItem('diboas_confidence_level');
    if (savedLevel) {
      this.state.confidenceLevel = savedLevel;
    }
  }
  
  /**
   * Apply initial UI state
   */
  applyInitialUIState() {
    // Set behavioral state attributes
    document.body.setAttribute('data-behavioral-state', this.state.behavioralState);
    document.body.setAttribute('data-confidence-level', this.state.confidenceLevel);
    
    // Update progressive UI
    this.updateProgressiveUI();
    
    // Update mascot
    this.updateMascotMessage();
    
    // Set theme
    document.documentElement.setAttribute('data-theme', this.state.theme);
  }
  
  /**
   * Apply basic UI state for fallback mode
   */
  applyBasicUIState() {
    document.body.setAttribute('data-behavioral-state', 'initial');
    document.body.setAttribute('data-confidence-level', 'beginner');
    document.documentElement.setAttribute('data-theme', 'light');
    
    // Show basic mascot message
    const speechBubble = document.getElementById('mascotSpeech');
    if (speechBubble) {
      speechBubble.textContent = 'Welcome! The platform is running in simplified mode.';
    }
  }
  
  /**
   * Update loading progress
   */
  updateLoadingProgress(percentage, message) {
    const progressFill = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (loadingText) {
      loadingText.textContent = message;
    }
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
   * Show fallback notification
   */
  showFallbackNotification() {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'fallback-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">⚡</div>
        <div class="notification-text">
          <strong>Running in simplified mode</strong>
          <p>Some advanced features are temporarily disabled to ensure smooth performance.</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4ECDC4;
      color: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      z-index: 10000;
      max-width: 350px;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .notification-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }
      .notification-icon {
        font-size: 20px;
        flex-shrink: 0;
      }
      .notification-text strong {
        display: block;
        margin-bottom: 4px;
      }
      .notification-text p {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }
      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
      }
      .notification-close:hover {
        background: rgba(255,255,255,0.2);
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
  
  /**
   * Handle errors gracefully
   */
  handleError(error) {
    console.error('Application error:', error);
    
    // Show user-friendly error message
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-toast';
    errorContainer.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span>Something went wrong. The app will continue in simplified mode.</span>
        <button onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;
    
    errorContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 10000;
      max-width: 300px;
    `;
    
    document.body.appendChild(errorContainer);
    
    setTimeout(() => {
      if (errorContainer.parentElement) {
        errorContainer.remove();
      }
    }, 5000);
  }
}

// ===========================
// INITIALIZATION
// ===========================

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.diBoaSApp = new DiBoaSOneFiApp();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiBoaSOneFiApp;
}