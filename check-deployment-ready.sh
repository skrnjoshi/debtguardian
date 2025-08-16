#!/bin/bash

echo "🔍 DebtGuardian Deployment Status Check"
echo "======================================="

# Check if we can build the project
echo "📦 Testing build process..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - check your code"
    exit 1
fi

# Check if required files exist
echo ""
echo "📋 Checking required files..."

required_files=(
    "package.json"
    "server/index.ts"
    "client/src/App.tsx"
    ".env.example"
    ".env.production.example"
    "RENDER_DEPLOYMENT.md"
    ".gitignore"
    "README_GITHUB.md"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        all_files_exist=false
    fi
done

# Check package.json configuration
echo ""
echo "🔧 Checking package.json configuration..."
if grep -q '"engines"' package.json; then
    echo "✅ Node.js engine version specified"
else
    echo "⚠️  Node.js engine version not specified"
fi

if grep -q '"start".*node.*dist' package.json; then
    echo "✅ Production start script configured"
else
    echo "❌ Production start script not configured"
fi

if grep -q '"build"' package.json; then
    echo "✅ Build script configured"
else
    echo "❌ Build script not configured"
fi

# Check server configuration
echo ""
echo "🖥️  Checking server configuration..."
if grep -q 'process.env.PORT' server/index.ts; then
    echo "✅ PORT environment variable configured"
else
    echo "❌ PORT environment variable not configured"
fi

if grep -q 'host.*0.0.0.0' server/index.ts; then
    echo "✅ Production host configuration found"
else
    echo "⚠️  Production host configuration may be missing"
fi

echo ""
if [ "$all_files_exist" = true ]; then
    echo "🎉 Your DebtGuardian app is ready for deployment!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Run: ./prepare-github.sh"
    echo "2. Create GitHub repository"
    echo "3. Push to GitHub"
    echo "4. Follow RENDER_DEPLOYMENT.md guide"
    echo "5. Deploy to Render"
else
    echo "❌ Some required files are missing. Please fix the issues above."
    exit 1
fi
