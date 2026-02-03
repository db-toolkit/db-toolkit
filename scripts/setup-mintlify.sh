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

# Create mintlify directory
MINT_DIR="mintlify-docs"
echo ""
echo "📁 Creating $MINT_DIR directory..."
mkdir -p "$MINT_DIR"

# Copy MDX files
echo "📄 Copying MDX files..."
cp -r src/docs/data/*.mdx "$MINT_DIR/"

# Create mint.json configuration
echo "⚙️  Creating mint.json configuration..."
cat > "$MINT_DIR/mint.json" << EOF
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
      "pages": ["getting-started"]
    },
    {
      "group": "Core Features",
      "pages": [
        "connections",
        "workspaces",
        "query-editor",
        "schema-explorer",
        "data-explorer"
      ]
    },
    {
      "group": "Advanced",
      "pages": [
        "migrations",
        "backups",
        "settings"
      ]
    }
  ],
  "footerSocials": {
    "github": "$GITHUB_URL"
  }
}
EOF

# Create README
cat > "$MINT_DIR/README.md" << EOF
# Mintlify Documentation

## Local Development
\`\`\`bash
mintlify dev
\`\`\`

## Deploy
\`\`\`bash
mintlify deploy
\`\`\`

Or connect your GitHub repo to Mintlify for auto-deployment.
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. cd $MINT_DIR"
echo "2. mintlify dev (preview locally)"
echo "3. mintlify deploy (deploy to Mintlify)"
echo ""
echo "🌐 Custom domain: Add in Mintlify dashboard after deployment"
echo ""
