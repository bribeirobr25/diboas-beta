/**
 * diBoaS Documentation Redesign JavaScript
 * Enterprise-grade documentation interface
 * 
 * Features: Interactive search, progressive disclosure, mascot integration
 * Performance: Optimized for Core Web Vitals
 * Accessibility: WCAG 2.1 AA compliant
 */

'use strict';

// ===========================
// DOCUMENTATION APPLICATION
// ===========================

/**
 * Main Documentation Application Class
 */
class DiBoaSDocsApp {
  constructor() {
    this.initialized = false;
    this.state = {
      currentJourney: 'beginner',
      searchResults: [],
      activeSection: null,
      theme: 'light',
      sidebarOpen: false
    };
    
    this.components = {
      search: null,
      navigation: null,
      theme: null,
      sidebar: null,
      journey: null
    };
    
    this.init();
  }
  
  /**
   * Initialize the application
   */
  init() {
    if (this.initialized) return;
    
    try {
      console.log('🚀 Initializing diBoaS Documentation Application');
      
      // Initialize core components
      this.initializeDOM();
      this.initializeSearch();
      this.initializeNavigation();
      this.initializeTheme();
      this.initializeSidebar();
      this.initializeJourneySelector();
      this.initializeAccessibility();
      this.initializeAnalytics();
      this.initializeProgressTracking();
      
      // Load user preferences
      this.loadUserPreferences();
      
      // Setup event listeners
      this.setupGlobalEventListeners();
      
      this.initialized = true;
      console.log('✅ Documentation application initialized successfully');
      
      // Track initialization
      // this.trackEvent('docs_app_initialized', {
      //   timestamp: Date.now(),
      //   user_agent: navigator.userAgent,
      //   viewport: `${window.innerWidth}x${window.innerHeight}`
      // });
      
    } catch (error) {
      console.error('❌ Failed to initialize documentation application:', error);
      this.handleError(error, 'initialization');
    }
  }
  
  /**
   * Initialize DOM references
   */
  initializeDOM() {
    this.elements = {
      // Header elements
      searchInput: document.getElementById('docs-search'),
      searchResults: document.getElementById('search-results'),
      themeToggle: document.getElementById('theme-toggle'),
      mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
      
      // Sidebar elements
      sidebar: document.getElementById('docs-sidebar'),
      sidebarOverlay: document.getElementById('sidebar-overlay'),
      navLinks: document.querySelectorAll('.nav-link'),
      
      // Content elements
      journeyOptions: document.querySelectorAll('.journey-option'),
      helpCards: document.querySelectorAll('.help-card'),
      
      // Main containers
      mainContent: document.getElementById('main-content'),
      contentWrapper: document.querySelector('.content-wrapper')
    };
    
    // Validate critical elements
    const requiredElements = ['searchInput', 'themeToggle', 'sidebar'];
    for (const elementName of requiredElements) {
      if (!this.elements[elementName]) {
        console.warn(`⚠️ Required element not found: ${elementName}`);
      }
    }
  }
  
  /**
   * Initialize search functionality
   */
  initializeSearch() {
    if (!this.elements.searchInput) return;
    
    // Mock documentation data for search
    this.searchData = [
      {
        title: "Getting Started with diBoaS",
        url: "#getting-started",
        content: "Complete guide to creating account and first crypto purchase with Aqua guidance step by step walkthrough",
        category: "Quick Start",
        keywords: ["start", "begin", "new", "account", "first", "aqua"]
      },
      {
        title: "Your First $10 Crypto Purchase",
        url: "#first-purchase", 
        content: "Buy Bitcoin Ethereum Solana Sui under 2 minutes 10 dollars minimum investment one click purchase",
        category: "Buying",
        keywords: ["buy", "purchase", "$10", "bitcoin", "ethereum", "solana", "sui", "crypto"]
      },
      {
        title: "Understanding the 4-Crypto Strategy",
        url: "#why-four-cryptos",
        content: "Why diBoaS starts with only 4 cryptocurrencies instead of overwhelming 500 options simple focused approach",
        category: "Strategy",
        keywords: ["four", "4", "cryptos", "strategy", "simple", "focused", "why"]
      },
      {
        title: "Meet Aqua - Your AI Guide",
        url: "#aqua-guide",
        content: "Aqua artificial intelligence guide beginner friendly crypto investment assistance personalized recommendations",
        category: "AI Guides",
        keywords: ["aqua", "ai", "guide", "assistant", "help", "personalized"]
      },
      {
        title: "Security Setup and Best Practices",
        url: "#security-setup",
        content: "Bank grade security two factor authentication 2FA protect funds secure account setup guide",
        category: "Security",
        keywords: ["security", "2fa", "safe", "protect", "secure", "bank-grade"]
      },
      {
        title: "Transparent Fee Structure",
        url: "#fees-pricing",
        content: "0.09% trading fees 0.9% transfer fees no hidden charges monthly fees transparent pricing structure",
        category: "Pricing",
        keywords: ["fees", "cost", "price", "transparent", "0.09%", "hidden"]
      },
      {
        title: "Verde - Growth and Multi-Asset",
        url: "#verde-growth",
        content: "Verde mascot guide growth strategies multi asset portfolio diversification investment expansion advanced features",
        category: "AI Guides",
        keywords: ["verde", "growth", "portfolio", "diversification", "advanced"]
      },
      {
        title: "Community Support and Help",
        url: "#community-support",
        content: "50000+ community members wealth builders experienced users help support share journey learn together",
        category: "Support",
        keywords: ["community", "help", "support", "members", "experienced"]
      },
      {
        title: "Platform Security Features",
        url: "#platform-security",
        content: "Military grade encryption independently audited fund protection regulatory compliance security measures",
        category: "Security",
        keywords: ["platform", "encryption", "audited", "compliance", "protection"]
      },
      {
        title: "AI-Powered Investment Guidance",
        url: "#ai-guidance",
        content: "DeFAi artificial intelligence collective AI mascot guides personalized investment recommendations adaptive learning",
        category: "AI Features",
        keywords: ["ai", "defai", "intelligent", "recommendations", "adaptive"]
      }
    ];
    
    // Setup search event listeners
    this.elements.searchInput.addEventListener('input', this.handleSearch.bind(this));
    this.elements.searchInput.addEventListener('focus', this.handleSearchFocus.bind(this));
    this.elements.searchInput.addEventListener('blur', this.handleSearchBlur.bind(this));
    this.elements.searchInput.addEventListener('keydown', this.handleSearchKeydown.bind(this));
    
    // Setup search results interaction
    if (this.elements.searchResults) {
      this.elements.searchResults.addEventListener('click', this.handleSearchResultClick.bind(this));
    }
    
    console.log('🔍 Search functionality initialized');
  }
  
  /**
   * Handle search input
   */
  handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (query.length === 0) {
      this.hideSearchResults();
      return;
    }
    
    if (query.length < 2) {
      this.showSearchSuggestions();
      return;
    }
    
    // Perform search
    const results = this.performSearch(query);
    this.displaySearchResults(results, query);
    
    // Track search
    // this.trackEvent('docs_search', {
    //   query: query,
    //   resultCount: results.length,
    //   timestamp: Date.now()
    // });
  }
  
  /**
   * Perform search on documentation data
   */
  performSearch(query) {
    const results = [];
    const queryTerms = query.split(' ').filter(term => term.length > 1);
    
    for (const doc of this.searchData) {
      let score = 0;
      let matches = [];
      
      // Check title matches (higher weight)
      const titleMatches = this.findMatches(doc.title.toLowerCase(), queryTerms);
      score += titleMatches.length * 3;
      matches.push(...titleMatches);
      
      // Check content matches
      const contentMatches = this.findMatches(doc.content.toLowerCase(), queryTerms);
      score += contentMatches.length * 2;
      matches.push(...contentMatches);
      
      // Check keyword matches (highest weight)
      for (const keyword of doc.keywords) {
        for (const term of queryTerms) {
          if (keyword.includes(term) || term.includes(keyword)) {
            score += 4;
            matches.push(term);
          }
        }
      }
      
      // Check category matches
      if (doc.category.toLowerCase().includes(query)) {
        score += 2;
        matches.push(query);
      }
      
      if (score > 0) {
        results.push({
          ...doc,
          score: score,
          matches: [...new Set(matches)]
        });
      }
    }
    
    // Sort by relevance score
    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  }
  
  /**
   * Find matches in text
   */
  findMatches(text, terms) {
    const matches = [];
    for (const term of terms) {
      if (text.includes(term)) {
        matches.push(term);
      }
    }
    return matches;
  }
  
  /**
   * Display search results
   */
  displaySearchResults(results, query) {
    if (!this.elements.searchResults) return;
    
    if (results.length === 0) {
      this.elements.searchResults.innerHTML = `
        <div class="search-no-results">
          <div class="no-results-icon">🔍</div>
          <div class="no-results-title">No results found</div>
          <div class="no-results-suggestion">Try searching for "getting started", "aqua", or "security"</div>
        </div>
      `;
    } else {
      this.elements.searchResults.innerHTML = results.map(result => {
        const highlightedTitle = this.highlightMatches(result.title, result.matches);
        const snippet = this.createSnippet(result.content, result.matches);
        
        return `
          <div class="search-result-item" role="option" data-url="${result.url}" tabindex="0">
            <div class="search-result-header">
              <div class="search-result-title">${highlightedTitle}</div>
              <div class="search-result-category">${result.category}</div>
            </div>
            <div class="search-result-snippet">${snippet}</div>
          </div>
        `;
      }).join('');
    }
    
    this.showSearchResults();
  }
  
  /**
   * Create search snippet with highlights
   */
  createSnippet(content, matches) {
    let snippet = content.substring(0, 120);
    if (content.length > 120) {
      snippet += '...';
    }
    
    return this.highlightMatches(snippet, matches);
  }
  
  /**
   * Highlight search matches
   */
  highlightMatches(text, matches) {
    if (!matches || matches.length === 0) return text;
    
    let result = text;
    for (const match of matches) {
      const regex = new RegExp(`(${this.escapeRegex(match)})`, 'gi');
      result = result.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    return result;
  }
  
  /**
   * Escape regex special characters
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  /**
   * Show search suggestions
   */
  showSearchSuggestions() {
    if (!this.elements.searchResults) return;
    
    const suggestions = [
      { title: "Getting Started", icon: "🚀" },
      { title: "Meet Aqua", icon: "🌊" },
      { title: "Security Setup", icon: "🛡️" },
      { title: "Fees & Pricing", icon: "💰" },
      { title: "First Purchase", icon: "⚡" }
    ];
    
    this.elements.searchResults.innerHTML = `
      <div class="search-suggestions">
        <div class="suggestions-title">Popular topics:</div>
        ${suggestions.map(suggestion => `
          <div class="suggestion-item" data-suggestion="${suggestion.title.toLowerCase()}">
            <span class="suggestion-icon">${suggestion.icon}</span>
            <span class="suggestion-title">${suggestion.title}</span>
          </div>
        `).join('')}
      </div>
    `;
    
    this.showSearchResults();
  }
  
  /**
   * Show search results
   */
  showSearchResults() {
    if (this.elements.searchResults) {
      this.elements.searchResults.style.display = 'block';
      this.elements.searchResults.setAttribute('aria-expanded', 'true');
    }
  }
  
  /**
   * Hide search results
   */
  hideSearchResults() {
    if (this.elements.searchResults) {
      this.elements.searchResults.style.display = 'none';
      this.elements.searchResults.setAttribute('aria-expanded', 'false');
    }
  }
  
  /**
   * Handle search focus
   */
  handleSearchFocus(event) {
    if (event.target.value.trim().length > 0) {
      this.showSearchResults();
    } else {
      this.showSearchSuggestions();
    }
  }
  
  /**
   * Handle search blur with delay
   */
  handleSearchBlur(event) {
    // Delay hiding to allow click events on results
    setTimeout(() => {
      this.hideSearchResults();
    }, 200);
  }
  
  /**
   * Handle search keyboard navigation
   */
  handleSearchKeydown(event) {
    if (event.key === 'Escape') {
      this.hideSearchResults();
      event.target.blur();
    }
    
    if (event.key === 'Enter') {
      const firstResult = this.elements.searchResults?.querySelector('.search-result-item');
      if (firstResult) {
        const url = firstResult.getAttribute('data-url');
        if (url) {
          window.location.href = url;
        }
      }
    }
  }
  
  /**
   * Handle search result clicks
   */
  handleSearchResultClick(event) {
    const resultItem = event.target.closest('.search-result-item');
    const suggestionItem = event.target.closest('.suggestion-item');
    
    if (resultItem) {
      const url = resultItem.getAttribute('data-url');
      if (url) {
        // this.trackEvent('docs_search_result_click', {
        //   url: url,
        //   position: Array.from(resultItem.parentNode.children).indexOf(resultItem)
        // });
        window.location.href = url;
      }
    }
    
    if (suggestionItem) {
      const suggestion = suggestionItem.getAttribute('data-suggestion');
      if (suggestion) {
        this.elements.searchInput.value = suggestion;
        this.handleSearch({ target: this.elements.searchInput });
      }
    }
  }
  
  /**
   * Initialize navigation functionality
   */
  initializeNavigation() {
    if (!this.elements.navLinks) return;
    
    // Setup navigation click handlers
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });
    
    // Setup help card interactions
    if (this.elements.helpCards) {
      this.elements.helpCards.forEach(card => {
        card.addEventListener('click', this.handleHelpCardClick.bind(this));
        card.addEventListener('keydown', this.handleHelpCardKeydown.bind(this));
      });
    }
    
    // Setup scroll spy for active navigation
    this.setupScrollSpy();
    
    console.log('🧭 Navigation functionality initialized');
  }
  
  /**
   * Handle navigation link clicks
   */
  handleNavClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    
    // Update active state
    this.elements.navLinks.forEach(navLink => {
      navLink.classList.remove('active');
    });
    link.classList.add('active');
    
    // Close mobile sidebar if open
    if (this.state.sidebarOpen) {
      this.closeSidebar();
    }
    
    // Track navigation
    // this.trackEvent('docs_navigation_click', {
    //   section: link.textContent.trim(),
    //   href: href
    // });
    
    // Handle smooth scrolling for anchor links
    if (href && href.startsWith('#')) {
      event.preventDefault();
      this.smoothScrollToSection(href);
    }
  }
  
  /**
   * Handle help card interactions
   */
  handleHelpCardClick(event) {
    const card = event.currentTarget;
    const link = card.querySelector('.card-link');
    
    if (link) {
      const href = link.getAttribute('href');
      // this.trackEvent('docs_help_card_click', {
      //   title: card.querySelector('.card-title')?.textContent.trim(),
      //   href: href
      // });
      
      if (href) {
        window.location.href = href;
      }
    }
  }
  
  /**
   * Handle help card keyboard interaction
   */
  handleHelpCardKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleHelpCardClick(event);
    }
  }
  
  /**
   * Setup scroll spy for navigation
   */
  setupScrollSpy() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id) {
            this.updateActiveNavigation(id);
          }
        }
      });
    }, observerOptions);
    
    // Observe all sections with IDs
    document.querySelectorAll('section[id], article[id]').forEach(section => {
      observer.observe(section);
    });
    
    this.scrollSpyObserver = observer;
  }
  
  /**
   * Update active navigation based on scroll position
   */
  updateActiveNavigation(activeId) {
    this.elements.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  /**
   * Smooth scroll to section
   */
  smoothScrollToSection(href) {
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = document.querySelector('.docs-header')?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
  
  /**
   * Initialize theme functionality
   */
  initializeTheme() {
    if (!this.elements.themeToggle) return;
    
    this.elements.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    
    // Load saved theme
    const savedTheme = localStorage.getItem('diboas-docs-theme') || 'light';
    this.setTheme(savedTheme);
    
    console.log('🎨 Theme functionality initialized');
  }
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    const currentTheme = this.state.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    // this.trackEvent('docs_theme_toggle', {
    //   from: currentTheme,
    //   to: newTheme
    // });
  }
  
  /**
   * Set theme
   */
  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('diboas-docs-theme', theme);
    
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
    if (!this.elements.mobileMenuBtn || !this.elements.sidebar) return;
    
    this.elements.mobileMenuBtn.addEventListener('click', this.toggleSidebar.bind(this));
    
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
    this.elements.sidebar?.classList.add('active');
    this.elements.sidebarOverlay?.classList.add('active');
    this.elements.mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // this.trackEvent('docs_sidebar_open');
  }
  
  /**
   * Close sidebar
   */
  closeSidebar() {
    this.state.sidebarOpen = false;
    this.elements.sidebar?.classList.remove('active');
    this.elements.sidebarOverlay?.classList.remove('active');
    this.elements.mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    
    // this.trackEvent('docs_sidebar_close');
  }
  
  /**
   * Initialize journey selector
   */
  initializeJourneySelector() {
    if (!this.elements.journeyOptions) return;
    
    this.elements.journeyOptions.forEach(option => {
      option.addEventListener('click', this.handleJourneySelect.bind(this));
    });
    
    console.log('🎯 Journey selector initialized');
  }
  
  /**
   * Handle journey selection
   */
  handleJourneySelect(event) {
    const option = event.currentTarget;
    const journey = option.getAttribute('data-journey');
    
    if (journey) {
      // Update active state
      this.elements.journeyOptions.forEach(opt => {
        opt.classList.remove('active');
      });
      option.classList.add('active');
      
      // Update journey content
      this.updateJourneyContent(journey);
      
      // Track selection
      // this.trackEvent('docs_journey_select', {
      //   journey: journey,
      //   previous: this.state.currentJourney
      // });
      
      this.state.currentJourney = journey;
    }
  }
  
  /**
   * Update journey content based on selection
   */
  updateJourneyContent(journey) {
    const journeyContents = {
      beginner: {
        mascot: 'aqua',
        message: "Perfect! I'll help you start your wealth journey safely and simply.",
        steps: [
          {
            title: "Understand the Basics",
            description: "What is crypto and why start with just 4 options?",
            link: "#crypto-basics",
            linkText: "Learn the fundamentals →"
          },
          {
            title: "Create Your Account",
            description: "Quick 2-minute setup with bank-grade security",
            link: "#account-setup",
            linkText: "Set up account →"
          },
          {
            title: "Make Your First Purchase",
            description: "Buy $10 of Bitcoin, Ethereum, Solana, or Sui",
            link: "#first-purchase",
            linkText: "Start investing →"
          }
        ]
      },
      intermediate: {
        mascot: 'verde',
        message: "Great choice! Let's expand your crypto knowledge and portfolio.",
        steps: [
          {
            title: "Portfolio Diversification",
            description: "Learn how to balance your crypto investments",
            link: "#portfolio-diversification",
            linkText: "Explore strategies →"
          },
          {
            title: "Advanced Features",
            description: "Unlock Verde's growth-focused tools",
            link: "#advanced-features",
            linkText: "Access features →"
          },
          {
            title: "Market Analysis",
            description: "Understand market movements and timing",
            link: "#market-analysis",
            linkText: "Learn analysis →"
          }
        ]
      },
      advanced: {
        mascot: 'mystic',
        message: "Excellent! Ready to explore sophisticated investment strategies?",
        steps: [
          {
            title: "DeFi Integration",
            description: "Access decentralized finance opportunities",
            link: "#defi-integration",
            linkText: "Explore DeFi →"
          },
          {
            title: "Advanced Analytics",
            description: "Deep market insights and predictions",
            link: "#advanced-analytics",
            linkText: "View analytics →"
          },
          {
            title: "Custom Strategies",
            description: "Build personalized investment approaches",
            link: "#custom-strategies",
            linkText: "Create strategy →"
          }
        ]
      }
    };
    
    const content = journeyContents[journey];
    if (!content) return;
    
    // Update the journey content in the DOM
    const journeyContainer = document.getElementById('journey-beginner');
    if (journeyContainer) {
      journeyContainer.innerHTML = `
        <div class="journey-mascot">
          <div class="mascot-avatar ${content.mascot}">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="50" cy="50" r="45" fill="var(--${content.mascot}-primary)" opacity="0.1"/>
              <circle cx="50" cy="50" r="30" fill="var(--${content.mascot}-primary)" opacity="0.3"/>
              <circle cx="50" cy="50" r="15" fill="var(--${content.mascot}-primary)"/>
              <path d="M35 45 Q50 35 65 45 Q50 55 35 45" fill="white" opacity="0.8"/>
            </svg>
          </div>
          <div class="mascot-speech">
            <p>"${content.message}"</p>
          </div>
        </div>
        
        <div class="journey-steps">
          ${content.steps.map((step, index) => `
            <div class="step-item">
              <div class="step-number">${index + 1}</div>
              <div class="step-content">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
                <a href="${step.link}" class="step-link">${step.linkText}</a>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
  
  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    // Setup keyboard navigation
    this.setupKeyboardShortcuts();
    
    // Setup focus management
    this.setupFocusManagement();
    
    // Setup reduced motion preferences
    this.setupReducedMotion();
    
    console.log('♿ Accessibility features initialized');
  }
  
  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Search focus: Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        this.elements.searchInput?.focus();
      }
      
      // Escape: Close modals/overlays
      if (event.key === 'Escape') {
        this.hideSearchResults();
        this.closeSidebar();
      }
      
      // Navigation: Arrow keys in search results
      if (event.key === 'ArrowDown' && this.elements.searchResults?.style.display === 'block') {
        event.preventDefault();
        this.navigateSearchResults('down');
      }
      
      if (event.key === 'ArrowUp' && this.elements.searchResults?.style.display === 'block') {
        event.preventDefault();
        this.navigateSearchResults('up');
      }
    });
  }
  
  /**
   * Navigate search results with keyboard
   */
  navigateSearchResults(direction) {
    const results = this.elements.searchResults?.querySelectorAll('.search-result-item');
    if (!results || results.length === 0) return;
    
    const currentFocus = this.elements.searchResults.querySelector('.search-result-item:focus');
    let nextIndex = 0;
    
    if (currentFocus) {
      const currentIndex = Array.from(results).indexOf(currentFocus);
      if (direction === 'down') {
        nextIndex = (currentIndex + 1) % results.length;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : results.length - 1;
      }
    }
    
    results[nextIndex].focus();
  }
  
  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Trap focus in search results when active
    this.elements.searchResults?.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        // Handle tab navigation within search results
        const focusableElements = this.elements.searchResults.querySelectorAll('[tabindex="0"]');
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
      document.documentElement.style.setProperty('--transition-duration', '0s');
    }
    
    prefersReducedMotion.addEventListener('change', (event) => {
      if (event.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
        document.documentElement.style.setProperty('--transition-duration', '0s');
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
        document.documentElement.style.removeProperty('--transition-duration');
      }
    });
  }
  
  /**
   * Initialize analytics
   */
  initializeAnalytics() {
    // Track page load time
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
        
        // this.trackEvent('docs_page_performance', {
        //   loadTime: loadTime,
        //   domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        //   firstPaint: this.getFirstPaint(),
        //   largestContentfulPaint: this.getLargestContentfulPaint()
        // });
      }
    });
    
    // Track user engagement
    this.setupEngagementTracking();
    
    console.log('📊 Analytics initialized');
  }
  
  /**
   * Setup engagement tracking
   */
  setupEngagementTracking() {
    let scrollDepth = 0;
    let timeOnPage = 0;
    let startTime = Date.now();
    
    // Track scroll depth
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const currentDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
      
      if (currentDepth > scrollDepth) {
        scrollDepth = currentDepth;
        
        // Track milestone depths
        if ([25, 50, 75, 90].includes(scrollDepth)) {
          // this.trackEvent('docs_scroll_depth', {
          //   depth: scrollDepth,
          //   timeToDepth: Date.now() - startTime
          // });
        }
      }
    });
    
    // Track time on page
    setInterval(() => {
      timeOnPage += 30;
      
      // Track time milestones
      if ([60, 180, 300, 600].includes(timeOnPage)) {
        // this.trackEvent('docs_time_on_page', {
        //   seconds: timeOnPage,
        //   scrollDepth: scrollDepth
        // });
      }
    }, 30000);
    
    // Track page exit
    window.addEventListener('beforeunload', () => {
      // this.trackEvent('docs_page_exit', {
      //   timeOnPage: Math.round((Date.now() - startTime) / 1000),
      //   scrollDepth: scrollDepth
      // });
    });
  }
  
  /**
   * Get First Paint timing
   */
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }
  
  /**
   * Get Largest Contentful Paint timing
   */
  getLargestContentfulPaint() {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
        observer.disconnect();
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 10000);
    });
  }
  
  /**
   * Initialize progress tracking
   */
  initializeProgressTracking() {
    this.loadReadingProgress();
    this.setupProgressSaving();
    
    console.log('📖 Progress tracking initialized');
  }
  
  /**
   * Load reading progress
   */
  loadReadingProgress() {
    const progress = JSON.parse(localStorage.getItem('diboas-docs-progress') || '{}');
    
    // Restore scroll position if available
    if (progress.scrollPosition && progress.lastVisit > Date.now() - 86400000) { // 24 hours
      setTimeout(() => {
        window.scrollTo(0, progress.scrollPosition);
      }, 100);
    }
    
    // Mark completed sections
    if (progress.completedSections) {
      progress.completedSections.forEach(section => {
        const link = document.querySelector(`[href="#${section}"]`);
        if (link) {
          link.classList.add('completed');
        }
      });
    }
  }
  
  /**
   * Setup progress saving
   */
  setupProgressSaving() {
    // Save scroll position periodically
    setInterval(() => {
      const progress = JSON.parse(localStorage.getItem('diboas-docs-progress') || '{}');
      progress.scrollPosition = window.pageYOffset;
      progress.lastVisit = Date.now();
      progress.currentJourney = this.state.currentJourney;
      localStorage.setItem('diboas-docs-progress', JSON.stringify(progress));
    }, 10000);
    
    // Save progress on page unload
    window.addEventListener('beforeunload', () => {
      const progress = JSON.parse(localStorage.getItem('diboas-docs-progress') || '{}');
      progress.scrollPosition = window.pageYOffset;
      progress.lastVisit = Date.now();
      progress.currentJourney = this.state.currentJourney;
      localStorage.setItem('diboas-docs-progress', JSON.stringify(progress));
    });
  }
  
  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Handle clicks outside search to close results
    document.addEventListener('click', (event) => {
      if (!this.elements.searchInput?.contains(event.target) && 
          !this.elements.searchResults?.contains(event.target)) {
        this.hideSearchResults();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && this.state.sidebarOpen) {
        this.closeSidebar();
      }
    });
    
    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (this.state.sidebarOpen) {
          this.closeSidebar();
        }
      }, 100);
    });
  }
  
  /**
   * Load user preferences
   */
  loadUserPreferences() {
    // Theme is already loaded in initializeTheme
    
    // Load search preferences
    const searchPrefs = JSON.parse(localStorage.getItem('diboas-docs-search-prefs') || '{}');
    if (searchPrefs.recentSearches) {
      this.recentSearches = searchPrefs.recentSearches;
    }
    
    // Load journey preference
    const progress = JSON.parse(localStorage.getItem('diboas-docs-progress') || '{}');
    if (progress.currentJourney) {
      this.state.currentJourney = progress.currentJourney;
      // Update journey selector
      const journeyOption = document.querySelector(`[data-journey="${progress.currentJourney}"]`);
      if (journeyOption) {
        this.elements.journeyOptions?.forEach(opt => opt.classList.remove('active'));
        journeyOption.classList.add('active');
        this.updateJourneyContent(progress.currentJourney);
      }
    }
  }
  
  /**
   * Track analytics event (stubbed for privacy)
   */
  trackEvent(eventName, properties = {}) {
    // Analytics tracking has been disabled for privacy
    // Would have tracked: eventName, properties
  }
  
  /**
   * Handle errors
   */
  handleError(error, context = 'unknown') {
    console.error(`Documentation App Error (${context}):`, error);
    
    // this.trackEvent('docs_error', {
    //   context: context,
    //   error: error.message,
    //   stack: error.stack?.substring(0, 500)
    // });
    
    // Graceful degradation - continue operation
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
 * Initialize the documentation application
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize the documentation app
    window.DiBoasDocsApp = new DiBoaSDocsApp();
    
    // Make it globally accessible
    window.diboasDocsApp = window.DiBoasDocsApp;
    
    console.log('✅ diBoaS Documentation application loaded successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize documentation application:', error);
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
        console.log('📱 Documentation SW registered:', registration);
      })
      .catch(registrationError => {
        console.log('📱 Documentation SW registration failed:', registrationError);
      });
  });
}

// ===========================
// PERFORMANCE MONITORING
// ===========================

/**
 * Monitor Core Web Vitals
 */
if ('performance' in window) {
  // Monitor Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('📊 LCP:', entry.startTime);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // Monitor First Input Delay
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('📊 FID:', entry.processingStart - entry.startTime);
    }
  }).observe({ entryTypes: ['first-input'] });
  
  // Monitor Cumulative Layout Shift
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        console.log('📊 CLS:', entry.value);
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiBoaSDocsApp };
}