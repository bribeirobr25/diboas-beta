# Local Development Guide

This guide explains how to run diBoaS locally without affecting production code.

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up local environment:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Start development server:**
   ```bash
   pnpm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```

## Environment Configuration

The application uses environment variables to handle differences between development and production:

### Key Local Development Variables

| Variable | Description | Local Value | Production Value |
|----------|-------------|-------------|------------------|
| `VITE_DAPP_URL` | DApp subdomain URL | `http://localhost:5173` | `https://dapp.diboas.com` |
| `VITE_B2B_URL` | B2B subdomain URL | `http://localhost:5173` | `https://b2b.diboas.com` |
| `VITE_DISABLE_BUNDLE_PRELOAD` | Skip chunk preloading | `true` | `false` |
| `VITE_USE_FALLBACK_INFRASTRUCTURE` | Use simple infrastructure | `true` | `false` |
| `VITE_USE_MOCK_DATA` | Enable mock API | `true` | `false` |

## How It Works

### 1. **Navigation Behavior**
- **Development:** "Get Started" button navigates to `/auth` (same localhost)
- **Production:** "Get Started" button navigates to `https://dapp.diboas.com`

### 2. **Bundle Loading**
- **Development:** Chunk preloading disabled (prevents 404 errors)
- **Production:** Full chunk preloading for performance

### 3. **Infrastructure**
- **Development:** Fallback infrastructure (simple in-memory services)
- **Production:** Full DDD architecture with all services

### 4. **Data Source**
- **Development:** Mock data service (no backend required)
- **Production:** Real API endpoints

## Production Deployment

**No code changes needed!** The application automatically detects the environment:

1. **Environment variables** control behavior
2. **No hardcoded checks** in source code
3. **Production builds** use production URLs by default
4. **Clean separation** between dev and prod configurations

### Production Environment Variables
```bash
# Production .env (not .env.local)
VITE_DAPP_URL=https://dapp.diboas.com
VITE_B2B_URL=https://b2b.diboas.com
VITE_DISABLE_BUNDLE_PRELOAD=false
VITE_USE_FALLBACK_INFRASTRUCTURE=false
VITE_USE_MOCK_DATA=false
```

## Troubleshooting

### Common Issues

1. **404 errors on chunks:** Ensure `VITE_DISABLE_BUNDLE_PRELOAD=true` in `.env.local`
2. **Infrastructure errors:** Ensure `VITE_USE_FALLBACK_INFRASTRUCTURE=true` in `.env.local`
3. **Button redirects to wrong URL:** Check `VITE_DAPP_URL` and `VITE_B2B_URL` in `.env.local`

### Development vs Production Check

Run this in browser console to verify environment detection:
```javascript
console.log('Environment:', {
  isDev: import.meta.env.DEV,
  dappUrl: import.meta.env.VITE_DAPP_URL,
  usesMockData: import.meta.env.VITE_USE_MOCK_DATA
})
```

## Team Workflow

1. **Developers:** Use `.env.local` for local development
2. **Staging:** Use staging-specific environment variables
3. **Production:** Use production environment variables
4. **CI/CD:** Automatically sets correct environment variables per environment

## Security

- `.env.local` is git-ignored (contains local configs only)
- `.env.local.example` is versioned (template for team)
- No sensitive production data in local files
- Environment-based configuration prevents accidental production changes

This approach ensures:
✅ **Zero production risk** - no hardcoded dev checks  
✅ **Clean deployments** - environment variables handle differences  
✅ **Team consistency** - same setup process for all developers  
✅ **No code changes** needed when deploying to production