/**
 * diBoaS Integration Layer
 * Pure DDD, Event-Driven, Service Agnostic Integration - NO LEGACY COMPATIBILITY
 */

import { getGlobalApplication } from '../application/DiBoaSApplication.js'
import { getGlobalUIManager } from '../../assets/js/ui/DiBoaSUIManager.js'
import { createCoreWebVitalsMonitor } from '../infrastructure/performance/CoreWebVitalsMonitor.js'
import { createGlobalErrorHandler } from '../infrastructure/monitoring/GlobalErrorHandler.js'
import { createABTestingService } from '../domains/experimentation/services/ABTestingService.js'

/**
 * Clean Integration Layer - DDD Architecture Only
 * No legacy compatibility, no bridging, pure DDD implementation
 */
export class DiBoaSIntegration {
  constructor() {
    this.isInitialized = false
    this.application = null
    this.uiManager = null
    this.performanceMonitor = null
    this.errorHandler = null
    this.abTestingService = null
  }

  /**
   * Initialize pure DDD architecture
   */
  async initialize() {
    if (this.isInitialized) return

    try {
      console.log('🔄 Starting diBoaS DDD Integration...')

      // 1. Initialize production monitoring services
      await this._initializeMonitoringServices()

      // 2. Initialize DDD architecture
      this.application = await getGlobalApplication()
      this.uiManager = await getGlobalUIManager()

      // 3. Activate A/B testing service
      await this._activateABTesting()

      // 4. Set up event-driven communication
      await this._setupEventDrivenCommunication()

      this.isInitialized = true
      console.log('✅ diBoaS DDD Integration complete')

    } catch (error) {
      console.error('❌ DDD Integration failed:', error)
      throw error
    }
  }

  /**
   * Initialize production monitoring services
   */
  async _initializeMonitoringServices() {
    console.log('📊 Initializing production monitoring services...')

    // Core Web Vitals monitoring
    this.performanceMonitor = createCoreWebVitalsMonitor({
      eventBus: this.application?._eventBus,
      sampleRate: 0.1
    })

    // Global error handling
    this.errorHandler = createGlobalErrorHandler({
      eventBus: this.application?._eventBus,
      sampleRate: 1.0
    })

    console.log('✅ Production monitoring services initialized')
  }

  /**
   * Activate A/B testing service
   */
  async _activateABTesting() {
    console.log('🧪 Activating A/B testing service...')

    this.abTestingService = createABTestingService({
      debugMode: true
    })

    // Create sample experiment for UI testing
    const experiment = await this.abTestingService.createExperiment({
      id: 'button_color_test',
      name: 'Button Color A/B Test',
      variants: [
        { id: 'control', name: 'Original Blue', weight: 0.5, isControl: true },
        { id: 'variant', name: 'Green Alternative', weight: 0.5, isControl: false }
      ]
    })

    await this.abTestingService.startExperiment('button_color_test')
  }

  /**
   * Set up event-driven communication between domains
   */
  async _setupEventDrivenCommunication() {
    console.log('📡 Setting up event-driven communication...')

    if (!this.application?._eventBus) {
      console.warn('Event bus not available, skipping event setup')
      return
    }

    // Subscribe to domain events
    this.application._eventBus.subscribe('UserJourneyProgressed', (event) => {
      console.log('🎯 User journey progressed:', event.eventData)
    })

    this.application._eventBus.subscribe('SystemError', (event) => {
      console.error('🚨 System error:', event.eventData)
    })

    console.log('✅ Event-driven communication setup complete')
  }

  /**
   * Get application health status
   */
  getHealthStatus() {
    return {
      integration: this.isInitialized,
      application: !!this.application,
      uiManager: !!this.uiManager,
      monitoring: !!this.performanceMonitor,
      errorHandler: !!this.errorHandler,
      abTesting: !!this.abTestingService
    }
  }

  /**
   * Get integration metrics
   */
  getMetrics() {
    return {
      status: 'operational',
      architecture: 'domain-driven-design',
      eventDriven: true,
      serviceAgnostic: true,
      legacyCompatibility: false, // Explicitly no legacy support
      monitoring: {
        performance: !!this.performanceMonitor,
        errors: !!this.errorHandler,
        abTesting: !!this.abTestingService
      }
    }
  }

  /**
   * Clean shutdown
   */
  async shutdown() {
    console.log('🛑 Shutting down diBoaS Integration...')

    if (this.uiManager) {
      await this.uiManager.shutdown()
    }

    if (this.application) {
      await this.application.shutdown()
    }

    this.isInitialized = false
    console.log('✅ diBoaS Integration shutdown complete')
  }
}

// Global integration instance
let globalIntegration = null

/**
 * Get global integration instance (singleton)
 */
export async function getGlobalIntegration() {
  if (!globalIntegration) {
    globalIntegration = new DiBoaSIntegration()
    await globalIntegration.initialize()
  }
  return globalIntegration
}

/**
 * Auto-initialize integration when imported
 */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const integration = await getGlobalIntegration()
        console.log('✅ diBoaS Integration auto-initialized:', integration.getHealthStatus())
      } catch (error) {
        console.error('❌ Auto-initialization failed:', error)
      }
    })
  } else {
    // DOM already loaded
    setTimeout(async () => {
      try {
        const integration = await getGlobalIntegration()
        console.log('✅ diBoaS Integration auto-initialized:', integration.getHealthStatus())
      } catch (error) {
        console.error('❌ Auto-initialization failed:', error)
      }
    }, 100)
  }
}