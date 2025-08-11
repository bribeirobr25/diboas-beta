# 🌐 Cloudflare Pages Multi-Project Setup for True Subdomain Separation

This complete guide walks you through setting up multiple Cloudflare Pages projects from a single GitHub repository to achieve true subdomain separation at zero cost - from account creation to final deployment.

## 📋 Overview

We'll create 7 separate Cloudflare Pages projects:

1. **diboas-landing** → `diboas.com` (root domain)
2. **diboas-dapp** → `dapp.diboas.com` 
3. **diboas-docs** → `docs.diboas.com`
4. **diboas-learn** → `learn.diboas.com`
5. **diboas-mascots** → `mascots.diboas.com`
6. **diboas-investors** → `investors.diboas.com`
7. **diboas-b2b** → `b2b.diboas.com`

Each project has its own build script and deploys independently.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ GitHub account with `bribeirobr25/diboas-beta` repository
- ✅ Domain name (`diboas.com`) 
- ✅ 60-90 minutes for complete setup
- ✅ Access to your domain registrar for nameserver updates

---

## 🚀 Part 1: Initial Cloudflare Setup

### Step 1: Create Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com)
2. Click **Sign Up** 
3. Enter your email and create a strong password
4. Verify your email address
5. Complete account setup

### Step 2: Add Your Domain to Cloudflare

1. In Cloudflare dashboard, click **+ Add a Site**
2. Enter your domain: `diboas.com`
3. Select **Free Plan** ($0/month)
4. Click **Continue**
5. Cloudflare will scan your DNS records
6. Review the found DNS records and click **Continue**

### Step 3: Update Nameservers

Cloudflare will show you 2 unique nameservers like:
```
carter.ns.cloudflare.com
gail.ns.cloudflare.com
```

**Update at Your Domain Registrar:**

**GoDaddy:**
1. Go to your GoDaddy account → Domain Settings
2. Find "Nameservers" → Click "Change"
3. Select "Custom" nameservers
4. Enter the 2 Cloudflare nameservers
5. Save changes

**Namecheap:**
1. Go to Domain List → Click "Manage" on your domain
2. Find "Nameservers" section
3. Select "Custom DNS" 
4. Enter the 2 Cloudflare nameservers
5. Save changes

**Google Domains:**
1. Go to DNS settings → Name servers
2. Select "Use custom name servers"
3. Enter the 2 Cloudflare nameservers
4. Save changes

⏰ **Wait 15 minutes to 24 hours for nameserver propagation** (usually 15-30 minutes)

### Step 4: Verify Domain Control

1. Return to your Cloudflare dashboard
2. Click **Done, check nameservers**
3. Wait for Cloudflare to detect the nameserver change
4. You should see "✅ Great! Cloudflare is now protecting your site"

⚠️ **IMPORTANT:** Do NOT configure DNS records yet. We'll do that after creating the Pages projects.

---

### Step 5: Access Cloudflare Pages

1. In your Cloudflare dashboard, click **Workers & Pages** in the left sidebar
2. Click on the **Pages** tab
3. Click **Create a project**

### Step 6: Connect GitHub Repository

1. Click **Connect to Git**
2. Choose **GitHub** 
3. Click **Authorize Cloudflare** (if first time)
4. Select your GitHub account if prompted
5. In the repository list, find and select: `bribeirobr25/diboas-beta`
6. Click **Begin setup**

---

## 🚀 Part 3: Create All Projects

### Step 7: Create Landing Project (diboas.com)

**Project Configuration:**
```
Project name: diboas-landing
Production branch: main
Build command: bash scripts/build-landing.sh
Build output directory: landing/dist
Root directory: (leave empty)
```

**Environment Variables:**
Click **Add variable** and add:
```
Variable name: NODE_ENV
Value: production
```

(No SUBDOMAIN variable needed since this serves the root domain)

Click **Save and Deploy**

⏰ **Wait 2-5 minutes for first build**

### Step 8: Add Custom Domain to Landing Project

1. After build completes, click on your **diboas-landing** project
2. Go to **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `diboas.com` (your root domain)
5. Click **Continue**
6. Cloudflare will automatically verify ownership
7. Wait for SSL certificate (15-30 minutes)

### Step 9: Create dApp Project (dapp.diboas.com)

1. Go back to **Workers & Pages** → **Pages** → **Create a project**
2. **Connect to Git** → Select `bribeirobr25/diboas-beta` → **Begin setup**

**Project Configuration:**
```
Project name: diboas-dapp
Production branch: main
Build command: bash scripts/build-dapp.sh
Build output directory: app/dist
Root directory: (leave empty)
```

**Environment Variables:**
```
NODE_ENV = production
SUBDOMAIN = dapp
```

3. **Save and Deploy**
4. After build: **Custom domains** → Add `dapp.diboas.com`

### Step 10: Create Docs Project (docs.diboas.com)

1. **Create a project** → **Connect to Git** → `bribeirobr25/diboas-beta`

**Project Configuration:**
```
Project name: diboas-docs
Production branch: main
Build command: bash scripts/build-docs.sh
Build output directory: docs/dist
```

**Environment Variables:**
```
NODE_ENV = production
SUBDOMAIN = docs
```

2. **Save and Deploy**
3. After build: **Custom domains** → Add `docs.diboas.com`

### Step 11: Create Learn Project (learn.diboas.com)

1. **Create a project** → **Connect to Git** → `bribeirobr25/diboas-beta`

**Project Configuration:**
```
Project name: diboas-learn
Production branch: main
Build command: bash scripts/build-learn.sh
Build output directory: learn/dist
```

**Environment Variables:**
```
NODE_ENV = production
SUBDOMAIN = learn
```

2. **Save and Deploy**
3. After build: **Custom domains** → Add `learn.diboas.com`

### Step 12: Create Mascots Project (mascots.diboas.com)

1. **Create a project** → **Connect to Git** → `bribeirobr25/diboas-beta`

**Project Configuration:**
```
Project name: diboas-mascots
Production branch: main
Build command: bash scripts/build-mascots.sh
Build output directory: mascots/dist
```

**Environment Variables:**
```
NODE_ENV = production
SUBDOMAIN = mascots
```

2. **Save and Deploy**
3. After build: **Custom domains** → Add `mascots.diboas.com`

### Step 13: Create Investors Project (investors.diboas.com)

1. **Create a project** → **Connect to Git** → `bribeirobr25/diboas-beta`

**Project Configuration:**
```
Project name: diboas-investors
Production branch: main
Build command: bash scripts/build-investors.sh
Build output directory: investors/dist
```

**Environment Variables:**
```
NODE_ENV = production
SUBDOMAIN = investors
```

2. **Save and Deploy**
3. After build: **Custom domains** → Add `investors.diboas.com`

### Step 14: Create B2B Project (b2b.diboas.com)

1. **Create a project** → **Connect to Git** → `bribeirobr25/diboas-beta`

**Project Configuration:**
```
Project name: diboas-b2b
Production branch: main
Build command: bash scripts/build-b2b.sh
Build output directory: b2b/dist
```

**Environment Variables:**
```
NODE_ENV = production
SUBDOMAIN = b2b
```

2. **Save and Deploy**
3. After build: **Custom domains** → Add `b2b.diboas.com`

---

### Step 15: Configure DNS Records

⚠️ **CRITICAL:** Only do this step AFTER all 7 projects are successfully created and deployed.

Now that all projects are created, you need to update DNS to point each domain to its respective project:

1. Go to your Cloudflare dashboard → Select `diboas.com` → **DNS**
2. You'll need to update/add these DNS records:

**Root Domain:**
- **Type:** CNAME
- **Name:** @ (or diboas.com)
- **Target:** diboas-landing.pages.dev
- **Proxy:** ✅ Proxied (orange cloud)

**Subdomains - Add each:**
- **dapp:** diboas-dapp.pages.dev
- **docs:** diboas-docs.pages.dev  
- **learn:** diboas-learn.pages.dev
- **mascots:** diboas-mascots.pages.dev
- **investors:** diboas-investors.pages.dev
- **b2b:** diboas-b2b.pages.dev

**For each subdomain:**
1. Click **Add record**
2. **Type:** CNAME
3. **Name:** [subdomain name] (e.g., "dapp")
4. **Target:** [project-name].pages.dev (e.g., "diboas-dapp.pages.dev")
5. **Proxy:** ✅ Proxied (orange cloud ON)
6. Click **Save**

⏰ **DNS changes take 5-15 minutes to propagate**

---

### Step 16: Test All URLs

After DNS propagation, test each URL:

**Primary URLs to test:**
- ✅ https://diboas.com (landing page)
- ✅ https://dapp.diboas.com (main application)
- ✅ https://docs.diboas.com (documentation)
- ✅ https://learn.diboas.com (learning center)
- ✅ https://mascots.diboas.com (mascots showcase)
- ✅ https://investors.diboas.com (investor relations)
- ✅ https://b2b.diboas.com (business solutions)

**Check for:**
1. **SSL Certificate:** All URLs show 🔒 secure padlock
2. **Correct Content:** Each subdomain shows its specific content
3. **Performance:** Fast loading times
4. **Mobile Responsive:** Test on mobile devices

### Step 17: Verify Build Status

1. Go to **Workers & Pages** → **Pages**
2. Check all 7 projects show **"✅ Success"** status
3. Click on each project to see deployment history
4. Verify latest builds completed successfully

---

## 🎯 Final Results

You now have:
- ✅ **7 independent projects** serving different subdomains
- ✅ **True subdomain separation** with independent deployments
- ✅ **Zero hosting costs** using Cloudflare Pages free tier
- ✅ **Global CDN** with optimal performance
- ✅ **Automatic SSL certificates** for all domains
- ✅ **Automatic deployments** on every GitHub push

## 🔄 Daily Workflow

Your workflow is now streamlined:

```bash
# Make changes to any subdomain
git add .
git commit -m "Update [subdomain] content"  
git push origin main

# Cloudflare automatically:
# 1. Detects the push
# 2. Builds affected projects (~30-60 seconds each)
# 3. Deploys globally
# 4. Updates live sites
```

## 🛠️ Management Tips

**Monitor All Projects:**
- Bookmark: https://dash.cloudflare.com/[account-id]/pages
- Check build status regularly
- Monitor analytics for each subdomain

**Update Content:**
- Each subdomain content lives in its respective directory
- Build scripts automatically handle asset copying
- Changes deploy independently per subdomain

**Troubleshooting:**
- Check build logs in each project's **Deployments** tab
- Verify DNS records in **DNS** section
- Test build scripts locally before pushing

---

## 📚 Build Scripts Reference

Each subdomain has its own build script in `/scripts/`:

- `build-landing.sh` - Landing page (diboas.com)
- `build-dapp.sh` - Main app (dapp.diboas.com)  
- `build-docs.sh` - Documentation (docs.diboas.com)
- `build-learn.sh` - Learning center (learn.diboas.com)
- `build-mascots.sh` - Mascots showcase (mascots.diboas.com)
- `build-investors.sh` - Investor relations (investors.diboas.com)
- `build-b2b.sh` - Business solutions (b2b.diboas.com)

**Test locally:**
```bash
bash scripts/build-[subdomain].sh
ls -la [subdomain]/dist/
```

This complete setup provides true subdomain independence with professional deployment infrastructure at zero cost.