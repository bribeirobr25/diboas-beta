#!/bin/bash

# Build script for diboas.com (landing page)
echo "🏠 Building Landing subdomain..."

# Clean and create dist
rm -rf landing/dist
mkdir -p landing/dist

# Copy landing files
if [ -d "subdomains/landing" ]; then
    cp -r subdomains/landing/* landing/dist/
elif [ -f "index.html" ]; then
    cp index.html landing/dist/
    # Copy other root files
    cp -r assets landing/dist/ 2>/dev/null || true
    cp -r shared landing/dist/ 2>/dev/null || true
fi

# Copy shared assets
mkdir -p landing/dist/assets
if [ -d "shared/assets" ]; then
    cp -r shared/assets/* landing/dist/assets/
elif [ -d "assets" ]; then
    cp -r assets/* landing/dist/assets/
fi

# Copy PWA files
if [ -f "manifest.json" ]; then
    cp manifest.json landing/dist/
fi
if [ -f "sw.js" ]; then
    cp sw.js landing/dist/
fi

# Create redirects for SPA
echo '/* /index.html 200' > landing/dist/_redirects

echo "✅ Landing build complete!"