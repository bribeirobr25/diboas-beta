/**
 * diBoaS Mascots Page - Enterprise JavaScript Implementation
 * Phase 3: Enterprise Development Implementation
 * 
 * Features: Interactive mascot showcases, shapeshifting animations, emotional storytelling
 * Performance: Core Web Vitals optimized, lazy loading, efficient state management
 * Accessibility: WCAG 2.1 AA compliant, screen reader optimized, keyboard navigation
 */

'use strict';

// ===========================
// MASCOTS PAGE APPLICATION
// ===========================

/**
 * Main Mascots Page Application Class
 * Implements interactive mascot experiences with emotional storytelling
 */
class DiBoaSMascotsApp {
  constructor() {
    this.initialized = false;
    this.state = {
      currentHeroMascot: 'aqua',
      activeMascot: null,
      loadingComplete: false,
      
      // Animation states
      mascotAnimations: new Map(),
      intersectionObserver: null,
      
      // User interaction tracking
      interactions: {
        mascotHovers: 0,
        showcaseViews: 0,
        carouselInteractions: 0,
        timeOnPage: Date.now()
      },
      
      // Mascot data
      mascots: {
        aqua: {
          name: 'Aqua',
          title: 'The Gateway Whisperer',
          phase: 'first',
          color: '#4ECDC4',
          element: 'water',
          personality: 'gentle, patient, encouraging',
          unlockTrigger: 'First platform visit',
          quote: "I am your first gentle current into crypto. Every expert was once a beginner, and I am here to make that beginning beautiful."
        },
        verde: {
          name: 'Verde',
          title: 'The Growth Accelerator',
          phase: 'growth',
          color: '#A8E6CF',
          element: 'earth',
          personality: 'optimistic, strategic, abundant',
          unlockTrigger: '3+ transactions + confidence',
          quote: "I am the force that turns tiny seeds into mighty forests, small investments into abundant wealth."
        },
        mystic: {
          name: 'Mystic',
          title: 'The DeFi Oracle',
          phase: 'advanced',
          color: '#B39DDB',
          element: 'fire',
          personality: 'wise, mysterious, protective',
          unlockTrigger: '$100+ invested + engagement',
          quote: "I swim in the rivers of liquidity, I speak the language of smart contracts, I am the bridge between worlds."
        },
        coral: {
          name: 'Coral',
          title: 'The Community Catalyst',
          phase: 'community',
          color: '#FFB3BA',
          element: 'air',
          personality: 'connective, inclusive, collaborative',
          unlockTrigger: 'Helping others + expertise',
          quote: "I am the connecting force, the sharing spirit, the energy that turns individual knowledge into collective wisdom."
        }
      }
    };
    
    this.config = {
      animationSpeed: 800,
      carouselAutoplay: true,
      carouselInterval: 5000,
      intersectionThreshold: 0.3,
      performanceMode: this.detectPerformanceMode(),
      
      // Accessibility settings
      respectMotionPreference: true,
      keyboardNavigation: true,
      screenReaderOptimized: true
    };
    
    this.init();
  }
  
  /**
   * Initialize the mascots page application
   */
  async init() {
    if (this.initialized) return;
    
    try {
      console.log('🎭 Initializing diBoaS Mascots Experience');
      
      // Wait for DOM ready
      await this.waitForDOM();
      
      // Initialize core systems
      this.initializeLoadingScreen();
      this.initializeIntersectionObserver();
      this.initializeHeroCarousel();
      this.initializeMascotShowcases();
      this.initializeAnimations();
      this.initializeAccessibility();
      this.initializeEventListeners();
      this.initializePerformanceOptimizations();
      
      // Start experience
      await this.startMascotExperience();
      
      this.initialized = true;
      console.log('✨ Mascots experience initialized successfully');
      
      // Track initialization
      this.trackEvent('mascots_page_loaded', {
        load_time: Date.now() - this.state.interactions.timeOnPage,
        performance_mode: this.config.performanceMode
      });
      
    } catch (error) {
      console.error('❌ Mascots page initialization failed:', error);
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
   * Detect device performance mode
   */
  detectPerformanceMode() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'reduced';
    }
    
    // Check for slow connection
    if (navigator.connection) {
      const connection = navigator.connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        return 'low';
      }
    }
    
    // Check for low-end device
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      return 'medium';
    }
    
    return 'high';
  }
  
  /**
   * Initialize loading screen with mascot animations
   */
  initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    
    if (!loadingScreen) return;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          this.hideLoadingScreen();
        }, 500);
      }
      
      if (loadingProgress) {
        loadingProgress.style.width = `${progress}%`;
      }
    }, 200);
  }
  
  /**
   * Hide loading screen
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        this.state.loadingComplete = true;
        this.triggerEntranceAnimations();
      }, 800);
    }
  }
  
  /**
   * Initialize intersection observer for scroll-triggered animations
   */
  initializeIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, using fallback');
      return;
    }
    
    this.state.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleElementInView(entry.target);
        }
      });
    }, {
      threshold: this.config.intersectionThreshold,
      rootMargin: '50px'
    });
    
    // Observe showcase elements
    const showcases = document.querySelectorAll('.mascot-showcase');
    showcases.forEach(showcase => {
      this.state.intersectionObserver.observe(showcase);
    });
    
    // Observe other animated elements
    const animatedElements = document.querySelectorAll('.benefit-card, .timeline-milestone, .science-point');
    animatedElements.forEach(element => {
      this.state.intersectionObserver.observe(element);
    });
  }
  
  /**
   * Handle element coming into view
   */
  handleElementInView(element) {
    if (element.classList.contains('mascot-showcase')) {
      this.animateMascotShowcase(element);
      this.state.interactions.showcaseViews++;
    } else {
      this.animateElementEntrance(element);
    }
    
    // Stop observing once animated
    this.state.intersectionObserver.unobserve(element);
  }
  
  /**
   * Initialize hero mascot carousel
   */
  initializeHeroCarousel() {
    const previewCards = document.querySelectorAll('.mascot-preview-card');
    const heroStage = document.getElementById('heroMascotStage');
    
    if (!previewCards.length || !heroStage) return;
    
    // Setup preview card interactions
    previewCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const mascot = card.getAttribute('data-mascot');
        this.switchHeroMascot(mascot);
        this.state.interactions.carouselInteractions++;
      });
      
      card.addEventListener('mouseenter', () => {
        if (this.config.performanceMode === 'high') {
          const mascot = card.getAttribute('data-mascot');
          this.previewMascotHover(mascot);
        }
      });
    });
    
    // Auto-rotate carousel if enabled
    if (this.config.carouselAutoplay && this.config.performanceMode !== 'low') {
      this.startCarouselAutoplay();
    }
    
    // Keyboard navigation
    this.setupCarouselKeyboardNav();
  }
  
  /**
   * Switch active hero mascot
   */
  switchHeroMascot(mascotId) {
    if (this.state.currentHeroMascot === mascotId) return;
    
    const heroStage = document.getElementById('heroMascotStage');
    const previewCards = document.querySelectorAll('.mascot-preview-card');
    
    // Update preview cards
    previewCards.forEach(card => {
      card.classList.remove('active');
      if (card.getAttribute('data-mascot') === mascotId) {
        card.classList.add('active');
      }
    });
    
    // Update hero mascot
    const currentMascot = heroStage.querySelector('.floating-mascot.active');
    const newMascot = heroStage.querySelector(`[data-mascot="${mascotId}"]`);
    
    if (currentMascot && newMascot) {
      // Animate transition
      currentMascot.style.transform = 'translate(-50%, -50%) scale(0.8) rotate(10deg)';
      currentMascot.style.opacity = '0';
      
      setTimeout(() => {
        currentMascot.classList.remove('active');
        newMascot.classList.add('active');
        newMascot.style.transform = 'translate(-50%, -50%) scale(1.1) rotate(-5deg)';
        newMascot.style.opacity = '1';
        
        setTimeout(() => {
          newMascot.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
        }, 300);
      }, 400);
    }
    
    this.state.currentHeroMascot = mascotId;
    
    // Update page theme
    this.updatePageTheme(mascotId);
    
    // Track interaction
    this.trackEvent('hero_mascot_switch', {
      from: this.state.currentHeroMascot,
      to: mascotId,
      trigger: 'user_click'
    });
  }
  
  /**
   * Preview mascot on hover
   */
  previewMascotHover(mascotId) {
    const card = document.querySelector(`[data-mascot="${mascotId}"]`);
    if (card) {
      card.style.transform = 'translateY(-12px) scale(1.08)';
      setTimeout(() => {
        if (card.matches(':hover')) return; // Still hovering
        card.style.transform = '';
      }, 2000);
    }
  }
  
  /**
   * Start carousel autoplay
   */
  startCarouselAutoplay() {
    const mascotOrder = ['aqua', 'verde', 'mystic', 'coral'];
    let currentIndex = 0;
    
    setInterval(() => {
      if (document.hidden || this.state.activeMascot) return; // Pause if tab inactive or user interacting
      
      currentIndex = (currentIndex + 1) % mascotOrder.length;
      this.switchHeroMascot(mascotOrder[currentIndex]);
    }, this.config.carouselInterval);
  }
  
  /**
   * Setup carousel keyboard navigation
   */
  setupCarouselKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (!e.target.closest('.mascot-preview-carousel')) return;
      
      const mascotOrder = ['aqua', 'verde', 'mystic', 'coral'];
      const currentIndex = mascotOrder.indexOf(this.state.currentHeroMascot);
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = currentIndex > 0 ? currentIndex - 1 : mascotOrder.length - 1;
        this.switchHeroMascot(mascotOrder[newIndex]);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = currentIndex < mascotOrder.length - 1 ? currentIndex + 1 : 0;
        this.switchHeroMascot(mascotOrder[newIndex]);
      }
    });
  }
  
  /**
   * Initialize mascot showcases
   */
  initializeMascotShowcases() {
    const showcases = document.querySelectorAll('.mascot-showcase');
    
    showcases.forEach(showcase => {
      const mascotId = this.extractMascotIdFromElement(showcase);
      if (!mascotId) return;
      
      // Setup hover interactions
      if (this.config.performanceMode === 'high') {
        showcase.addEventListener('mouseenter', () => {
          this.startShowcaseHoverEffect(showcase, mascotId);
        });
        
        showcase.addEventListener('mouseleave', () => {
          this.endShowcaseHoverEffect(showcase, mascotId);
        });
      }
      
      // Setup click interactions for mobile
      showcase.addEventListener('click', () => {
        this.toggleShowcaseInteraction(showcase, mascotId);
      });
    });
  }
  
  /**
   * Extract mascot ID from showcase element
   */
  extractMascotIdFromElement(element) {
    const classList = element.classList;
    for (const className of classList) {
      if (className.includes('-showcase')) {
        return className.replace('-showcase', '');
      }
    }
    return null;
  }
  
  /**
   * Start showcase hover effect
   */
  startShowcaseHoverEffect(showcase, mascotId) {
    const mascot = this.state.mascots[mascotId];
    if (!mascot) return;
    
    // Enhance visual effects
    const stage = showcase.querySelector('.mascot-stage');
    const effects = showcase.querySelector('.stage-effects');
    
    if (stage) {
      stage.style.transform = 'scale(1.05)';
      stage.style.filter = 'brightness(1.1)';
    }
    
    if (effects) {
      effects.style.opacity = '0.3';
      effects.style.transform = 'scale(1.2)';
    }
    
    // Play hover sound (if enabled)
    this.playMascotSound(mascotId, 'hover');
    
    this.state.interactions.mascotHovers++;
  }
  
  /**
   * End showcase hover effect
   */
  endShowcaseHoverEffect(showcase, mascotId) {
    const stage = showcase.querySelector('.mascot-stage');
    const effects = showcase.querySelector('.stage-effects');
    
    if (stage) {
      stage.style.transform = '';
      stage.style.filter = '';
    }
    
    if (effects) {
      effects.style.opacity = '';
      effects.style.transform = '';
    }
  }
  
  /**
   * Toggle showcase interaction (for mobile)
   */
  toggleShowcaseInteraction(showcase, mascotId) {
    if (this.state.activeMascot === mascotId) {
      this.deactivateShowcase(showcase, mascotId);
    } else {
      this.activateShowcase(showcase, mascotId);
    }
  }
  
  /**
   * Activate showcase
   */
  activateShowcase(showcase, mascotId) {
    // Deactivate other showcases
    const allShowcases = document.querySelectorAll('.mascot-showcase');
    allShowcases.forEach(s => {
      if (s !== showcase) {
        s.classList.remove('active');
      }
    });
    
    showcase.classList.add('active');
    this.state.activeMascot = mascotId;
    
    // Enhanced animation
    this.animateMascotShowcase(showcase);
    
    // Update hero to match
    this.switchHeroMascot(mascotId);
    
    // Track interaction
    this.trackEvent('showcase_activated', {
      mascot: mascotId,
      method: 'click'
    });
  }
  
  /**
   * Deactivate showcase
   */
  deactivateShowcase(showcase, mascotId) {
    showcase.classList.remove('active');
    this.state.activeMascot = null;
    
    this.trackEvent('showcase_deactivated', {
      mascot: mascotId
    });
  }
  
  /**
   * Animate mascot showcase entrance
   */
  animateMascotShowcase(showcase) {
    const mascotImage = showcase.querySelector('.showcase-mascot, .mystic-orb');
    const content = showcase.querySelector('.showcase-content');
    const effects = showcase.querySelector('.stage-effects');
    
    if (this.config.performanceMode === 'reduced') {
      // Simple fade-in for reduced motion
      showcase.style.opacity = '0';
      showcase.style.opacity = '1';
      return;
    }
    
    // Staggered animation
    const timeline = [
      { element: mascotImage, delay: 0, animation: 'fadeInUp' },
      { element: content, delay: 200, animation: 'fadeInRight' },
      { element: effects, delay: 400, animation: 'fadeIn' }
    ];
    
    timeline.forEach(({ element, delay, animation }) => {
      if (element) {
        setTimeout(() => {
          element.classList.add(`animate-${animation}`);
        }, delay);
      }
    });
  }
  
  /**
   * Animate element entrance
   */
  animateElementEntrance(element) {
    if (this.config.performanceMode === 'reduced') {
      element.style.opacity = '1';
      return;
    }
    
    element.classList.add('animate-fadeInUp');
  }
  
  /**
   * Initialize all animations
   */
  initializeAnimations() {
    // Create animation stylesheet
    this.createAnimationStyles();
    
    // Setup performance-based animation controls
    if (this.config.performanceMode === 'low') {
      this.disableHeavyAnimations();
    }
    
    // Setup intersection-based animations
    this.setupScrollAnimations();
  }
  
  /**
   * Create animation styles
   */
  createAnimationStyles() {
    const style = document.createElement('style');
    style.id = 'mascot-animations';
    style.textContent = `
      .animate-fadeIn {
        animation: fadeIn 0.8s ease-out forwards;
      }
      
      .animate-fadeInUp {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      
      .animate-fadeInRight {
        animation: fadeInRight 0.8s ease-out forwards;
      }
      
      .animate-bounce {
        animation: gentleBounce 2s ease-in-out infinite;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes fadeInRight {
        from { 
          opacity: 0; 
          transform: translateX(-30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes gentleBounce {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * Disable heavy animations for low performance mode
   */
  disableHeavyAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      
      .floating-mascot {
        animation: none !important;
      }
      
      .stage-effects {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Setup scroll-based animations
   */
  setupScrollAnimations() {
    // Timeline animation
    const timelinePath = document.querySelector('.timeline-path');
    if (timelinePath) {
      this.animateTimelinePath();
    }
    
    // Science section animation
    const sciencePoints = document.querySelectorAll('.science-point');
    sciencePoints.forEach((point, index) => {
      setTimeout(() => {
        if (this.isElementInViewport(point)) {
          point.classList.add('animate-fadeInUp');
        }
      }, index * 200);
    });
  }
  
  /**
   * Animate timeline path
   */
  animateTimelinePath() {
    const path = document.querySelector('.timeline-path::before');
    if (path && this.config.performanceMode === 'high') {
      // Animate path drawing (would need SVG implementation for full effect)
      console.log('Animating timeline path');
    }
  }
  
  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    // Setup ARIA labels
    this.setupAriaLabels();
    
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
    
    // Setup screen reader announcements
    this.setupScreenReaderSupport();
    
    // Setup focus management
    this.setupFocusManagement();
  }
  
  /**
   * Setup ARIA labels
   */
  setupAriaLabels() {
    const showcases = document.querySelectorAll('.mascot-showcase');
    showcases.forEach((showcase, index) => {
      const mascotId = this.extractMascotIdFromElement(showcase);
      if (mascotId) {
        const mascot = this.state.mascots[mascotId];
        showcase.setAttribute('aria-label', `Learn about ${mascot.name}, ${mascot.title}`);
        showcase.setAttribute('tabindex', '0');
      }
    });
    
    // Preview cards
    const previewCards = document.querySelectorAll('.mascot-preview-card');
    previewCards.forEach(card => {
      const mascotId = card.getAttribute('data-mascot');
      if (mascotId) {
        const mascot = this.state.mascots[mascotId];
        card.setAttribute('aria-label', `Switch to ${mascot.name} guide`);
        card.setAttribute('role', 'button');
      }
    });
  }
  
  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape key to close interactions
      if (e.key === 'Escape' && this.state.activeMascot) {
        const activeShowcase = document.querySelector('.mascot-showcase.active');
        if (activeShowcase) {
          this.deactivateShowcase(activeShowcase, this.state.activeMascot);
        }
      }
      
      // Enter/Space to activate showcases
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('mascot-showcase')) {
        e.preventDefault();
        const mascotId = this.extractMascotIdFromElement(e.target);
        if (mascotId) {
          this.toggleShowcaseInteraction(e.target, mascotId);
        }
      }
    });
  }
  
  /**
   * Setup screen reader support
   */
  setupScreenReaderSupport() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'mascot-announcements';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
    
    this.liveRegion = liveRegion;
  }
  
  /**
   * Announce to screen readers
   */
  announceToScreenReader(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
    }
  }
  
  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Ensure proper focus order
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), .mascot-showcase'
    );
    
    focusableElements.forEach((element, index) => {
      element.addEventListener('focus', () => {
        // Announce focus for mascot elements
        if (element.classList.contains('mascot-showcase')) {
          const mascotId = this.extractMascotIdFromElement(element);
          if (mascotId) {
            const mascot = this.state.mascots[mascotId];
            this.announceToScreenReader(`Focused on ${mascot.name}, ${mascot.title}`);
          }
        }
      });
    });
  }
  
  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Scroll to mascots function
    window.scrollToMascots = () => {
      const mascotsSection = document.getElementById('mascots');
      if (mascotsSection) {
        mascotsSection.scrollIntoView({ behavior: 'smooth' });
        this.trackEvent('scroll_to_mascots', { trigger: 'button_click' });
      }
    };
    
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
    
    // Resize handling
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    // Navigation clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
  
  /**
   * Initialize performance optimizations
   */
  initializePerformanceOptimizations() {
    // Lazy load images
    this.setupLazyLoading();
    
    // Optimize animations based on device capabilities
    this.optimizeAnimations();
    
    // Setup efficient event listeners
    this.setupEfficientListeners();
    
    // Monitor performance
    this.monitorPerformance();
  }
  
  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }
  
  /**
   * Optimize animations based on device
   */
  optimizeAnimations() {
    // Disable heavy animations on mobile
    if (window.innerWidth < 768) {
      this.config.performanceMode = 'medium';
    }
    
    // Check for battery API
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        if (battery.level < 0.2) {
          this.config.performanceMode = 'low';
          this.disableHeavyAnimations();
        }
      });
    }
  }
  
  /**
   * Setup efficient event listeners
   */
  setupEfficientListeners() {
    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          this.handleScroll();
          scrollTimeout = null;
        }, 16); // ~60fps
      }
    }, { passive: true });
  }
  
  /**
   * Monitor performance metrics
   */
  monitorPerformance() {
    if ('performance' in window) {
      // Monitor memory usage
      if ('memory' in performance) {
        setInterval(() => {
          const memInfo = performance.memory;
          if (memInfo.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
            console.warn('High memory usage detected');
            this.optimizeMemoryUsage();
          }
        }, 30000);
      }
      
      // Monitor frame rate
      this.monitorFrameRate();
    }
  }
  
  /**
   * Monitor frame rate
   */
  monitorFrameRate() {
    let frames = 0;
    let lastTime = performance.now();
    
    const checkFrameRate = (currentTime) => {
      frames++;
      
      if (currentTime - lastTime >= 1000) { // Every second
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        
        if (fps < 30 && this.config.performanceMode !== 'low') {
          console.warn(`Low FPS detected: ${fps}`);
          this.reduceAnimationComplexity();
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkFrameRate);
    };
    
    requestAnimationFrame(checkFrameRate);
  }
  
  /**
   * Reduce animation complexity
   */
  reduceAnimationComplexity() {
    const style = document.createElement('style');
    style.textContent = `
      .stage-effects {
        opacity: 0.05 !important;
      }
      
      .floating-mascot {
        animation-duration: 8s !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Optimize memory usage
   */
  optimizeMemoryUsage() {
    // Clear unused animation references
    this.state.mascotAnimations.clear();
    
    // Remove hidden elements from DOM temporarily
    const hiddenElements = document.querySelectorAll('[style*="display: none"]');
    hiddenElements.forEach(element => {
      if (!element.dataset.critical) {
        element.remove();
      }
    });
  }
  
  /**
   * Start the mascot experience
   */
  async startMascotExperience() {
    // Initial hero setup
    this.switchHeroMascot('aqua');
    
    // Trigger entrance animations
    this.triggerEntranceAnimations();
    
    // Start interactive features
    this.startInteractiveFeatures();
  }
  
  /**
   * Trigger entrance animations
   */
  triggerEntranceAnimations() {
    if (!this.state.loadingComplete) return;
    
    const hero = document.querySelector('.hero-section');
    const previewCards = document.querySelectorAll('.mascot-preview-card');
    
    // Animate hero elements
    setTimeout(() => {
      if (hero) hero.classList.add('animate-fadeIn');
    }, 200);
    
    // Animate preview cards
    previewCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-fadeInUp');
      }, 400 + (index * 100));
    });
  }
  
  /**
   * Start interactive features
   */
  startInteractiveFeatures() {
    // Enable tooltips
    this.enableTooltips();
    
    // Start ambient effects
    if (this.config.performanceMode === 'high') {
      this.startAmbientEffects();
    }
    
    // Initialize mascot personalities
    this.initializeMascotPersonalities();
  }
  
  /**
   * Enable tooltips
   */
  enableTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', this.showTooltip.bind(this));
      element.addEventListener('mouseleave', this.hideTooltip.bind(this));
    });
  }
  
  /**
   * Show tooltip
   */
  showTooltip(event) {
    const element = event.target;
    const text = element.getAttribute('title');
    
    if (!text) return;
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'mascot-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      pointer-events: none;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    
    // Show tooltip
    requestAnimationFrame(() => {
      tooltip.style.opacity = '1';
    });
    
    // Store reference
    element._tooltip = tooltip;
  }
  
  /**
   * Hide tooltip
   */
  hideTooltip(event) {
    const element = event.target;
    if (element._tooltip) {
      element._tooltip.style.opacity = '0';
      setTimeout(() => {
        if (element._tooltip && element._tooltip.parentNode) {
          element._tooltip.parentNode.removeChild(element._tooltip);
        }
        delete element._tooltip;
      }, 300);
    }
  }
  
  /**
   * Start ambient effects
   */
  startAmbientEffects() {
    // Particle effects
    this.createParticleEffect();
    
    // Subtle background animations
    this.startBackgroundAnimations();
  }
  
  /**
   * Create particle effect
   */
  createParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.3;
    `;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Simple particle system
    const animate = () => {
      if (document.hidden) {
        requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.y -= particle.speed;
        particle.opacity -= 0.005;
        
        if (particle.opacity <= 0) {
          particles.splice(index, 1);
          return;
        }
        
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      // Add new particles occasionally
      if (Math.random() < 0.1 && particles.length < 50) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 1,
          opacity: 1,
          color: ['#4ECDC4', '#A8E6CF', '#B39DDB', '#FFB3BA'][Math.floor(Math.random() * 4)]
        });
      }
      
      requestAnimationFrame(animate);
    };
    
    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
  }
  
  /**
   * Start background animations
   */
  startBackgroundAnimations() {
    const hero = document.querySelector('.hero-section');
    if (hero) {
      // Subtle gradient animation
      let hue = 0;
      setInterval(() => {
        hue = (hue + 1) % 360;
        hero.style.filter = `hue-rotate(${hue * 0.1}deg)`;
      }, 100);
    }
  }
  
  /**
   * Initialize mascot personalities
   */
  initializeMascotPersonalities() {
    // Setup personality-based interactions
    Object.keys(this.state.mascots).forEach(mascotId => {
      const mascot = this.state.mascots[mascotId];
      this.setupMascotPersonality(mascotId, mascot);
    });
  }
  
  /**
   * Setup individual mascot personality
   */
  setupMascotPersonality(mascotId, mascot) {
    const showcase = document.querySelector(`.${mascotId}-showcase`);
    if (!showcase) return;
    
    // Add personality-specific interactions
    showcase.addEventListener('mouseenter', () => {
      this.playMascotSound(mascotId, 'greeting');
      this.showMascotThought(mascotId);
    });
  }
  
  /**
   * Play mascot sound
   */
  playMascotSound(mascotId, type) {
    // Placeholder for sound system
    console.log(`Playing ${type} sound for ${mascotId}`);
  }
  
  /**
   * Show mascot thought bubble
   */
  showMascotThought(mascotId) {
    const mascot = this.state.mascots[mascotId];
    if (!mascot) return;
    
    // Show contextual thought based on mascot personality
    const thoughts = {
      aqua: ["Let's start your journey gently 🌊", "Every expert was once a beginner", "I'm here to help you feel confident"],
      verde: ["Ready to grow your wealth? 🌱", "Small seeds become mighty trees", "Patience and consistency create abundance"],
      mystic: ["The crypto mysteries await 🔮", "Knowledge is your greatest asset", "Advanced strategies for the prepared mind"],
      coral: ["Community makes us stronger 🌸", "Shared wisdom multiplies wealth", "Together we achieve more"]
    };
    
    const thoughtText = thoughts[mascotId][Math.floor(Math.random() * thoughts[mascotId].length)];
    this.showThoughtBubble(mascotId, thoughtText);
  }
  
  /**
   * Show thought bubble
   */
  showThoughtBubble(mascotId, text) {
    const showcase = document.querySelector(`.${mascotId}-showcase`);
    if (!showcase) return;
    
    // Create thought bubble
    const bubble = document.createElement('div');
    bubble.className = 'thought-bubble';
    bubble.textContent = text;
    bubble.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: white;
      border: 2px solid ${this.state.mascots[mascotId].color};
      border-radius: 20px;
      padding: 10px 15px;
      font-size: 14px;
      max-width: 200px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 10;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `;
    
    showcase.style.position = 'relative';
    showcase.appendChild(bubble);
    
    // Animate in
    requestAnimationFrame(() => {
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateY(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
      bubble.style.opacity = '0';
      bubble.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (bubble.parentNode) {
          bubble.parentNode.removeChild(bubble);
        }
      }, 300);
    }, 3000);
  }
  
  /**
   * Update page theme based on active mascot
   */
  updatePageTheme(mascotId) {
    const mascot = this.state.mascots[mascotId];
    if (!mascot) return;
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--active-mascot-color', mascot.color);
    
    // Update meta theme color
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.content = mascot.color;
    }
  }
  
  /**
   * Handle scroll events
   */
  handleScroll() {
    // Update active sections
    this.updateActiveSection();
    
    // Parallax effects for high performance mode
    if (this.config.performanceMode === 'high') {
      this.updateParallaxEffects();
    }
  }
  
  /**
   * Update active section based on scroll position
   */
  updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Update navigation if exists
        const navLink = document.querySelector(`a[href="#${section.id}"]`);
        if (navLink) {
          document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  }
  
  /**
   * Update parallax effects
   */
  updateParallaxEffects() {
    const scrollY = window.pageYOffset;
    const heroMascots = document.querySelectorAll('.floating-mascot');
    
    heroMascots.forEach((mascot, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrollY * speed);
      mascot.style.transform = `translate(-50%, calc(-50% + ${yPos}px))`;
    });
  }
  
  /**
   * Handle resize events
   */
  handleResize() {
    // Update carousel if needed
    const carousel = document.querySelector('.mascot-preview-track');
    if (carousel) {
      // Reset scroll position if needed
      carousel.scrollLeft = 0;
    }
    
    // Update particle canvas if exists
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }
  
  /**
   * Pause animations when page is hidden
   */
  pauseAnimations() {
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(element => {
      element.style.animationPlayState = 'paused';
    });
  }
  
  /**
   * Resume animations when page is visible
   */
  resumeAnimations() {
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(element => {
      element.style.animationPlayState = 'running';
    });
  }
  
  /**
   * Check if element is in viewport
   */
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  /**
   * Track analytics events
   */
  trackEvent(eventName, properties = {}) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        page: 'mascots',
        user_agent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        performance_mode: this.config.performanceMode,
        ...this.state.interactions
      }
    };
    
    console.log('📊 Mascots Analytics:', event);
    
    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
    
    // Store locally for offline sync
    const events = JSON.parse(localStorage.getItem('diboas_mascots_events') || '[]');
    events.push(event);
    localStorage.setItem('diboas_mascots_events', JSON.stringify(events.slice(-50)));
  }
  
  /**
   * Initialize fallback mode
   */
  initializeFallbackMode() {
    console.log('🔄 Initializing mascots fallback mode');
    
    // Hide loading screen
    this.hideLoadingScreen();
    
    // Basic functionality only
    const showcases = document.querySelectorAll('.mascot-showcase');
    showcases.forEach(showcase => {
      showcase.addEventListener('click', () => {
        console.log('Showcase clicked in fallback mode');
      });
    });
    
    // Track fallback mode
    this.trackEvent('fallback_mode_activated', {
      reason: 'initialization_failed'
    });
  }
  
  /**
   * Get current state for debugging
   */
  getState() {
    return {
      ...this.state,
      config: this.config,
      initialized: this.initialized
    };
  }
}

// ===========================
// INITIALIZATION
// ===========================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.diBoaSMascotsApp = new DiBoaSMascotsApp();
});

// Global scroll function
function scrollToMascots() {
  const mascotsSection = document.getElementById('mascots');
  if (mascotsSection) {
    mascotsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiBoaSMascotsApp;
}