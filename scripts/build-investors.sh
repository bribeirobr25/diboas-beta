#!/bin/bash

# Build script for investors.diboas.com
echo "💼 Building Investors subdomain..."

# Clean and create dist
rm -rf investors/dist
mkdir -p investors/dist

# Copy investors files
if [ -d "investors" ]; then
    cp -r investors/* investors/dist/ 2>/dev/null || true
    rm -rf investors/dist/dist 2>/dev/null || true
elif [ -d "subdomains/investors" ]; then
    cp -r subdomains/investors/* investors/dist/
fi

# Copy shared assets
mkdir -p investors/dist/assets
if [ -d "shared/assets" ]; then
    cp -r shared/assets/* investors/dist/assets/
elif [ -d "assets" ]; then
    cp -r assets/* investors/dist/assets/
fi

# Create redirects for SPA
echo '/* /index.html 200' > investors/dist/_redirects

echo "✅ Investors build complete!"