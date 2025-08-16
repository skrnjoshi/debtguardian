#!/bin/bash

echo "🚀 Setting up React Native for DebtGuardian..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the mobile-app directory
if [ ! -d "react-native" ]; then
    echo -e "${RED}❌ Error: Please run this script from the mobile-app directory${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//')
if [[ "$(printf '%s\n' "16.0.0" "$NODE_VERSION" | sort -V | head -n1)" != "16.0.0" ]]; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is too old. Please install Node.js 16+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $NODE_VERSION found${NC}"

# Check React Native CLI
if ! command -v react-native &> /dev/null; then
    echo -e "${YELLOW}📦 Installing React Native CLI...${NC}"
    npm install -g react-native-cli
else
    echo -e "${GREEN}✅ React Native CLI found${NC}"
fi

# Platform-specific checks
echo -e "${YELLOW}🔍 Checking platform tools...${NC}"

# Check for iOS (only on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v xcodebuild &> /dev/null; then
        echo -e "${GREEN}✅ Xcode found${NC}"
    else
        echo -e "${YELLOW}⚠️  Xcode not found. iOS development won't be available.${NC}"
    fi
    
    # Check CocoaPods
    if command -v pod &> /dev/null; then
        echo -e "${GREEN}✅ CocoaPods found${NC}"
    else
        echo -e "${YELLOW}📦 Installing CocoaPods...${NC}"
        sudo gem install cocoapods
    fi
else
    echo -e "${YELLOW}ℹ️  Not on macOS - iOS development not available${NC}"
fi

# Check Android Studio / SDK
if [ -d "$HOME/Library/Android/sdk" ] || [ -d "$HOME/Android/Sdk" ] || [ -d "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✅ Android SDK found${NC}"
else
    echo -e "${YELLOW}⚠️  Android SDK not found. Please install Android Studio.${NC}"
fi

echo -e "${YELLOW}🏗️  Creating React Native project...${NC}"

# Create React Native project
npx react-native init DebtGuardianApp --version latest

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create React Native project${NC}"
    exit 1
fi

cd DebtGuardianApp

echo -e "${YELLOW}📦 Installing dependencies...${NC}"

# Install WebView
npm install react-native-webview

# Install additional useful packages
npm install react-native-splash-screen
npm install react-native-vector-icons

echo -e "${YELLOW}📁 Setting up project structure...${NC}"

# Create components directory
mkdir -p src/components
mkdir -p src/config
mkdir -p src/screens

# Copy our pre-built files
echo -e "${YELLOW}📋 Copying pre-built files...${NC}"

# Copy App.js
cp ../react-native/App.js ./

# Copy components
cp -r ../react-native/src/* ./src/

echo -e "${YELLOW}📱 Setting up iOS (if available)...${NC}"
if [[ "$OSTYPE" == "darwin"* ]] && command -v pod &> /dev/null; then
    cd ios
    pod install
    cd ..
    echo -e "${GREEN}✅ iOS setup complete${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping iOS setup${NC}"
fi

echo -e "${YELLOW}🤖 Setting up Android...${NC}"

# Update Android package name
PACKAGE_NAME="com.debtguardian.app"
APP_NAME="DebtGuardian"

# Update package name in build.gradle
sed -i.bak "s/applicationId \".*\"/applicationId \"$PACKAGE_NAME\"/" android/app/build.gradle
sed -i.bak "s/resValue \"string\", \"app_name\", \".*\"/resValue \"string\", \"app_name\", \"$APP_NAME\"/" android/app/build.gradle

echo -e "${GREEN}✅ Android setup complete${NC}"

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${YELLOW}📱 To run the app:${NC}"

if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${GREEN}iOS:${NC} npx react-native run-ios"
fi

echo -e "${GREEN}Android:${NC} npx react-native run-android"
echo ""
echo -e "${YELLOW}📂 Project location:${NC} $(pwd)"
echo ""
echo -e "${YELLOW}📖 Next steps:${NC}"
echo "1. Start Metro bundler: npx react-native start"
echo "2. Run on iOS: npx react-native run-ios (Mac only)"
echo "3. Run on Android: npx react-native run-android"
echo "4. Open project in IDE for further customization"
echo ""
echo -e "${GREEN}🚀 Happy coding!${NC}"
