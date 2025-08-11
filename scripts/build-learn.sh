#!/bin/bash

# Build script for learn.diboas.com
echo "🎓 Building Learn subdomain..."

# Clean and create dist
rm -rf learn/dist
mkdir -p learn/dist

# Copy learn files
if [ -d "learn" ]; then
    cp -r learn/* learn/dist/ 2>/dev/null || true
    rm -rf learn/dist/dist 2>/dev/null || true
elif [ -d "subdomains/learn" ]; then
    cp -r subdomains/learn/* learn/dist/
fi

# Copy shared assets
mkdir -p learn/dist/assets
if [ -d "shared/assets" ]; then
    cp -r shared/assets/* learn/dist/assets/
elif [ -d "assets" ]; then
    cp -r assets/* learn/dist/assets/
fi

# Create redirects for SPA
echo '/* /index.html 200' > learn/dist/_redirects

echo "✅ Learn build complete!"