#!/bin/bash

echo "🚀 Preparing DebtGuardian for GitHub and Render deployment..."

# Check if git is already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
else
    echo "📦 Git repository already exists"
fi

# Add all files
echo "📝 Adding files to Git..."
git add .

# Create initial commit if no commits exist
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
    echo "💾 Creating initial commit..."
    git commit -m "Initial commit: DebtGuardian - Professional debt management app

Features:
- React + TypeScript frontend
- Node.js + Express backend
- PostgreSQL database with Drizzle ORM
- JWT authentication
- Loan management and tracking
- Financial analytics dashboard
- Payment history and calculators
- Responsive design with Tailwind CSS
- Ready for Render deployment"
else
    echo "💾 Repository already has commits"
fi

echo "✅ Repository prepared for GitHub!"
echo ""
echo "🔗 Next steps:"
echo "1. Create a new repository on GitHub named 'DebtGuardian'"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/DebtGuardian.git"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"
echo "5. Follow the RENDER_DEPLOYMENT.md guide"
echo ""
echo "🎉 Your professional DebtGuardian app is ready for deployment!"
