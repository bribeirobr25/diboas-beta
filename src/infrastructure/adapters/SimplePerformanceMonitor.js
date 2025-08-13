/**
 * Simple Performance Monitor Implementation
 * Basic implementation of PerformanceMonitorInterface for development and testing
 */

import { PerformanceMonitorInterface } from '../../shared-kernel/common/interfaces/RepositoryContracts.js';

/**
 * Simple performance monitor that tracks metrics in memory
 * Suitable for development and simple production environments
 */
export class SimplePerformanceMonitor extends PerformanceMonitorInterface {
  constructor(options = {}) {
    super();
    this._options = {
      enabled: true,
      logToConsole: true,
      retainMetrics: true,
      maxMetrics: 10000,
      aggregateMetrics: true,
      ...options
    };

    // Metric storage
    this._metrics = new Map();
    this._timers = new Map();
    this._counters = new Map();
    this._histograms = new Map();
    
    // Aggregated statistics
    this._aggregatedStats = new Map();
    
    // Start cleanup timer if retaining metrics
    if (this._options.retainMetrics) {
      this._startCleanupTimer();
    }
  }

  startTimer(metricName) {
    if (!this._options.enabled) {
      return { end: () => 0 };
    }

    const timerId = `${metricName}_${Date.now()}_${Math.random()}`;
    const startTime = performance.now();
    const startTimestamp = new Date();

    this._timers.set(timerId, {
      metricName,
      startTime,
      startTimestamp
    });

    return {
      end: () => {
        const timer = this._timers.get(timerId);
        if (!timer) {
          console.warn(`Timer not found: ${timerId}`);
          return 0;
        }

        const duration = performance.now() - timer.startTime;
        this._timers.delete(timerId);

        // Record the duration metric
        this._recordTimerMetric(metricName, duration, startTimestamp);

        return Math.round(duration);
      }
    };
  }

  async recordMetric(metricName, value, tags = {}) {
    if (!this._options.enabled) {
      return;
    }

    const metric = {
      name: metricName,
      value,
      tags,
      timestamp: new Date(),
      type: 'gauge'
    };

    this._storeMetric(metric);
    this._updateAggregatedStats(metric);

    if (this._options.logToConsole) {
      console.debug(`[METRIC] ${metricName}: ${value}`, tags);
    }
  }

  async increment(metricName, value = 1, tags = {}) {
    if (!this._options.enabled) {
      return;
    }

    const counterKey = this._getCounterKey(metricName, tags);
    const currentValue = this._counters.get(counterKey) || 0;
    const newValue = currentValue + value;
    
    this._counters.set(counterKey, newValue);

    const metric = {
      name: metricName,
      value: newValue,
      incrementBy: value,
      tags,
      timestamp: new Date(),
      type: 'counter'
    };

    this._storeMetric(metric);
    this._updateAggregatedStats(metric);

    if (this._options.logToConsole) {
      console.debug(`[COUNTER] ${metricName}: ${newValue} (+${value})`, tags);
    }
  }

  async histogram(metricName, value, tags = {}) {
    if (!this._options.enabled) {
      return;
    }

    const histogramKey = this._getHistogramKey(metricName, tags);
    
    if (!this._histograms.has(histogramKey)) {
      this._histograms.set(histogramKey, {
        values: [],
        count: 0,
        sum: 0,
        min: value,
        max: value
      });
    }

    const histogram = this._histograms.get(histogramKey);
    histogram.values.push(value);
    histogram.count++;
    histogram.sum += value;
    histogram.min = Math.min(histogram.min, value);
    histogram.max = Math.max(histogram.max, value);

    // Keep only recent values to prevent memory issues
    if (histogram.values.length > 1000) {
      histogram.values = histogram.values.slice(-500);
    }

    const metric = {
      name: metricName,
      value,
      tags,
      timestamp: new Date(),
      type: 'histogram'
    };

    this._storeMetric(metric);
    this._updateAggregatedStats(metric);

    if (this._options.logToConsole) {
      const avg = histogram.sum / histogram.count;
      console.debug(`[HISTOGRAM] ${metricName}: ${value} (avg: ${avg.toFixed(2)}, count: ${histogram.count})`, tags);
    }
  }

  /**
   * Get performance statistics
   * @returns {Object} Performance statistics
   */
  getStatistics() {
    return {
      totalMetrics: this._metrics.size,
      activeTimers: this._timers.size,
      counters: Object.fromEntries(this._counters),
      aggregatedStats: Object.fromEntries(this._aggregatedStats),
      histogramSummaries: this._getHistogramSummaries(),
      enabled: this._options.enabled
    };
  }

  /**
   * Get metrics by name
   * @param {string} metricName - Metric name to filter by
   * @param {number} limit - Maximum number of metrics to return
   * @returns {Array} Array of metrics
   */
  getMetrics(metricName = null, limit = 100) {
    let metrics = Array.from(this._metrics.values());

    if (metricName) {
      metrics = metrics.filter(metric => metric.name === metricName);
    }

    // Sort by timestamp (most recent first)
    metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return metrics.slice(0, limit);
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this._metrics.clear();
    this._counters.clear();
    this._histograms.clear();
    this._aggregatedStats.clear();
  }

  /**
   * Enable or disable the monitor
   * @param {boolean} enabled - True to enable
   */
  setEnabled(enabled) {
    this._options.enabled = enabled;
  }

  /**
   * Export metrics in Prometheus format
   * @returns {string} Metrics in Prometheus format
   */
  exportPrometheusMetrics() {
    let output = '';

    // Export counters
    for (const [key, value] of this._counters) {
      const [name, tagsStr] = key.split('|');
      const tags = tagsStr ? this._parseTagsFromString(tagsStr) : {};
      const tagStr = Object.entries(tags)
        .map(([k, v]) => `${k}="${v}"`)
        .join(',');
      
      output += `# TYPE ${name} counter\n`;
      output += `${name}{${tagStr}} ${value}\n`;
    }

    // Export histogram summaries
    for (const [key, histogram] of this._histograms) {
      const [name, tagsStr] = key.split('|');
      const tags = tagsStr ? this._parseTagsFromString(tagsStr) : {};
      const tagStr = Object.entries(tags)
        .map(([k, v]) => `${k}="${v}"`)
        .join(',');
      
      const avg = histogram.sum / histogram.count;
      
      output += `# TYPE ${name} histogram\n`;
      output += `${name}_count{${tagStr}} ${histogram.count}\n`;
      output += `${name}_sum{${tagStr}} ${histogram.sum}\n`;
      output += `${name}_avg{${tagStr}} ${avg}\n`;
      output += `${name}_min{${tagStr}} ${histogram.min}\n`;
      output += `${name}_max{${tagStr}} ${histogram.max}\n`;
    }

    return output;
  }

  // Private methods

  _recordTimerMetric(metricName, duration, startTimestamp) {
    const metric = {
      name: `${metricName}_duration`,
      value: duration,
      tags: { type: 'timer' },
      timestamp: startTimestamp,
      type: 'timer'
    };

    this._storeMetric(metric);
    this._updateAggregatedStats(metric);

    if (this._options.logToConsole) {
      console.debug(`[TIMER] ${metricName}: ${Math.round(duration)}ms`);
    }

    // Also record as histogram for better statistics
    this.histogram(`${metricName}_duration`, duration, { type: 'timer' });
  }

  _storeMetric(metric) {
    if (!this._options.retainMetrics) {
      return;
    }

    const metricId = `${metric.name}_${metric.timestamp.getTime()}_${Math.random()}`;
    this._metrics.set(metricId, metric);

    // Remove old metrics if we exceed the limit
    if (this._metrics.size > this._options.maxMetrics) {
      const oldestKeys = Array.from(this._metrics.keys()).slice(0, this._metrics.size - this._options.maxMetrics);
      oldestKeys.forEach(key => this._metrics.delete(key));
    }
  }

  _updateAggregatedStats(metric) {
    if (!this._options.aggregateMetrics) {
      return;
    }

    const statsKey = `${metric.name}_${JSON.stringify(metric.tags)}`;
    
    if (!this._aggregatedStats.has(statsKey)) {
      this._aggregatedStats.set(statsKey, {
        name: metric.name,
        tags: metric.tags,
        count: 0,
        sum: 0,
        min: metric.value,
        max: metric.value,
        avg: 0,
        lastValue: metric.value,
        lastUpdate: metric.timestamp
      });
    }

    const stats = this._aggregatedStats.get(statsKey);
    stats.count++;
    stats.sum += metric.value;
    stats.min = Math.min(stats.min, metric.value);
    stats.max = Math.max(stats.max, metric.value);
    stats.avg = stats.sum / stats.count;
    stats.lastValue = metric.value;
    stats.lastUpdate = metric.timestamp;
  }

  _getCounterKey(metricName, tags) {
    const tagStr = Object.entries(tags).map(([k, v]) => `${k}=${v}`).join(',');
    return `${metricName}|${tagStr}`;
  }

  _getHistogramKey(metricName, tags) {
    const tagStr = Object.entries(tags).map(([k, v]) => `${k}=${v}`).join(',');
    return `${metricName}|${tagStr}`;
  }

  _getHistogramSummaries() {
    const summaries = {};
    
    for (const [key, histogram] of this._histograms) {
      const [name] = key.split('|');
      const values = [...histogram.values].sort((a, b) => a - b);
      const count = values.length;
      
      if (count === 0) continue;
      
      summaries[key] = {
        count: histogram.count,
        sum: histogram.sum,
        min: histogram.min,
        max: histogram.max,
        avg: histogram.sum / histogram.count,
        p50: values[Math.floor(count * 0.5)],
        p95: values[Math.floor(count * 0.95)],
        p99: values[Math.floor(count * 0.99)]
      };
    }
    
    return summaries;
  }

  _parseTagsFromString(tagsStr) {
    const tags = {};
    if (tagsStr) {
      tagsStr.split(',').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          tags[key] = value;
        }
      });
    }
    return tags;
  }

  _startCleanupTimer() {
    // Clean up old metrics every 5 minutes
    setInterval(() => {
      const cutoffTime = new Date(Date.now() - (60 * 60 * 1000)); // 1 hour ago
      
      for (const [key, metric] of this._metrics) {
        if (metric.timestamp < cutoffTime) {
          this._metrics.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }
}