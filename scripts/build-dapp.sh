#!/bin/bash

# Build script for dapp.diboas.com
echo "🚀 Building dApp subdomain..."

# Clean and create dist
rm -rf app/dist
mkdir -p app/dist

# Copy dApp files
if [ -d "app" ]; then
    cp -r app/* app/dist/ 2>/dev/null || true
    rm -rf app/dist/dist 2>/dev/null || true
elif [ -d "subdomains/dapp" ]; then
    cp -r subdomains/dapp/* app/dist/
fi

# Copy shared assets
mkdir -p app/dist/assets
if [ -d "shared/assets" ]; then
    cp -r shared/assets/* app/dist/assets/
elif [ -d "assets" ]; then
    cp -r assets/* app/dist/assets/
fi

# Create redirects for SPA
echo '/* /index.html 200' > app/dist/_redirects

echo "✅ dApp build complete!"