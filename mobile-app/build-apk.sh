#!/bin/bash

echo "📱 DebtGuardian APK Builder"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the mobile-app directory
if [ ! -f "setup-react-native.sh" ]; then
    echo -e "${RED}❌ Error: Please run this script from the mobile-app directory${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found${NC}"

# Check if React Native project exists
if [ ! -d "DebtGuardianApp" ]; then
    echo -e "${YELLOW}📦 Creating React Native project...${NC}"
    
    # Create React Native project
    npx react-native init DebtGuardianApp --version latest
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to create React Native project${NC}"
        exit 1
    fi
    
    cd DebtGuardianApp
    
    # Install WebView
    echo -e "${YELLOW}📦 Installing react-native-webview...${NC}"
    npm install react-native-webview
    
    # Copy our pre-built files
    echo -e "${YELLOW}📋 Copying pre-built components...${NC}"
    cp ../react-native/App.js ./
    
    if [ -d "../react-native/src" ]; then
        cp -r ../react-native/src ./
    fi
    
    # Update package name in Android
    echo -e "${YELLOW}⚙️  Configuring Android project...${NC}"
    sed -i.bak 's/applicationId "com.debtguardianapp"/applicationId "com.debtguardian.app"/' android/app/build.gradle
    
else
    echo -e "${GREEN}✅ React Native project found${NC}"
    cd DebtGuardianApp
fi

# Check Android setup
if [ ! -d "android" ]; then
    echo -e "${RED}❌ Android directory not found${NC}"
    exit 1
fi

echo -e "${BLUE}🏗️  Building APK...${NC}"

# Navigate to Android directory
cd android

# Make gradlew executable
chmod +x gradlew

# Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
./gradlew clean

# Build release APK
echo -e "${YELLOW}📱 Building release APK...${NC}"
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 APK built successfully!${NC}"
    echo ""
    echo -e "${BLUE}📁 APK Location:${NC}"
    APK_PATH="$(pwd)/app/build/outputs/apk/release/app-release.apk"
    echo "$APK_PATH"
    
    if [ -f "$APK_PATH" ]; then
        APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo -e "${GREEN}📏 APK Size: $APK_SIZE${NC}"
        echo ""
        echo -e "${BLUE}📱 Install on Android device:${NC}"
        echo "1. Copy APK to your Android device"
        echo "2. Open file manager and tap the APK"
        echo "3. Allow 'Install from unknown sources' if prompted"
        echo "4. Tap 'Install'"
        echo ""
        echo -e "${BLUE}🔗 Or install via ADB:${NC}"
        echo "adb install \"$APK_PATH\""
        
        # Also build debug APK for testing
        echo ""
        echo -e "${YELLOW}📱 Building debug APK for testing...${NC}"
        ./gradlew assembleDebug
        
        DEBUG_APK_PATH="$(pwd)/app/build/outputs/apk/debug/app-debug.apk"
        if [ -f "$DEBUG_APK_PATH" ]; then
            DEBUG_SIZE=$(du -h "$DEBUG_APK_PATH" | cut -f1)
            echo -e "${GREEN}✅ Debug APK also created: $DEBUG_SIZE${NC}"
            echo "$DEBUG_APK_PATH"
        fi
        
    else
        echo -e "${RED}❌ APK file not found at expected location${NC}"
    fi
else
    echo -e "${RED}❌ Failed to build APK${NC}"
    echo -e "${YELLOW}💡 Try running:${NC}"
    echo "cd DebtGuardianApp/android"
    echo "./gradlew clean"
    echo "./gradlew assembleDebug"
    exit 1
fi

echo ""
echo -e "${GREEN}🚀 DebtGuardian APK is ready!${NC}"
