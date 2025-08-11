#!/bin/bash

# Build script for docs.diboas.com
echo "📚 Building Docs subdomain..."

# Clean and create dist
rm -rf docs/dist
mkdir -p docs/dist

# Copy docs files
if [ -d "docs" ]; then
    cp -r docs/* docs/dist/ 2>/dev/null || true
    rm -rf docs/dist/dist 2>/dev/null || true
elif [ -d "subdomains/docs" ]; then
    cp -r subdomains/docs/* docs/dist/
fi

# Copy shared assets
mkdir -p docs/dist/assets
if [ -d "shared/assets" ]; then
    cp -r shared/assets/* docs/dist/assets/
elif [ -d "assets" ]; then
    cp -r assets/* docs/dist/assets/
fi

# Create redirects for SPA
echo '/* /index.html 200' > docs/dist/_redirects

echo "✅ Docs build complete!"