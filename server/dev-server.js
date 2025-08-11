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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

// Environment configuration
const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost'
};

// Subdomain configuration
const SUBDOMAINS = {
  landing: { 
    path: '/', 
    dir: 'subdomains/landing',
    title: 'diBoaS Landing' 
  },
  dapp: { 
    path: '/app', 
    dir: 'subdomains/dapp',
    title: 'diBoaS dApp' 
  },
  docs: { 
    path: '/docs', 
    dir: 'subdomains/docs',
    title: 'diBoaS Docs' 
  },
  learn: { 
    path: '/learn', 
    dir: 'subdomains/learn',
    title: 'diBoaS Learn' 
  },
  mascots: { 
    path: '/mascots', 
    dir: 'subdomains/mascots',
    title: 'diBoaS Mascots' 
  },
  investors: { 
    path: '/investors', 
    dir: 'subdomains/investors',
    title: 'diBoaS Investors' 
  },
  b2b: { 
    path: '/b2b', 
    dir: 'subdomains/b2b',
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

// Static assets (shared across all subdomains)
app.use('/assets', express.static(path.join(PROJECT_ROOT, 'shared/assets')));

// Development: Path-based routing
if (ENV.NODE_ENV === 'development') {
  console.log(chalk.cyan('🔧 Development Mode: Path-based routing'));
  
  // Serve each subdomain on its path
  Object.entries(SUBDOMAINS).forEach(([name, config]) => {
    const subdomainDir = path.join(PROJECT_ROOT, config.dir);
    
    // Check if subdomain directory exists, fallback to current structure
    let staticDir = subdomainDir;
    if (!fs.existsSync(subdomainDir)) {
      // Fallback to current structure during migration
      switch(name) {
        case 'landing':
          staticDir = PROJECT_ROOT;
          break;
        case 'dapp':
          staticDir = path.join(PROJECT_ROOT, 'app');
          break;
        default:
          staticDir = path.join(PROJECT_ROOT, name);
      }
    }
    
    // Serve static files for this subdomain
    if (config.path === '/') {
      // Landing page at root
      app.use('/', express.static(staticDir));
      app.get('/', (req, res) => {
        res.sendFile(path.join(staticDir, 'index.html'));
      });
    } else {
      // Other subdomains on their paths
      app.use(config.path, express.static(staticDir));
      app.get(config.path, (req, res) => {
        res.sendFile(path.join(staticDir, 'index.html'));
      });
      
      // Handle nested routes within subdomain
      app.get(`${config.path}/*`, (req, res) => {
        const filePath = path.join(staticDir, req.params[0]);
        if (fs.existsSync(filePath)) {
          res.sendFile(filePath);
        } else {
          res.sendFile(path.join(staticDir, 'index.html'));
        }
      });
    }
    
    console.log(chalk.green(`📁 ${config.title}: ${chalk.yellow(`http://${ENV.HOST}:${ENV.PORT}${config.path}`)}`));
  });
}

// Production: Subdomain-based routing
else {
  console.log(chalk.magenta('🚀 Production Mode: Subdomain-based routing'));
  
  app.use((req, res, next) => {
    const subdomain = req.hostname.split('.')[0];
    
    // Find matching subdomain config
    const subdomainConfig = Object.values(SUBDOMAINS).find(config => 
      req.hostname.includes(subdomain) || config.path === `/${subdomain}`
    );
    
    if (subdomainConfig) {
      const staticDir = path.join(PROJECT_ROOT, subdomainConfig.dir);
      express.static(staticDir)(req, res, next);
    } else {
      // Default to landing
      express.static(path.join(PROJECT_ROOT, SUBDOMAINS.landing.dir))(req, res, next);
    }
  });
}

// API routes (shared across all subdomains)
app.use('/api', (req, res) => {
  res.json({ 
    message: 'diBoaS API', 
    environment: ENV.NODE_ENV,
    subdomain: req.headers.host 
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
    console.log(chalk.yellow('\n📍 Available Routes:'));
    Object.entries(SUBDOMAINS).forEach(([name, config]) => {
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