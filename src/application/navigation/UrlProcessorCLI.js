#!/usr/bin/env node

/**
 * URL Processor CLI
 * Command-line interface that uses domain services for URL processing
 * Application layer component that orchestrates navigation domain services
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RouteProcessingService } from './RouteProcessingService.js';
import { createNavigationService } from '../infrastructure/navigation/NavigationServiceFactory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main execution function
 */
async function main() {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Starting domain-aware URL processing...');
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const config = parseArguments(args);
    
    console.log(`📋 Configuration:`, {
      environment: config.environment,
      targetPath: config.targetPath,
      dryRun: config.dryRun,
      verbose: config.verbose
    });

    // Create domain services
    const navigationService = createNavigationService({
      auditLogger: {
        enabled: config.verbose,
        handler: config.verbose ? consoleLogHandler : null
      },
      performanceMonitor: {
        enabled: config.verbose,
        handler: config.verbose ? consoleMetricHandler : null
      }
    });

    const routeProcessingService = new RouteProcessingService(navigationService);

    // Validate routes before processing
    console.log('🔍 Validating route configuration...');
    const validation = await routeProcessingService.validateRoutes(config.environment);
    
    if (!validation.isValid) {
      console.error('❌ Route validation failed:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      process.exit(1);
    }

    console.log('✅ Route validation passed');
    console.log(`📍 Available routes: ${validation.routes.join(', ')}`);

    // Process directory
    console.log(`🔄 Processing files in: ${config.targetPath}`);
    const result = await routeProcessingService.processDirectory(
      config.targetPath,
      config.environment,
      {
        processingType: 'build',
        dryRun: config.dryRun,
        extensions: ['.html', '.js', '.css'],
        excludePatterns: [
          /node_modules/,
          /\.git/,
          /config\/build-urls\.js$/,
          /scripts\/.+\.js$/,
          /src\/infrastructure\/.+\.js$/,
          /src\/domains\/.+\.js$/,
          /src\/application\/.+\.js$/
        ]
      }
    );

    // Display results
    if (result.success) {
      console.log('✅ Processing completed successfully!');
      console.log(`📊 Results:`);
      console.log(`  - Files processed: ${result.processedFiles}/${result.totalFiles}`);
      console.log(`  - Duration: ${result.duration}ms`);
      
      if (config.verbose && result.results.length > 0) {
        console.log(`\n📝 Detailed results:`);
        result.results.forEach(file => {
          if (file.processed) {
            console.log(`  ✅ ${path.relative(config.targetPath, file.file)} (${file.replacements} replacements)`);
          } else if (config.verbose) {
            console.log(`  ⏭️  ${path.relative(config.targetPath, file.file)} - ${file.reason}`);
          }
        });
      }

      // Display statistics
      if (config.verbose) {
        const stats = routeProcessingService.getStatistics();
        console.log(`\n📈 Statistics:`);
        console.log(`  - Total processing runs: ${stats.totalProcessingRuns}`);
        console.log(`  - Total events published: ${stats.totalEventsPublished}`);
      }

    } else {
      console.error('❌ Processing failed:');
      console.error(`  Error: ${result.error}`);
      process.exit(1);
    }

    const totalDuration = Date.now() - startTime;
    console.log(`\n🎉 Complete! Total time: ${totalDuration}ms`);

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Parse command line arguments
 */
function parseArguments(args) {
  const config = {
    environment: process.env.NODE_ENV || 'development',
    targetPath: process.cwd(),
    dryRun: false,
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--env':
      case '-e':
        config.environment = args[++i];
        break;
      
      case '--path':
      case '-p':
        config.targetPath = path.resolve(args[++i]);
        break;
      
      case '--dry-run':
      case '-d':
        config.dryRun = true;
        break;
      
      case '--verbose':
      case '-v':
        config.verbose = true;
        break;
      
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          showHelp();
          process.exit(1);
        }
        // Treat as target path if no path specified
        if (config.targetPath === process.cwd()) {
          config.targetPath = path.resolve(arg);
        }
        break;
    }
  }

  return config;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Domain-Aware URL Processor

Usage: node UrlProcessorCLI.js [options] [path]

Options:
  -e, --env <environment>     Target environment (development, production, staging, test)
  -p, --path <path>          Target directory to process
  -d, --dry-run              Show what would be processed without making changes
  -v, --verbose              Show detailed output and statistics
  -h, --help                 Show this help message

Examples:
  node UrlProcessorCLI.js
  node UrlProcessorCLI.js --env production --path ./dist
  node UrlProcessorCLI.js --dry-run --verbose
  node UrlProcessorCLI.js . --env staging
`);
}

/**
 * Console log handler for audit events
 */
function consoleLogHandler(logEntry) {
  const timestamp = logEntry.timestamp.toISOString();
  const level = logEntry.level || 'INFO';
  
  if (level === 'error') {
    console.error(`[${timestamp}] ${level.toUpperCase()}: ${logEntry.message}`, logEntry.data || '');
  } else if (level === 'warn') {
    console.warn(`[${timestamp}] ${level.toUpperCase()}: ${logEntry.message}`, logEntry.data || '');
  } else {
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${logEntry.message}`, logEntry.data || '');
  }
}

/**
 * Console metric handler for performance events
 */
function consoleMetricHandler(metric) {
  if (metric.metricName && metric.duration !== undefined) {
    console.log(`[PERF] ${metric.metricName}: ${metric.duration}ms`);
  } else {
    console.log(`[METRIC] ${metric.metricName}: ${metric.value}`, metric.tags || '');
  }
}

/**
 * Ensure target path exists and is accessible
 */
async function validateTargetPath(targetPath) {
  try {
    const stats = await fs.stat(targetPath);
    if (!stats.isDirectory()) {
      throw new Error(`Target path is not a directory: ${targetPath}`);
    }
    
    // Check if we can read the directory
    await fs.access(targetPath, fs.constants.R_OK);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Target path does not exist: ${targetPath}`);
    } else if (error.code === 'EACCES') {
      throw new Error(`Permission denied accessing: ${targetPath}`);
    } else {
      throw error;
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main, parseArguments };