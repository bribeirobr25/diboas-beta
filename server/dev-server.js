#!/usr/bin/env node

/**
 * diBoaS Development Server
 * Environment-aware routing: Subdomains in production, paths in development
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import fs from 'fs';
import chalk from 'chalk';
import { replaceUrlPlaceholders } from '../config/build-urls.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

// Environment configuration
const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost'
};

// Ensure NODE_ENV is set for URL processing
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Frontend application configuration
const FRONTEND_APPS = {
  landing: { 
    path: '/', 
    dir: '.', // Root directory for landing page
    title: 'diBoaS Landing' 
  },
  dapp: { 
    path: '/app', 
    dir: 'frontend/dapp',
    title: 'diBoaS dApp' 
  },
  docs: { 
    path: '/docs', 
    dir: 'frontend/docs',
    title: 'diBoaS Docs' 
  },
  learn: { 
    path: '/learn', 
    dir: 'frontend/learn',
    title: 'diBoaS Learn' 
  },
  mascots: { 
    path: '/mascots', 
    dir: 'frontend/mascots',
    title: 'diBoaS Mascots' 
  },
  investors: { 
    path: '/investors', 
    dir: 'frontend/investors',
    title: 'diBoaS Investors' 
  },
  b2b: { 
    path: '/b2b', 
    dir: 'frontend/b2b',
    title: 'diBoaS B2B' 
  }
};

const app = express();

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false, // Will be handled per subdomain
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());

// Configure static file serving with correct MIME types
const staticOptions = {
  setHeaders: (res, filePath) => {
    // Set correct MIME types for CSS files
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    }
    // Set correct MIME types for JavaScript files
    else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    }
    // Set correct MIME types for images
    else if (filePath.match(/\.(jpg|jpeg|png|gif|svg|ico)$/i)) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    }
  }
};

// Static assets (shared across all frontend applications)
app.use('/assets', express.static(path.join(PROJECT_ROOT, 'assets'), staticOptions));

// Handle missing icons directory - fallback to favicon.png in images
app.use('/assets/icons', (req, res, next) => {
  // For any icon request, serve the favicon.png from images directory
  const faviconPath = path.join(PROJECT_ROOT, 'assets', 'images', 'favicon.png');
  if (fs.existsSync(faviconPath)) {
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(faviconPath);
  } else {
    res.status(404).send('Icon not found');
  }
});

// DDD source files for module loading
app.use('/src', express.static(path.join(PROJECT_ROOT, 'src')));

// Helper function to serve HTML with processed placeholders
function serveProcessedHtml(filePath, res) {
  try {
    if (fs.existsSync(filePath)) {
      const htmlContent = fs.readFileSync(filePath, 'utf8');
      const processedContent = replaceUrlPlaceholders(htmlContent);
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.send(processedContent);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error(chalk.red('Error processing HTML placeholders:'), error);
    res.status(500).send('Error processing file');
  }
}

// Development: Path-based routing
if (ENV.NODE_ENV === 'development') {
  console.log(chalk.cyan('🔧 Development Mode: Path-based routing'));
  
  // Serve each frontend application on its path
  Object.entries(FRONTEND_APPS).forEach(([name, config]) => {
    const subdomainDir = path.join(PROJECT_ROOT, config.dir);
    
    // Use the frontend directory structure
    const staticDir = path.join(PROJECT_ROOT, config.dir);
    
    // Ensure directory exists
    if (!fs.existsSync(staticDir)) {
      console.warn(chalk.yellow(`⚠️  Directory not found: ${staticDir}`));
      return;
    }
    
    // Serve static files for this subdomain
    if (config.path === '/') {
      // Landing page at root - serve processed HTML
      app.get('/', (req, res) => {
        serveProcessedHtml(path.join(staticDir, 'index.html'), res);
      });
      // Serve other static files normally
      app.use('/', express.static(staticDir, staticOptions));
    } else {
      // Other subdomains on their paths - serve processed HTML
      app.get(config.path, (req, res) => {
        serveProcessedHtml(path.join(staticDir, 'index.html'), res);
      });
      
      // Handle nested routes within frontend app
      app.get(`${config.path}/*`, (req, res) => {
        const filePath = path.join(staticDir, req.params[0]);
        if (fs.existsSync(filePath)) {
          // Process HTML files with placeholders
          if (filePath.endsWith('.html')) {
            serveProcessedHtml(filePath, res);
          } else {
            // Apply correct MIME type for CSS files
            if (filePath.endsWith('.css')) {
              res.setHeader('Content-Type', 'text/css; charset=UTF-8');
            }
            res.sendFile(filePath);
          }
        } else {
          // SPA fallback to processed index.html
          serveProcessedHtml(path.join(staticDir, 'index.html'), res);
        }
      });
      
      // Serve other static files normally
      app.use(config.path, express.static(staticDir, staticOptions));
    }
    
    console.log(chalk.green(`📁 ${config.title}: ${chalk.yellow(`http://${ENV.HOST}:${ENV.PORT}${config.path}`)}`));
  });
}

// Production: Subdomain-based routing for frontend applications
else {
  console.log(chalk.magenta('🚀 Production Mode: Subdomain-based routing'));
  
  app.use((req, res, next) => {
    const subdomain = req.hostname.split('.')[0];
    
    // Find matching frontend app config
    const appConfig = Object.values(FRONTEND_APPS).find(config => 
      req.hostname.includes(subdomain) || config.path === `/${subdomain}`
    );
    
    if (appConfig) {
      const staticDir = path.join(PROJECT_ROOT, appConfig.dir);
      express.static(staticDir, staticOptions)(req, res, next);
    } else {
      // Default to landing
      express.static(path.join(PROJECT_ROOT, FRONTEND_APPS.landing.dir), staticOptions)(req, res, next);
    }
  });
}

// API routes (shared across all frontend applications)
app.use('/api', (req, res) => {
  res.json({ 
    message: 'diBoaS API', 
    environment: ENV.NODE_ENV,
    host: req.headers.host 
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path,
    environment: ENV.NODE_ENV
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(chalk.red('Server Error:'), err);
  res.status(500).json({ 
    error: ENV.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Start server
app.listen(ENV.PORT, ENV.HOST, () => {
  console.log('\n' + chalk.cyan('🌊 diBoaS Development Server Started'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(`${chalk.green('Environment:')} ${ENV.NODE_ENV}`);
  console.log(`${chalk.green('Server:')} http://${ENV.HOST}:${ENV.PORT}`);
  console.log(chalk.gray('─'.repeat(50)));
  
  if (ENV.NODE_ENV === 'development') {
    console.log(chalk.yellow('\n📍 Available Frontend Applications:'));
    Object.entries(FRONTEND_APPS).forEach(([name, config]) => {
      console.log(`   ${chalk.cyan(config.title)}: http://${ENV.HOST}:${ENV.PORT}${config.path}`);
    });
  }
  
  console.log(chalk.green('\n✨ Ready for development!\n'));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n🔄 Shutting down server...'));
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(chalk.yellow('\n🔄 Shutting down server...'));
  process.exit(0);
});