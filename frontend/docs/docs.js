/**
 * diBoaS Documentation Interface
 * Pure DDD, Event-Driven, Service Agnostic Architecture - NO LEGACY COMPATIBILITY
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
 * Follows DDD principles with domain-focused organization
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
   * Initialize the application with DDD architecture integration
   */
  async init() {
    if (this.initialized) return;

    try {
      console.log('📖 Initializing diBoaS Documentation Application');

      // Initialize core components
      this.initializeTheme();
      this.initializeNavigation();
      this.initializeSearch();
      this.initializeSidebar();
      this.initializeJourneySelector();

      // Set up event listeners
      this.setupEventListeners();

      // Initialize responsive behavior
      this.initializeResponsive();

      // Set up accessibility features
      this.initializeAccessibility();

      // Mark as initialized
      this.initialized = true;

      console.log('✅ diBoaS Documentation Application initialized successfully');

      // Integrate with main DDD architecture if available
      this.integrateDDDArchitecture();

    } catch (error) {
      console.error('❌ Documentation Application initialization failed:', error);
      throw error;
    }
  }

  /**
   * Integrate with main DDD architecture
   */
  async integrateDDDArchitecture() {
    // Wait for main DDD system to be available
    if (window._diBoaSInitialized) {
      console.log('🌉 Integrating docs with DDD architecture');
      
      // Listen for DDD system events
      window.addEventListener('diBoaSInitialized', (event) => {
        console.log('📖 Docs integrated with DDD system:', event.detail);
      });
    }
  }

  /**
   * Initialize theme system
   */
  initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Apply saved theme
    const savedTheme = localStorage.getItem('diboas-docs-theme') || 'light';
    this.setTheme(savedTheme);
  }

  /**
   * Initialize navigation system
   */
  initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        this.navigateToSection(section);
      });
    });
  }

  /**
   * Initialize search functionality
   */
  initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (searchInput) {
      // Debounced search
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });

      // Search shortcuts
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }
  }

  /**
   * Initialize sidebar functionality
   */
  initializeSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        this.closeSidebar();
      });
    }
  }

  /**
   * Initialize journey selector
   */
  initializeJourneySelector() {
    const journeyButtons = document.querySelectorAll('.journey-btn');
    journeyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const journey = btn.getAttribute('data-journey');
        this.setJourney(journey);
      });
    });
  }

  /**
   * Set up global event listeners
   */
  setupEventListeners() {
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSidebar();
        this.clearSearch();
      }
    });

    // Handle clicks outside elements
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.clearSearchResults();
      }
    });
  }

  /**
   * Initialize responsive behavior
   */
  initializeResponsive() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaQueryChange = (e) => {
      if (!e.matches) {
        this.closeSidebar();
      }
    };

    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);
  }

  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    // Add ARIA labels to interactive elements
    const interactiveElements = document.querySelectorAll('button, .nav-link, .search-input');
    interactiveElements.forEach(element => {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        const text = element.textContent || element.placeholder || 'Interactive element';
        element.setAttribute('aria-label', text);
      }
    });

    // Keyboard navigation for custom elements
    const customLinks = document.querySelectorAll('.nav-link');
    customLinks.forEach(link => {
      link.setAttribute('tabindex', '0');
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });
  }

  // ===========================
  // CORE FUNCTIONALITY METHODS
  // ===========================

  /**
   * Toggle theme between light and dark
   */
  toggleTheme() {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Set application theme
   */
  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('diboas-docs-theme', theme);

    // Update theme toggle icon
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }

  /**
   * Navigate to documentation section
   */
  navigateToSection(sectionId) {
    // Update active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Update content
    this.state.activeSection = sectionId;
    this.loadSectionContent(sectionId);

    // Update URL without reload
    if (history.pushState) {
      history.pushState(null, null, `#${sectionId}`);
    }
  }

  /**
   * Load section content
   */
  loadSectionContent(sectionId) {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) return;

    // Show loading state
    contentArea.innerHTML = '<div class="loading">Loading documentation...</div>';

    // Simulate content loading (in real app, this would fetch from API or static files)
    setTimeout(() => {
      const content = this.generateSectionContent(sectionId);
      contentArea.innerHTML = content;
      
      // Re-initialize any interactive elements in the new content
      this.initializeDynamicContent();
    }, 300);
  }

  /**
   * Generate section content
   */
  generateSectionContent(sectionId) {
    const contentTemplates = {
      'getting-started': `
        <h1>Getting Started</h1>
        <p>Welcome to the diBoaS OneFi Platform documentation. This guide will help you understand our Domain-Driven Design architecture.</p>
        <h2>Architecture Overview</h2>
        <ul>
          <li><strong>Domain-Driven Design</strong>: Pure domain models and services</li>
          <li><strong>Event-Driven Architecture</strong>: Reactive communication between domains</li>
          <li><strong>Service Agnostic</strong>: Abstract interfaces and repositories</li>
        </ul>
      `,
      'api-reference': `
        <h1>API Reference</h1>
        <p>Complete API documentation for the diBoaS platform.</p>
        <h2>Authentication</h2>
        <p>All API requests require authentication via JWT tokens.</p>
        <h2>Endpoints</h2>
        <p>RESTful API endpoints following OpenAPI 3.0 specification.</p>
      `,
      'tutorials': `
        <h1>Tutorials</h1>
        <p>Step-by-step tutorials to help you build with diBoaS.</p>
        <h2>Building Your First DApp</h2>
        <p>Learn how to create a decentralized application using our DDD architecture.</p>
      `,
      'guides': `
        <h1>Developer Guides</h1>
        <p>In-depth guides for advanced development scenarios.</p>
        <h2>Domain Design Patterns</h2>
        <p>Best practices for implementing Domain-Driven Design in your applications.</p>
      `
    };

    return contentTemplates[sectionId] || `
      <h1>Documentation Section</h1>
      <p>Content for ${sectionId} is being prepared.</p>
    `;
  }

  /**
   * Initialize dynamic content after loading
   */
  initializeDynamicContent() {
    // Re-apply accessibility features to new content
    const newInteractiveElements = document.querySelectorAll('.content-area button, .content-area a');
    newInteractiveElements.forEach(element => {
      if (!element.getAttribute('aria-label') && element.textContent) {
        element.setAttribute('aria-label', element.textContent);
      }
    });
  }

  /**
   * Perform documentation search
   */
  performSearch(query) {
    if (!query || query.length < 2) {
      this.clearSearchResults();
      return;
    }

    // Simulate search (in real app, this would query an API or search index)
    const mockResults = [
      { title: 'Getting Started', excerpt: 'Introduction to diBoaS platform', url: '#getting-started' },
      { title: 'API Authentication', excerpt: 'How to authenticate API requests', url: '#api-reference' },
      { title: 'Domain Events', excerpt: 'Working with domain events', url: '#guides' },
      { title: 'Tutorial: First DApp', excerpt: 'Build your first decentralized app', url: '#tutorials' }
    ].filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(query.toLowerCase())
    );

    this.displaySearchResults(mockResults);
  }

  /**
   * Display search results
   */
  displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
    } else {
      const resultsHtml = results.map(result => `
        <a href="${result.url}" class="search-result-item" data-section="${result.url.replace('#', '')}">
          <div class="search-result-title">${result.title}</div>
          <div class="search-result-excerpt">${result.excerpt}</div>
        </a>
      `).join('');
      
      searchResults.innerHTML = resultsHtml;

      // Add click handlers to search results
      searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const section = item.getAttribute('data-section');
          this.navigateToSection(section);
          this.clearSearchResults();
        });
      });
    }

    searchResults.classList.add('show');
  }

  /**
   * Clear search results
   */
  clearSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
      searchResults.classList.remove('show');
      searchResults.innerHTML = '';
    }
  }

  /**
   * Clear search input and results
   */
  clearSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = '';
    }
    this.clearSearchResults();
  }

  /**
   * Toggle sidebar visibility
   */
  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;
    document.body.classList.toggle('sidebar-open', this.state.sidebarOpen);
  }

  /**
   * Close sidebar
   */
  closeSidebar() {
    this.state.sidebarOpen = false;
    document.body.classList.remove('sidebar-open');
  }

  /**
   * Set user journey type
   */
  setJourney(journey) {
    this.state.currentJourney = journey;
    
    // Update active journey button
    document.querySelectorAll('.journey-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-journey="${journey}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // Update content based on journey
    this.filterContentByJourney(journey);
    
    localStorage.setItem('diboas-docs-journey', journey);
  }

  /**
   * Filter content based on journey type
   */
  filterContentByJourney(journey) {
    // Add journey-specific filtering logic here
    console.log(`📖 Filtering docs for ${journey} journey`);
  }
}

// ===========================
// INITIALIZATION
// ===========================

// Initialize documentation app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.diBoaSDocsApp = new DiBoaSDocsApp();
});

// Handle initial navigation from URL hash
window.addEventListener('load', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && window.diBoaSDocsApp) {
    window.diBoaSDocsApp.navigateToSection(hash);
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiBoaSDocsApp;
}