# GitHub Actions Workflows

## Disabled Workflows

### `deploy.yml.disabled`
- **Purpose:** Previously used for GitHub Pages deployment
- **Status:** DISABLED - Migrated to Cloudflare Pages
- **Reason:** Cloudflare Pages provides better performance and subdomain support
- **To re-enable:** Rename from `deploy.yml.disabled` to `deploy.yml`

## Current Deployment

The diBoaS platform is now deployed using **Cloudflare Pages** with automatic deployments on push to main branch.

### Deployment Process
1. Push changes to `main` branch
2. Cloudflare Pages automatically builds using `npm run build:cloudflare`
3. Site is deployed globally across Cloudflare's CDN

### Benefits over GitHub Pages
- ✅ True subdomain support
- ✅ 50-80% faster loading times
- ✅ Better Core Web Vitals scores
- ✅ Global edge caching
- ✅ Zero cost (free tier)

### URLs
- **Production:** https://diboas.com (and subdomains)
- **Preview:** Cloudflare Pages provides preview URLs for pull requests