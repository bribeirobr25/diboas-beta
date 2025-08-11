# Manual Subdomain Setup Guide

## Repository Setup Checklist

For each subdomain, create a new GitHub repository and follow these steps:

### 1. diboas-landing (diboas.com)
```bash
# Create repo: https://github.com/bribeirobr25/diboas-landing
# Copy files from: subdomains/landing/
# CNAME content: diboas.com
```

### 2. diboas-dapp (dapp.diboas.com)  
```bash
# Create repo: https://github.com/bribeirobr25/diboas-dapp
# Copy files from: subdomains/dapp/
# CNAME content: dapp.diboas.com
```

### 3. diboas-docs (docs.diboas.com)
```bash
# Create repo: https://github.com/bribeirobr25/diboas-docs
# Copy files from: subdomains/docs/
# CNAME content: docs.diboas.com
```

### 4. diboas-learn (learn.diboas.com)
```bash
# Create repo: https://github.com/bribeirobr25/diboas-learn  
# Copy files from: subdomains/learn/
# CNAME content: learn.diboas.com
```

### 5. diboas-mascots (mascots.diboas.com)
```bash
# Create repo: https://github.com/bribeirobr25/diboas-mascots
# Copy files from: subdomains/mascots/
# CNAME content: mascots.diboas.com
```

### 6. diboas-investors (investors.diboas.com)
```bash
# Create repo: https://github.com/bribeirobr25/diboas-investors
# Copy files from: subdomains/investors/  
# CNAME content: investors.diboas.com
```

### 7. diboas-b2b (b2b.diboas.com)
```bash
# Create repo: https://github.com/bribeirobr25/diboas-b2b
# Copy files from: subdomains/b2b/
# CNAME content: b2b.diboas.com
```

## For Each Repository:

### File Structure
```
repository-root/
├── index.html              # Main page
├── assets/                 # Copy from shared/assets/
│   ├── css/
│   ├── js/
│   └── images/
├── CNAME                   # Contains subdomain (e.g., dapp.diboas.com)
└── .github/workflows/      # GitHub Actions (optional)
    └── pages.yml
```

### GitHub Pages Settings
1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Source: **Deploy from a branch**
4. Branch: **main** / **root**
5. Custom domain: **Enter subdomain** (e.g., `dapp.diboas.com`)
6. **Save**

### Update Navigation Links
In each subdomain's HTML files, update navigation to use full URLs:

```html
<!-- Instead of relative paths -->
<a href="/app">dApp</a>
<a href="/docs">Docs</a>

<!-- Use full subdomain URLs -->
<a href="https://dapp.diboas.com">dApp</a>  
<a href="https://docs.diboas.com">Docs</a>
<a href="https://learn.diboas.com">Learn</a>
<a href="https://mascots.diboas.com">Mascots</a>
<a href="https://investors.diboas.com">Investors</a>
<a href="https://b2b.diboas.com">B2B</a>
```

## Quick Copy Commands

From your current project directory:

```bash
# Create directories for each repo
mkdir -p temp-repos/{diboas-landing,diboas-dapp,diboas-docs,diboas-learn,diboas-mascots,diboas-investors,diboas-b2b}

# Copy landing page
cp index.html temp-repos/diboas-landing/
cp -r assets temp-repos/diboas-landing/
echo "diboas.com" > temp-repos/diboas-landing/CNAME

# Copy dapp
cp -r subdomains/dapp/* temp-repos/diboas-dapp/
cp -r shared/assets temp-repos/diboas-dapp/
echo "dapp.diboas.com" > temp-repos/diboas-dapp/CNAME

# Copy docs  
cp -r subdomains/docs/* temp-repos/diboas-docs/
cp -r shared/assets temp-repos/diboas-docs/
echo "docs.diboas.com" > temp-repos/diboas-docs/CNAME

# Copy learn
cp -r subdomains/learn/* temp-repos/diboas-learn/
cp -r shared/assets temp-repos/diboas-learn/  
echo "learn.diboas.com" > temp-repos/diboas-learn/CNAME

# Copy mascots
cp -r subdomains/mascots/* temp-repos/diboas-mascots/
cp -r shared/assets temp-repos/diboas-mascots/
echo "mascots.diboas.com" > temp-repos/diboas-mascots/CNAME

# Copy investors
cp -r subdomains/investors/* temp-repos/diboas-investors/
cp -r shared/assets temp-repos/diboas-investors/
echo "investors.diboas.com" > temp-repos/diboas-investors/CNAME

# Copy B2B
cp -r subdomains/b2b/* temp-repos/diboas-b2b/
cp -r shared/assets temp-repos/diboas-b2b/
echo "b2b.diboas.com" > temp-repos/diboas-b2b/CNAME
```

Then upload each directory to its respective GitHub repository.

## Timeline

- **Repository creation**: 5 minutes each  
- **File upload**: 2 minutes each
- **GitHub Pages activation**: 10-15 minutes each
- **DNS configuration**: 30 minutes
- **Total**: 2-3 hours (mostly waiting for DNS/GitHub)