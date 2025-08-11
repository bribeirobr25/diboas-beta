# diBoaS Platform Deployment Guide

## Current Setup: Cloudflare Pages ✅

Your platform is now deployed on **Cloudflare Pages** with professional subdomain support.

### Live URLs
- `diboas.com` - Landing page
- `dapp.diboas.com` - Investment dApp (redirects to `/app`)
- `docs.diboas.com` - Documentation (redirects to `/docs`)
- `learn.diboas.com` - Learning center (redirects to `/learn`)
- `mascots.diboas.com` - AI mascots (redirects to `/mascots`)
- `investors.diboas.com` - Investor portal (redirects to `/investors`)
- `b2b.diboas.com` - Business portal (redirects to `/b2b`)

## Deployment Process

### Automatic Deployment
Every push to `main` branch automatically:
1. Triggers Cloudflare Pages build
2. Runs `npm run build:cloudflare`
3. Deploys globally in ~30 seconds

### Manual Deployment
```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Cloudflare handles the rest automatically
```

## Setup Instructions

For complete setup and configuration instructions, see:
📖 **[CLOUDFLARE_COMPLETE_GUIDE.md](./CLOUDFLARE_COMPLETE_GUIDE.md)**

## Benefits vs GitHub Pages

- ✅ **True subdomains** (`dapp.diboas.com` instead of `diboas.com/app`)
- ✅ **50-80% faster** loading times
- ✅ **Global CDN** with edge caching
- ✅ **Better SEO** with professional URLs
- ✅ **Zero cost** (free tier)
- ✅ **Automatic HTTPS** for all domains

## Quick Commands

```bash
# Local development
npm run dev

# Test build locally  
npm run build:cloudflare

# Deploy (automatic on push)
git push origin main
```

## Environment Configuration

The platform automatically detects the environment:

**Development** (`localhost:3000`):
- Uses path-based routing (`/app`, `/docs`, etc.)
- Assets served locally
- Debug mode enabled

**Production** (`diboas.com`):
- Uses Cloudflare Pages with subdomain redirects
- Optimized assets with CDN
- Production performance monitoring

## File Structure

```
diboas-beta/
├── subdomains/          # Subdomain source files
│   ├── landing/         # Main landing page content
│   ├── dapp/           # dApp content
│   ├── docs/           # Docs content
│   ├── learn/          # Learn content  
│   ├── mascots/        # Mascots content
│   ├── investors/      # Investors content
│   └── b2b/            # B2B enterprise portal
├── shared/             # Shared assets and utilities
│   ├── assets/         # CSS, JS, images
│   └── utils/          # Environment configuration
├── server/             # Development server
├── scripts/            # Build scripts
├── config/             # Configuration files
└── [original dirs]     # Legacy structure (still works)
```

## Troubleshooting

See **[CLOUDFLARE_COMPLETE_GUIDE.md](./CLOUDFLARE_COMPLETE_GUIDE.md)** for detailed troubleshooting.

---

**Platform:** diBoaS OneFi  
**Hosting:** Cloudflare Pages  
**Status:** ✅ Live and operational