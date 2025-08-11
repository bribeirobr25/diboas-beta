#!/bin/bash

# diBoaS Subdomain Setup Script
# Creates separate repositories for each subdomain

set -e

GITHUB_USERNAME="bribeirobr25"
BASE_DIR="$(pwd)"
TEMP_DIR="$BASE_DIR/temp-repos"

echo "🚀 Setting up diBoaS subdomains..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is required but not installed."
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "❌ Please login to GitHub CLI first:"
    echo "gh auth login"
    exit 1
fi

# Create temporary directory
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Repository configurations
declare -A REPOS=(
    ["diboas-landing"]="diboas.com|subdomains/landing|Main landing page"
    ["diboas-dapp"]="dapp.diboas.com|subdomains/dapp|Investment dApp"
    ["diboas-docs"]="docs.diboas.com|subdomains/docs|Documentation"
    ["diboas-learn"]="learn.diboas.com|subdomains/learn|Learning center"
    ["diboas-mascots"]="mascots.diboas.com|subdomains/mascots|AI mascot guides"
    ["diboas-investors"]="investors.diboas.com|subdomains/investors|Investor portal"
    ["diboas-b2b"]="b2b.diboas.com|subdomains/b2b|Business portal"
)

# Function to create and setup repository
setup_repo() {
    local repo_name="$1"
    local domain="$2"
    local source_dir="$3"
    local description="$4"
    
    echo "📦 Setting up $repo_name..."
    
    # Create GitHub repository
    gh repo create "$GITHUB_USERNAME/$repo_name" \
        --description "diBoaS OneFi Platform - $description" \
        --homepage "https://$domain" \
        --public
    
    # Clone the repository
    git clone "https://github.com/$GITHUB_USERNAME/$repo_name.git"
    cd "$repo_name"
    
    # Copy source files
    if [ -d "$BASE_DIR/$source_dir" ]; then
        cp -r "$BASE_DIR/$source_dir"/* .
        echo "✅ Copied files from $source_dir"
    else
        echo "⚠️  Source directory $source_dir not found, creating basic structure..."
        # Create basic HTML file
        cat > index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$description - diBoaS</title>
    <link rel="stylesheet" href="https://diboas.com/assets/css/main.css">
</head>
<body>
    <h1>$description</h1>
    <p>Coming soon...</p>
    <p><a href="https://diboas.com">← Back to diBoaS</a></p>
</body>
</html>
EOF
    fi
    
    # Copy shared assets
    if [ -d "$BASE_DIR/shared/assets" ]; then
        mkdir -p assets
        cp -r "$BASE_DIR/shared/assets"/* assets/
        echo "✅ Copied shared assets"
    fi
    
    # Create CNAME file
    echo "$domain" > CNAME
    
    # Create GitHub Pages workflow
    mkdir -p .github/workflows
    cat > .github/workflows/pages.yml << EOF
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
      
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: '.'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
EOF
    
    # Initial commit
    git add .
    git commit -m "Initial setup for $domain"
    git push origin main
    
    echo "✅ Repository $repo_name created and deployed"
    echo "🌐 Will be available at: https://$domain"
    echo ""
    
    cd ..
}

# Setup all repositories
for repo in "${!REPOS[@]}"; do
    IFS='|' read -r domain source_dir description <<< "${REPOS[$repo]}"
    setup_repo "$repo" "$domain" "$source_dir" "$description"
done

echo "🎉 All repositories created successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo "1. Configure DNS records (see DNS_SETUP.md)"
echo "2. Wait 10-15 minutes for GitHub Pages to activate"
echo "3. Enable HTTPS in each repository settings"
echo ""
echo "🌐 Your subdomains will be:"
for repo in "${!REPOS[@]}"; do
    IFS='|' read -r domain source_dir description <<< "${REPOS[$repo]}"
    echo "   https://$domain"
done

# Cleanup
cd "$BASE_DIR"
rm -rf "$TEMP_DIR"

echo ""
echo "✨ Setup complete!"