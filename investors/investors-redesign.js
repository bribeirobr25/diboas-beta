/**
 * diBoaS Investor Portal Redesign JavaScript
 * Enterprise-grade professional investment interface
 * 
 * Features: Secure document access, redaction system, investor forms, analytics
 * Performance: Optimized for Core Web Vitals
 * Accessibility: WCAG 2.1 AA compliant
 */

'use strict';

// ===========================
// INVESTOR PORTAL APPLICATION
// ===========================

/**
 * Main Investor Portal Application Class
 */
class DiBoaSInvestorApp {
  constructor() {
    this.initialized = false;
    this.state = {
      currentSection: 'opportunity',
      theme: 'light',
      mobileNavOpen: false,
      currentModal: null,
      formValidation: {
        contactForm: {
          isValid: false,
          errors: {}
        }
      },
      intelligenceDemo: {
        activePersona: 'beginner'
      },
      documentAccess: {
        requestedDocs: [],
        accessLevel: 'public'
      },
      userInteractions: {
        redactedClicks: 0,
        documentViews: [],
        sectionViews: {},
        timeOnSections: {}
      }
    };
    
    this.components = {
      navigation: null,
      theme: null,
      forms: null,
      modals: null,
      documents: null,
      intelligence: null,
      redaction: null,
      analytics: null
    };
    
    this.config = {
      scrollThrottle: 100,
      formValidationDelay: 300,
      modalTransitionDuration: 300,
      sectionViewThreshold: 0.3,
      maxRedactedClicks: 10,
      accessRequestEmail: 'hello@diboas.com'
    };
    
    this.init();
  }
  
  /**
   * Initialize the application
   */
  init() {
    if (this.initialized) return;
    
    try {
      console.log('🚀 Initializing diBoaS Investor Portal');
      
      // Initialize core components
      this.initializeDOM();
      this.initializeTheme();
      this.initializeNavigation();
      this.initializeForms();
      this.initializeModals();
      this.initializeDocuments();
      this.initializeIntelligenceDemo();
      this.initializeRedactionSystem();
      this.initializeAccessibility();
      this.initializeAnalytics();
      this.initializePerformanceMonitoring();
      
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      // Load user preferences
      this.loadUserPreferences();
      
      this.initialized = true;
      console.log('✅ Investor portal initialized successfully');
      
      // Track initialization
      // this.trackEvent('investor_portal_initialized', {
      //   timestamp: Date.now(),
      //   user_agent: navigator.userAgent,
      //   viewport: `${window.innerWidth}x${window.innerHeight}`,
      //   theme: this.state.theme
      // });
      
    } catch (error) {
      console.error('❌ Failed to initialize investor portal:', error);
      this.handleError(error, 'initialization');
    }
  }
  
  /**
   * Initialize DOM references
   */
  initializeDOM() {
    this.dom = {
      // Header elements
      header: document.querySelector('.investor-header'),
      mobileMenuBtn: document.getElementById('mobileMenuBtn'),
      navLinks: document.querySelectorAll('.nav-link'),
      themeToggle: document.getElementById('themeToggle'),
      
      // Main content
      main: document.querySelector('.investor-main'),
      sections: document.querySelectorAll('.content-section[id]'),
      
      // Hero elements
      heroStats: document.querySelectorAll('.stat-card'),
      mascotCards: document.querySelectorAll('.mascot-card'),
      
      // Intelligence demo
      demoControls: document.querySelectorAll('.demo-btn'),
      demoInterface: document.getElementById('demo-interface'),
      demoPersonas: document.querySelectorAll('.demo-persona'),
      
      // Documents
      documentCards: document.querySelectorAll('.document-card'),
      
      // Forms
      contactForm: document.getElementById('investorContactForm'),
      formInputs: document.querySelectorAll('.form-input, .form-select, .form-textarea'),
      submitBtn: document.getElementById('submitBtn'),
      
      // Modals
      modals: document.querySelectorAll('.modal'),
      accessModal: document.getElementById('accessRequestModal'),
      
      // Mobile nav
      mobileNavOverlay: document.getElementById('mobileNavOverlay'),
      mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
      
      // Redacted elements
      redactedElements: document.querySelectorAll('.redacted'),
      
      // Loading overlay
      loadingOverlay: document.getElementById('loadingOverlay')
    };
  }
  
  /**
   * Initialize theme management
   */
  initializeTheme() {
    const savedTheme = localStorage.getItem('diboas-investor-theme') || 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme === 'auto' ? (systemPrefersDark ? 'dark' : 'light') : savedTheme;
    
    this.setTheme(initialTheme);
    
    // Theme toggle event
    if (this.dom.themeToggle) {
      this.dom.themeToggle.addEventListener('click', () => {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        // this.trackEvent('theme_toggle', { theme: newTheme });
      });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('diboas-investor-theme') === 'auto') {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  /**
   * Set theme
   */
  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('diboas-investor-theme', theme);
    
    // Update theme toggle icon
    if (this.dom.themeToggle) {
      const lightIcon = this.dom.themeToggle.querySelector('.theme-icon-light');
      const darkIcon = this.dom.themeToggle.querySelector('.theme-icon-dark');
      
      if (theme === 'dark') {
        lightIcon?.style.setProperty('opacity', '0');
        lightIcon?.style.setProperty('transform', 'rotate(90deg)');
        darkIcon?.style.setProperty('opacity', '1');
        darkIcon?.style.setProperty('transform', 'rotate(0deg)');
      } else {
        lightIcon?.style.setProperty('opacity', '1');
        lightIcon?.style.setProperty('transform', 'rotate(0deg)');
        darkIcon?.style.setProperty('opacity', '0');
        darkIcon?.style.setProperty('transform', 'rotate(-90deg)');
      }
    }
  }
  
  /**
   * Initialize navigation
   */
  initializeNavigation() {
    // Smooth scrolling for anchor links
    this.dom.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const headerHeight = this.dom.header?.offsetHeight || 88;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            this.updateActiveSection(href.substring(1));
            // this.trackEvent('navigation_click', { section: href.substring(1) });
          }
        }
      });
    });
    
    // Mobile navigation
    if (this.dom.mobileMenuBtn) {
      this.dom.mobileMenuBtn.addEventListener('click', () => {
        this.toggleMobileNav();
      });
    }
    
    if (this.dom.mobileNavLinks) {
      this.dom.mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileNav();
        });
      });
    }
    
    // Close mobile nav when clicking overlay
    if (this.dom.mobileNavOverlay) {
      this.dom.mobileNavOverlay.addEventListener('click', (e) => {
        if (e.target === this.dom.mobileNavOverlay) {
          this.closeMobileNav();
        }
      });
    }
    
    // Active section detection on scroll
    this.setupScrollSpy();
  }
  
  /**
   * Setup scroll spy for active navigation
   */
  setupScrollSpy() {
    let scrollTimeout;
    
    const updateActiveOnScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        const headerHeight = this.dom.header?.offsetHeight || 88;
        const sections = Array.from(this.dom.sections);
        let activeSection = null;
        
        // Find the section currently in view
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          const threshold = window.innerHeight * this.config.sectionViewThreshold;
          
          if (rect.top <= headerHeight + threshold && rect.bottom >= headerHeight + threshold) {
            activeSection = section.id;
            break;
          }
        }
        
        if (activeSection && activeSection !== this.state.currentSection) {
          this.updateActiveSection(activeSection);
        }
      }, this.config.scrollThrottle);
    };
    
    window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
  }
  
  /**
   * Update active navigation section
   */
  updateActiveSection(sectionId) {
    // Track time spent in previous section
    if (this.state.currentSection && this.state.sectionEnterTime) {
      const timeSpent = Date.now() - this.state.sectionEnterTime;
      this.state.userInteractions.timeOnSections[this.state.currentSection] = 
        (this.state.userInteractions.timeOnSections[this.state.currentSection] || 0) + timeSpent;
    }
    
    this.state.currentSection = sectionId;
    this.state.sectionEnterTime = Date.now();
    
    // Update section view count
    this.state.userInteractions.sectionViews[sectionId] = 
      (this.state.userInteractions.sectionViews[sectionId] || 0) + 1;
    
    // Update navigation active states
    this.dom.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
    
    // Track section view
    // this.trackEvent('section_view', {
    //   section: sectionId,
    //   view_count: this.state.userInteractions.sectionViews[sectionId]
    // });
  }
  
  /**
   * Toggle mobile navigation
   */
  toggleMobileNav() {
    this.state.mobileNavOpen = !this.state.mobileNavOpen;
    
    if (this.state.mobileNavOpen) {
      this.openMobileNav();
    } else {
      this.closeMobileNav();
    }
  }
  
  /**
   * Open mobile navigation
   */
  openMobileNav() {
    this.state.mobileNavOpen = true;
    this.dom.mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    this.dom.mobileNavOverlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // this.trackEvent('mobile_nav_open');
  }
  
  /**
   * Close mobile navigation
   */
  closeMobileNav() {
    this.state.mobileNavOpen = false;
    this.dom.mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    this.dom.mobileNavOverlay?.classList.remove('show');
    document.body.style.overflow = '';
    
    if (this.state.mobileNavOpen) {
      // this.trackEvent('mobile_nav_close');
    }
  }
  
  /**
   * Initialize forms
   */
  initializeForms() {
    if (!this.dom.contactForm) return;
    
    // Form validation setup
    this.setupFormValidation();
    
    // Form submission
    this.dom.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });
    
    // Real-time validation
    this.dom.formInputs.forEach(input => {
      let validationTimeout;
      
      const validateInput = () => {
        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(() => {
          this.validateField(input);
        }, this.config.formValidationDelay);
      };
      
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', validateInput);
    });
  }
  
  /**
   * Setup form validation rules
   */
  setupFormValidation() {
    this.validationRules = {
      fullName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s'-]+$/,
        message: 'Please enter a valid full name'
      },
      emailAddress: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      investorType: {
        required: true,
        message: 'Please select your investor type'
      },
      accreditedInvestor: {
        required: true,
        message: 'You must confirm accredited investor status'
      },
      confidentialityAgreement: {
        required: true,
        message: 'You must agree to maintain confidentiality'
      }
    };
  }
  
  /**
   * Validate individual form field
   */
  validateField(field) {
    const fieldName = field.name;
    const rule = this.validationRules[fieldName];
    if (!rule) return true;
    
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    const errorElement = document.getElementById(`${fieldName}-error`);
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (rule.required && (!value || (field.type === 'checkbox' && !field.checked))) {
      isValid = false;
      errorMessage = rule.message;
    }
    
    // Pattern validation
    if (isValid && rule.pattern && value && !rule.pattern.test(value)) {
      isValid = false;
      errorMessage = rule.message;
    }
    
    // Min length validation
    if (isValid && rule.minLength && value && value.length < rule.minLength) {
      isValid = false;
      errorMessage = rule.message;
    }
    
    // Update UI
    if (errorElement) {
      if (!isValid) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
        field.classList.add('error');
      } else {
        errorElement.style.display = 'none';
        field.classList.remove('error');
      }
    }
    
    // Update form state
    if (!this.state.formValidation.contactForm.errors) {
      this.state.formValidation.contactForm.errors = {};
    }
    
    if (isValid) {
      delete this.state.formValidation.contactForm.errors[fieldName];
    } else {
      this.state.formValidation.contactForm.errors[fieldName] = errorMessage;
    }
    
    // Update overall form validity
    this.updateFormValidity();
    
    return isValid;
  }
  
  /**
   * Update overall form validity
   */
  updateFormValidity() {
    const hasErrors = Object.keys(this.state.formValidation.contactForm.errors).length > 0;
    this.state.formValidation.contactForm.isValid = !hasErrors;
    
    // Update submit button state
    if (this.dom.submitBtn) {
      this.dom.submitBtn.disabled = hasErrors;
    }
  }
  
  /**
   * Handle form submission
   */
  async handleFormSubmission() {
    try {
      // Validate all fields
      let allValid = true;
      this.dom.formInputs.forEach(input => {
        if (!this.validateField(input)) {
          allValid = false;
        }
      });
      
      if (!allValid) {
        this.showNotification('Please correct the errors in the form', 'error');
        return;
      }
      
      // Show loading state
      this.setFormLoading(true);
      
      // Collect form data
      const formData = new FormData(this.dom.contactForm);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission (replace with actual API call)
      await this.simulateFormSubmission(data);
      
      // Success handling
      this.showNotification('Investment inquiry sent successfully! We\'ll be in touch within 24 hours.', 'success');
      this.dom.contactForm.reset();
      this.resetFormValidation();
      
      // Track successful submission
      // this.trackEvent('investor_inquiry_submitted', {
      //   investor_type: data.investorType,
      //   company: data.companyFund || 'Individual',
      //   investment_range: data.investmentRange || 'Not specified',
      //   timeframe: data.timeframe || 'Not specified'
      // });
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showNotification('Failed to send inquiry. Please try again or contact us directly.', 'error');
      // this.trackEvent('form_submission_error', { error: error.message });
    } finally {
      this.setFormLoading(false);
    }
  }
  
  /**
   * Simulate form submission
   */
  async simulateFormSubmission(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form submitted:', data);
        resolve();
      }, 2000);
    });
  }
  
  /**
   * Set form loading state
   */
  setFormLoading(loading) {
    if (!this.dom.submitBtn) return;
    
    const btnText = this.dom.submitBtn.querySelector('.btn-text');
    const btnLoading = this.dom.submitBtn.querySelector('.btn-loading');
    
    if (loading) {
      btnText?.classList.add('hidden');
      btnLoading?.classList.remove('hidden');
      this.dom.submitBtn.disabled = true;
    } else {
      btnText?.classList.remove('hidden');
      btnLoading?.classList.add('hidden');
      this.dom.submitBtn.disabled = false;
    }
  }
  
  /**
   * Reset form validation
   */
  resetFormValidation() {
    this.state.formValidation.contactForm = {
      isValid: false,
      errors: {}
    };
    
    // Clear all error displays
    document.querySelectorAll('.form-error').forEach(error => {
      error.style.display = 'none';
    });
    
    // Remove error classes
    this.dom.formInputs.forEach(input => {
      input.classList.remove('error');
    });
  }
  
  /**
   * Initialize modals
   */
  initializeModals() {
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) {
          this.closeModal(modal.id);
        }
      });
    });
    
    // Close modal when clicking backdrop
    this.dom.modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });
    
    // Escape key handling
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.currentModal) {
        this.closeModal(this.state.currentModal);
      }
    });
  }
  
  /**
   * Show modal
   */
  showModal(modalId, data = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Update modal content if data provided
    if (data.documentName) {
      const emailLink = modal.querySelector('a[href*="mailto"]');
      if (emailLink) {
        const currentHref = emailLink.getAttribute('href');
        const updatedHref = currentHref.replace('[DOCUMENT_NAME]', data.documentName);
        emailLink.setAttribute('href', updatedHref);
      }
    }
    
    this.state.currentModal = modalId;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
    
    // this.trackEvent('modal_opened', { modal: modalId });
  }
  
  /**
   * Close modal
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
    this.state.currentModal = null;
    
    // this.trackEvent('modal_closed', { modal: modalId });
  }
  
  /**
   * Initialize document access system
   */
  initializeDocuments() {
    // Document card interactions
    this.dom.documentCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent click if it's on a button
        if (e.target.closest('button')) return;
        
        const accessLevel = this.getDocumentAccessLevel(card);
        const documentName = this.getDocumentName(card);
        
        this.handleDocumentAccess(documentName, accessLevel);
      });
    });
    
    // Setup document download buttons
    document.querySelectorAll('.download-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const card = btn.closest('.document-card');
        const accessLevel = this.getDocumentAccessLevel(card);
        const documentName = this.getDocumentName(card);
        
        this.handleDocumentAccess(documentName, accessLevel);
      });
    });
  }
  
  /**
   * Get document access level from card
   */
  getDocumentAccessLevel(card) {
    if (card.classList.contains('public')) return 'public';
    if (card.classList.contains('restricted')) return 'restricted';
    if (card.classList.contains('confidential')) return 'confidential';
    return 'public';
  }
  
  /**
   * Get document name from card
   */
  getDocumentName(card) {
    const titleElement = card.querySelector('h4');
    return titleElement ? titleElement.textContent.trim() : 'Document';
  }
  
  /**
   * Handle document access request
   */
  handleDocumentAccess(documentName, accessLevel) {
    // this.trackEvent('document_access_attempt', {
    //   document: documentName,
    //   access_level: accessLevel
    // });
    
    if (accessLevel === 'public') {
      this.downloadDocument(documentName);
    } else {
      this.requestDocumentAccess(documentName, accessLevel);
    }
  }
  
  /**
   * Download public document
   */
  downloadDocument(documentName) {
    // Simulate download for demo purposes
    this.showNotification(`Downloading ${documentName}...`, 'success');
    
    // this.trackEvent('document_downloaded', {
    //   document: documentName,
    //   timestamp: Date.now()
    // });
    
    // Add to user interactions
    this.state.userInteractions.documentViews.push({
      document: documentName,
      timestamp: Date.now(),
      type: 'download'
    });
    
    // In a real implementation, this would trigger actual file download
    setTimeout(() => {
      this.showNotification('Download complete!', 'success');
    }, 1500);
  }
  
  /**
   * Request access to restricted/confidential document
   */
  requestDocumentAccess(documentName, accessLevel) {
    this.showModal('accessRequestModal', { documentName });
    
    // Track access request
    this.state.userInteractions.documentViews.push({
      document: documentName,
      timestamp: Date.now(),
      type: 'access_request',
      access_level: accessLevel
    });
    
    // this.trackEvent('document_access_requested', {
    //   document: documentName,
    //   access_level: accessLevel
    // });
  }
  
  /**
   * Initialize intelligence demo
   */
  initializeIntelligenceDemo() {
    // Demo control buttons
    this.dom.demoControls.forEach(btn => {
      btn.addEventListener('click', () => {
        const persona = btn.getAttribute('data-persona');
        this.switchIntelligencePersona(persona);
      });
    });
    
    // Mascot card interactions
    this.dom.mascotCards.forEach(card => {
      card.addEventListener('click', () => {
        const mascot = card.getAttribute('data-mascot');
        this.activateMascotCard(mascot);
      });
    });
  }
  
  /**
   * Switch intelligence demo persona
   */
  switchIntelligencePersona(persona) {
    if (this.state.intelligenceDemo.activePersona === persona) return;
    
    this.state.intelligenceDemo.activePersona = persona;
    
    // Update button states
    this.dom.demoControls.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-persona') === persona) {
        btn.classList.add('active');
      }
    });
    
    // Update demo interface
    this.dom.demoPersonas.forEach(demo => {
      const demoPersona = demo.getAttribute('data-persona');
      if (demoPersona === persona) {
        demo.classList.remove('hidden');
        demo.style.opacity = '1';
      } else {
        demo.classList.add('hidden');
        demo.style.opacity = '0';
      }
    });
    
    // this.trackEvent('intelligence_demo_switched', { persona });
  }
  
  /**
   * Activate mascot card
   */
  activateMascotCard(mascot) {
    this.dom.mascotCards.forEach(card => {
      card.classList.remove('active');
      if (card.getAttribute('data-mascot') === mascot) {
        card.classList.add('active');
      }
    });
    
    // this.trackEvent('mascot_card_activated', { mascot });
  }
  
  /**
   * Initialize redaction system
   */
  initializeRedactionSystem() {
    this.dom.redactedElements.forEach(element => {
      element.addEventListener('click', () => {
        this.handleRedactedClick(element);
      });
      
      // Add hover effects
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
      });
    });
  }
  
  /**
   * Handle redacted content click
   */
  handleRedactedClick(element) {
    this.state.userInteractions.redactedClicks++;
    
    const content = element.getAttribute('data-reveal') || element.textContent;
    
    // Show access modal after multiple clicks
    if (this.state.userInteractions.redactedClicks >= 3) {
      this.showModal('accessRequestModal', { documentName: 'Confidential Financial Data' });
    } else {
      this.showNotification('This information requires investor verification. Contact hello@diboas.com for access.', 'info');
    }
    
    // this.trackEvent('redacted_content_clicked', {
    //   content_type: element.className.includes('stat-value') ? 'financial_metric' : 'general',
    //   click_count: this.state.userInteractions.redactedClicks,
    //   element_data: content
    // });
  }
  
  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    // Keyboard navigation for modals
    document.addEventListener('keydown', (e) => {
      if (this.state.currentModal) {
        this.handleModalKeyboard(e);
      }
    });
    
    // Skip links
    document.querySelectorAll('.skip-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    
    // ARIA live regions for notifications
    this.createAriaLiveRegion();
    
    // Focus management for form validation
    this.setupFormAccessibility();
  }
  
  /**
   * Handle modal keyboard navigation
   */
  handleModalKeyboard(e) {
    if (!this.state.currentModal) return;
    
    const modal = document.getElementById(this.state.currentModal);
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (e.key === 'Tab') {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
  
  /**
   * Create ARIA live region for notifications
   */
  createAriaLiveRegion() {
    if (document.getElementById('aria-live-region')) return;
    
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
  }
  
  /**
   * Announce to screen readers
   */
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }
  
  /**
   * Setup form accessibility
   */
  setupFormAccessibility() {
    // Associate labels with inputs
    this.dom.formInputs.forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label && !input.getAttribute('aria-labelledby')) {
        input.setAttribute('aria-labelledby', label.id || `${input.id}-label`);
      }
    });
    
    // Error announcement
    const originalValidateField = this.validateField.bind(this);
    this.validateField = (field) => {
      const wasValid = !field.classList.contains('error');
      const result = originalValidateField(field);
      
      if (wasValid && !result) {
        const errorMessage = document.getElementById(`${field.name}-error`)?.textContent;
        if (errorMessage) {
          this.announceToScreenReader(`Error in ${field.name}: ${errorMessage}`);
        }
      }
      
      return result;
    };
  }
  
  /**
   * Initialize analytics and performance monitoring
   */
  initializeAnalytics() {
    // Page load analytics
    this.trackPageLoad();
    
    // User engagement tracking
    this.setupEngagementTracking();
    
    // Error tracking
    this.setupErrorTracking();
  }
  
  /**
   * Track page load metrics
   */
  trackPageLoad() {
    window.addEventListener('load', () => {
      // Performance metrics
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      const metrics = {
        load_time: navigation.loadEventEnd - navigation.loadEventStart,
        dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        first_paint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        first_contentful_paint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
      
      // this.trackEvent('page_load_metrics', metrics);
    });
  }
  
  /**
   * Setup engagement tracking
   */
  setupEngagementTracking() {
    let engagementTimeout;
    let isActive = true;
    
    const trackEngagement = () => {
      if (isActive) {
        // this.trackEvent('user_engagement', {
        //   timestamp: Date.now(),
        //   section: this.state.currentSection,
        //   redacted_clicks: this.state.userInteractions.redactedClicks,
        //   document_views: this.state.userInteractions.documentViews.length
        // });
      }
    };
    
    // Track engagement every 30 seconds
    const startEngagementTracking = () => {
      engagementTimeout = setInterval(trackEngagement, 30000);
    };
    
    const stopEngagementTracking = () => {
      if (engagementTimeout) {
        clearInterval(engagementTimeout);
        engagementTimeout = null;
      }
    };
    
    // Page visibility API
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isActive = false;
        stopEngagementTracking();
        // this.trackEvent('page_hidden');
      } else {
        isActive = true;
        startEngagementTracking();
        // this.trackEvent('page_visible');
      }
    });
    
    // Start initial tracking
    startEngagementTracking();
    
    // Track scroll depth
    this.setupScrollDepthTracking();
  }
  
  /**
   * Setup scroll depth tracking
   */
  setupScrollDepthTracking() {
    let maxScroll = 0;
    const scrollMilestones = [25, 50, 75, 90, 100];
    const reachedMilestones = new Set();
    
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      maxScroll = Math.max(maxScroll, scrollPercent);
      
      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !reachedMilestones.has(milestone)) {
          reachedMilestones.add(milestone);
          // this.trackEvent('scroll_depth', {
          //   milestone: milestone,
          //   section: this.state.currentSection
          // });
        }
      });
    };
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScrollDepth, 100);
    }, { passive: true });
  }
  
  /**
   * Setup error tracking
   */
  setupErrorTracking() {
    window.addEventListener('error', (e) => {
      // this.trackEvent('javascript_error', {
      //   message: e.message,
      //   filename: e.filename,
      //   lineno: e.lineno,
      //   colno: e.colno,
      //   stack: e.error?.stack
      // });
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      // this.trackEvent('promise_rejection', {
      //   reason: e.reason?.toString(),
      //   stack: e.reason?.stack
      // });
    });
  }
  
  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    // Core Web Vitals monitoring
    this.observePerformanceMetrics();
    
    // Resource loading monitoring
    this.monitorResourceLoading();
  }
  
  /**
   * Observe performance metrics
   */
  observePerformanceMetrics() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // this.trackEvent('core_web_vitals', {
          //   metric: 'LCP',
          //   value: entry.startTime,
          //   target: entry.element?.tagName
          // });
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // this.trackEvent('core_web_vitals', {
          //   metric: 'FID',
          //   value: entry.processingStart - entry.startTime,
          //   target: entry.target?.tagName
          // });
        }
      }).observe({ entryTypes: ['first-input'] });
      
      // Cumulative Layout Shift
      new PerformanceObserver((entryList) => {
        let cls = 0;
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
        if (cls > 0) {
          // this.trackEvent('core_web_vitals', {
          //   metric: 'CLS',
          //   value: cls
          // });
        }
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
  
  /**
   * Monitor resource loading
   */
  monitorResourceLoading() {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter(r => r.duration > 1000);
      
      if (slowResources.length > 0) {
        // this.trackEvent('slow_resources', {
        //   count: slowResources.length,
        //   resources: slowResources.map(r => ({
        //     name: r.name,
        //     duration: r.duration,
        //     size: r.transferSize
        //   }))
        // });
      }
    });
  }
  
  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    // Before unload
    window.addEventListener('beforeunload', () => {
      this.handleBeforeUnload();
    });
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    // Close mobile nav if window becomes large
    if (window.innerWidth >= 1024 && this.state.mobileNavOpen) {
      this.closeMobileNav();
    }
    
    // this.trackEvent('window_resize', {
    //   width: window.innerWidth,
    //   height: window.innerHeight
    // });
  }
  
  /**
   * Handle before unload
   */
  handleBeforeUnload() {
    // Send final analytics
    // this.trackEvent('session_end', {
    //   duration: Date.now() - (this.state.sessionStart || Date.now()),
    //   sections_viewed: Object.keys(this.state.userInteractions.sectionViews),
    //   documents_accessed: this.state.userInteractions.documentViews.length,
    //   redacted_clicks: this.state.userInteractions.redactedClicks
    // });
  }
  
  /**
   * Load user preferences
   */
  loadUserPreferences() {
    // Theme preference loaded in initializeTheme
    
    // Other preferences can be loaded here
    this.state.sessionStart = Date.now();
  }
  
  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      z-index: 3000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 350px;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.4;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Announce to screen readers
    this.announceToScreenReader(message);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }
  
  /**
   * Get notification color based on type
   */
  getNotificationColor(type) {
    const colors = {
      success: '#059669',
      error: '#DC2626',
      warning: '#D97706',
      info: '#0284C7'
    };
    return colors[type] || colors.info;
  }
  
  /**
   * Track analytics event (stubbed for privacy)
   */
  trackEvent(eventName, properties = {}) {
    // Analytics tracking has been disabled for privacy
    // Would have tracked: eventName, properties
  }
  
  /**
   * Get or create session ID (stubbed for privacy)
   */
  getSessionId() {
    // Session tracking has been disabled for privacy
    return 'privacy_mode';
  }
  
  /**
   * Send event to analytics service (stubbed for privacy)
   */
  sendToAnalytics(event) {
    // Analytics tracking has been disabled for privacy
    // Would have sent: event
  }
  
  /**
   * Handle application errors
   */
  handleError(error, context = 'unknown') {
    console.error(`Error in ${context}:`, error);
    
    // this.trackEvent('application_error', {
    //   context,
    //   message: error.message,
    //   stack: error.stack
    // });
    
    // Show user-friendly error message
    this.showNotification('Something went wrong. Please refresh the page and try again.', 'error');
  }
}

// ===========================
// GLOBAL FUNCTIONS
// ===========================

/**
 * Global function for handling document access
 */
window.handleDocumentAccess = function(documentName, accessLevel) {
  if (window.investorApp) {
    window.investorApp.handleDocumentAccess(documentName, accessLevel);
  }
};

/**
 * Global function for requesting access
 */
window.requestAccess = function(documentType) {
  if (window.investorApp) {
    window.investorApp.requestDocumentAccess(documentType, 'restricted');
  }
};

/**
 * Global function for closing modals
 */
window.closeModal = function(modalId) {
  if (window.investorApp) {
    window.investorApp.closeModal(modalId);
  }
};

/**
 * Global function for closing mobile nav
 */
window.closeMobileNav = function() {
  if (window.investorApp) {
    window.investorApp.closeMobileNav();
  }
};

// ===========================
// APPLICATION INITIALIZATION
// ===========================

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.investorApp = new DiBoaSInvestorApp();
    console.log('🎯 diBoaS Investor Portal loaded successfully');
  } catch (error) {
    console.error('❌ Failed to initialize investor portal:', error);
  }
});

/**
 * Service Worker Registration for PWA
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// ===========================
// DEVELOPMENT HELPERS
// ===========================

// Development debug utilities disabled for production