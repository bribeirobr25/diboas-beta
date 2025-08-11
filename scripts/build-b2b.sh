#!/bin/bash

# Build script for b2b.diboas.com
echo "🏢 Building B2B subdomain..."

# Clean and create dist
rm -rf b2b/dist
mkdir -p b2b/dist

# Copy B2B files
if [ -d "b2b" ]; then
    cp -r b2b/* b2b/dist/ 2>/dev/null || true
    rm -rf b2b/dist/dist 2>/dev/null || true
elif [ -d "subdomains/b2b" ]; then
    cp -r subdomains/b2b/* b2b/dist/
fi

# Copy shared assets
mkdir -p b2b/dist/assets
if [ -d "shared/assets" ]; then
    cp -r shared/assets/* b2b/dist/assets/
elif [ -d "assets" ]; then
    cp -r assets/* b2b/dist/assets/
fi

# Create redirects for SPA
echo '/* /index.html 200' > b2b/dist/_redirects

echo "✅ B2B build complete!"