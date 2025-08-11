# 🌐 Cloudflare Pages Multi-Project Setup for True Subdomain Separation

This guide shows how to set up multiple Cloudflare Pages projects from a single GitHub repository to achieve true subdomain separation at zero cost.

## 📋 Overview

Instead of one project serving all subdomains, we'll create 6 separate Cloudflare Pages projects:

1. **diboas-landing** → `diboas.com`
2. **diboas-dapp** → `dapp.diboas.com`
3. **diboas-docs** → `docs.diboas.com`
4. **diboas-learn** → `learn.diboas.com`
5. **diboas-mascots** → `mascots.diboas.com`
6. **diboas-investors** → `investors.diboas.com`
7. **diboas-b2b** → `b2b.diboas.com`

Each project has its own build script and will deploy independently.

## 🔧 Build Scripts

Each subdomain now has its own build script in `/scripts/`:

- `build-landing.sh` - Landing page (diboas.com)
- `build-dapp.sh` - Main app (dapp.diboas.com)
- `build-docs.sh` - Documentation (docs.diboas.com)
- `build-learn.sh` - Learning center (learn.diboas.com)
- `build-mascots.sh` - Mascots showcase (mascots.diboas.com)
- `build-investors.sh` - Investor relations (investors.diboas.com)
- `build-b2b.sh` - Business solutions (b2b.diboas.com)

## 📁 Directory Structure

```
diboas-beta/
├── scripts/
│   ├── build-landing.sh    # Landing page build
│   ├── build-dapp.sh       # dApp build
│   ├── build-docs.sh       # Docs build
│   ├── build-learn.sh      # Learn build
│   ├── build-mascots.sh    # Mascots build
│   ├── build-investors.sh  # Investors build
│   └── build-b2b.sh        # B2B build
├── subdomains/
│   ├── landing/            # Landing page content
│   ├── b2b/                # B2B content
│   └── [other subdomains]/
├── app/                    # dApp content
├── docs/                   # Documentation content
└── [other directories]/
```

## 🚀 Step-by-Step Setup

### Step 1: Create First Project (Landing)

1. Go to **Cloudflare Pages** → **Create a project**
2. Connect to GitHub → Select `bribeirobr25/diboas-beta`
3. **Project Settings:**
   ```
   Project name: diboas-landing
   Production branch: main
   Build command: bash scripts/build-landing.sh
   Build output directory: landing/dist
   ```
4. **Environment Variables:**
   ```
   NODE_ENV = production
   SUBDOMAIN = landing
   ```
5. **Custom Domain:** `diboas.com`

### Step 2: Create dApp Project

1. **Create new project** → Same repository
2. **Project Settings:**
   ```
   Project name: diboas-dapp
   Production branch: main
   Build command: bash scripts/build-dapp.sh
   Build output directory: app/dist
   ```
3. **Environment Variables:**
   ```
   NODE_ENV = production
   SUBDOMAIN = dapp
   ```
4. **Custom Domain:** `dapp.diboas.com`

### Step 3: Create Docs Project

1. **Create new project** → Same repository
2. **Project Settings:**
   ```
   Project name: diboas-docs
   Production branch: main
   Build command: bash scripts/build-docs.sh
   Build output directory: docs/dist
   ```
3. **Environment Variables:**
   ```
   NODE_ENV = production
   SUBDOMAIN = docs
   ```
4. **Custom Domain:** `docs.diboas.com`

### Step 4: Create Learn Project

1. **Create new project** → Same repository
2. **Project Settings:**
   ```
   Project name: diboas-learn
   Production branch: main
   Build command: bash scripts/build-learn.sh
   Build output directory: learn/dist
   ```
3. **Environment Variables:**
   ```
   NODE_ENV = production
   SUBDOMAIN = learn
   ```
4. **Custom Domain:** `learn.diboas.com`

### Step 5: Create Mascots Project

1. **Create new project** → Same repository
2. **Project Settings:**
   ```
   Project name: diboas-mascots
   Production branch: main
   Build command: bash scripts/build-mascots.sh
   Build output directory: mascots/dist
   ```
3. **Environment Variables:**
   ```
   NODE_ENV = production
   SUBDOMAIN = mascots
   ```
4. **Custom Domain:** `mascots.diboas.com`

### Step 6: Create Investors Project

1. **Create new project** → Same repository
2. **Project Settings:**
   ```
   Project name: diboas-investors
   Production branch: main
   Build command: bash scripts/build-investors.sh
   Build output directory: investors/dist
   ```
3. **Environment Variables:**
   ```
   NODE_ENV = production
   SUBDOMAIN = investors
   ```
4. **Custom Domain:** `investors.diboas.com`

### Step 7: Create B2B Project

1. **Create new project** → Same repository
2. **Project Settings:**
   ```
   Project name: diboas-b2b
   Production branch: main
   Build command: bash scripts/build-b2b.sh
   Build output directory: b2b/dist
   ```
3. **Environment Variables:**
   ```
   NODE_ENV = production
   SUBDOMAIN = b2b
   ```
4. **Custom Domain:** `b2b.diboas.com`

## 🌍 DNS Configuration

Since you already have DNS configured, you just need to verify the CNAME records point to the correct Pages projects:

```
Type: CNAME
Name: dapp
Target: diboas-dapp.pages.dev
Proxy: ON

Type: CNAME
Name: docs
Target: diboas-docs.pages.dev
Proxy: ON

Type: CNAME
Name: learn
Target: diboas-learn.pages.dev
Proxy: ON

Type: CNAME
Name: mascots
Target: diboas-mascots.pages.dev
Proxy: ON

Type: CNAME
Name: investors
Target: diboas-investors.pages.dev
Proxy: ON

Type: CNAME
Name: b2b
Target: diboas-b2b.pages.dev
Proxy: ON
```

## ✅ Benefits of This Setup

1. **True Separation:** Each subdomain runs independently
2. **Independent Deployments:** Update one without affecting others
3. **Better Performance:** Each project optimized for its content
4. **Easier Management:** Clear separation of concerns
5. **Zero Cost:** All projects use Cloudflare Pages free tier
6. **Scalability:** Easy to add new subdomains

## 🔄 Deployment Workflow

When you push to `main`, all 7 projects will build in parallel:

```bash
git add .
git commit -m "Update content"
git push origin main

# Cloudflare automatically builds:
# 1. diboas-landing → diboas.com
# 2. diboas-dapp → dapp.diboas.com
# 3. diboas-docs → docs.diboas.com
# 4. diboas-learn → learn.diboas.com
# 5. diboas-mascots → mascots.diboas.com
# 6. diboas-investors → investors.diboas.com
# 7. diboas-b2b → b2b.diboas.com
```

## 🧪 Testing Build Scripts Locally

```bash
# Test individual build scripts
./scripts/build-landing.sh
./scripts/build-dapp.sh
./scripts/build-docs.sh
./scripts/build-learn.sh
./scripts/build-mascots.sh
./scripts/build-investors.sh
./scripts/build-b2b.sh

# Check output directories
ls -la landing/dist/
ls -la app/dist/
ls -la docs/dist/
ls -la learn/dist/
ls -la mascots/dist/
ls -la investors/dist/
ls -la b2b/dist/
```

## 🎯 Next Steps

1. Create each Cloudflare Pages project following the steps above
2. Verify all builds succeed
3. Test each subdomain URL
4. Monitor deployment analytics for each project
5. Set up any additional custom domains or redirects as needed

This setup gives you true subdomain independence while maintaining a single source repository.