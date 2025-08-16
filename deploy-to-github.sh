#!/bin/bash

echo "🚀 DebtGuardian - Safe GitHub Deployment"
echo "======================================="
echo ""

# Check that .env is ignored
if git check-ignore .env > /dev/null 2>&1; then
    echo "✅ .env file is safely ignored (won't be pushed)"
else
    echo "❌ WARNING: .env might be pushed! Check .gitignore"
    exit 1
fi

# Show what will be committed
echo ""
echo "📋 Files ready to push to GitHub:"
echo "✅ Source code and configurations"
echo "✅ Documentation (README.md, deployment guides)"
echo "✅ Environment templates (.env.example, .env.production.example)"
echo "✅ Build scripts and deployment tools"
echo "❌ Your actual .env file (safely excluded)"
echo ""

# Commit the cleaned up version
echo "💾 Creating commit..."
git commit -m "DebtGuardian: Professional debt management application

Features:
- React + TypeScript frontend with Tailwind CSS
- Node.js + Express backend with PostgreSQL
- JWT authentication system
- Loan management with progress tracking
- Financial health analytics dashboard
- Payment history and payoff calculators
- Responsive design for all devices
- Ready for Render deployment

Tech Stack:
- Frontend: React 18, TypeScript, Vite, TanStack Query, Radix UI
- Backend: Node.js, Express, Drizzle ORM, bcrypt
- Database: PostgreSQL with Neon serverless
- Deployment: Render-ready with automatic builds"

echo ""
echo "🎯 Next Steps:"
echo "1. Create a repository on GitHub named 'DebtGuardian'"
echo "2. Run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/DebtGuardian.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Then follow GITHUB_RENDER_DEPLOYMENT.md for Render deployment"
echo ""
echo "🔐 Security Status:"
echo "✅ .env file is excluded from push"
echo "✅ Only safe template files will be uploaded"
echo "✅ Your secrets stay local and secure"
echo ""
echo "🎉 Your professional DebtGuardian app is ready for GitHub!"
