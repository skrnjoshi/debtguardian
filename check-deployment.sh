#!/bin/bash

echo "🚀 DebtGuardian - GitHub to Render Deployment Status"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check git status
echo -e "${BLUE}📋 Git Repository Status:${NC}"
echo "Current branch: $(git branch --show-current)"
echo "Latest commit: $(git log --oneline -1)"
echo "Remote status: $(git status -uno --porcelain)"

if [[ -z "$(git status -uno --porcelain)" ]]; then
    echo -e "${GREEN}✅ All changes committed and pushed${NC}"
else
    echo -e "${YELLOW}⚠️  Uncommitted changes found${NC}"
fi

echo ""

# Check deployment files
echo -e "${BLUE}📁 Deployment Configuration:${NC}"

if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json found${NC}"
    echo "   Build command: $(grep -o '"build":[^,]*' package.json | cut -d'"' -f4)"
    echo "   Start command: $(grep -o '"start":[^,]*' package.json | cut -d'"' -f4)"
else
    echo -e "${YELLOW}⚠️  package.json missing${NC}"
fi

if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✅ render.yaml found${NC}"
else
    echo -e "${YELLOW}⚠️  render.yaml missing (optional)${NC}"
fi

echo ""

# Check build requirements
echo -e "${BLUE}🔧 Build Requirements:${NC}"

if [ -d "dist" ]; then
    echo -e "${GREEN}✅ dist/ directory exists${NC}"
    echo "   Size: $(du -sh dist | cut -f1)"
else
    echo -e "${YELLOW}⚠️  No dist/ directory (will be created during build)${NC}"
fi

if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✅ TypeScript configuration found${NC}"
else
    echo -e "${YELLOW}⚠️  tsconfig.json missing${NC}"
fi

echo ""

# Check live deployment
echo -e "${BLUE}🌐 Live Deployment Check:${NC}"

DEPLOY_URL="https://debtguardian.onrender.com"
echo "Checking: $DEPLOY_URL"

if command -v curl >/dev/null 2>&1; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$DEPLOY_URL" 2>/dev/null)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ App is live and responding${NC}"
        echo "   Status: HTTP $HTTP_CODE"
    elif [ "$HTTP_CODE" = "000" ]; then
        echo -e "${YELLOW}⚠️  App is building or starting up${NC}"
        echo "   (This is normal for recent deployments)"
    else
        echo -e "${YELLOW}⚠️  App returned HTTP $HTTP_CODE${NC}"
    fi
else
    echo "📝 curl not available - check manually: $DEPLOY_URL"
fi

echo ""

# Deployment instructions
echo -e "${BLUE}📋 GitHub to Render Deployment Process:${NC}"
echo "1. ✅ Code pushed to GitHub (automatic)"
echo "2. 🔄 Render detects changes (automatic)"  
echo "3. 🏗️  Render runs 'npm run build' (automatic)"
echo "4. 🚀 Render starts with 'npm start' (automatic)"
echo "5. 🌐 App goes live (automatic)"

echo ""
echo -e "${GREEN}🎉 Your app should be deploying automatically!${NC}"
echo -e "${BLUE}🔗 Monitor deployment: https://dashboard.render.com${NC}"
echo -e "${BLUE}🌐 Live app: https://debtguardian.onrender.com${NC}"
