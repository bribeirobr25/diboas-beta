/**
 * Core Web Vitals Monitor
 * Production-grade performance monitoring for Core Web Vitals metrics
 * Implements Google's Web Vitals specification for FCP, LCP, FID, CLS, TTFB
 */

import { PerformanceMetricsEvent } from '../../shared-kernel/common/events/DomainEvents.js';

/**
 * Core Web Vitals monitoring service
 * Tracks and reports essential performance metrics for production optimization
 */
export class CoreWebVitalsMonitor {
  constructor(options = {}) {
    this._eventBus = options.eventBus;
    this._auditLogger = options.auditLogger || console;
    this._reportingEndpoint = options.reportingEndpoint;
    this._sampleRate = options.sampleRate || 0.1; // 10% sampling rate
    
    // Performance metrics storage
    this._metrics = {
      fcp: null,      // First Contentful Paint
      lcp: null,      // Largest Contentful Paint  
      fid: null,      // First Input Delay
      cls: 0,         // Cumulative Layout Shift
      ttfb: null,     // Time to First Byte
      timestamp: Date.now(),
      sessionId: this._generateSessionId()
    };
    
    // Observer instances
    this._observers = new Map();
    
    // Initialize monitoring
    this._initializeMonitoring();
  }

  /**
   * Initialize all Core Web Vitals monitoring
   */
  _initializeMonitoring() {
    try {
      this._monitorFirstContentfulPaint();
      this._monitorLargestContentfulPaint();
      this._monitorFirstInputDelay();
      this._monitorCumulativeLayoutShift();
      this._monitorTimeToFirstByte();
      
      // Report metrics when page visibility changes or unloads
      this._setupReporting();
      
      this._auditLogger.info('Core Web Vitals monitoring initialized', {
        sessionId: this._metrics.sessionId,
        sampleRate: this._sampleRate
      });
      
    } catch (error) {
      this._auditLogger.error('Failed to initialize Core Web Vitals monitoring', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Monitor First Contentful Paint (FCP)
   * Measures time from navigation start to when first text/image is painted
   */
  _monitorFirstContentfulPaint() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcp && !this._metrics.fcp) {
          this._metrics.fcp = Math.round(fcp.startTime);
          
          this._reportMetric('fcp', {
            value: this._metrics.fcp,
            rating: this._rateFCP(this._metrics.fcp),
            timestamp: Date.now()
          });
        }
      });
      
      observer.observe({ type: 'paint', buffered: true });
      this._observers.set('fcp', observer);
      
    } catch (error) {
      this._auditLogger.warn('FCP monitoring not supported in this browser', {
        error: error.message
      });
    }
  }

  /**
   * Monitor Largest Contentful Paint (LCP) 
   * Measures loading performance - when largest content element is painted
   */
  _monitorLargestContentfulPaint() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        
        if (lcp) {
          this._metrics.lcp = Math.round(lcp.startTime);
          
          this._reportMetric('lcp', {
            value: this._metrics.lcp,
            rating: this._rateLCP(this._metrics.lcp),
            element: lcp.element ? lcp.element.tagName : 'unknown',
            timestamp: Date.now()
          });
        }
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this._observers.set('lcp', observer);
      
    } catch (error) {
      this._auditLogger.warn('LCP monitoring not supported in this browser', {
        error: error.message
      });
    }
  }

  /**
   * Monitor First Input Delay (FID)
   * Measures interactivity - delay between first user interaction and browser response
   */
  _monitorFirstInputDelay() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (!this._metrics.fid) {
            const fid = Math.round(entry.processingStart - entry.startTime);
            this._metrics.fid = fid;
            
            this._reportMetric('fid', {
              value: fid,
              rating: this._rateFID(fid),
              eventType: entry.name,
              timestamp: Date.now()
            });
          }
        });
      });
      
      observer.observe({ type: 'first-input', buffered: true });
      this._observers.set('fid', observer);
      
    } catch (error) {
      this._auditLogger.warn('FID monitoring not supported in this browser', {
        error: error.message
      });
    }
  }

  /**
   * Monitor Cumulative Layout Shift (CLS)
   * Measures visual stability - sum of all unexpected layout shifts
   */
  _monitorCumulativeLayoutShift() {
    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Only count shifts that aren't user-initiated
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this._metrics.cls = Math.round(clsValue * 1000) / 1000; // Round to 3 decimals
            
            this._reportMetric('cls', {
              value: this._metrics.cls,
              rating: this._rateCLS(this._metrics.cls),
              shiftValue: entry.value,
              timestamp: Date.now()
            });
          }
        }
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
      this._observers.set('cls', observer);
      
    } catch (error) {
      this._auditLogger.warn('CLS monitoring not supported in this browser', {
        error: error.message
      });
    }
  }

  /**
   * Monitor Time to First Byte (TTFB)
   * Measures server response time
   */
  _monitorTimeToFirstByte() {
    try {
      window.addEventListener('load', () => {
        const navigationEntries = performance.getEntriesByType('navigation');
        
        if (navigationEntries.length > 0) {
          const navigation = navigationEntries[0];
          const ttfb = Math.round(navigation.responseStart - navigation.requestStart);
          this._metrics.ttfb = ttfb;
          
          this._reportMetric('ttfb', {
            value: ttfb,
            rating: this._rateTTFB(ttfb),
            navigationStart: navigation.requestStart,
            responseStart: navigation.responseStart,
            timestamp: Date.now()
          });
        }
      }, { once: true });
      
    } catch (error) {
      this._auditLogger.warn('TTFB monitoring failed', {
        error: error.message
      });
    }
  }

  /**
   * Setup metric reporting on page visibility change and unload
   */
  _setupReporting() {
    // Report metrics when page becomes hidden
    const reportOnVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        this._reportAllMetrics();
      }
    };
    
    // Report metrics before page unloads
    const reportOnBeforeUnload = () => {
      this._reportAllMetrics();
    };
    
    document.addEventListener('visibilitychange', reportOnVisibilityChange);
    window.addEventListener('beforeunload', reportOnBeforeUnload);
  }

  /**
   * Report individual metric
   */
  _reportMetric(metricName, data) {
    try {
      // Sample rate filtering - only report subset of metrics to reduce noise
      if (Math.random() > this._sampleRate) {
        return;
      }
      
      const metricData = {
        metric: metricName,
        sessionId: this._metrics.sessionId,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        ...data
      };
      
      // Log to audit logger
      this._auditLogger.info(`Core Web Vitals - ${metricName.toUpperCase()}`, metricData);
      
      // Publish domain event
      if (this._eventBus) {
        this._eventBus.publish(new PerformanceMetricsEvent('core_web_vitals', metricData));
      }
      
      // Send to reporting endpoint if configured
      if (this._reportingEndpoint && navigator.sendBeacon) {
        navigator.sendBeacon(
          this._reportingEndpoint,
          JSON.stringify(metricData)
        );
      }
      
    } catch (error) {
      this._auditLogger.error('Failed to report metric', {
        metric: metricName,
        error: error.message
      });
    }
  }

  /**
   * Report all collected metrics
   */
  _reportAllMetrics() {
    const allMetrics = {
      sessionId: this._metrics.sessionId,
      url: window.location.href,
      timestamp: Date.now(),
      metrics: {
        fcp: this._metrics.fcp,
        lcp: this._metrics.lcp,
        fid: this._metrics.fid,
        cls: this._metrics.cls,
        ttfb: this._metrics.ttfb
      },
      ratings: {
        fcp: this._metrics.fcp ? this._rateFCP(this._metrics.fcp) : null,
        lcp: this._metrics.lcp ? this._rateLCP(this._metrics.lcp) : null,
        fid: this._metrics.fid ? this._rateFID(this._metrics.fid) : null,
        cls: this._rateCLS(this._metrics.cls),
        ttfb: this._metrics.ttfb ? this._rateTTFB(this._metrics.ttfb) : null
      }
    };
    
    this._auditLogger.info('Core Web Vitals Summary', allMetrics);
    
    if (this._eventBus) {
      this._eventBus.publish(new PerformanceMetricsEvent('core_web_vitals_summary', allMetrics));
    }
  }

  /**
   * Rate FCP performance (First Contentful Paint)
   * Good: < 1.8s, Needs Improvement: 1.8s - 3.0s, Poor: > 3.0s
   */
  _rateFCP(value) {
    if (value < 1800) return 'good';
    if (value < 3000) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Rate LCP performance (Largest Contentful Paint)
   * Good: < 2.5s, Needs Improvement: 2.5s - 4.0s, Poor: > 4.0s
   */
  _rateLCP(value) {
    if (value < 2500) return 'good';
    if (value < 4000) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Rate FID performance (First Input Delay)
   * Good: < 100ms, Needs Improvement: 100ms - 300ms, Poor: > 300ms
   */
  _rateFID(value) {
    if (value < 100) return 'good';
    if (value < 300) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Rate CLS performance (Cumulative Layout Shift)
   * Good: < 0.1, Needs Improvement: 0.1 - 0.25, Poor: > 0.25
   */
  _rateCLS(value) {
    if (value < 0.1) return 'good';
    if (value < 0.25) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Rate TTFB performance (Time to First Byte)
   * Good: < 800ms, Needs Improvement: 800ms - 1800ms, Poor: > 1800ms
   */
  _rateTTFB(value) {
    if (value < 800) return 'good';
    if (value < 1800) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get current metrics snapshot
   */
  getMetrics() {
    return {
      ...this._metrics,
      ratings: {
        fcp: this._metrics.fcp ? this._rateFCP(this._metrics.fcp) : null,
        lcp: this._metrics.lcp ? this._rateLCP(this._metrics.lcp) : null,
        fid: this._metrics.fid ? this._rateFID(this._metrics.fid) : null,
        cls: this._rateCLS(this._metrics.cls),
        ttfb: this._metrics.ttfb ? this._rateTTFB(this._metrics.ttfb) : null
      }
    };
  }

  /**
   * Generate unique session ID
   */
  _generateSessionId() {
    return 'cwv_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
  }

  /**
   * Cleanup observers and event listeners
   */
  disconnect() {
    try {
      this._observers.forEach((observer) => {
        observer.disconnect();
      });
      this._observers.clear();
      
      this._auditLogger.info('Core Web Vitals monitoring disconnected', {
        sessionId: this._metrics.sessionId
      });
      
    } catch (error) {
      this._auditLogger.error('Error disconnecting Core Web Vitals monitoring', {
        error: error.message
      });
    }
  }
}

/**
 * Create production-ready Core Web Vitals monitor
 */
export function createCoreWebVitalsMonitor(options = {}) {
  return new CoreWebVitalsMonitor({
    sampleRate: 0.1, // 10% sampling rate for production
    ...options
  });
}