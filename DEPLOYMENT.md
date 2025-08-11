# diBoaS Platform Deployment Guide

## Current GitHub Pages Setup ✅

Your current deployment uses **path-based routing** which is compatible with GitHub Pages:

- `diboas.com/` - Landing page
- `diboas.com/app/` - dApp
- `diboas.com/docs/` - Documentation  
- `diboas.com/learn/` - Learning center
- `diboas.com/mascots/` - Mascots page
- `diboas.com/investors/` - Investor portal
- `diboas.com/b2b/` - **NEW** Business portal

## Deployment Options

### Option 1: Keep Current Path-Based (Recommended for Now)

**Pros:**
- ✅ Works with existing GitHub Pages
- ✅ Single repository management
- ✅ Easy development workflow
- ✅ No additional DNS configuration

**Cons:**
- ❌ URLs are `diboas.com/app` instead of `dapp.diboas.com`
- ❌ Less professional for B2B clients

**To Deploy:**
```bash
# The GitHub Action will automatically deploy on push to main
git add .
git commit -m "Add subdomain architecture"
git push origin main
```

### Option 2: True Subdomains with Multiple Repos

**Pros:**
- ✅ Professional URLs (`dapp.diboas.com`)
- ✅ Independent deployments
- ✅ Better for enterprise clients

**Cons:**
- ❌ Requires multiple repositories
- ❌ More complex DNS setup
- ❌ Separate GitHub Actions for each repo

**Setup Required:**
1. Create separate repos for each subdomain
2. Configure DNS records for each subdomain
3. Set up deployment for each repository

## Quick Start for Current Setup

### 1. Test Locally
```bash
pnpm run dev
# Visit http://localhost:3000/b2b to see the new B2B portal
```

### 2. Deploy to GitHub Pages
```bash
# Build and commit
pnpm run build:github-pages  # Optional: test the build locally
git add .
git commit -m "Add B2B subdomain and improved architecture"
git push origin main
```

### 3. Access Your Sites
- **Landing:** https://diboas.com/
- **dApp:** https://diboas.com/app/  
- **Docs:** https://diboas.com/docs/
- **Learn:** https://diboas.com/learn/
- **Mascots:** https://diboas.com/mascots/
- **Investors:** https://diboas.com/investors/
- **B2B:** https://diboas.com/b2b/ ⭐ **NEW**

## DNS Configuration (Optional - For Future)

If you want true subdomains later, configure these DNS records:

```
# A Records
diboas.com                   → 185.199.108.153
diboas.com                   → 185.199.109.153  
diboas.com                   → 185.199.110.153
diboas.com                   → 185.199.111.153

# CNAME Records (Subdomain redirects)
dapp.diboas.com             → diboas.com
docs.diboas.com             → diboas.com  
learn.diboas.com            → diboas.com
mascots.diboas.com          → diboas.com
investors.diboas.com        → diboas.com
b2b.diboas.com              → diboas.com
```

Then use JavaScript redirects or server-side redirects to route to the correct paths.

## Environment Configuration

The platform automatically detects the environment:

**Development** (`localhost:3000`):
- Uses path-based routing (`/app`, `/docs`, etc.)
- Assets served locally
- Debug mode enabled

**Production** (`diboas.com`):
- Uses current GitHub Pages structure
- Optimized assets
- Production analytics

## File Structure

```
diboas-beta/
├── subdomains/          # New subdomain source files
│   ├── landing/         # Main landing page content
│   ├── dapp/           # dApp content (copied from app/)
│   ├── docs/           # Docs content
│   ├── learn/          # Learn content  
│   ├── mascots/        # Mascots content
│   ├── investors/      # Investors content
│   └── b2b/            # NEW B2B enterprise portal
├── shared/             # Shared assets and utilities
│   ├── assets/         # CSS, JS, images
│   └── utils/          # Environment configuration
├── server/             # Development server
├── scripts/            # Build scripts
├── .github/workflows/  # GitHub Actions
└── [original files]    # Existing structure (still works)
```

## Next Steps

1. **Test locally**: `pnpm run dev`
2. **Deploy**: Push to main branch (auto-deploys)  
3. **Monitor**: Check GitHub Actions for deployment status
4. **Optimize**: Later migrate to true subdomains if needed

## Troubleshooting

**If B2B page doesn't work:**
- Check that `subdomains/b2b/` directory exists
- Ensure GitHub Action completed successfully
- Clear browser cache

**If assets don't load:**
- Check that paths are relative in HTML files
- Verify GitHub Pages is serving from correct branch
- Check repository settings > Pages configuration

## Support

- **Development Issues**: Check browser console and server logs
- **Deployment Issues**: Check GitHub Actions logs
- **DNS Issues**: Contact your domain provider

---

**Ready to deploy!** Your current setup will work perfectly with GitHub Pages while maintaining the new subdomain architecture for future scaling.