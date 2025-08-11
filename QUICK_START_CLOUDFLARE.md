# 🚀 Quick Start: Cloudflare Pages Migration

## TL;DR - Get True Subdomains in 30 Minutes

### 1. Sign Up & Add Domain (5 min)
1. Go to [cloudflare.com](https://cloudflare.com) → Sign up (free)
2. Add domain: `diboas.com`
3. Update nameservers at your domain provider

### 2. Connect GitHub (5 min)
1. Cloudflare dashboard → **Pages** → **Create project**
2. Connect GitHub → Select `diboas-beta` repository
3. Build settings:
   ```
   Build command: npm run build:cloudflare
   Output directory: dist
   ```

### 3. Add Subdomains (10 min)
In Cloudflare Pages project → **Custom domains**:
```
diboas.com
dapp.diboas.com
docs.diboas.com
learn.diboas.com
mascots.diboas.com
investors.diboas.com
b2b.diboas.com
```

### 4. Set Up Redirects (10 min)
Cloudflare dashboard → **Rules** → **Redirect Rules**:
```
dapp.diboas.com/* → https://diboas.com/app/$1
docs.diboas.com/* → https://diboas.com/docs/$1
learn.diboas.com/* → https://diboas.com/learn/$1
mascots.diboas.com/* → https://diboas.com/mascots/$1
investors.diboas.com/* → https://diboas.com/investors/$1
b2b.diboas.com/* → https://diboas.com/b2b/$1
```

## ✅ Result
- `https://dapp.diboas.com` ✅
- `https://docs.diboas.com` ✅
- `https://b2b.diboas.com` ✅
- All other subdomains ✅
- **Zero cost** ✅
- **Better performance** ✅

## 🔄 Deploy Changes
```bash
git add .
git commit -m "Add Cloudflare Pages support"
git push origin main
```

**Done!** Your subdomains will be live in 10-15 minutes.

---

See `CLOUDFLARE_MIGRATION.md` for detailed instructions.