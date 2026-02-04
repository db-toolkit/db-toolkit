#!/bin/bash

# Mintlify Setup Script
# Interactive setup for Mintlify documentation

set -e

echo "🚀 Mintlify Documentation Setup"
echo "================================"
echo ""

# Check if mintlify is installed
if ! command -v mintlify &> /dev/null; then
    echo "📦 Installing Mintlify CLI..."
    npm install -g mintlify
    echo "✅ Mintlify CLI installed"
    echo ""
fi

# Get project details
echo "📝 Project Configuration"
echo ""
read -p "Enter your documentation name (e.g., DB Toolkit Docs): " DOC_NAME
read -p "Enter your project URL (e.g., https://dbtoolkit.dev): " PROJECT_URL
read -p "Enter primary color (hex, e.g., #10b981): " PRIMARY_COLOR
read -p "Enter GitHub repo URL (optional, press enter to skip): " GITHUB_URL

# Use existing docs directory
DOCS_DIR="src/docs"
echo ""
echo "📁 Using existing directory: $DOCS_DIR"

# Create mint.json configuration
echo "⚙️  Creating mint.json configuration..."
cat > "$DOCS_DIR/mint.json" << EOF
{
  "name": "$DOC_NAME",
  "logo": {
    "dark": "/logo/dark.svg",
    "light": "/logo/light.svg"
  },
  "favicon": "/favicon.svg",
  "colors": {
    "primary": "$PRIMARY_COLOR",
    "light": "$PRIMARY_COLOR",
    "dark": "$PRIMARY_COLOR"
  },
  "topbarLinks": [
    {
      "name": "Website",
      "url": "$PROJECT_URL"
    }
  ],
  "topbarCtaButton": {
    "name": "Download",
    "url": "$PROJECT_URL/download"
  },
  "navigation": [
    {
      "group": "Getting Started",
      "pages": ["data/getting-started"]
    },
    {
      "group": "Core Features",
      "pages": [
        "data/connections",
        "data/workspaces",
        "data/query-editor",
        "data/schema-explorer",
        "data/data-explorer"
      ]
    },
    {
      "group": "Advanced",
      "pages": [
        "data/migrations",
        "data/backups",
        "data/settings"
      ]
    }
  ],
  "footerSocials": {
    "github": "$GITHUB_URL"
  }
}
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. cd $DOCS_DIR"
echo "2. mintlify dev (preview locally)"
echo "3. mintlify deploy (deploy to Mintlify)"
echo ""
echo "🌐 Custom domain: Add in Mintlify dashboard after deployment"
echo ""
