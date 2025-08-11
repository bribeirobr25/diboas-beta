#!/bin/bash

# Build script for mascots.diboas.com
echo "🎭 Building Mascots subdomain..."

# Clean and create dist
rm -rf mascots/dist
mkdir -p mascots/dist

# Copy mascots files
if [ -d "mascots" ]; then
    cp -r mascots/* mascots/dist/ 2>/dev/null || true
    rm -rf mascots/dist/dist 2>/dev/null || true
elif [ -d "subdomains/mascots" ]; then
    cp -r subdomains/mascots/* mascots/dist/
fi

# Copy shared assets
mkdir -p mascots/dist/assets
if [ -d "shared/assets" ]; then
    cp -r shared/assets/* mascots/dist/assets/
elif [ -d "assets" ]; then
    cp -r assets/* mascots/dist/assets/
fi

# Create redirects for SPA
echo '/* /index.html 200' > mascots/dist/_redirects

echo "✅ Mascots build complete!"