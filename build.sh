#!/bin/bash

# Cloudflare Pages Build Script for diBoaS
set -e

echo "🌐 Building diBoaS for Cloudflare Pages..."

# Create dist directory
mkdir -p dist

# Copy landing page to root
echo "🏠 Setting up landing page..."
if [ -f "subdomains/landing/index.html" ]; then
    cp -r subdomains/landing/* dist/
else
    cp index.html dist/
fi

# Copy existing directories to their paths
echo "📁 Setting up subdomain paths..."

# Create subdomain directories
mkdir -p dist/{app,docs,learn,mascots,investors,b2b}

# Copy existing subdomain content
if [ -d "app" ]; then
    cp -r app/* dist/app/
elif [ -d "subdomains/dapp" ]; then
    cp -r subdomains/dapp/* dist/app/
fi

if [ -d "docs" ]; then
    cp -r docs/* dist/docs/
elif [ -d "subdomains/docs" ]; then
    cp -r subdomains/docs/* dist/docs/
fi

if [ -d "learn" ]; then
    cp -r learn/* dist/learn/
elif [ -d "subdomains/learn" ]; then
    cp -r subdomains/learn/* dist/learn/
fi

if [ -d "mascots" ]; then
    cp -r mascots/* dist/mascots/
elif [ -d "subdomains/mascots" ]; then
    cp -r subdomains/mascots/* dist/mascots/
fi

if [ -d "investors" ]; then
    cp -r investors/* dist/investors/
elif [ -d "subdomains/investors" ]; then
    cp -r subdomains/investors/* dist/investors/
fi

# Copy B2B subdomain
if [ -d "subdomains/b2b" ]; then
    cp -r subdomains/b2b/* dist/b2b/
fi

# Copy assets
echo "🎨 Copying assets..."
if [ -d "shared/assets" ]; then
    cp -r shared/assets dist/
elif [ -d "assets" ]; then
    cp -r assets dist/
fi

# Copy assets to each subdomain
for dir in app docs learn mascots investors b2b; do
    if [ -d "dist/$dir" ] && [ -d "dist/assets" ]; then
        cp -r dist/assets "dist/$dir/"
    fi
done

# Copy PWA files if they exist
if [ -f "manifest.json" ]; then
    cp manifest.json dist/
fi

if [ -f "sw.js" ]; then
    cp sw.js dist/
fi

if [ -f "shared/manifest.json" ]; then
    cp shared/manifest.json dist/
fi

if [ -f "shared/sw.js" ]; then
    cp shared/sw.js dist/
fi

# Create redirects for Cloudflare Pages
echo "🔀 Creating redirect rules..."
cat > dist/_redirects << 'EOF'
# Cloudflare Pages Redirects for diBoaS subdomains
# Note: Subdomain redirects will be configured in Cloudflare dashboard

# SPA fallbacks - avoid infinite loops
/app/assets/* /assets/:splat 200
/docs/assets/* /assets/:splat 200  
/learn/assets/* /assets/:splat 200
/mascots/assets/* /assets/:splat 200
/investors/assets/* /assets/:splat 200
/b2b/assets/* /assets/:splat 200

# Handle missing files in subdomains
/app/* /app/index.html 200
/docs/* /docs/index.html 200  
/learn/* /learn/index.html 200
/mascots/* /mascots/index.html 200
/investors/* /investors/index.html 200
/b2b/* /b2b/index.html 200
EOF

echo "✅ Build completed successfully!"
echo "📁 Output directory: dist/"