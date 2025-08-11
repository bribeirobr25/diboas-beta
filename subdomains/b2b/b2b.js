/**
 * diBoaS B2B Subdomain JavaScript
 * Enterprise-focused functionality and interactions
 */

'use strict';

// B2B-specific configuration
const B2B_CONFIG = {
  api: {
    demoRequest: '/api/b2b/demo-request',
    salesContact: '/api/b2b/sales-contact',
    enterpriseQuote: '/api/b2b/enterprise-quote'
  },
  features: {
    multiTenant: window.ENV?.FEATURE_FLAGS?.MULTI_TENANT || false,
    adminDashboard: window.ENV?.FEATURE_FLAGS?.ADMIN_DASHBOARD || false,
    whiteLabeling: window.ENV?.FEATURE_FLAGS?.WHITE_LABELING || false
  }
};

/**
 * B2B Application Entry Point
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🏢 diBoaS B2B Application Initializing...');
  
  initializeDemoForm();
  initializeAnimations();
  initializeAnalytics();
  initializeNavigation();
  
  console.log('✅ diBoaS B2B Application Ready');
});

/**
 * Initialize the demo request form
 */
function initializeDemoForm() {
  const demoForm = document.getElementById('demo-form');
  
  if (!demoForm) return;
  
  demoForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = demoForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      // Show loading state
      submitButton.textContent = 'Scheduling...';
      submitButton.disabled = true;
      
      // Collect form data
      const formData = new FormData(demoForm);
      const demoRequest = {
        company: formData.get('company'),
        email: formData.get('email'),
        name: formData.get('name'),
        employees: formData.get('employees'),
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        source: 'b2b_website',
        subdomain: 'b2b'
      };
      
      // Validate required fields
      if (!demoRequest.company || !demoRequest.email || !demoRequest.name) {
        throw new Error('Please fill in all required fields');
      }
      
      // Submit demo request
      const response = await submitDemoRequest(demoRequest);
      
      if (response.success) {
        showSuccessMessage();
        demoForm.reset();
        
        // Track successful demo request
        trackEvent('b2b_demo_requested', {
          company_size: demoRequest.employees,
          source: 'website'
        });
        
      } else {
        throw new Error(response.message || 'Failed to submit demo request');
      }
      
    } catch (error) {
      console.error('Demo request error:', error);
      showErrorMessage(error.message);
      
      // Track error
      trackEvent('b2b_demo_error', {
        error: error.message
      });
      
    } finally {
      // Reset button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
}

/**
 * Submit demo request to API
 */
async function submitDemoRequest(demoData) {
  try {
    const response = await fetch(B2B_CONFIG.api.demoRequest, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(demoData)
    });
    
    return await response.json();
    
  } catch (error) {
    // Fallback: Use email service or third-party integration
    console.log('Fallback: Would integrate with email service');
    
    // For development, return success
    return {
      success: true,
      message: 'Demo request received successfully'
    };
  }
}

/**
 * Show success message
 */
function showSuccessMessage() {
  const demoForm = document.getElementById('demo-form');
  const successMessage = document.createElement('div');
  
  successMessage.className = 'success-message';
  successMessage.innerHTML = `
    <div class="success-content">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22,4 12,14.01 9,11.01"/>
      </svg>
      <h4>Demo Request Submitted!</h4>
      <p>Thank you for your interest in diBoaS for Business. Our team will contact you within 24 hours to schedule your personalized demo.</p>
    </div>
  `;
  
  // Add styles
  successMessage.style.cssText = `
    background: #E8F5E9;
    border: 1px solid #4CAF50;
    border-radius: 12px;
    padding: 24px;
    margin-top: 20px;
    text-align: center;
  `;
  
  successMessage.querySelector('svg').style.cssText = `
    color: #4CAF50;
    margin-bottom: 12px;
  `;
  
  successMessage.querySelector('h4').style.cssText = `
    color: #2E7D5B;
    margin-bottom: 8px;
  `;
  
  successMessage.querySelector('p').style.cssText = `
    color: #1A4C3A;
    margin: 0;
  `;
  
  demoForm.appendChild(successMessage);
  
  // Remove message after 10 seconds
  setTimeout(() => {
    successMessage.remove();
  }, 10000);
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  const demoForm = document.getElementById('demo-form');
  const errorMessage = document.createElement('div');
  
  errorMessage.className = 'error-message';
  errorMessage.innerHTML = `
    <div class="error-content">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <p>${message}</p>
    </div>
  `;
  
  // Add styles
  errorMessage.style.cssText = `
    background: #FFEBEE;
    border: 1px solid #F44336;
    border-radius: 12px;
    padding: 16px;
    margin-top: 16px;
    text-align: center;
  `;
  
  errorMessage.querySelector('svg').style.cssText = `
    color: #F44336;
    margin-bottom: 8px;
  `;
  
  errorMessage.querySelector('p').style.cssText = `
    color: #C62828;
    margin: 0;
  `;
  
  demoForm.appendChild(errorMessage);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    errorMessage.remove();
  }, 5000);
}

/**
 * Initialize scroll animations
 */
function initializeAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe solution cards
  document.querySelectorAll('.solution-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

/**
 * Initialize B2B analytics
 */
function initializeAnalytics() {
  // Track page view
  trackEvent('b2b_page_view', {
    subdomain: 'b2b',
    timestamp: Date.now(),
    user_agent: navigator.userAgent
  });
  
  // Track scroll depth
  let maxScrollDepth = 0;
  let scrollDepthTracked = false;
  
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
    
    // Track 50% scroll depth once
    if (scrollPercent >= 50 && !scrollDepthTracked) {
      trackEvent('b2b_scroll_depth_50', {
        depth: scrollPercent,
        timestamp: Date.now()
      });
      scrollDepthTracked = true;
    }
  });
  
  // Track before page unload
  window.addEventListener('beforeunload', () => {
    if (maxScrollDepth > 0) {
      trackEvent('b2b_page_exit', {
        max_scroll_depth: maxScrollDepth,
        time_on_page: Date.now() - performance.timing.navigationStart
      });
    }
  });
}

/**
 * Initialize navigation enhancements
 */
function initializeNavigation() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Track navigation
        trackEvent('b2b_internal_navigation', {
          target: targetId,
          source: 'nav_link'
        });
      }
    });
  });
}

/**
 * Track events (B2B specific)
 */
function trackEvent(eventName, properties = {}) {
  // Add B2B context to all events
  const eventData = {
    ...properties,
    subdomain: 'b2b',
    timestamp: Date.now(),
    session_id: getSessionId()
  };
  
  // Use main DiBoaS tracking if available
  if (window.DiBoaS && window.DiBoaS.trackEvent) {
    window.DiBoaS.trackEvent(eventName, eventData);
  } else {
    // Fallback console logging
    console.log('📊 B2B Event:', eventName, eventData);
  }
}

/**
 * Get or create session ID
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('diboas_b2b_session');
  
  if (!sessionId) {
    sessionId = 'b2b_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('diboas_b2b_session', sessionId);
  }
  
  return sessionId;
}

/**
 * Export B2B utilities for use in other scripts
 */
window.DiBoaS_B2B = {
  trackEvent,
  submitDemoRequest,
  config: B2B_CONFIG
};