#!/bin/bash

echo "🚀 AL EBREIZ - Building for Production"
echo "======================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build
if [ -d "dist" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf dist
fi

# Build the project
echo "🏗️  Building production bundle..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📁 Files ready for deployment in: ./dist/"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Open FileZilla or Hostinger File Manager"
    echo "2. Upload ALL files from './dist/' folder to 'public_html/'"
    echo "3. Upload '.htaccess' file to 'public_html/'"
    echo "4. Upload app icons to 'public_html/icons/'"
    echo "5. Enable SSL in Hostinger panel"
    echo ""
    echo "📖 Full guide: See HOSTINGER_DEPLOYMENT_GUIDE.md"
    echo ""
else
    echo ""
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
