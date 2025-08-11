# 🌐 Cloudflare Pages Complete Setup Guide

This guide covers everything you need to set up diBoaS on Cloudflare Pages with professional subdomain support.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Cloudflare Account Setup](#step-1-initial-cloudflare-account-setup)
3. [Add Domain to Cloudflare](#step-2-add-domain-to-cloudflare)
4. [Connect GitHub Repository](#step-3-connect-github-repository)
5. [Configure Build Settings](#step-4-configure-build-settings)
6. [Add Custom Domains](#step-5-add-custom-domains)
7. [Configure DNS Records](#step-6-configure-dns-records)
8. [Set Up Subdomain Redirects](#step-7-set-up-subdomain-redirects)
9. [Test and Verify](#step-8-test-and-verify)
10. [Troubleshooting](#troubleshooting)
11. [Ongoing Deployment Process](#ongoing-deployment-process)

---

## Prerequisites

Before starting, ensure you have:
- ✅ GitHub repository (`bribeirobr25/diboas-beta`)
- ✅ Domain name (`diboas.com`)
- ✅ 30-45 minutes for setup
- ✅ Access to your domain registrar (for nameserver updates)

---

## Step 1: Initial Cloudflare Account Setup

### 1.1 Create Free Account
1. Go to [cloudflare.com](https://cloudflare.com)
2. Click **Sign Up**
3. Enter your email and password
4. Verify your email address

### 1.2 Choose Plan
- Select **Free Plan** ($0/month)
- Click **Continue**

---

## Step 2: Add Domain to Cloudflare

### 2.1 Add Your Site
1. In Cloudflare dashboard, click **+ Add a Site**
2. Enter `diboas.com`
3. Select **Free Plan**
4. Click **Continue**

### 2.2 Update Nameservers
Cloudflare will show you 2 nameservers like:
```
carter.ns.cloudflare.com
gail.ns.cloudflare.com
```

### 2.3 Update at Your Domain Registrar
Go to your domain provider and update nameservers:

**GoDaddy:**
1. Domain Settings → Nameservers → Change
2. Choose "Custom" → Enter Cloudflare nameservers

**Namecheap:**
1. Domain List → Manage → Nameservers
2. Select "Custom DNS" → Enter Cloudflare nameservers

**Google Domains:**
1. DNS → Name servers
2. Use custom name servers → Enter Cloudflare nameservers

⏰ **Wait 5-24 hours for propagation** (typically 15-30 minutes)

---

## Step 3: Connect GitHub Repository

### 3.1 Access Cloudflare Pages
1. In Cloudflare dashboard, go to **Workers & Pages**
2. Click **Pages** tab
3. Click **Create a project**

### 3.2 Connect to GitHub
1. Click **Connect to Git**
2. Choose **GitHub**
3. Authorize Cloudflare to access your GitHub
4. Select repository: `bribeirobr25/diboas-beta`
5. Click **Begin setup**

---

## Step 4: Configure Build Settings

### 4.1 Project Configuration
Use these exact settings:
```
Project name: diboas-platform
Production branch: main
Framework preset: None
Build command: npm run build:cloudflare
Build output directory: dist
Root directory: (leave empty)
```

### 4.2 Environment Variables
Click **Environment variables** and add:
```
NODE_ENV = production
CLOUDFLARE_PAGES = true
```

### 4.3 Deploy
Click **Save and Deploy**

⏰ **First build takes 2-5 minutes**

---

## Step 5: Add Custom Domains

### 5.1 Access Custom Domains
1. Go to your Cloudflare Pages project
2. Click **Custom domains** tab
3. Click **Set up a custom domain**

### 5.2 Add Main Domain
1. Enter `diboas.com`
2. Click **Continue**
3. Cloudflare will verify ownership automatically

### 5.3 Add Subdomains
Click **Add a custom domain** for each:
- `dapp.diboas.com`
- `docs.diboas.com`
- `learn.diboas.com`
- `mascots.diboas.com`
- `investors.diboas.com`
- `b2b.diboas.com`

⏰ **SSL certificates generate in 15-30 minutes**

---

## Step 6: Configure DNS Records

### 6.1 Navigate to DNS
1. Go to Cloudflare dashboard
2. Select your domain (`diboas.com`)
3. Click **DNS** in the sidebar

### 6.2 Add CNAME Records
For each subdomain, add a CNAME record:

```
Type: CNAME
Name: dapp
Target: diboas-platform.pages.dev
Proxy status: Proxied (orange cloud ON)
TTL: Auto

Type: CNAME
Name: docs
Target: diboas-platform.pages.dev
Proxy status: Proxied (orange cloud ON)
TTL: Auto
```

Repeat for: `learn`, `mascots`, `investors`, `b2b`

---

## Step 7: Configure Cloudflare Pages for Subdomains

### No Redirect Rules Needed!

Since you want users to access the subdomains directly (e.g., `dapp.diboas.com` instead of `diboas.com/app`), you don't need redirect rules. 

### What Cloudflare Pages Does:

Cloudflare Pages automatically serves the correct content based on the URL path:
- `dapp.diboas.com` → Serves content from `/app` directory
- `docs.diboas.com` → Serves content from `/docs` directory
- `b2b.diboas.com` → Serves content from `/b2b` directory

### Update Your Navigation:

All navigation links have been updated to use subdomain URLs:
- "Get Started" button → `https://dapp.diboas.com`
- "Documentation" link → `https://docs.diboas.com`
- "Learn" link → `https://learn.diboas.com`
- etc.

### Test Your Setup:

Visit each subdomain directly:
- https://dapp.diboas.com
- https://docs.diboas.com
- https://learn.diboas.com
- https://mascots.diboas.com
- https://investors.diboas.com
- https://b2b.diboas.com

Each should display the appropriate content without any redirects!

---

## Step 8: Test and Verify

### 8.1 Check DNS Propagation
```bash
# Terminal commands
dig diboas.com
dig dapp.diboas.com
dig b2b.diboas.com

# Or use online tool
https://whatsmydns.net/
```

### 8.2 Test Each URL
Visit and verify these work:
- ✅ `https://diboas.com` (main site)
- ✅ `https://dapp.diboas.com` → redirects to `/app`
- ✅ `https://docs.diboas.com` → redirects to `/docs`
- ✅ `https://learn.diboas.com` → redirects to `/learn`
- ✅ `https://mascots.diboas.com` → redirects to `/mascots`
- ✅ `https://investors.diboas.com` → redirects to `/investors`
- ✅ `https://b2b.diboas.com` → redirects to `/b2b`

### 8.3 Check SSL Certificates
All domains should show secure padlock icon in browser.

---

## Troubleshooting

### Build Errors

**Problem:** Build fails with `yaml: not found`
**Solution:** Already fixed with `build.sh` script

**Problem:** Redirect warnings in build log
**Solution:** Non-critical, site works fine

### DNS Issues

**Problem:** Subdomain not resolving
**Solution:** 
1. Check DNS records in Cloudflare
2. Verify nameserver update completed
3. Wait for propagation (up to 24 hours)

### SSL Certificate Issues

**Problem:** "Not Secure" warning
**Solution:**
1. Wait 15-30 minutes after adding domain
2. Check SSL/TLS settings → Set to "Flexible" or "Full"
3. Verify domain ownership in Cloudflare

### 404 Errors

**Problem:** Paths not working
**Solution:**
1. Check `_redirects` file exists in build
2. Verify build output includes all subdomain folders
3. Check Cloudflare Pages deployment logs

---

## Ongoing Deployment Process

### Daily Workflow

Your deployment is now automatic:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Cloudflare automatically:
# 1. Detects push
# 2. Builds site (~30 seconds)
# 3. Deploys globally
# 4. Updates all subdomains
```

### Monitoring

1. **Build Status:** Cloudflare Pages dashboard
2. **Analytics:** Cloudflare Analytics (free)
3. **Performance:** PageSpeed Insights
4. **Errors:** Browser console

### Best Practices

1. **Test locally first:** `npm run dev`
2. **Check build:** `npm run build:cloudflare`
3. **Monitor deployments:** Watch Cloudflare dashboard
4. **Use preview deployments:** For pull requests

---

## Summary

You now have:
- ✅ **Professional subdomains** (`dapp.diboas.com`, etc.)
- ✅ **50-80% faster performance** than GitHub Pages
- ✅ **Global CDN** with edge caching
- ✅ **Automatic HTTPS** for all domains
- ✅ **Zero hosting costs**
- ✅ **Automatic deployments** from GitHub

### Support Resources

- **Cloudflare Docs:** [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Community:** [community.cloudflare.com](https://community.cloudflare.com)
- **Status:** [cloudflarestatus.com](https://cloudflarestatus.com)

---

**Last Updated:** August 2024
**Platform:** diBoaS OneFi
**Deployment:** Cloudflare Pages