/**
 * diBoaS Learning Platform Redesign JavaScript
 * Enterprise-grade interactive learning interface
 * 
 * Features: Interactive lessons, progress tracking, mascot integration, achievement system
 * Performance: Optimized for Core Web Vitals
 * Accessibility: WCAG 2.1 AA compliant
 */

'use strict';

// ===========================
// LEARNING PLATFORM APPLICATION
// ===========================

/**
 * Main Learning Platform Application Class
 */
class DiBoaSLearningApp {
  constructor() {
    this.initialized = false;
    this.state = {
      currentMascot: 'aqua',
      currentLesson: 'first-purchase',
      lessonProgress: 0,
      completedLessons: JSON.parse(localStorage.getItem('diboas-completed-lessons') || '[]'),
      userProgress: JSON.parse(localStorage.getItem('diboas-user-progress') || '{}'),
      theme: 'light',
      sidebarOpen: false,
      videoPlaying: false,
      currentTime: 0,
      videoDuration: 225, // 3:45 in seconds
      simulationData: {
        selectedCrypto: 'btc',
        purchaseAmount: 10,
        cryptoPrices: {
          btc: 43250,
          eth: 2650,
          sol: 98,
          sui: 1.85
        }
      }
    };
    
    this.components = {
      navigation: null,
      video: null,
      simulation: null,
      quiz: null,
      progress: null,
      achievements: null
    };
    
    this.init();
  }
  
  /**
   * Initialize the application
   */
  init() {
    if (this.initialized) return;
    
    try {
      console.log('🚀 Initializing diBoaS Learning Platform');
      
      // Initialize core components
      this.initializeDOM();
      this.initializeNavigation();
      this.initializeVideo();
      this.initializeSimulation();
      this.initializeQuiz();
      this.initializeProgress();
      this.initializeAchievements();
      this.initializeMascotSystem();
      this.initializeTheme();
      this.initializeSidebar();
      this.initializeAccessibility();
      this.initializeAnalytics();
      
      // Load user state
      this.loadUserState();
      
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      this.initialized = true;
      console.log('✅ Learning platform initialized successfully');
      
      // Track initialization
      this.trackEvent('learning_app_initialized', {
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        lesson: this.state.currentLesson,
        mascot: this.state.currentMascot
      });
      
    } catch (error) {
      console.error('❌ Failed to initialize learning platform:', error);
      this.handleError(error, 'initialization');
    }
  }
  
  /**
   * Initialize DOM references
   */
  initializeDOM() {
    this.elements = {
      // Header elements
      mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
      themeToggle: document.getElementById('theme-toggle'),
      progressCircle: document.querySelector('.progress-ring-fill'),
      progressText: document.querySelector('.progress-text'),
      
      // Sidebar elements
      sidebar: document.getElementById('learning-sidebar'),
      sidebarOverlay: document.getElementById('sidebar-overlay'),
      mascotOptions: document.querySelectorAll('.mascot-option'),
      lessonLinks: document.querySelectorAll('.lesson-link'),
      currentGuide: document.querySelector('.current-guide'),
      
      // Content elements
      lessonProgress: document.getElementById('lesson-progress'),
      videoPlayer: document.getElementById('lesson-video'),
      playButton: document.querySelector('.play-button'),
      videoControls: document.querySelector('.video-controls'),
      playPauseBtn: document.getElementById('play-pause'),
      videoProgress: document.getElementById('video-progress'),
      videoProgressFill: document.getElementById('video-progress-fill'),
      timeDisplay: document.getElementById('time-display'),
      
      // Simulation elements
      cryptoOptions: document.querySelectorAll('.crypto-option'),
      purchaseAmountInput: document.getElementById('purchase-amount'),
      quickAmounts: document.querySelectorAll('.quick-amount'),
      summaryAmount: document.getElementById('summary-amount'),
      summaryFee: document.getElementById('summary-fee'),
      summaryTotal: document.getElementById('summary-total'),
      summaryCrypto: document.getElementById('summary-crypto'),
      simulateBtn: document.getElementById('simulate-purchase'),
      
      // Quiz elements
      quizSubmit: document.getElementById('submit-quiz'),
      quizFeedback: document.getElementById('quiz-feedback'),
      feedbackCorrect: document.getElementById('feedback-correct'),
      feedbackIncorrect: document.getElementById('feedback-incorrect'),
      
      // Navigation elements
      completeBtn: document.getElementById('complete-lesson'),
      nextLessonBtn: document.getElementById('next-lesson'),
      
      // Modal elements
      achievementModal: document.getElementById('achievement-modal'),
      continueBtn: document.getElementById('continue-learning'),
      shareBtn: document.getElementById('share-achievement'),
      
      // Loading elements
      loadingOverlay: document.getElementById('loading-overlay')
    };
    
    // Validate critical elements
    const requiredElements = ['sidebar', 'themeToggle', 'lessonProgress'];
    for (const elementName of requiredElements) {
      if (!this.elements[elementName]) {
        console.warn(`⚠️ Required element not found: ${elementName}`);
      }
    }
  }
  
  /**
   * Initialize navigation functionality
   */
  initializeNavigation() {
    // Lesson navigation
    if (this.elements.lessonLinks) {
      this.elements.lessonLinks.forEach(link => {
        link.addEventListener('click', this.handleLessonClick.bind(this));
      });
    }
    
    // Lesson completion
    if (this.elements.completeBtn) {
      this.elements.completeBtn.addEventListener('click', this.handleLessonComplete.bind(this));
    }
    
    // Next lesson navigation
    if (this.elements.nextLessonBtn) {
      this.elements.nextLessonBtn.addEventListener('click', this.handleNextLesson.bind(this));
    }
    
    console.log('🧭 Navigation functionality initialized');
  }
  
  /**
   * Handle lesson navigation click
   */
  handleLessonClick(event) {
    event.preventDefault();
    const link = event.currentTarget;
    const lessonId = link.getAttribute('data-lesson');
    
    if (link.classList.contains('locked') || link.getAttribute('aria-disabled') === 'true') {
      this.showLockedLessonMessage();
      return;
    }
    
    // Update active state
    this.elements.lessonLinks.forEach(l => l.classList.remove('active', 'current'));
    link.classList.add('active', 'current');
    
    // Load lesson
    this.loadLesson(lessonId);
    
    // Close mobile sidebar if open
    if (this.state.sidebarOpen) {
      this.closeSidebar();
    }
    
    this.trackEvent('lesson_navigation', {
      from: this.state.currentLesson,
      to: lessonId,
      method: 'sidebar_click'
    });
  }
  
  /**
   * Load lesson content
   */
  loadLesson(lessonId) {
    this.showLoading();
    
    // Simulate loading time
    setTimeout(() => {
      this.state.currentLesson = lessonId;
      this.updateLessonContent(lessonId);
      this.hideLoading();
      
      // Reset lesson progress
      this.state.lessonProgress = 0;
      this.updateLessonProgress();
      
      this.trackEvent('lesson_loaded', {
        lesson: lessonId,
        loadTime: 1000 // simulated
      });
    }, 1000);
  }
  
  /**
   * Update lesson content based on lesson ID
   */
  updateLessonContent(lessonId) {
    // In a real implementation, this would load actual lesson content
    // For now, we'll update the progress and simulate content changes
    
    const lessonData = this.getLessonData(lessonId);
    
    // Update lesson header
    const lessonTitle = document.querySelector('.lesson-title');
    if (lessonTitle && lessonData) {
      lessonTitle.textContent = lessonData.title;
    }
    
    // Update breadcrumb
    const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
    if (breadcrumbCurrent && lessonData) {
      breadcrumbCurrent.textContent = lessonData.phase;
    }
    
    // Reset interactive elements
    this.resetQuiz();
    this.resetSimulation();
    this.resetVideo();
  }
  
  /**
   * Get lesson data by ID
   */
  getLessonData(lessonId) {
    const lessons = {
      'welcome': {
        title: 'Welcome to Crypto',
        phase: 'Aqua Phase',
        duration: 2
      },
      'crypto-basics': {
        title: 'Crypto Fundamentals', 
        phase: 'Aqua Phase',
        duration: 5
      },
      'first-purchase': {
        title: 'Your First $10 Crypto Purchase',
        phase: 'Aqua Phase',
        duration: 8
      },
      'wallet-security': {
        title: 'Wallet Security Basics',
        phase: 'Aqua Phase',
        duration: 6
      },
      'reading-charts': {
        title: 'Reading Price Charts',
        phase: 'Aqua Phase',
        duration: 10
      }
    };
    
    return lessons[lessonId] || null;
  }
  
  /**
   * Handle lesson completion
   */
  handleLessonComplete() {
    const lessonId = this.state.currentLesson;
    
    // Mark lesson as completed
    if (!this.state.completedLessons.includes(lessonId)) {
      this.state.completedLessons.push(lessonId);
      this.saveUserProgress();
    }
    
    // Update UI
    this.updateLessonCompletionUI();
    
    // Show achievement
    this.showAchievement('lesson_complete', {
      title: 'Lesson Complete!',
      description: `Great job! You've mastered "${this.getLessonData(lessonId)?.title}". Aqua is proud of your progress!`,
      points: 50
    });
    
    // Enable next lesson
    this.unlockNextLesson();
    
    this.trackEvent('lesson_completed', {
      lesson: lessonId,
      timeSpent: Date.now() - this.lessonStartTime,
      completionRate: this.state.lessonProgress
    });
  }
  
  /**
   * Handle next lesson navigation
   */
  handleNextLesson(event) {
    event.preventDefault();
    
    const nextLessonId = this.getNextLessonId();
    if (nextLessonId) {
      this.loadLesson(nextLessonId);
    }
  }
  
  /**
   * Get next lesson ID
   */
  getNextLessonId() {
    const lessonOrder = ['welcome', 'crypto-basics', 'first-purchase', 'wallet-security', 'reading-charts'];
    const currentIndex = lessonOrder.indexOf(this.state.currentLesson);
    
    if (currentIndex >= 0 && currentIndex < lessonOrder.length - 1) {
      return lessonOrder[currentIndex + 1];
    }
    
    return null;
  }
  
  /**
   * Initialize video functionality
   */
  initializeVideo() {
    if (this.elements.playButton) {
      this.elements.playButton.addEventListener('click', this.handleVideoPlay.bind(this));
    }
    
    if (this.elements.playPauseBtn) {
      this.elements.playPauseBtn.addEventListener('click', this.handleVideoToggle.bind(this));
    }
    
    if (this.elements.videoProgress) {
      this.elements.videoProgress.addEventListener('click', this.handleVideoSeek.bind(this));
    }
    
    // Start video progress simulation
    this.startVideoProgress();
    
    console.log('🎥 Video functionality initialized');
  }
  
  /**
   * Handle video play
   */
  handleVideoPlay() {
    if (this.elements.videoControls) {
      this.elements.videoControls.style.display = 'flex';
    }
    
    this.state.videoPlaying = true;
    this.updateVideoControls();
    
    // Track video start
    this.trackEvent('video_started', {
      lesson: this.state.currentLesson,
      timestamp: Date.now()
    });
    
    // Update lesson progress
    this.updateLessonProgress(25);
  }
  
  /**
   * Handle video play/pause toggle
   */
  handleVideoToggle() {
    this.state.videoPlaying = !this.state.videoPlaying;
    this.updateVideoControls();
    
    this.trackEvent('video_toggle', {
      action: this.state.videoPlaying ? 'play' : 'pause',
      currentTime: this.state.currentTime
    });
  }
  
  /**
   * Handle video seek
   */
  handleVideoSeek(event) {
    const rect = this.elements.videoProgress.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    this.state.currentTime = Math.floor(this.state.videoDuration * percent);
    
    this.updateVideoProgress();
    
    this.trackEvent('video_seek', {
      newTime: this.state.currentTime,
      percent: percent * 100
    });
  }
  
  /**
   * Start video progress simulation
   */
  startVideoProgress() {
    setInterval(() => {
      if (this.state.videoPlaying && this.state.currentTime < this.state.videoDuration) {
        this.state.currentTime++;
        this.updateVideoProgress();
        
        // Track viewing milestones
        const percent = (this.state.currentTime / this.state.videoDuration) * 100;
        if ([25, 50, 75, 95].includes(Math.floor(percent))) {
          this.trackEvent('video_progress', {
            percent: Math.floor(percent),
            currentTime: this.state.currentTime
          });
          
          // Update lesson progress based on video progress
          if (percent >= 95) {
            this.updateLessonProgress(50);
          }
        }
      }
    }, 1000);
  }
  
  /**
   * Update video controls
   */
  updateVideoControls() {
    if (this.elements.playPauseBtn) {
      const playIcon = this.elements.playPauseBtn.querySelector('.play-icon');
      const pauseIcon = this.elements.playPauseBtn.querySelector('.pause-icon');
      
      if (this.state.videoPlaying) {
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'inline';
      } else {
        if (playIcon) playIcon.style.display = 'inline';
        if (pauseIcon) pauseIcon.style.display = 'none';
      }
    }
  }
  
  /**
   * Update video progress
   */
  updateVideoProgress() {
    const percent = (this.state.currentTime / this.state.videoDuration) * 100;
    
    if (this.elements.videoProgressFill) {
      this.elements.videoProgressFill.style.width = `${percent}%`;
    }
    
    if (this.elements.timeDisplay) {
      this.elements.timeDisplay.textContent = `${this.formatTime(this.state.currentTime)} / ${this.formatTime(this.state.videoDuration)}`;
    }
  }
  
  /**
   * Format time in MM:SS format
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  /**
   * Reset video state
   */
  resetVideo() {
    this.state.videoPlaying = false;
    this.state.currentTime = 0;
    this.updateVideoProgress();
    this.updateVideoControls();
    
    if (this.elements.videoControls) {
      this.elements.videoControls.style.display = 'none';
    }
  }
  
  /**
   * Initialize simulation functionality
   */
  initializeSimulation() {
    // Crypto selection
    if (this.elements.cryptoOptions) {
      this.elements.cryptoOptions.forEach(option => {
        option.addEventListener('click', this.handleCryptoSelect.bind(this));
      });
    }
    
    // Amount input
    if (this.elements.purchaseAmountInput) {
      this.elements.purchaseAmountInput.addEventListener('input', this.handleAmountChange.bind(this));
    }
    
    // Quick amounts
    if (this.elements.quickAmounts) {
      this.elements.quickAmounts.forEach(btn => {
        btn.addEventListener('click', this.handleQuickAmount.bind(this));
      });
    }
    
    // Simulate purchase
    if (this.elements.simulateBtn) {
      this.elements.simulateBtn.addEventListener('click', this.handleSimulatePurchase.bind(this));
    }
    
    // Initialize with default values
    this.updatePurchaseSummary();
    
    console.log('🎮 Simulation functionality initialized');
  }
  
  /**
   * Handle crypto selection
   */
  handleCryptoSelect(event) {
    const option = event.currentTarget;
    const crypto = option.getAttribute('data-crypto');
    
    // Update active state
    this.elements.cryptoOptions.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');
    
    // Update state
    this.state.simulationData.selectedCrypto = crypto;
    this.updatePurchaseSummary();
    
    this.trackEvent('simulation_crypto_select', {
      crypto: crypto,
      lesson: this.state.currentLesson
    });
  }
  
  /**
   * Handle amount change
   */
  handleAmountChange(event) {
    const amount = parseFloat(event.target.value) || 10;
    this.state.simulationData.purchaseAmount = Math.max(10, Math.min(1000, amount));
    
    // Update quick amount buttons
    this.elements.quickAmounts.forEach(btn => {
      btn.classList.remove('active');
      if (parseInt(btn.getAttribute('data-amount')) === this.state.simulationData.purchaseAmount) {
        btn.classList.add('active');
      }
    });
    
    this.updatePurchaseSummary();
  }
  
  /**
   * Handle quick amount selection
   */
  handleQuickAmount(event) {
    const btn = event.currentTarget;
    const amount = parseInt(btn.getAttribute('data-amount'));
    
    // Update active state
    this.elements.quickAmounts.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update input and state
    if (this.elements.purchaseAmountInput) {
      this.elements.purchaseAmountInput.value = amount;
    }
    this.state.simulationData.purchaseAmount = amount;
    
    this.updatePurchaseSummary();
  }
  
  /**
   * Update purchase summary
   */
  updatePurchaseSummary() {
    const { selectedCrypto, purchaseAmount, cryptoPrices } = this.state.simulationData;
    const cryptoPrice = cryptoPrices[selectedCrypto];
    const fee = purchaseAmount * 0.0009; // 0.09% fee
    const total = purchaseAmount + fee;
    const cryptoAmount = purchaseAmount / cryptoPrice;
    
    // Update summary display
    if (this.elements.summaryAmount) {
      this.elements.summaryAmount.textContent = `$${purchaseAmount.toFixed(2)}`;
    }
    
    if (this.elements.summaryFee) {
      this.elements.summaryFee.textContent = `$${fee.toFixed(2)}`;
    }
    
    if (this.elements.summaryTotal) {
      this.elements.summaryTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    if (this.elements.summaryCrypto) {
      const symbol = selectedCrypto.toUpperCase();
      let formatted;
      
      if (cryptoAmount >= 1) {
        formatted = cryptoAmount.toFixed(4);
      } else if (cryptoAmount >= 0.01) {
        formatted = cryptoAmount.toFixed(6);
      } else {
        formatted = cryptoAmount.toFixed(8);
      }
      
      this.elements.summaryCrypto.textContent = `${formatted} ${symbol}`;
    }
  }
  
  /**
   * Handle simulate purchase
   */
  handleSimulatePurchase() {
    const { selectedCrypto, purchaseAmount } = this.state.simulationData;
    
    // Show loading state
    if (this.elements.simulateBtn) {
      this.elements.simulateBtn.disabled = true;
      this.elements.simulateBtn.innerHTML = `
        <div class="spinner" style="width: 20px; height: 20px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></div>
        Processing...
      `;
    }
    
    // Simulate processing time
    setTimeout(() => {
      // Reset button
      if (this.elements.simulateBtn) {
        this.elements.simulateBtn.disabled = false;
        this.elements.simulateBtn.innerHTML = `
          <span>Simulate Purchase</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        `;
      }
      
      // Show success message
      this.showSimulationSuccess();
      
      // Update lesson progress
      this.updateLessonProgress(75);
      
      this.trackEvent('simulation_purchase_complete', {
        crypto: selectedCrypto,
        amount: purchaseAmount,
        lesson: this.state.currentLesson
      });
    }, 2000);
    
    this.trackEvent('simulation_purchase_started', {
      crypto: selectedCrypto,
      amount: purchaseAmount
    });
  }
  
  /**
   * Show simulation success message
   */
  showSimulationSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'simulation-success';
    successMessage.innerHTML = `
      <div style="background: var(--success-light); border: 1px solid var(--success-green); border-radius: var(--radius-lg); padding: var(--space-4); margin-top: var(--space-4); text-align: center;">
        <div style="font-size: var(--text-2xl); margin-bottom: var(--space-2);">🎉</div>
        <h4 style="color: var(--success-green); margin: 0 0 var(--space-2);">Purchase Simulated Successfully!</h4>
        <p style="margin: 0; color: var(--text-secondary);">Great job! You've learned how to make a crypto purchase. In the real app, your crypto would now be in your portfolio.</p>
      </div>
    `;
    
    const simulationContainer = document.querySelector('.simulation-container');
    if (simulationContainer) {
      simulationContainer.appendChild(successMessage);
      
      // Remove after 5 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    }
  }
  
  /**
   * Reset simulation state
   */
  resetSimulation() {
    this.state.simulationData.selectedCrypto = 'btc';
    this.state.simulationData.purchaseAmount = 10;
    
    // Reset UI
    this.elements.cryptoOptions?.forEach((opt, index) => {
      opt.classList.toggle('active', index === 0);
    });
    
    this.elements.quickAmounts?.forEach((btn, index) => {
      btn.classList.toggle('active', index === 0);
    });
    
    if (this.elements.purchaseAmountInput) {
      this.elements.purchaseAmountInput.value = 10;
    }
    
    this.updatePurchaseSummary();
    
    // Remove any success messages
    document.querySelectorAll('.simulation-success').forEach(el => el.remove());
  }
  
  /**
   * Initialize quiz functionality
   */
  initializeQuiz() {
    if (this.elements.quizSubmit) {
      this.elements.quizSubmit.addEventListener('click', this.handleQuizSubmit.bind(this));
    }
    
    console.log('🧠 Quiz functionality initialized');
  }
  
  /**
   * Handle quiz submission
   */
  handleQuizSubmit() {
    const selectedAnswer = document.querySelector('input[name="quiz-purchase"]:checked');
    
    if (!selectedAnswer) {
      alert('Please select an answer first!');
      return;
    }
    
    const isCorrect = selectedAnswer.value === 'b';
    
    // Show feedback
    if (this.elements.quizFeedback) {
      this.elements.quizFeedback.style.display = 'block';
    }
    
    if (isCorrect) {
      if (this.elements.feedbackCorrect) {
        this.elements.feedbackCorrect.style.display = 'block';
      }
      if (this.elements.feedbackIncorrect) {
        this.elements.feedbackIncorrect.style.display = 'none';
      }
      
      // Update lesson progress
      this.updateLessonProgress(100);
      
      // Enable lesson completion
      if (this.elements.completeBtn) {
        this.elements.completeBtn.disabled = false;
      }
    } else {
      if (this.elements.feedbackCorrect) {
        this.elements.feedbackCorrect.style.display = 'none';
      }
      if (this.elements.feedbackIncorrect) {
        this.elements.feedbackIncorrect.style.display = 'block';
      }
    }
    
    // Disable submit button
    if (this.elements.quizSubmit) {
      this.elements.quizSubmit.disabled = true;
    }
    
    this.trackEvent('quiz_submitted', {
      lesson: this.state.currentLesson,
      answer: selectedAnswer.value,
      correct: isCorrect
    });
  }
  
  /**
   * Reset quiz state
   */
  resetQuiz() {
    // Reset radio buttons
    document.querySelectorAll('input[name="quiz-purchase"]').forEach(input => {
      input.checked = false;
    });
    
    // Hide feedback
    if (this.elements.quizFeedback) {
      this.elements.quizFeedback.style.display = 'none';
    }
    
    // Re-enable submit button
    if (this.elements.quizSubmit) {
      this.elements.quizSubmit.disabled = false;
    }
    
    // Disable completion button
    if (this.elements.completeBtn) {
      this.elements.completeBtn.disabled = true;
    }
  }
  
  /**
   * Initialize progress tracking
   */
  initializeProgress() {
    this.lessonStartTime = Date.now();
    this.updateLessonProgress(0);
    this.updateOverallProgress();
    
    console.log('📊 Progress tracking initialized');
  }
  
  /**
   * Update lesson progress
   */
  updateLessonProgress(progress = null) {
    if (progress !== null) {
      this.state.lessonProgress = progress;
    }
    
    // Update progress bar
    if (this.elements.lessonProgress) {
      this.elements.lessonProgress.style.width = `${this.state.lessonProgress}%`;
    }
    
    // Update progress label
    const progressLabel = document.querySelector('.progress-label');
    if (progressLabel) {
      progressLabel.textContent = `${this.state.lessonProgress}% Complete`;
    }
  }
  
  /**
   * Update overall learning progress
   */
  updateOverallProgress() {
    const totalLessons = 8; // Aqua phase lessons
    const completedCount = this.state.completedLessons.length;
    const overallProgress = Math.round((completedCount / totalLessons) * 100);
    
    // Update progress circle
    if (this.elements.progressCircle) {
      const circumference = 2 * Math.PI * 16; // radius = 16
      const offset = circumference - (overallProgress / 100) * circumference;
      this.elements.progressCircle.style.strokeDashoffset = offset;
    }
    
    // Update progress text
    if (this.elements.progressText) {
      this.elements.progressText.textContent = `${overallProgress}%`;
    }
  }
  
  /**
   * Initialize achievement system
   */
  initializeAchievements() {
    if (this.elements.continueBtn) {
      this.elements.continueBtn.addEventListener('click', this.hideAchievement.bind(this));
    }
    
    if (this.elements.shareBtn) {
      this.elements.shareBtn.addEventListener('click', this.shareAchievement.bind(this));
    }
    
    console.log('🏆 Achievement system initialized');
  }
  
  /**
   * Show achievement modal
   */
  showAchievement(type, data) {
    if (this.elements.achievementModal) {
      // Update content
      const title = this.elements.achievementModal.querySelector('.achievement-title');
      const description = this.elements.achievementModal.querySelector('.achievement-description');
      
      if (title) title.textContent = data.title;
      if (description) description.textContent = data.description;
      
      // Show modal
      this.elements.achievementModal.classList.add('show');
      this.elements.achievementModal.setAttribute('aria-hidden', 'false');
      
      // Focus management
      if (this.elements.continueBtn) {
        this.elements.continueBtn.focus();
      }
    }
    
    this.trackEvent('achievement_shown', {
      type: type,
      lesson: this.state.currentLesson,
      ...data
    });
  }
  
  /**
   * Hide achievement modal
   */
  hideAchievement() {
    if (this.elements.achievementModal) {
      this.elements.achievementModal.classList.remove('show');
      this.elements.achievementModal.setAttribute('aria-hidden', 'true');
    }
  }
  
  /**
   * Share achievement
   */
  shareAchievement() {
    const text = `🎉 Just completed "${this.getLessonData(this.state.currentLesson)?.title}" on diBoaS Learning! Learning crypto with Aqua is amazing! 🌊`;
    
    if (navigator.share) {
      navigator.share({
        title: 'diBoaS Learning Achievement',
        text: text,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(text).then(() => {
        alert('Achievement text copied to clipboard!');
      });
    }
    
    this.trackEvent('achievement_shared', {
      lesson: this.state.currentLesson,
      method: navigator.share ? 'native' : 'clipboard'
    });
  }
  
  /**
   * Initialize mascot system
   */
  initializeMascotSystem() {
    if (this.elements.mascotOptions) {
      this.elements.mascotOptions.forEach(option => {
        option.addEventListener('click', this.handleMascotSelect.bind(this));
      });
    }
    
    this.updateMascotUI();
    
    console.log('🌊 Mascot system initialized');
  }
  
  /**
   * Handle mascot selection
   */
  handleMascotSelect(event) {
    const option = event.currentTarget;
    const mascot = option.getAttribute('data-mascot');
    
    // Update active state
    this.elements.mascotOptions.forEach(opt => {
      opt.classList.remove('active');
      opt.setAttribute('aria-pressed', 'false');
    });
    option.classList.add('active');
    option.setAttribute('aria-pressed', 'true');
    
    // Update state
    this.state.currentMascot = mascot;
    this.updateMascotUI();
    
    this.trackEvent('mascot_selected', {
      mascot: mascot,
      lesson: this.state.currentLesson
    });
  }
  
  /**
   * Update mascot UI
   */
  updateMascotUI() {
    const mascotData = {
      aqua: {
        name: 'Aqua',
        message: 'Ready to master crypto basics? Let\'s build your confidence step by step!',
        color: 'var(--aqua-primary)',
        level: 'Beginner Level'
      },
      verde: {
        name: 'Verde',
        message: 'Time to grow your portfolio! Let\'s explore advanced strategies together.',
        color: 'var(--verde-primary)',
        level: 'Growth Level'
      },
      mystic: {
        name: 'Mystic',
        message: 'Ready for DeFi mysteries? Advanced protocols await your discovery.',
        color: 'var(--mystic-primary)',
        level: 'Advanced Level'
      },
      coral: {
        name: 'Coral',
        message: 'Let\'s build community! Share your knowledge and help others grow.',
        color: 'var(--coral-primary)',
        level: 'Community Level'
      }
    };
    
    const data = mascotData[this.state.currentMascot];
    
    // Update current guide section
    if (this.elements.currentGuide) {
      const guideName = this.elements.currentGuide.querySelector('.guide-name');
      const guideMessage = this.elements.currentGuide.querySelector('.guide-message');
      
      if (guideName) guideName.textContent = `Learning with ${data.name}`;
      if (guideMessage) guideMessage.textContent = `"${data.message}"`;
    }
    
    // Update CSS custom property for accent color
    document.documentElement.style.setProperty('--platform-accent', data.color);
    
    // Update data attribute on html element
    document.documentElement.setAttribute('data-mascot', this.state.currentMascot);
  }
  
  /**
   * Initialize theme functionality
   */
  initializeTheme() {
    if (this.elements.themeToggle) {
      this.elements.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('diboas-learn-theme') || 'light';
    this.setTheme(savedTheme);
    
    console.log('🎨 Theme functionality initialized');
  }
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    this.trackEvent('theme_toggle', {
      from: this.state.theme,
      to: newTheme
    });
  }
  
  /**
   * Set theme
   */
  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('diboas-learn-theme', theme);
    
    // Update theme toggle icon
    if (this.elements.themeToggle) {
      const lightIcon = this.elements.themeToggle.querySelector('.theme-icon-light');
      const darkIcon = this.elements.themeToggle.querySelector('.theme-icon-dark');
      
      if (theme === 'dark') {
        if (lightIcon) lightIcon.style.display = 'none';
        if (darkIcon) darkIcon.style.display = 'block';
      } else {
        if (lightIcon) lightIcon.style.display = 'block';
        if (darkIcon) darkIcon.style.display = 'none';
      }
    }
  }
  
  /**
   * Initialize sidebar functionality
   */
  initializeSidebar() {
    if (this.elements.mobileMenuBtn) {
      this.elements.mobileMenuBtn.addEventListener('click', this.toggleSidebar.bind(this));
    }
    
    if (this.elements.sidebarOverlay) {
      this.elements.sidebarOverlay.addEventListener('click', this.closeSidebar.bind(this));
    }
    
    console.log('📱 Sidebar functionality initialized');
  }
  
  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    if (this.state.sidebarOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }
  
  /**
   * Open sidebar
   */
  openSidebar() {
    this.state.sidebarOpen = true;
    
    if (this.elements.sidebar) {
      this.elements.sidebar.classList.add('active');
    }
    
    if (this.elements.sidebarOverlay) {
      this.elements.sidebarOverlay.classList.add('active');
    }
    
    if (this.elements.mobileMenuBtn) {
      this.elements.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Close sidebar
   */
  closeSidebar() {
    this.state.sidebarOpen = false;
    
    if (this.elements.sidebar) {
      this.elements.sidebar.classList.remove('active');
    }
    
    if (this.elements.sidebarOverlay) {
      this.elements.sidebarOverlay.classList.remove('active');
    }
    
    if (this.elements.mobileMenuBtn) {
      this.elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    
    document.body.style.overflow = '';
  }
  
  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    this.setupKeyboardShortcuts();
    this.setupFocusManagement();
    this.setupReducedMotion();
    
    console.log('♿ Accessibility features initialized');
  }
  
  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Escape: Close modals and sidebar
      if (event.key === 'Escape') {
        this.hideAchievement();
        this.closeSidebar();
      }
      
      // Space: Play/pause video when focused
      if (event.key === ' ' && event.target === this.elements.playPauseBtn) {
        event.preventDefault();
        this.handleVideoToggle();
      }
      
      // Arrow keys: Navigate lessons (when sidebar focused)
      if (event.target.closest('.learning-nav')) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          this.navigateLessons(event.key === 'ArrowDown' ? 1 : -1);
        }
      }
    });
  }
  
  /**
   * Navigate lessons with keyboard
   */
  navigateLessons(direction) {
    const currentLink = document.querySelector('.lesson-link.active');
    if (!currentLink) return;
    
    const allLinks = Array.from(this.elements.lessonLinks);
    const currentIndex = allLinks.indexOf(currentLink);
    const nextIndex = currentIndex + direction;
    
    if (nextIndex >= 0 && nextIndex < allLinks.length) {
      allLinks[nextIndex].focus();
    }
  }
  
  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Trap focus in achievement modal when open
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' && this.elements.achievementModal?.classList.contains('show')) {
        const focusableElements = this.elements.achievementModal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
  
  /**
   * Setup reduced motion preferences
   */
  setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    }
    
    prefersReducedMotion.addEventListener('change', (event) => {
      if (event.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
      }
    });
  }
  
  /**
   * Initialize analytics
   */
  initializeAnalytics() {
    this.setupEngagementTracking();
    this.setupPerformanceMonitoring();
    
    console.log('📊 Analytics initialized');
  }
  
  /**
   * Setup engagement tracking
   */
  setupEngagementTracking() {
    let timeOnLesson = 0;
    let engagementStartTime = Date.now();
    
    // Track time on lesson
    setInterval(() => {
      timeOnLesson += 30;
      
      // Track engagement milestones
      if ([60, 180, 300, 600].includes(timeOnLesson)) {
        this.trackEvent('lesson_engagement', {
          timeOnLesson: timeOnLesson,
          lesson: this.state.currentLesson,
          progress: this.state.lessonProgress
        });
      }
    }, 30000);
    
    // Track interactions
    document.addEventListener('click', (event) => {
      const element = event.target.closest('[data-lesson], [data-crypto], [data-mascot]');
      if (element) {
        this.trackEvent('interaction', {
          type: element.tagName.toLowerCase(),
          target: element.className,
          lesson: this.state.currentLesson
        });
      }
    });
  }
  
  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Track page load performance
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
        
        this.trackEvent('learning_page_performance', {
          loadTime: loadTime,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
          lesson: this.state.currentLesson
        });
      }
    });
  }
  
  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && this.state.sidebarOpen) {
        this.closeSidebar();
      }
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (this.state.sidebarOpen) {
          this.closeSidebar();
        }
      }, 100);
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause video when page is hidden
        if (this.state.videoPlaying) {
          this.state.videoPlaying = false;
          this.updateVideoControls();
        }
      }
    });
  }
  
  /**
   * Load user state
   */
  loadUserState() {
    // Load progress data
    const progress = JSON.parse(localStorage.getItem('diboas-user-progress') || '{}');
    if (progress.currentLesson) {
      this.state.currentLesson = progress.currentLesson;
    }
    if (progress.currentMascot) {
      this.state.currentMascot = progress.currentMascot;
      this.updateMascotUI();
    }
    
    // Update UI based on completed lessons
    this.updateLessonCompletionUI();
    this.updateOverallProgress();
    
    console.log('💾 User state loaded');
  }
  
  /**
   * Save user progress
   */
  saveUserProgress() {
    const progressData = {
      currentLesson: this.state.currentLesson,
      currentMascot: this.state.currentMascot,
      completedLessons: this.state.completedLessons,
      lastActivity: Date.now()
    };
    
    localStorage.setItem('diboas-user-progress', JSON.stringify(progressData));
    localStorage.setItem('diboas-completed-lessons', JSON.stringify(this.state.completedLessons));
  }
  
  /**
   * Update lesson completion UI
   */
  updateLessonCompletionUI() {
    this.elements.lessonLinks?.forEach(link => {
      const lessonId = link.getAttribute('data-lesson');
      const statusIcon = link.querySelector('.status-icon');
      
      if (this.state.completedLessons.includes(lessonId)) {
        link.classList.add('completed');
        if (statusIcon) {
          statusIcon.classList.add('completed');
          statusIcon.textContent = '✓';
        }
      }
    });
  }
  
  /**
   * Unlock next lesson
   */
  unlockNextLesson() {
    const nextLessonId = this.getNextLessonId();
    if (nextLessonId) {
      const nextLink = document.querySelector(`[data-lesson="${nextLessonId}"]`);
      if (nextLink) {
        nextLink.classList.remove('locked');
        nextLink.removeAttribute('aria-disabled');
        
        if (this.elements.nextLessonBtn) {
          this.elements.nextLessonBtn.classList.remove('disabled');
        }
      }
    }
  }
  
  /**
   * Show locked lesson message
   */
  showLockedLessonMessage() {
    alert('Complete the previous lessons to unlock this content!');
  }
  
  /**
   * Show loading overlay
   */
  showLoading() {
    if (this.elements.loadingOverlay) {
      this.elements.loadingOverlay.classList.add('show');
      this.elements.loadingOverlay.setAttribute('aria-hidden', 'false');
    }
  }
  
  /**
   * Hide loading overlay
   */
  hideLoading() {
    if (this.elements.loadingOverlay) {
      this.elements.loadingOverlay.classList.remove('show');
      this.elements.loadingOverlay.setAttribute('aria-hidden', 'true');
    }
  }
  
  /**
   * Track analytics event
   */
  trackEvent(eventName, properties = {}) {
    try {
      // Use main app's tracking if available
      if (window.DiBoaS && window.DiBoaS.trackEvent) {
        window.DiBoaS.trackEvent(eventName, {
          ...properties,
          page: 'learning',
          timestamp: Date.now()
        });
      }
      
      // Local tracking for learning-specific events
      const eventData = {
        event: eventName,
        properties: {
          ...properties,
          page: 'learning',
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        }
      };
      
      // Store locally (in production, send to analytics service)
      const events = JSON.parse(localStorage.getItem('diboas-learning-analytics') || '[]');
      events.push(eventData);
      
      // Keep only last 200 events
      if (events.length > 200) {
        events.splice(0, events.length - 200);
      }
      
      localStorage.setItem('diboas-learning-analytics', JSON.stringify(events));
      
      console.log('📊 Learning Analytics Event:', eventName, properties);
      
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }
  
  /**
   * Handle errors
   */
  handleError(error, context = 'unknown') {
    console.error(`Learning App Error (${context}):`, error);
    
    this.trackEvent('learning_error', {
      context: context,
      error: error.message,
      stack: error.stack?.substring(0, 500)
    });
    
    // Graceful degradation
    return false;
  }
  
  /**
   * Get application state
   */
  getState() {
    return { ...this.state };
  }
}

// ===========================
// APPLICATION INITIALIZATION
// ===========================

/**
 * Initialize the learning application
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize the learning app
    window.DiBoaSLearningApp = new DiBoaSLearningApp();
    
    // Make it globally accessible
    window.diboasLearningApp = window.DiBoaSLearningApp;
    
    console.log('✅ diBoaS Learning Platform loaded successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize learning platform:', error);
  }
});

// ===========================
// SERVICE WORKER REGISTRATION
// ===========================

/**
 * Register service worker for PWA capabilities
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
      .then(registration => {
        console.log('📱 Learning SW registered:', registration);
      })
      .catch(registrationError => {
        console.log('📱 Learning SW registration failed:', registrationError);
      });
  });
}

// ===========================
// PERFORMANCE MONITORING
// ===========================

/**
 * Monitor Core Web Vitals for learning platform
 */
if ('performance' in window) {
  // Monitor Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('📊 Learning LCP:', entry.startTime);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // Monitor First Input Delay
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('📊 Learning FID:', entry.processingStart - entry.startTime);
    }
  }).observe({ entryTypes: ['first-input'] });
  
  // Monitor Cumulative Layout Shift
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        console.log('📊 Learning CLS:', entry.value);
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiBoaSLearningApp };
}