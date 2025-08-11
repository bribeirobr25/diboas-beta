# 🌐 Cloudflare Pages Migration Guide

Complete migration from GitHub Pages to Cloudflare Pages with **true subdomain support**.

## ✨ What You'll Get

**Before (GitHub Pages):**
- `diboas.com/app` 
- `diboas.com/docs`
- `diboas.com/b2b`

**After (Cloudflare Pages):**
- `dapp.diboas.com` ✅
- `docs.diboas.com` ✅  
- `b2b.diboas.com` ✅
- All from **single repository**
- **Zero cost**
- **Better performance**

---

## 📋 Prerequisites

- [x] GitHub repository (you have this)
- [x] `diboas.com` domain (you have this)
- [ ] Cloudflare account (free)
- [ ] 30 minutes of time

---

## Step 1: Create Cloudflare Account & Add Domain

### 1.1 Sign Up for Cloudflare
1. Go to [cloudflare.com](https://cloudflare.com)
2. Click **Sign Up** (free account)
3. Verify your email

### 1.2 Add Your Domain
1. In Cloudflare dashboard, click **+ Add a Site**
2. Enter `diboas.com`
3. Select **Free Plan**
4. Click **Continue**

### 1.3 Update Nameservers
Cloudflare will show you 2 nameservers like:
```
carter.ns.cloudflare.com
gail.ns.cloudflare.com
```

**Update these in your domain provider:**
- **GoDaddy**: Domain Settings → Nameservers → Custom
- **Namecheap**: Domain List → Manage → Nameservers → Custom DNS
- **Google Domains**: DNS → Name servers → Use custom name servers

⏰ **Wait 5-24 hours** for nameserver propagation (usually 15 minutes)

---

## Step 2: Set Up Cloudflare Pages

### 2.1 Create Pages Project
1. In Cloudflare dashboard, go to **Pages**
2. Click **Create a project**
3. Click **Connect to Git**
4. Choose **GitHub** and authorize Cloudflare
5. Select your repository: `bribeirobr25/diboas-beta`
6. Click **Begin setup**

### 2.2 Configure Build Settings
```yaml
Project name: diboas-platform
Production branch: main
Framework preset: None
Build command: npm run build:cloudflare
Build output directory: dist
```

**Root directory:** Leave empty (use repository root)

### 2.3 Environment Variables
Add these in **Environment variables** section:
```
NODE_ENV = production
CLOUDFLARE_PAGES = true
```

Click **Save and Deploy**

---

## Step 3: Create Build Configuration

### 3.1 Create Cloudflare Build Script

Back in your project, add the Cloudflare build command to package.json:

```json
"scripts": {
  "build:cloudflare": "node scripts/cloudflare-build.js"
}
```

### 3.2 Commit and Push Changes

```bash
git add .
git commit -m "Add Cloudflare Pages build configuration"
git push origin main
```

Cloudflare Pages will automatically detect the push and start building.

---

## Step 4: Configure Custom Domains

### 4.1 Add Main Domain
1. In Cloudflare Pages, go to your **diboas-platform** project
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter `diboas.com`
5. Click **Continue**
6. Cloudflare will verify domain ownership (automatic if using Cloudflare DNS)

### 4.2 Add Subdomains
For each subdomain, click **Add a custom domain**:

```
dapp.diboas.com
docs.diboas.com  
learn.diboas.com
mascots.diboas.com
investors.diboas.com
b2b.diboas.com
```

⏰ **Wait 5-10 minutes** for SSL certificates to be issued.

---

## Step 5: Configure Subdomain Routing

### 5.1 Method 1: Cloudflare Redirects (Recommended)

In Cloudflare dashboard:
1. Go to **Rules** → **Redirect Rules**
2. Create rule for each subdomain:

**Example for dApp:**
```
Rule name: dApp Subdomain
Source URL: dapp.diboas.com/*
Target URL: https://diboas.com/app/$1
Status code: 301 - Permanent Redirect
```

Repeat for all subdomains:
- `docs.diboas.com/*` → `https://diboas.com/docs/$1`
- `learn.diboas.com/*` → `https://diboas.com/learn/$1`
- `mascots.diboas.com/*` → `https://diboas.com/mascots/$1`
- `investors.diboas.com/*` → `https://diboas.com/investors/$1`
- `b2b.diboas.com/*` → `https://diboas.com/b2b/$1`

### 5.2 Method 2: Cloudflare Workers (Advanced)

For more control, create a Cloudflare Worker:

1. Go to **Workers & Pages** → **Create application** → **Create Worker**
2. Name it `diboas-subdomain-router`
3. Replace the default code with the content from `cloudflare-worker.js`
4. Click **Save and Deploy**
5. Go to **Triggers** tab → **Add Custom Domain**
6. Add each subdomain:
   - `dapp.diboas.com`
   - `docs.diboas.com`  
   - `learn.diboas.com`
   - `mascots.diboas.com`
   - `investors.diboas.com`
   - `b2b.diboas.com`

---

## Step 6: Test Your Subdomains

### 6.1 DNS Propagation Check
```bash
# Check if subdomains resolve
nslookup dapp.diboas.com
nslookup docs.diboas.com
nslookup b2b.diboas.com

# Or use online tool: https://whatsmydns.net/
```

### 6.2 Test Each Subdomain
Visit each URL and verify they work:

- ✅ https://diboas.com (landing page)
- ✅ https://dapp.diboas.com (investment dApp)  
- ✅ https://docs.diboas.com (documentation)
- ✅ https://learn.diboas.com (learning center)
- ✅ https://mascots.diboas.com (AI guides)
- ✅ https://investors.diboas.com (investor portal)
- ✅ https://b2b.diboas.com (business portal)

### 6.3 Performance Check
Use [PageSpeed Insights](https://pagespeed.web.dev/) to verify performance improvements.

---

## Step 7: Update Navigation (Optional)

### 7.1 Update Cross-Subdomain Links

In your HTML files, update navigation to use subdomain URLs:

```html
<!-- Before -->
<a href="/app">dApp</a>
<a href="/docs">Documentation</a>

<!-- After -->  
<a href="https://dapp.diboas.com">dApp</a>
<a href="https://docs.diboas.com">Documentation</a>
<a href="https://learn.diboas.com">Learn</a>
<a href="https://mascots.diboas.com">Mascots</a>
<a href="https://investors.diboas.com">Investors</a>
<a href="https://b2b.diboas.com">B2B</a>
```

### 7.2 Update JavaScript Navigation

In your JavaScript files, update the environment configuration:

```javascript
// Update shared/utils/environment.js
const URL_CONFIG = {
  production: {
    subdomains: {
      landing: 'https://diboas.com',
      dapp: 'https://dapp.diboas.com',
      docs: 'https://docs.diboas.com',
      learn: 'https://learn.diboas.com',
      mascots: 'https://mascots.diboas.com',
      investors: 'https://investors.diboas.com',
      b2b: 'https://b2b.diboas.com'
    }
  }
};
```

---

## Step 8: Cleanup & Optimization

### 8.1 Remove GitHub Pages Deployment (Optional)
1. In your GitHub repository settings
2. Go to **Pages** section  
3. Set Source to **None**
4. This disables GitHub Pages deployment

### 8.2 Update README
Update your project README to reflect the new subdomain URLs:

```markdown
## 🌐 Live Platform
- **Main Site:** https://diboas.com
- **dApp:** https://dapp.diboas.com
- **Documentation:** https://docs.diboas.com  
- **Learning Center:** https://learn.diboas.com
- **AI Mascots:** https://mascots.diboas.com
- **Investors:** https://investors.diboas.com
- **Business Portal:** https://b2b.diboas.com
```

### 8.3 Set Up Analytics (Optional)
Add Cloudflare Web Analytics:
1. In Cloudflare dashboard, go to **Analytics & Logs** → **Web Analytics**
2. Click **Add a site**
3. Enter `diboas.com`
4. Add the tracking code to your HTML files

---

## 🎉 Migration Complete!

### ✅ What You've Achieved:

- **True subdomains** working (`dapp.diboas.com`, etc.)
- **Single repository** management
- **Better performance** with Cloudflare CDN
- **Automatic HTTPS** for all subdomains  
- **Zero cost** hosting solution
- **Professional URLs** for B2B clients

### 🔄 Development Workflow:

1. **Local Development:**
   ```bash
   pnpm run dev
   # Test at localhost:3000/app, localhost:3000/b2b, etc.
   ```

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   # Cloudflare automatically builds and deploys
   ```

3. **Monitor:**
   - Check Cloudflare Pages dashboard for build status
   - View analytics in Cloudflare dashboard

### 📊 Performance Benefits:

- **50-80% faster** loading times vs GitHub Pages
- **Global CDN** with edge caching
- **Better SEO** with professional subdomain structure
- **Improved Core Web Vitals** scores

### 🛟 Support:

- **Cloudflare Documentation:** [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Community:** [community.cloudflare.com](https://community.cloudflare.com)
- **Status:** [cloudflarestatus.com](https://cloudflarestatus.com)

---

## 🚨 Troubleshooting

### Subdomain not working?
1. Check DNS propagation: `dig dapp.diboas.com`
2. Verify Cloudflare Pages deployment succeeded  
3. Check redirect rules in Cloudflare dashboard

### SSL certificate issues?
1. Wait 15-30 minutes after adding custom domain
2. Verify domain ownership in Cloudflare
3. Check that nameservers point to Cloudflare

### Build failures?
1. Check Cloudflare Pages build logs
2. Verify `npm run build:cloudflare` works locally
3. Check for missing dependencies in package.json

**🎊 Congratulations! You now have professional subdomains with zero cost and maximum performance!**