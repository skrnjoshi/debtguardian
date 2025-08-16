#!/bin/bash

# DebtGuardian Mobile App Build Script
# This script helps build the Android APK for the DebtGuardian mobile app

set -e  # Exit on any error

echo "🚀 DebtGuardian Mobile App Builder"
echo "=================================="

# Check if Android SDK is available
if ! command -v android &> /dev/null; then
    echo "❌ Android SDK not found. Please install Android Studio and set up SDK."
    echo "   Visit: https://developer.android.com/studio"
    exit 1
fi

# Navigate to Android project directory
cd "$(dirname "$0")/android"

echo "📁 Current directory: $(pwd)"

# Check if gradlew exists
if [ ! -f "./gradlew" ]; then
    echo "❌ gradlew not found. Please ensure you're in the correct Android project directory."
    exit 1
fi

# Make gradlew executable
chmod +x ./gradlew

echo "🔧 Cleaning previous build..."
./gradlew clean

echo "📦 Building debug APK..."
./gradlew assembleDebug

# Check if build was successful
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ Debug APK built successfully!"
    echo "📱 Location: app/build/outputs/apk/debug/app-debug.apk"
    
    # Get APK size
    APK_SIZE=$(du -h "app/build/outputs/apk/debug/app-debug.apk" | cut -f1)
    echo "📏 APK Size: $APK_SIZE"
    
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Install on device: adb install app/build/outputs/apk/debug/app-debug.apk"
    echo "2. Or copy APK to device and install manually"
    echo "3. For release APK: ./gradlew assembleRelease"
else
    echo "❌ Build failed. Check the output above for errors."
    exit 1
fi

echo ""
echo "📱 Mobile App Features:"
echo "• Loads https://debtguardian.onrender.com/ in WebView"
echo "• Native app experience with custom icon"
echo "• Handles back button and navigation"
echo "• Opens external links in browser"
echo "• Offline error handling"

echo ""
echo "🏪 Ready for Distribution:"
echo "• Google Play Store (recommended)"
echo "• Direct APK sharing"
echo "• Enterprise distribution"

echo ""
echo "✨ Build completed successfully!"
