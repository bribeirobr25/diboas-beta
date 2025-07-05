/**
 * diBoaS OneFi Platform App JavaScript
 * Enterprise-grade Progressive Smart Simplicity Implementation
 * 
 * Features: Behavioral Intelligence Engine, Progressive Disclosure, Mascot AI
 * Performance: Core Web Vitals optimized, lazy loading, efficient state management
 * Accessibility: WCAG 2.1 AA compliant, screen reader optimized
 */

'use strict';

// ===========================
// ONEFI PLATFORM APPLICATION
// ===========================

/**
 * Main diBoaS OneFi Application Class
 * Implements Progressive Smart Simplicity with Behavioral Intelligence
 */
class DiBoaSOneFiApp {
  constructor() {
    this.initialized = false;
    this.state = {
      currentView: 'dashboard',
      theme: 'light',
      sidebarCollapsed: false,
      mobileNavOpen: false,
      currentModal: null,
      searchActive: false,

      // Behavioral Intelligence State
      behavioralState: 'initial', // initial, learning, confident, expert
      confidenceLevel: 'beginner', // beginner, intermediate, advanced
      userInteractionScore: 0,
      featureUnlockProgress: 0,

      // Mascot System State
      currentMascot: 'aqua',
      mascotMood: 'welcoming',
      mascotMessage: '',

      // Progressive Disclosure State
      unlockedFeatures: ['dashboard', 'portfolio', 'buy', 'learn'],
      lockedFeatures: ['analytics', 'defi', 'social'],
      phaseProgress: 25,

      // User Journey Tracking
      userJourney: {
        daysSinceSignup: 0,
        totalTransactions: 0,
        totalLearningModulesCompleted: 0,
        portfolioValue: 127.45,
        investmentGoals: [],
        riskTolerance: 'conservative'
      },

      // Performance Metrics
      performance: {
        navigationStartTime: Date.now(),
        interactionLatencies: [],
        memoryUsage: 0,
        errorCount: 0
      }
    };

    this.components = {
      navigation: null,
      search: null,
      profile: null,
      mascot: null,
      behavioral: null,
      progressive: null,
      portfolio: null,
      analytics: null,
      notifications: null
    };

    this.config = {
      apiEndpoint: window.diBoaSConfig?.apiEndpoint || 'https://api.diboas.com',
      wsEndpoint: window.diBoaSConfig?.wsEndpoint || 'wss://ws.diboas.com',
      behavioralAnalyticsEnabled: false, // Analytics disabled
      progressiveDisclosureEnabled: true,
      mascotInteractionEnabled: true,
      realTimeDataEnabled: true,

      // Performance Thresholds
      maxInteractionLatency: 100, // ms
      maxMemoryUsage: 50, // MB
      targetFPS: 60,

      // Progressive Disclosure Thresholds
      intermediateUnlockScore: 1000,
      advancedUnlockScore: 5000,
      expertUnlockScore: 15000,

      // Mascot Behavior Settings
      mascotResponseDelay: 1500,
      mascotIdleTime: 30000,
      mascotEncouragementFrequency: 300000 // 5 minutes
    };

    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.initialized) return;

    try {
      console.log('🚀 Initializing diBoaS OneFi Platform');

      // Performance monitoring
      this.startPerformanceMonitoring();

      // Initialize core systems
      await this.initializeCore();
      await this.initializeBehavioralIntelligence();
      await this.initializeMascotSystem();
      await this.initializeProgressiveDisclosure();
      await this.initializeNavigation();
      await this.initializeSearch();
      await this.initializeProfile();
      await this.initializePortfolio();
      await this.initializeNotifications();
      await this.initializeAccessibility();

      // Setup real-time connections
      await this.setupWebSocketConnection();

      // Load user data and preferences
      await this.loadUserData();

      // Apply initial UI state
      this.applyInitialUIState();

      // Setup global event listeners
      this.setupGlobalEventListeners();

      // Start behavioral analysis
      this.startBehavioralAnalysis();

      // Initialize loading sequence
      this.initializeLoadingSequence();

      this.initialized = true;
      console.log('✅ OneFi platform initialized successfully');

      // Analytics - disabled
      // TODO: Replace with actual analytics when needed
      // this.trackEvent('app_initialized', {
      //   initialization_time: Date.now() - this.state.performance.navigationStartTime,
      //   features_unlocked: this.state.unlockedFeatures.length
      // });

    } catch (error) {
      console.error('❌ App initialization failed:', error);
      this.handleInitializationError(error);
    }
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

    // Detect user preferences
    this.detectUserPreferences();

    // Initialize error handling
    this.setupErrorHandling();

    // Initialize service worker for PWA
    await this.initializeServiceWorker();
  }

  /**
   * Initialize Behavioral Intelligence Engine
   */
  async initializeBehavioralIntelligence() {
    console.log('🧠 Initializing Behavioral Intelligence Engine');

    this.components.behavioral = {
      interactionTracker: new InteractionTracker(this),
      confidenceAnalyzer: new ConfidenceAnalyzer(this),
      adaptiveUI: new AdaptiveUIController(this),
      learningPattern: new LearningPatternAnalyzer(this)
    };

    // Load existing behavioral data
    const behavioralData = await this.loadBehavioralData();
    if (behavioralData) {
      this.state.behavioralState = behavioralData.state;
      this.state.confidenceLevel = behavioralData.confidenceLevel;
      this.state.userInteractionScore = behavioralData.interactionScore;
    }

    // Start tracking user interactions
    this.components.behavioral.interactionTracker.start();

    // Analyze current confidence level
    this.components.behavioral.confidenceAnalyzer.analyze();
  }

  /**
   * Initialize Mascot AI System
   */
  async initializeMascotSystem() {
    console.log('🌊 Initializing Mascot AI System');

    this.components.mascot = new MascotAIController(this);

    // Set initial mascot based on user level
    await this.components.mascot.initialize();

    // Load mascot personality and conversation history
    await this.components.mascot.loadPersonality();

    // Setup mascot interaction handlers
    this.setupMascotInteractions();
  }

  /**
   * Initialize Progressive Disclosure System
   */
  async initializeProgressiveDisclosure() {
    console.log('📈 Initializing Progressive Disclosure System');

    this.components.progressive = new ProgressiveDisclosureController(this);

    // Evaluate current user level and unlock appropriate features
    await this.components.progressive.evaluateUnlocks();

    // Apply progressive UI state
    this.components.progressive.applyUIState();

    // Setup progression monitoring
    this.components.progressive.startMonitoring();
  }

  /**
   * Initialize Navigation System
   */
  initializeNavigation() {
    console.log('🧭 Initializing Navigation System');

    this.components.navigation = new NavigationController(this);

    // Setup navigation event listeners
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavigationClick.bind(this));
    });

    // Setup sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', this.toggleSidebar.bind(this));
    }

    // Setup mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', this.toggleMobileNav.bind(this));
    }
  }

  /**
   * Initialize Search System
   */
  initializeSearch() {
    console.log('🔍 Initializing Search System');

    this.components.search = new SearchController(this);

    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', this.handleSearchInput.bind(this));
      searchInput.addEventListener('focus', this.handleSearchFocus.bind(this));
      searchInput.addEventListener('blur', this.handleSearchBlur.bind(this));
    }

    // Voice search setup
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    if (voiceSearchBtn && 'webkitSpeechRecognition' in window) {
      voiceSearchBtn.addEventListener('click', this.handleVoiceSearch.bind(this));
    } else if (voiceSearchBtn) {
      voiceSearchBtn.style.display = 'none';
    }
  }

  /**
   * Initialize Profile System
   */
  initializeProfile() {
    console.log('👤 Initializing Profile System');

    this.components.profile = new ProfileController(this);

    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener('click', this.toggleProfileDropdown.bind(this));

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
          this.closeProfileDropdown();
        }
      });
    }
  }

  /**
   * Initialize Portfolio System
   */
  async initializePortfolio() {
    console.log('💼 Initializing Portfolio System');

    this.components.portfolio = new PortfolioController(this);

    // Load portfolio data
    await this.components.portfolio.loadPortfolioData();

    // Setup real-time price updates
    this.components.portfolio.startPriceUpdates();

    // Initialize portfolio chart
    await this.components.portfolio.initializeChart();
  }

  /**
   * Initialize Notifications System
   */
  initializeNotifications() {
    console.log('🔔 Initializing Notifications System');

    this.components.notifications = new NotificationController(this);

    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', this.handleNotificationClick.bind(this));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  /**
   * Initialize Accessibility Features
   */
  initializeAccessibility() {
    console.log('♿ Initializing Accessibility Features');

    // Setup keyboard navigation
    this.setupKeyboardNavigation();

    // Setup screen reader announcements
    this.setupScreenReaderSupport();

    // Setup focus management
    this.setupFocusManagement();

    // Setup high contrast mode detection
    this.setupHighContrastMode();
  }

  /**
   * Setup WebSocket connection for real-time data
   */
  async setupWebSocketConnection() {
    if (!this.config.realTimeDataEnabled) return;

    try {
      this.ws = new WebSocket(this.config.wsEndpoint);

      this.ws.onopen = () => {
        console.log('🔗 WebSocket connected');
        // TODO: Replace with actual analytics when needed
        // this.trackEvent('websocket_connected');
      };

      this.ws.onmessage = (event) => {
        this.handleWebSocketMessage(JSON.parse(event.data));
      };

      this.ws.onclose = () => {
        console.log('📡 WebSocket disconnected, attempting reconnection...');
        setTimeout(() => this.setupWebSocketConnection(), 5000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
    }
  }

  /**
   * Load user data and preferences
   */
  async loadUserData() {
    try {
      // Load from localStorage first (offline support)
      const localData = this.loadFromLocalStorage();
      if (localData) {
        this.applyUserData(localData);
      }

      // Then sync with server
      const serverData = await this.fetchFromAPI('/user/profile');
      if (serverData) {
        this.applyUserData(serverData);
        this.saveToLocalStorage(serverData);
      }

    } catch (error) {
      console.error('Failed to load user data:', error);
      // Fallback to default values
      this.applyDefaultUserData();
    }
  }

  /**
   * Apply initial UI state based on user data
   */
  applyInitialUIState() {
    // Set behavioral state attributes
    document.body.setAttribute('data-behavioral-state', this.state.behavioralState);
    document.body.setAttribute('data-confidence-level', this.state.confidenceLevel);

    // Apply progressive disclosure state
    this.updateProgressiveUI();

    // Set mascot state
    this.updateMascotDisplay();

    // Update navigation state
    this.updateNavigationState();

    // Apply theme
    document.documentElement.setAttribute('data-theme', this.state.theme);
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Performance monitoring
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));

    // Visibility change (tab switching)
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Resize handling
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));

    // Online/offline status
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Error handling
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }

  /**
   * Start behavioral analysis and tracking
   */
  startBehavioralAnalysis() {
    // Track user interactions every 5 seconds
    setInterval(() => {
      this.components.behavioral?.confidenceAnalyzer?.analyze();
    }, 5000);

    // Update behavioral state every 30 seconds
    setInterval(() => {
      this.updateBehavioralState();
    }, 30000);

    // Save behavioral data every 2 minutes
    setInterval(() => {
      this.saveBehavioralData();
    }, 120000);
  }

  /**
   * Initialize loading sequence with mascot
   */
  initializeLoadingSequence() {
    const loadingElement = document.getElementById('appLoading');
    const progressElement = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');

    if (!loadingElement) return;

    const loadingSteps = [
      { text: 'Initializing behavioral intelligence...', progress: 20 },
      { text: 'Loading your personalized experience...', progress: 40 },
      { text: 'Setting up your mascot guide...', progress: 60 },
      { text: 'Preparing your portfolio...', progress: 80 },
      { text: 'Welcome to your OneFi journey!', progress: 100 }
    ];

    let currentStep = 0;

    const updateLoading = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        if (loadingText) loadingText.textContent = step.text;
        if (progressElement) progressElement.style.width = `${step.progress}%`;
        currentStep++;
        setTimeout(updateLoading, 800);
      } else {
        // Hide loading screen
        setTimeout(() => {
          loadingElement.classList.add('hidden');
          setTimeout(() => {
            loadingElement.style.display = 'none';
          }, 500);
        }, 500);
      }
    };

    updateLoading();
  }

  /**
   * Handle navigation clicks
   */
  handleNavigationClick(event) {
    event.preventDefault();

    const link = event.currentTarget;
    const view = link.getAttribute('data-view');

    if (view) {
      this.navigateToView(view);

      // Track behavioral interaction - disabled
      // TODO: Replace with actual interaction tracking when needed
      // this.trackInteraction('navigation', { view, source: 'sidebar' });
    }
  }

  /**
   * Navigate to a specific view
   */
  navigateToView(view) {
    // Check if feature is unlocked
    if (this.state.lockedFeatures.includes(view)) {
      this.showFeatureLockedModal(view);
      return;
    }

    // Update active navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[data-view="${view}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Update page title and subtitle
    this.updatePageHeader(view);

    // Update breadcrumb
    this.updateBreadcrumb(view);

    // Switch content view
    this.switchContentView(view);

    // Update state
    this.state.currentView = view;

    // Track view change - disabled
    // TODO: Replace with actual analytics when needed
    // this.trackEvent('view_changed', { view, previous_view: this.state.currentView });

    // Update mascot context
    if (this.components.mascot) {
      this.components.mascot.updateContext(view);
    }
  }

  /**
   * Track user interactions for behavioral analysis - STUBBED OUT
   * TODO: Replace with actual interaction tracking when needed
   */
  trackInteraction(type, data = {}) {
    // Interaction tracking disabled
    console.log('Interaction tracking disabled - would track:', type, data);

    // Still update interaction score for progression (keeping game mechanics)
    this.updateInteractionScore(type);

    // Still check for progression triggers (keeping level-up functionality)
    this.checkProgressionTriggers();

    /* Original behavioral tracking disabled:
    const interaction = {
      type,
      data,
      timestamp: Date.now(),
      view: this.state.currentView,
      session_id: this.getSessionId()
    };
    
    // Add to behavioral analysis
    if (this.components.behavioral?.interactionTracker) {
      this.components.behavioral.interactionTracker.track(interaction);
    }
    */
  }

  /**
   * Update interaction score for behavioral intelligence
   */
  updateInteractionScore(interactionType) {
    const scores = {
      'navigation': 5,
      'purchase': 50,
      'learn_complete': 25,
      'portfolio_view': 10,
      'settings_change': 15,
      'help_request': 5,
      'mascot_interaction': 10
    };

    const points = scores[interactionType] || 1;
    this.state.userInteractionScore += points;

    // Save to localStorage
    localStorage.setItem('diboas_interaction_score', this.state.userInteractionScore);
  }

  /**
   * Check for progression triggers and unlock features
   */
  checkProgressionTriggers() {
    const oldLevel = this.state.confidenceLevel;

    // Determine new confidence level
    let newLevel = 'beginner';
    if (this.state.userInteractionScore >= this.config.expertUnlockScore) {
      newLevel = 'advanced';
    } else if (this.state.userInteractionScore >= this.config.advancedUnlockScore) {
      newLevel = 'intermediate';
    } else if (this.state.userInteractionScore >= this.config.intermediateUnlockScore) {
      newLevel = 'intermediate';
    }

    // Level up progression
    if (newLevel !== oldLevel) {
      this.levelUp(newLevel);
    }

    // Update progress percentage
    this.updateProgressPercentage();
  }

  /**
   * Handle level up progression
   */
  levelUp(newLevel) {
    const oldLevel = this.state.confidenceLevel;
    this.state.confidenceLevel = newLevel;

    // Update UI attributes
    document.body.setAttribute('data-confidence-level', newLevel);

    // Unlock new features
    this.unlockLevelFeatures(newLevel);

    // Show level up celebration
    this.showLevelUpCelebration(oldLevel, newLevel);

    // Update mascot
    this.updateMascotForLevel(newLevel);

    // Track progression event - disabled
    // TODO: Replace with actual analytics when needed
    // this.trackEvent('level_up', {
    //   old_level: oldLevel,
    //   new_level: newLevel,
    //   interaction_score: this.state.userInteractionScore
    // });
  }

  /**
   * Start performance monitoring
   */
  startPerformanceMonitoring() {
    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = performance.memory;
        this.state.performance.memoryUsage = memInfo.usedJSHeapSize / 1024 / 1024; // MB

        if (this.state.performance.memoryUsage > this.config.maxMemoryUsage) {
          console.warn('High memory usage detected:', this.state.performance.memoryUsage, 'MB');
        }
      }, 10000);
    }

    // Monitor interaction latencies
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          this.state.performance.interactionLatencies.push(entry.duration);

          if (entry.duration > this.config.maxInteractionLatency) {
            console.warn('Slow interaction detected:', entry.name, entry.duration, 'ms');
          }
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });
  }

  /**
   * Utility: Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Utility: Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * API Helper: Fetch from API
   */
  async fetchFromAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.config.apiEndpoint}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Get authentication token
   */
  getAuthToken() {
    return localStorage.getItem('diboas_auth_token') || '';
  }

  /**
   * Get session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('diboas_session_id');
    if (!sessionId) {
      sessionId = this.generateUUID();
      sessionStorage.setItem('diboas_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Generate UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Track analytics event - STUBBED OUT
   * TODO: Replace with actual analytics implementation when needed
   */
  trackEvent(eventName, properties = {}) {
    // Analytics functionality disabled
    console.log('Analytics disabled - would track:', eventName, properties);

    // Stubbed implementation - no actual tracking
    return;

    /* Original implementation disabled:
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        session_id: this.getSessionId(),
        user_level: this.state.confidenceLevel,
        current_view: this.state.currentView,
        platform: 'web',
        version: '1.0.0'
      }
    };
    
    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
    
    // Store locally for offline sync
    const events = JSON.parse(localStorage.getItem('diboas_analytics_events') || '[]');
    events.push(event);
    localStorage.setItem('diboas_analytics_events', JSON.stringify(events.slice(-100))); // Keep last 100 events
    */

    /**
     * Error handling
     */
    handleInitializationError(error) {
      console.error('Initialization error:', error);

      // Show user-friendly error message
      const errorContainer = document.createElement('div');
      errorContainer.className = 'app-error';
      errorContainer.innerHTML = `
      <div class="error-content">
        <h2>Oops! Something went wrong</h2>
        <p>We're having trouble loading the diBoaS platform. Please try refreshing the page.</p>
        <button onclick="window.location.reload()">Refresh Page</button>
      </div>
    `;
      document.body.appendChild(errorContainer);

      // Track error - disabled
      // TODO: Replace with actual analytics when needed
      // this.trackEvent('app_initialization_error', {
      //   error_message: error.message,
      //   error_stack: error.stack
      // });
    }

    // Additional methods would continue here...
    // Including: MascotAIController, ProgressiveDisclosureController, 
    // InteractionTracker, ConfidenceAnalyzer, etc.
  }

// ===========================
// COMPONENT CLASSES
// ===========================

/**
 * Behavioral Intelligence: Interaction Tracker
 */
class InteractionTracker {
  constructor(app) {
    this.app = app;
    this.interactions = [];
    this.patterns = new Map();
  }

  start() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Track all user interactions
    ['click', 'keydown', 'scroll', 'mousemove'].forEach(eventType => {
      document.addEventListener(eventType, this.throttle((e) => {
        this.recordInteraction(eventType, e);
      }, 100));
    });
  }

  recordInteraction(type, event) {
    const interaction = {
      type,
      timestamp: Date.now(),
      target: event.target.tagName,
      view: this.app.state.currentView
    };

    this.interactions.push(interaction);
    this.analyzePatterns();

    // Keep only recent interactions
    if (this.interactions.length > 1000) {
      this.interactions = this.interactions.slice(-500);
    }
  }

  analyzePatterns() {
    // Analyze interaction patterns for behavioral intelligence
    // This would include frequency analysis, timing patterns, etc.
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

/**
 * Behavioral Intelligence: Confidence Analyzer
 */
class ConfidenceAnalyzer {
  constructor(app) {
    this.app = app;
    this.confidenceFactors = {
      transactionCount: 0,
      learningModulesCompleted: 0,
      timeSpentInApp: 0,
      helpRequestsCount: 0,
      errorRecoverySuccess: 0
    };
  }

  analyze() {
    // Analyze user confidence based on various factors
    const confidenceScore = this.calculateConfidenceScore();
    this.updateConfidenceLevel(confidenceScore);
  }

  calculateConfidenceScore() {
    // Complex algorithm to determine user confidence
    // Based on interaction patterns, success rates, help requests, etc.
    return this.app.state.userInteractionScore;
  }

  updateConfidenceLevel(score) {
    // Update confidence level based on score
    // This feeds into the progressive disclosure system
  }
}

/**
 * Mascot AI Controller
 */
class MascotAIController {
  constructor(app) {
    this.app = app;
    this.personality = {};
    this.conversationHistory = [];
    this.currentMood = 'welcoming';
  }

  async initialize() {
    await this.loadPersonality();
    this.startIdleBehavior();
  }

  async loadPersonality() {
    // Load mascot personality based on current mascot
    const mascot = this.app.state.currentMascot;
    // This would typically load from a configuration file or API
  }

  startIdleBehavior() {
    setInterval(() => {
      if (Date.now() - this.lastInteraction > this.app.config.mascotIdleTime) {
        this.showIdleMessage();
      }
    }, this.app.config.mascotIdleTime);
  }

  showIdleMessage() {
    const messages = [
      "Need any help? I'm here for you! 🌊",
      "How's your investment journey going?",
      "Ready to learn something new today?",
      "Want to check your portfolio performance?"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    this.displayMessage(randomMessage);
  }

  displayMessage(message) {
    const speechBubble = document.getElementById('mascotSpeech');
    if (speechBubble) {
      speechBubble.textContent = message;
      // Add animation class for message display
      speechBubble.parentElement.classList.add('message-update');
      setTimeout(() => {
        speechBubble.parentElement.classList.remove('message-update');
      }, 300);
    }
  }

  updateContext(view) {
    // Update mascot behavior based on current view
    const contextMessages = {
      'dashboard': "Welcome back! Ready to dive into your investments?",
      'portfolio': "Let's see how your investments are performing!",
      'buy': "Great choice! Starting small is the smart way to learn.",
      'learn': "Learning is the key to successful investing!",
      'security': "Security first! Let's keep your account safe."
    };

    if (contextMessages[view]) {
      setTimeout(() => {
        this.displayMessage(contextMessages[view]);
      }, this.app.config.mascotResponseDelay);
    }
  }
}

/**
 * Progressive Disclosure Controller
 */
class ProgressiveDisclosureController {
  constructor(app) {
    this.app = app;
    this.featureMap = {
      'beginner': ['dashboard', 'portfolio', 'buy', 'learn', 'security', 'settings'],
      'intermediate': ['analytics', 'insights'],
      'advanced': ['defi', 'social', 'api']
    };
  }

  async evaluateUnlocks() {
    const currentLevel = this.app.state.confidenceLevel;
    const availableFeatures = this.getAvailableFeaturesForLevel(currentLevel);

    // Update unlocked features
    this.app.state.unlockedFeatures = availableFeatures;
    this.app.state.lockedFeatures = this.getAllFeatures().filter(
      feature => !availableFeatures.includes(feature)
    );
  }

  getAvailableFeaturesForLevel(level) {
    let features = [...this.featureMap.beginner];

    if (level === 'intermediate' || level === 'advanced') {
      features = [...features, ...this.featureMap.intermediate];
    }

    if (level === 'advanced') {
      features = [...features, ...this.featureMap.advanced];
    }

    return features;
  }

  getAllFeatures() {
    return [
      ...this.featureMap.beginner,
      ...this.featureMap.intermediate,
      ...this.featureMap.advanced
    ];
  }

  applyUIState() {
    // Show/hide UI elements based on unlocked features
    this.getAllFeatures().forEach(feature => {
      const elements = document.querySelectorAll(`[data-feature="${feature}"]`);
      elements.forEach(element => {
        if (this.app.state.unlockedFeatures.includes(feature)) {
          element.classList.remove('feature-locked');
          element.classList.add('feature-unlocked');
        } else {
          element.classList.add('feature-locked');
          element.classList.remove('feature-unlocked');
        }
      });
    });

    // Update advanced section visibility
    const advancedSection = document.getElementById('advancedSection');
    if (advancedSection) {
      if (this.app.state.confidenceLevel !== 'beginner') {
        advancedSection.style.display = 'block';
        advancedSection.classList.add('feature-unlock-animation');
      } else {
        advancedSection.style.display = 'none';
      }
    }
  }

  startMonitoring() {
    // Monitor for progression triggers
    setInterval(() => {
      this.evaluateUnlocks();
      this.applyUIState();
    }, 30000);
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