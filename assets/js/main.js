/**
 * diBoaS Enterprise Redesign JavaScript
 * Phase 3: Development Implementation
 * 
 * Architecture: Domain-driven, event-driven, performance-optimized
 * Features: Conversion tracking, A/B testing, error monitoring, accessibility
 * Target: Core Web Vitals optimization, 95+ Lighthouse score
 * Browser Support: ES2020+, Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
 */

'use strict';

// ===========================
// CORE SYSTEM ARCHITECTURE
// ===========================

/**
 * Main diBoaS namespace and application entry point
 */
window.DiBoaS = (function () {

  // Private state management
  const state = {
    initialized: false,
    userSession: null,
    analytics: null,
    performance: {},
    errors: [],
    config: window.ENV || {}
  };

  // Core modules
  const modules = {
    analytics: null,
    performance: null,
    interactions: null,
    accessibility: null,
    abTesting: null
  };

  /**
   * Initialize the application
   */
  function init() {
    if (state.initialized) return;

    try {
      console.log('🚀 Initializing diBoaS Enterprise Application');

      // Initialize core modules in dependency order
      initializePerformanceMonitoring();
      initializeErrorHandling();
      // initializeAnalytics(); // Removed analytics
      initializeInteractions();
      initializeAccessibility();
      initializeABTesting();
      // initializeConversionTracking(); // Removed analytics

      state.initialized = true;
      console.log('✅ diBoaS application initialized successfully');

      // Track successful initialization (stubbed)
      // trackEvent('app_initialized', {
      //   timestamp: Date.now(),
      //   user_agent: navigator.userAgent,
      //   viewport: `${window.innerWidth}x${window.innerHeight}`
      // });

    } catch (error) {
      console.error('❌ Failed to initialize diBoaS application:', error);
      handleError(error, 'initialization');
    }
  }

  /**
   * Public API
   */
  return {
    init,
    trackEvent: (eventName, properties) => trackEvent(eventName, properties),
    getState: () => ({ ...state }),
    handleError: (error, context) => handleError(error, context)
  };

})();

// ===========================
// PERFORMANCE MONITORING
// ===========================

/**
 * Performance monitoring and Core Web Vitals tracking
 */
function initializePerformanceMonitoring() {
  const performanceData = {
    fcp: null,
    lcp: null,
    fid: null,
    cls: 0,
    ttfb: null
  };

  // First Contentful Paint
  const fcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const fcp = entries[entries.length - 1];
    performanceData.fcp = fcp.startTime;

    // Performance tracking stubbed
    // if (window.ENV && window.ENV.FEATURE_FLAGS && window.ENV.FEATURE_FLAGS.ADVANCED_ANALYTICS) {
    //   trackEvent('performance_fcp', { value: Math.round(fcp.startTime) });
    // }
  });

  try {
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {
    console.warn('FCP observer not supported');
  }

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lcp = entries[entries.length - 1];
    performanceData.lcp = lcp.startTime;

    // Performance tracking stubbed
    // if (window.ENV && window.ENV.FEATURE_FLAGS && window.ENV.FEATURE_FLAGS.ADVANCED_ANALYTICS) {
    //   trackEvent('performance_lcp', { value: Math.round(lcp.startTime) });
    // }
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP observer not supported');
  }

  // First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      performanceData.fid = entry.processingStart - entry.startTime;

      // Performance tracking stubbed
      // if (window.ENV && window.ENV.FEATURE_FLAGS && window.ENV.FEATURE_FLAGS.ADVANCED_ANALYTICS) {
      //   trackEvent('performance_fid', { value: Math.round(performanceData.fid) });
      // }
    });
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID observer not supported');
  }

  // Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    performanceData.cls = clsValue;
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    console.warn('CLS observer not supported');
  }

  // Time to First Byte
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      performanceData.ttfb = navigation.responseStart - navigation.requestStart;

      // Performance tracking stubbed
      // if (window.ENV && window.ENV.FEATURE_FLAGS && window.ENV.FEATURE_FLAGS.ADVANCED_ANALYTICS) {
      //   trackEvent('performance_ttfb', { value: Math.round(performanceData.ttfb) });
      // }
    }
  });

  // Store performance data globally
  window.DiBoaS.performance = performanceData;
}

// ===========================
// ERROR HANDLING & MONITORING
// ===========================

/**
 * Global error handling and monitoring
 */
function initializeErrorHandling() {
  // Global error handler
  window.addEventListener('error', (event) => {
    const error = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    handleError(error, 'javascript_error');
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const error = {
      reason: event.reason,
      promise: event.promise,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    handleError(error, 'unhandled_promise_rejection');
  });

  // Network error monitoring
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    return originalFetch.apply(this, args)
      .catch(error => {
        handleError({
          type: 'network_error',
          url: args[0],
          error: error.message,
          timestamp: Date.now()
        }, 'network');
        throw error;
      });
  };
}

/**
 * Centralized error handling
 */
function handleError(error, context = 'unknown') {
  console.error(`[diBoaS Error - ${context}]:`, error);

  // Store error locally
  const errorEntry = {
    error,
    context,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  if (window.DiBoaS && window.DiBoaS.getState) {
    const state = window.DiBoaS.getState();
    state.errors.push(errorEntry);

    // Limit error storage to prevent memory issues
    if (state.errors.length > 50) {
      state.errors.shift();
    }
  }

  // Send to monitoring service in production (stubbed)
  if (window.ENV && window.ENV.FEATURE_FLAGS && window.ENV.FEATURE_FLAGS.ERROR_MONITORING && window.ENV.NODE_ENV === 'production') {
    // This would integrate with your error monitoring service
    // Example: Sentry, Bugsnag, etc.
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorEntry)
      }).catch(() => {
        // Silently fail if error reporting fails
      });
    } catch (e) {
      // Prevent error handling from causing more errors
    }
  }
}

// ===========================
// ANALYTICS & CONVERSION TRACKING
// ===========================

/**
 * Analytics and conversion tracking initialization (STUBBED)
 */
function initializeAnalytics() {
  // Initialize session tracking
  const sessionId = generateSessionId();
  const userId = getUserId();

  // Set up analytics context (minimal for compatibility)
  window.analyticsContext = {
    sessionId,
    userId,
    pageLoadTime: Date.now(),
    persona: document.documentElement.getAttribute('data-persona') || 'carla',
    theme: document.documentElement.getAttribute('data-theme') || 'default'
  };

  // Track page view (stubbed)
  // trackEvent('page_view', {
  //   page: window.location.pathname,
  //   title: document.title,
  //   referrer: document.referrer,
  //   ...window.analyticsContext
  // });

  // Initialize scroll depth tracking (stubbed)
  // initializeScrollDepthTracking();

  // Initialize time on page tracking (stubbed)
  // initializeTimeOnPageTracking();
}

/**
 * Core event tracking function (STUBBED)
 */
function trackEvent(eventName, properties = {}) {
  // Completely stubbed - no analytics tracking
  console.log('📊 Analytics Event (stubbed):', eventName, properties);
  return;

  // Original code commented out
  /*
  const event = {
    event: eventName,
    properties: {
      ...properties,
      timestamp: Date.now(),
      url: window.location.href,
      sessionId: window.analyticsContext?.sessionId,
      userId: window.analyticsContext?.userId,
      persona: window.analyticsContext?.persona
    }
  };

  // Console logging for development
  if (window.ENV && window.ENV.NODE_ENV !== 'production') {
    console.log('📊 Analytics Event:', event);
  }

  // Send to Google Analytics 4 if available
  if (typeof gtag !== 'undefined' && window.ENV && window.ENV.FEATURE_FLAGS && window.ENV.FEATURE_FLAGS.CONVERSION_TRACKING) {
    gtag('event', eventName, {
      ...properties,
      send_to: window.ENV.ANALYTICS_ID
    });
  }

  // Send to custom analytics endpoint
  if (window.ENV && window.ENV.FEATURE_FLAGS && window.ENV.FEATURE_FLAGS.ADVANCED_ANALYTICS && window.ENV.NODE_ENV === 'production') {
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event),
        keepalive: true
      }).catch(() => {
        // Silently fail if analytics fails
      });
    } catch (e) {
      // Prevent analytics from breaking the app
    }
  }

  // Store locally for debugging
  if (!window.analyticsEvents) {
    window.analyticsEvents = [];
  }
  window.analyticsEvents.push(event);
  
  // Limit local storage
  if (window.analyticsEvents.length > 100) {
    window.analyticsEvents.shift();
  }
  */
}

/**
 * Scroll depth tracking
 */
function initializeScrollDepthTracking() {
  let maxScrollDepth = 0;
  const milestones = [25, 50, 75, 90, 100];
  const trackedMilestones = new Set();

  function trackScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const scrollPercent = Math.round((scrollTop + windowHeight) / documentHeight * 100);

    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
      document.body.setAttribute('data-scroll-depth', maxScrollDepth);
    }

    // Track milestone achievements
    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
        trackedMilestones.add(milestone);
        // trackEvent('scroll_depth', {
        //   depth: milestone,
        //   max_depth: maxScrollDepth
        // });
      }
    });
  }

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        trackScrollDepth();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * Time on page tracking
 */
function initializeTimeOnPageTracking() {
  const startTime = Date.now();
  let lastActiveTime = startTime;
  let totalActiveTime = 0;
  let isActive = true;

  // Track user activity
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

  function updateActivity() {
    if (!isActive) {
      isActive = true;
      lastActiveTime = Date.now();
    }
  }

  activityEvents.forEach(event => {
    document.addEventListener(event, updateActivity, { passive: true });
  });

  // Track inactive periods
  function checkInactivity() {
    if (isActive && Date.now() - lastActiveTime > 30000) { // 30 seconds of inactivity
      isActive = false;
      totalActiveTime += Date.now() - lastActiveTime;
    }
  }

  setInterval(checkInactivity, 5000);

  // Track time milestones
  const timeMilestones = [30, 60, 120, 300]; // seconds
  const trackedTimeMilestones = new Set();

  setInterval(() => {
    const currentTime = Date.now();
    const timeOnPage = Math.floor((currentTime - startTime) / 1000);

    timeMilestones.forEach(milestone => {
      if (timeOnPage >= milestone && !trackedTimeMilestones.has(milestone)) {
        trackedTimeMilestones.add(milestone);
        // trackEvent('time_on_page', {
        //   duration: milestone,
        //   active_time: Math.floor(totalActiveTime / 1000),
        //   total_time: timeOnPage
        // });
      }
    });
  }, 10000);

  // Track on page unload
  window.addEventListener('beforeunload', () => {
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - startTime) / 1000);
    const activeTime = Math.floor((totalActiveTime + (isActive ? endTime - lastActiveTime : 0)) / 1000);

    // trackEvent('page_exit', {
    //   total_time: totalTime,
    //   active_time: activeTime,
    //   engagement_rate: Math.round((activeTime / totalTime) * 100)
    // });
  });
}

// ===========================
// INTERACTION HANDLERS
// ===========================

/**
 * Interactive component initialization
 */
function initializeInteractions() {
  initializeNavigation();
  initializeCTATracking();
  initializeAssetSelection();
  initializeFormInteractions();
  initializeMascotInteractions();
  initializeResponsiveFeatures();
}

/**
 * Navigation interactions
 */
function initializeNavigation() {
  const header = document.getElementById('header');
  let lastScrollY = window.scrollY;

  // Header scroll behavior
  function updateHeader() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', throttle(updateHeader, 10));

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';

      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');

      // Animate hamburger lines
      const lines = mobileMenuToggle.querySelectorAll('.hamburger-line');
      lines.forEach((line, index) => {
        if (!isExpanded) {
          if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (index === 1) line.style.opacity = '0';
          if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          line.style.transform = '';
          line.style.opacity = '';
        }
      });

      // trackEvent('mobile_menu_toggle', { expanded: !isExpanded });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // trackEvent('anchor_navigation', {
        //   target: this.getAttribute('href'),
        //   source_section: this.closest('section')?.id || 'unknown'
        // });
      }
    });
  });
}

/**
 * CTA button tracking and interactions
 */
function initializeCTATracking() {
  // Track all CTA interactions
  document.querySelectorAll('[data-action]').forEach(element => {
    element.addEventListener('click', function (e) {
      const action = this.getAttribute('data-action');
      const asset = this.getAttribute('data-asset');
      const section = this.closest('section')?.id || 'unknown';

      // trackEvent('cta_click', {
      //   action,
      //   asset,
      //   section,
      //   button_text: this.textContent.trim(),
      //   button_type: this.tagName.toLowerCase()
      // });

      // Add visual feedback
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);

      // Handle specific actions
      handleCTAAction(action, { asset, section, element: this });
    });
  });

  // Track hover events on primary CTAs
  document.querySelectorAll('.cta-primary-hero, .cta-primary-large').forEach(element => {
    let hoverStartTime;

    element.addEventListener('mouseenter', () => {
      hoverStartTime = Date.now();
    });

    element.addEventListener('mouseleave', () => {
      if (hoverStartTime) {
        const hoverDuration = Date.now() - hoverStartTime;
        // trackEvent('cta_hover', {
        //   duration: hoverDuration,
        //   element_id: element.id || element.className,
        //   section: element.closest('section')?.id || 'unknown'
        // });
      }
    });
  });
}

/**
 * Handle specific CTA actions
 */
function handleCTAAction(action, context) {
  switch (action) {
    case 'meet-aqua':
    case 'get-started':
    case 'get-started-main':
      // Redirect to app with onboarding flow
      showModal('Welcome! Ready to start your wealth journey?', {
        primaryAction: {
          text: 'Start with Aqua',
          action: () => {
            // trackEvent('onboarding_start', context);
            window.location.href = './app/?flow=onboarding';
          }
        },
        secondaryAction: {
          text: 'Learn More First',
          action: () => {
            // trackEvent('learn_more_selected', context);
            window.location.href = './learn/';
          }
        }
      });
      break;

    case 'select-asset':
      // trackEvent('asset_selected', {
      //   ...context,
      //   selection_method: 'decision_matrix'
      // });
      showAssetConfirmation(context.asset);
      break;

    case 'start-bitcoin':
      // trackEvent('asset_selected', {
      //   ...context,
      //   asset: 'bitcoin',
      //   selection_method: 'aqua_recommendation'
      // });
      showAssetConfirmation('bitcoin');
      break;

    case 'learn-more':
      // trackEvent('learn_more_clicked', context);
      window.location.href = './learn/';
      break;

    default:
      console.log('Unhandled CTA action:', action);
  }
}

/**
 * Asset selection interactions
 */
function initializeAssetSelection() {
  // Asset card interactions in hero section
  document.querySelectorAll('.asset-card').forEach(card => {
    card.addEventListener('click', function () {
      const asset = this.classList.contains('btc') ? 'bitcoin' :
        this.classList.contains('eth') ? 'ethereum' :
          this.classList.contains('sol') ? 'solana' :
            this.classList.contains('sui') ? 'sui' :
              this.classList.contains('gold') ? 'gold' :
                this.classList.contains('stocks') ? 'stocks' :
                  this.classList.contains('defi') ? 'defi' : 'unknown';

      // trackEvent('asset_preview_click', {
      //   asset,
      //   section: 'hero',
      //   interaction_type: 'preview_card'
      // });

      // Visual feedback
      this.style.transform = 'translateY(-8px) scale(1.05)';
      setTimeout(() => {
        this.style.transform = '';
      }, 300);

      // Show asset information
      showAssetInfo(asset);
    });

    // Add keyboard support
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Decision card interactions
  document.querySelectorAll('.decision-card').forEach(card => {
    let hoverTimeout;

    card.addEventListener('mouseenter', function () {
      hoverTimeout = setTimeout(() => {
        const asset = this.querySelector('.asset-result h3')?.textContent.toLowerCase();
        // trackEvent('decision_card_hover', {
        //   asset,
        //   hover_duration: 2000
        // });
      }, 2000);
    });

    card.addEventListener('mouseleave', function () {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    });
  });
}

/**
 * Form interactions and validation
 */
function initializeFormInteractions() {
  // Track form field interactions
  document.querySelectorAll('input, textarea, select').forEach(field => {
    let focusStartTime;

    field.addEventListener('focus', () => {
      focusStartTime = Date.now();
      // trackEvent('form_field_focus', {
      //   field_name: field.name || field.id,
      //   field_type: field.type
      // });
    });

    field.addEventListener('blur', () => {
      if (focusStartTime) {
        const focusDuration = Date.now() - focusStartTime;
        // trackEvent('form_field_blur', {
        //   field_name: field.name || field.id,
        //   field_type: field.type,
        //   focus_duration: focusDuration,
        //   has_value: !!field.value
        // });
      }
    });

    // Real-time validation feedback
    field.addEventListener('input', debounce(() => {
      validateField(field);
    }, 300));
  });

  // Form submission tracking
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      // trackEvent('form_submit', {
      //   form_id: this.id,
      //   form_action: this.action,
      //   field_count: formData.keys().length
      // });
    });
  });
}

/**
 * Mascot interaction animations
 */
function initializeMascotInteractions() {
  const mascotContainers = document.querySelectorAll('.mascot-container, .mascot-small');

  mascotContainers.forEach(container => {
    const mascot = container.querySelector('img');

    if (mascot) {
      // Click interaction
      container.addEventListener('click', () => {
        mascot.style.animation = 'none';
        mascot.offsetHeight; // Trigger reflow
        mascot.style.animation = 'gentle-bob 0.6s ease-in-out';

        // trackEvent('mascot_interaction', {
        //   interaction_type: 'click',
        //   mascot_type: 'aqua',
        //   section: container.closest('section')?.id || 'unknown'
        // });

        // Show random encouraging message
        showMascotMessage();
      });

      // Hover effects
      container.addEventListener('mouseenter', () => {
        mascot.style.transform = 'scale(1.05)';

        // trackEvent('mascot_interaction', {
        //   interaction_type: 'hover',
        //   mascot_type: 'aqua'
        // });
      });

      container.addEventListener('mouseleave', () => {
        mascot.style.transform = '';
      });
    }
  });
}

/**
 * Responsive feature detection and handling
 */
function initializeResponsiveFeatures() {
  // Detect touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    document.body.classList.add('touch-device');

    // Optimize touch interactions
    document.querySelectorAll('.asset-card, .decision-card, .trust-pillar').forEach(element => {
      element.addEventListener('touchstart', function () {
        this.classList.add('touch-active');
      }, { passive: true });

      element.addEventListener('touchend', function () {
        setTimeout(() => {
          this.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
    });
  }

  // Viewport size tracking
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // trackEvent('viewport_resize', {
      //   width: window.innerWidth,
      //   height: window.innerHeight,
      //   device_type: getDeviceType()
      // });
    }, 250);
  });

  // Orientation change tracking
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      // trackEvent('orientation_change', {
      //   orientation: window.orientation,
      //   width: window.innerWidth,
      //   height: window.innerHeight
      // });
    }, 500);
  });
}

// ===========================
// A/B TESTING FRAMEWORK
// ===========================

/**
 * A/B testing initialization and management
 */
function initializeABTesting() {
  if (!window.ENV || !window.ENV.FEATURE_FLAGS || !window.ENV.FEATURE_FLAGS.AB_TESTING) return;

  const userId = getUserId();
  const tests = getActiveTests();

  tests.forEach(test => {
    const variant = assignUserToVariant(userId, test);
    applyTestVariant(test, variant);

    // trackEvent('ab_test_assignment', {
    //   test_name: test.name,
    //   variant,
    //   user_id: userId
    // });
  });
}

/**
 * Get active A/B tests configuration
 */
function getActiveTests() {
  return [
    {
      name: 'hero_cta_text',
      variants: {
        control: 'Meet Aqua & Choose Your First Crypto',
        variant_a: 'Start Your Wealth Journey with Aqua',
        variant_b: 'Get Started - It Takes 2 Minutes'
      },
      traffic: 100, // Percentage of users to include
      selector: '.cta-primary-hero span'
    },
    {
      name: 'hero_subtitle',
      variants: {
        control: 'We Start You with Just 4 Proven Leaders',
        variant_a: 'We Start You with Just 4 Top Cryptos',
        variant_b: 'We Give You 4 Proven Options (Not 500+)'
      },
      traffic: 50,
      selector: '.headline-secondary'
    }
  ];
}

/**
 * Assign user to test variant based on user ID
 */
function assignUserToVariant(userId, test) {
  const hash = simpleHash(userId + test.name);
  const bucket = hash % 100;

  if (bucket >= test.traffic) {
    return null; // User not in test
  }

  const variants = Object.keys(test.variants);
  const variantIndex = hash % variants.length;
  return variants[variantIndex];
}

/**
 * Apply test variant to the page
 */
function applyTestVariant(test, variant) {
  if (!variant || !test.variants[variant]) return;

  const element = document.querySelector(test.selector);
  if (element) {
    element.textContent = test.variants[variant];
    element.setAttribute('data-ab-test', test.name);
    element.setAttribute('data-ab-variant', variant);
  }
}

// ===========================
// ACCESSIBILITY FEATURES
// ===========================

/**
 * Accessibility enhancements and monitoring
 */
function initializeAccessibility() {
  // Enhanced focus management
  initializeFocusManagement();

  // Keyboard navigation
  initializeKeyboardNavigation();

  // Screen reader announcements
  initializeScreenReaderSupport();

  // Motion preferences
  handleMotionPreferences();
}

/**
 * Enhanced focus management
 */
function initializeFocusManagement() {
  let isTabbing = false;

  // Detect tab navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isTabbing = true;
      document.body.classList.add('user-is-tabbing');
    }
  });

  document.addEventListener('mousedown', () => {
    isTabbing = false;
    document.body.classList.remove('user-is-tabbing');
  });

  // Focus trap for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal.active');
      if (modal) {
        closeModal();
      }
    }
  });
}

/**
 * Keyboard navigation enhancements
 */
function initializeKeyboardNavigation() {
  // Enhanced arrow key navigation for asset cards
  const assetCards = document.querySelectorAll('.asset-card, .decision-card');

  assetCards.forEach((card, index) => {
    card.addEventListener('keydown', (e) => {
      let targetIndex;

      switch (e.key) {
        case 'ArrowRight':
          targetIndex = (index + 1) % assetCards.length;
          break;
        case 'ArrowLeft':
          targetIndex = (index - 1 + assetCards.length) % assetCards.length;
          break;
        case 'Home':
          targetIndex = 0;
          break;
        case 'End':
          targetIndex = assetCards.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      assetCards[targetIndex].focus();
    });
  });
}

/**
 * Screen reader support and announcements
 */
function initializeScreenReaderSupport() {
  // Create live region for dynamic announcements
  const liveRegion = document.createElement('div');
  liveRegion.id = 'live-announcements';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);

  // Announce important state changes
  window.announceToScreenReader = function (message, priority = 'polite') {
    const liveRegion = document.getElementById('live-announcements');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  };
}

/**
 * Handle motion preferences
 */
function handleMotionPreferences() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleMotionChange(e) {
    if (e.matches) {
      document.body.classList.add('reduce-motion');
      // Disable auto-playing animations
      document.querySelectorAll('[style*="animation"]').forEach(el => {
        el.style.animationPlayState = 'paused';
      });
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }

  handleMotionChange(prefersReducedMotion);
  prefersReducedMotion.addEventListener('change', handleMotionChange);
}

// ===========================
// UI HELPER FUNCTIONS
// ===========================

/**
 * Show Asset information modal
 */
function showAssetInfo(asset) {
  const assetData = {
    bitcoin: {
      name: 'Bitcoin',
      symbol: 'BTC',
      description: 'The world first cryptocurrency, like digital gold you can own and trade easily.',
      pros: ['Trusted by millions, from startups to global brands', 'Only 21 million coins – a rare asset that grows in value', 'Pay anywhere, from online shops to real-world stores'],
      cons: ['Fees can be higher for small transactions', 'Transfers may take a few minutes'],
      goodFor: 'Investors wanting a trusted, long-term asset and Beginners starting their crypto journey'
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      description: 'A powerful platform for digital apps and wealth-building tools, like the internet of finance',
      pros: ['Fuels NFTs, games, and lending apps you can join', 'Backed by a massive global community', 'Earn passive income through staking', 'Strong foundation for DeFi growth'],
      cons: ['Prices may swing more than traditional investments', 'Fees can rise during high network demand'],
      goodFor: 'Investors excited to explore digital finance or grow wealth passively.'
    },
    solana: {
      name: 'Solana',
      symbol: 'SOL',
      description: ' A super-fast platform for affordable crypto investments and cutting-edge apps',
      pros: ['Lightning-fast transactions – seconds, not minutes', 'Low fees let you keep more of your money', 'Hub for new DeFi apps and NFT opportunities'],
      cons: ['Newer, so it is still building its track record', 'Rare network hiccups in the past'],
      goodFor: 'Investors who want fast, affordable trades and new DeFi possibilities'
    },
    sui: {
      name: 'Sui',
      symbol: 'SUI',
      description: 'A next-gen platform for fast, future-focused crypto investments',
      pros: ['Blazing-fast tech for effortless investing', 'Powers innovative apps, from NFTs to DeFi', 'Early investors can lead the crypto future'],
      cons: ['Newer, so it carries higher risk', 'Smaller community, still growing'],
      goodFor: 'Bold investors ready to bet on crypto next big thing'
    },
    gold: {
      name: 'Gold',
      symbol: 'XAU',
      description: 'A timeless asset you can own, like a golden safety net for your wealth',
      pros: ['Trusted for centuries as a store of value', 'Protects your wealth during economic uncertainty', 'Easy to buy and hold with Aqua’s AI guidance'],
      cons: ['Prices can fluctuate with market trends', 'No income like dividends or staking'],
      goodFor: 'Investors seeking a safe, long-term way to preserve wealth.'
    },
    stocks: {
      name: 'Stocks',
      symbol: 'Stocks',
      description: 'Own a piece of top companies and easily diversify your investment',
      pros: ['Invest in brands you know, like Apple or Tesla', 'Potential for growth and dividend income', 'Diversify easily'],
      cons: ['Prices can vary with market ups and downs', 'Requires some research to pick winners'],
      goodFor: 'Investors wanting to grow wealth with familiar companies or diversify their portfolio.'
    },
    defi: {
      name: 'DeFi',
      symbol: 'DeFi',
      description: 'A new way to grow money through digital finance, powered by blockchain technology and crypto',
      pros: ['Earn high returns through lending, staking and more', 'Access cutting-edge finance apps and tools', 'Take control with decentralized investments'],
      cons: ['Higher risk due to new technology and smart contract issues', 'Can be complex without proper guidance'],
      goodFor: 'Adventurous investors eager to explore digital finance and high-growth opportunities.'
    }
  };

  const data = assetData[asset];
  if (!data) return;

  const assetSymbols = {
    bitcoin: '₿',
    gold: 'ⓐu', 
    stocks: 'Ⓢ',
    defi: 'Ⓓ'
  };

  const content = `
    <div class="asset-info">
      <button class="asset-close-btn" onclick="closeModal()" aria-label="Close asset information">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="asset-info-header">
        <div class="asset-header">
          <div class="asset-icon">
            ${assetSymbols[asset] || data.symbol}
          </div>
          <h1 class="asset-title">${data.name}</h1>
          <p class="asset-subtitle">${data.symbol} • Digital Asset</p>
        </div>
      </div>
      
      <div class="asset-info-content">
        <div class="asset-description">
          ${data.description}
        </div>
        
        <div class="section-divider"></div>
        
        <div class="asset-features">
          <div class="feature-section advantages">
            <h4>Advantages</h4>
            <ul>
              ${data.pros.map(pro => `<li>${pro}</li>`).join('')}
            </ul>
          </div>
          
          <div class="feature-section considerations">
            <h4>Considerations</h4>
            <ul>
              ${data.cons.map(con => `<li>${con}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="asset-recommendation">
          <h4>Good For</h4>
          <p>${data.goodFor}</p>
        </div>
        
        <div class="asset-actions">
          <button class="asset-primary-btn" onclick="closeModal(); showAssetConfirmation('${asset}')">
            Choose ${data.name}
          </button>
          <button class="asset-secondary-btn" onclick="closeModal()">
            Compare Others
          </button>
        </div>
      </div>
    </div>
  `;

  showModal(content, {
    customClass: `asset-modal-${asset}`,
    primaryAction: null, // We handle actions in the content
    secondaryAction: null
  });
}

/**
 * Show asset selection confirmation with personalized content
 */
function showAssetConfirmation(asset) {
  const assetData = {
    bitcoin: {
      name: 'Bitcoin',
      message: 'Oh you want to join the 50+ million people owning BTC. I can help you. Got 5 mins for a quick and secure signup?',
      mascotImage: './assets/images/aqua_mascot_pose1.png',
      themeColor: '#FF8F00',
      glowColor: 'rgba(255, 143, 0, 0.4)'
    },
    gold: {
      name: 'Gold', 
      message: 'You want safety. I get that! Gold has been around for centuries. Let me help you to protect your wealth. First you need 5 mins for a quick and secure signup.',
      mascotImage: './assets/images/aqua_mascot_pose2.png',
      themeColor: '#FFC107',
      glowColor: 'rgba(255, 193, 7, 0.4)'
    },
    stocks: {
      name: 'Stocks',
      message: 'I see you are more into traditional finance. That is fine! I guess you already have a company in mind you would like to buy a share. We can make it happen by creating your account in just 2 mins.',
      mascotImage: './assets/images/aqua_mascot_pose3.png',
      themeColor: '#3F51B5',
      glowColor: 'rgba(63, 81, 181, 0.4)'
    },
    defi: {
      name: 'DeFi',
      message: 'Wow you are really All-in. Awesome! We just need to create your account, it only takes a minute.',
      mascotImage: './assets/images/aqua_mascot_pose.png',
      themeColor: '#9575CD',
      glowColor: 'rgba(149, 117, 205, 0.4)'
    }
  };

  const data = assetData[asset];
  if (!data) return;

  const content = `
    <div class="asset-confirmation themed-${asset}">
      <div class="mascot-celebration">
        <div class="mascot-glow-wrapper">
          <img src="${data.mascotImage}" alt="Aqua helping with ${data.name} choice">
          <div class="themed-glow" style="background: radial-gradient(circle, ${data.glowColor} 0%, transparent 70%);"></div>
        </div>
      </div>
      
      <h2>${data.name}</h2>
      <p class="aqua-message">${data.message}</p>
      
      <div class="cta-section">
        <a href="./app/" class="themed-cta-button" style="background: ${data.themeColor};">
          Get Started with ${data.name}
        </a>
      </div>
    </div>
  `;

  showModal(content, {
    customClass: `asset-modal-${asset}`,
    primaryAction: null, // We handle the action in the content
    secondaryAction: {
      text: 'Maybe Later',
      action: () => {
        closeModal();
      }
    }
  });
}

/**
 * Show legal information popup with detailed content
 */
function showLegalInfo(legalType) {
  const legalData = {
    'privacy': {
      title: 'Privacy Policy',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="12" r="3" />
      </svg>`,
      description: 'Your privacy is our top priority. We protect your personal information with the highest standards of data security and transparency.',
      details: [
        'We collect only essential information required for platform functionality',
        'Your personal data is encrypted and stored securely in compliance with GDPR',
        'We never sell, rent, or share your personal information with third parties',
        'You maintain full control over your data and can request deletion at any time',
        'All data processing activities are logged and auditable for transparency',
        'We use industry-standard security measures to protect against data breaches'
      ],
      themeColor: '#4ECDC4'
    },
    'terms': {
      title: 'Terms of Service',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>`,
      description: 'Clear, fair terms that protect both you and diBoaS. We believe in transparency and user-friendly policies that you can actually understand.',
      details: [
        'Non-custodial service - you always maintain control of your assets',
        'Transparent fee structure: 0.09% trading, 0.9% transfers, no hidden costs',
        'Educational guidance only - we provide information, not financial advice',
        'You are responsible for your investment decisions and risk management',
        'Platform availability may vary by jurisdiction due to regulatory requirements',
        'Account security is a shared responsibility between you and diBoaS'
      ],
      themeColor: '#A8E6CF'
    },
    'compliance': {
      title: 'Regulatory Compliance',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22,4 12,14.01 9,11.01" />
        <circle cx="12" cy="12" r="3" />
      </svg>`,
      description: 'diBoaS operates under strict regulatory oversight across multiple jurisdictions to ensure the highest standards of financial compliance.',
      details: [
        'EU MiCA regulation compliance for all European Union operations',
        'US Bank Secrecy Act (BSA) compliance and state money transmitter licenses',
        'Brazil Law 14.478 compliance with Central Bank of Brazil coordination',
        'Anti-Money Laundering (AML) and Know Your Customer (KYC) procedures',
        'Regular compliance audits by independent third-party firms',
        'Ongoing regulatory reporting and transparent fee disclosure requirements'
      ],
      themeColor: '#B39DDB'
    }
  };

  const data = legalData[legalType];
  if (!data) return;

  const content = `
    <div class="legal-info-modal">
      <div class="legal-header">
        <div class="legal-icon" style="color: ${data.themeColor};">
          ${data.icon}
        </div>
        <h2 style="color: ${data.themeColor};">${data.title}</h2>
      </div>
      
      <p class="legal-description">${data.description}</p>
      
      <div class="legal-details">
        <h3>Key Points:</h3>
        <ul class="legal-list">
          ${data.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      </div>
      
      <div class="legal-note">
        <p><strong>Note:</strong> This is a summary of our ${data.title}. For complete legal text and detailed terms, please contact us at <a href="mailto:legal@diboas.com">legal@diboas.com</a></p>
      </div>
      
      <div class="legal-cta">
        <a href="./app/" class="legal-cta-button" style="background: ${data.themeColor}; border-color: ${data.themeColor};">
          Continue to diBoaS
        </a>
      </div>
    </div>
  `;

  showModal(content, {
    customClass: `legal-modal-${legalType}`,
    primaryAction: null, // We handle the action in the content
    secondaryAction: {
      text: 'Close',
      action: () => {
        closeModal();
      }
    }
  });
}

/**
 * Show security information popup with detailed explanations
 */
function showSecurityInfo(securityType) {
  const securityData = {
    'bank-grade': {
      title: 'Bank-Grade Security',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>`,
      description: 'Your wealth is protected with military-grade encryption and the same security standards used by major financial institutions.',
      details: [
        'Military-grade encryption safeguards all your data and transactions',
        'Multi-layered security protocols protect against unauthorized access',
        'Regular security audits by independent cybersecurity firms',
        'Advanced authentication systems including 2FA protection',
        'Compliance with international security standards and regulations'
      ],
      themeColor: '#4ECDC4'
    },
    'non-custodial': {
      title: 'Non-Custodial Control',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <circle cx="12" cy="16" r="1" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>`,
      description: 'You always maintain complete ownership and control of your assets. diBoaS never holds or touches your funds.',
      details: [
        'You own your private keys and maintain full control of your assets',
        'diBoaS cannot access, freeze, or confiscate your investments',
        'Your funds remain secure even if diBoaS ceases operations',
        'Non-custody wallets automatically created behind the scenes',
        'Complete transparency - you can verify your ownership at any time'
      ],
      themeColor: '#A8E6CF'
    },
    'regulated-compliance': {
      title: 'Regulated Compliance',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22,4 12,14.01 9,11.01" />
      </svg>`,
      description: 'Fully regulated and compliant across multiple jurisdictions to ensure your investments meet the highest legal standards.',
      details: [
        'EU MiCA regulation compliance for European operations',
        'US BSA and state money transmitter licenses',
        'Brazil Law 14.478 compliance with Central Bank coordination',
        'Transparent fee structure with no hidden costs (0.09% trading, 0.9% transfers)',
        'Regular compliance audits and regulatory reporting'
      ],
      themeColor: '#B39DDB'
    }
  };

  const data = securityData[securityType];
  if (!data) return;

  const content = `
    <div class="security-info-modal">
      <div class="security-header">
        <div class="security-icon" style="color: ${data.themeColor};">
          ${data.icon}
        </div>
        <h2 style="color: ${data.themeColor};">${data.title}</h2>
      </div>
      
      <p class="security-description">${data.description}</p>
      
      <div class="security-details">
        <h3>How We Protect You:</h3>
        <ul class="security-list">
          ${data.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      </div>
      
      <div class="security-cta">
        <a href="./app/" class="security-cta-button" style="background: ${data.themeColor}; border-color: ${data.themeColor};">
          Start Your Secure Journey
        </a>
      </div>
    </div>
  `;

  showModal(content, {
    customClass: `security-modal-${securityType}`,
    primaryAction: null, // We handle the action in the content
    secondaryAction: {
      text: 'Close',
      action: () => {
        closeModal();
      }
    }
  });
}

/**
 * Show mascot encouraging message
 */
function showMascotMessage() {
  const messages = [
    "You're doing great exploring crypto options!",
    "I'm here to help you every step of the way.",
    "Small steps lead to big financial growth!",
    "Your wealth journey is going to be amazing!",
    "Every expert was once a beginner like you."
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  window.announceToScreenReader && window.announceToScreenReader(`Aqua says: ${randomMessage}`);

  // Show temporary message bubble
  const messageEl = document.createElement('div');
  messageEl.className = 'mascot-temp-message';
  messageEl.textContent = `"${randomMessage}"`;
  messageEl.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid var(--aqua-light);
    border-radius: 12px;
    padding: 16px 24px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: fadeInOut 3s ease-in-out forwards;
    max-width: 300px;
    text-align: center;
    font-family: var(--font-display);
    color: var(--aqua-dark);
  `;

  document.body.appendChild(messageEl);

  setTimeout(() => {
    messageEl.remove();
  }, 3000);
}

/**
 * Generic modal system
 */
function showModal(content, actions = {}) {
  // Remove existing modal
  const existingModal = document.querySelector('.modal-overlay');
  if (existingModal) {
    existingModal.remove();
  }

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" aria-label="Close modal">&times;</button>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-actions">
        ${actions.secondaryAction ? `<button class="modal-secondary">${actions.secondaryAction.text}</button>` : ''}
        ${actions.primaryAction ? `<button class="modal-primary">${actions.primaryAction.text}</button>` : ''}
      </div>
    </div>
  `;

  // Add modal styles
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(4px);
  `;

  const modalContent = modalOverlay.querySelector('.modal-content');
  modalContent.style.cssText = `
    background: white;
    border-radius: 16px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  `;

  document.body.appendChild(modalOverlay);

  // Event listeners
  modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);

  if (actions.primaryAction) {
    modalOverlay.querySelector('.modal-primary').addEventListener('click', () => {
      actions.primaryAction.action();
      closeModal();
    });
  }

  if (actions.secondaryAction) {
    modalOverlay.querySelector('.modal-secondary').addEventListener('click', () => {
      actions.secondaryAction.action();
      closeModal();
    });
  }

  // Close on overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Focus management
  const firstFocusable = modalOverlay.querySelector('button, input, textarea, select, a[href]');
  if (firstFocusable) {
    firstFocusable.focus();
  }

  // trackEvent('modal_opened', {
  //   content_type: content.includes('asset-info') ? 'asset_info' : 
  //                 content.includes('asset-confirmation') ? 'asset_confirmation' : 'generic'
  // });
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.remove();
    // trackEvent('modal_closed');
  }
}

/**
 * Field validation
 */
function validateField(field) {
  let isValid = true;
  let message = '';

  // Remove existing validation classes
  field.classList.remove('valid', 'invalid');

  // Validate based on field type
  switch (field.type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(field.value);
      message = isValid ? '' : 'Please enter a valid email address';
      break;

    case 'password':
      isValid = field.value.length >= 8;
      message = isValid ? '' : 'Password must be at least 8 characters';
      break;

    default:
      isValid = field.value.trim() !== '';
      message = isValid ? '' : 'This field is required';
  }

  // Apply validation state
  field.classList.add(isValid ? 'valid' : 'invalid');

  // Show/hide validation message
  let messageElement = field.parentNode.querySelector('.validation-message');
  if (!messageElement && message) {
    messageElement = document.createElement('div');
    messageElement.className = 'validation-message';
    field.parentNode.appendChild(messageElement);
  }

  if (messageElement) {
    messageElement.textContent = message;
    messageElement.style.display = message ? 'block' : 'none';
  }

  return isValid;
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Generate unique session ID
 */
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get or create user ID
 */
function getUserId() {
  let userId = localStorage.getItem('diboas_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('diboas_user_id', userId);
  }
  return userId;
}

/**
 * Simple hash function for A/B testing
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get device type
 */
function getDeviceType() {
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Throttle function
 */
function throttle(func, limit) {
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
 * Debounce function
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this, args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// ===========================
// INITIALIZATION
// ===========================

/**
 * Initialize conversion tracking for specific elements (STUBBED)
 */
function initializeConversionTracking() {
  return; // Completely disabled
  // Track conversion funnel steps
  const funnelSteps = [
    { element: '.hero-section', step: 'awareness', name: 'landing_page_view' },
    { element: '.asset-selection-section', step: 'interest', name: 'asset_options_viewed' },
    { element: '.trust-building-section', step: 'consideration', name: 'trust_factors_viewed' },
    { element: '.final-cta-section', step: 'intent', name: 'final_cta_viewed' }
  ];

  // Intersection Observer for conversion tracking
  const conversionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const step = funnelSteps.find(s => entry.target.matches(s.element));
        if (step) {
          // trackEvent('conversion_funnel', {
          //   step: step.step,
          //   step_name: step.name,
          //   time_to_step: Date.now() - window.analyticsContext.pageLoadTime
          // });
        }
      }
    });
  }, { threshold: 0.5 });

  // Observe funnel elements
  funnelSteps.forEach(step => {
    const element = document.querySelector(step.element);
    if (element) {
      conversionObserver.observe(element);
    }
  });

  // Track micro-conversions
  trackMicroConversions();
}

/**
 * Track micro-conversions and engagement signals
 */
function trackMicroConversions() {
  // Video play tracking (if videos are added)
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => {
      // trackEvent('video_play', { video_src: video.src });
    });

    video.addEventListener('ended', () => {
      // trackEvent('video_complete', { video_src: video.src });
    });
  });

  // External link tracking
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', () => {
      // trackEvent('external_link_click', {
      //   url: link.href,
      //   text: link.textContent.trim()
      // });
    });
  });

  // Download tracking
  document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"]').forEach(link => {
    link.addEventListener('click', () => {
      // trackEvent('document_download', {
      //   file_url: link.href,
      //   file_type: link.href.split('.').pop()
      // });
    });
  });

  // Copy text tracking
  document.addEventListener('copy', () => {
    const selection = window.getSelection().toString();
    if (selection.length > 10) {
      // trackEvent('text_copied', {
      //   text_length: selection.length,
      //   text_preview: selection.substring(0, 50)
      // });
    }
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.DiBoaS.init();
  });
} else {
  window.DiBoaS.init();
}

// Export stub trackEvent function and error handler for global access
window.trackEvent = trackEvent;
window.handleError = handleError;