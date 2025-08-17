# 📱 DebtGuardian Mobile App

Native mobile app for iOS and Android built with React Native WebView.

## 🎯 Overview

This directory contains a complete React Native project that wraps the DebtGuardian web app in a native mobile container. The app provides a native mobile experience while leveraging the existing web application.

**Key Features:**

- Cross-platform (iOS & Android)
- WebView-based architecture
- Native app detection (hides download prompts when running in native app)
- Production-ready APK builds included

## 📁 Structure

```
mobile-app/
├── DebtGuardianApp/              # Complete React Native project
│   ├── App.tsx                   # Main component with WebView + native detection
│   ├── android/                  # Android build configuration
│   ├── ios/                      # iOS build configuration
│   └── package.json              # Dependencies
├── releases/                     # Pre-built APK files
│   ├── DebtGuardian-v1.0.0-release.apk (46MB)
│   └── DebtGuardian-v1.0.0-debug.apk (100MB)
└── build-apk.sh                  # Build script
```

## 🚀 Quick Start

### Option 1: Use Pre-built APKs (Recommended)

```bash
# Download and install the release APK
# Files are in releases/ folder
```

### Option 2: Build from Source

```bash
cd DebtGuardianApp
npm install
cd android && ./gradlew assembleRelease
```

## 🔧 Development

### Requirements

- Node.js 18+
- Android Studio (for Android builds)
- Xcode (for iOS builds, Mac only)

### Setup

```bash
cd DebtGuardianApp
npm install

# For Android
cd android && ./gradlew assembleDebug

# For iOS (Mac only)
cd ios && pod install
npx react-native run-ios
```

## 📋 App Details

- **Package Name:** com.debtguardian.app
- **Web URL:** https://debtguardian.onrender.com
- **Version:** 1.0.0
- **Native Features:**
  - Auto-detection when running in native app
  - Hides web download prompts appropriately
  - Native status bar styling

## 🎯 Architecture

The app uses a simple but effective WebView approach:

1. **React Native Shell:** Provides native app container
2. **WebView Component:** Loads the web application
3. **JavaScript Injection:** Sets native app detection flag
4. **Web App Integration:** Conditionally shows/hides download UI

This approach allows leveraging the full web application while providing a native mobile experience.

---

*Ready-to-use APK files are available in the `releases/` folder.*oss-Platform Mobile## 📁 Project Structure

````
mobile-app/
├── 🚀 setup-react-native.sh     # Auto-setup script
├── 🍎 setup-ios.sh              # iOS-specific setup
├── 📖 CROSS_PLATFORM_GUIDE.md   # Detailed guide
├── 📖 MOBILE_APP_GUIDE.md       # Original guide
│
├── ⚛️  DebtGuardianApp/          # Complete React Native project
│   ├── App.tsx                   # Main app component with WebView
│   ├── package.json              # Dependencies
│   ├── android/                  # Android build files
│   ├── ios/                      # iOS build files
│   └── __tests__/                # Test files
│
├── 📦 releases/                  # Built APK files
└── 📚 docs/                      # Documentation
```r web app into native mobile experiences for both iOS and Android using React Native!

## 🎯 Why React Native?

✅ **Single Codebase** for iOS + Android
✅ **Familiar Technology** (React + JavaScript)
✅ **Great Performance** and native feel
✅ **Large Community** and extensive ecosystem
✅ **Easy Updates** and maintenance

## 🚀 Quick Start

### **One-Command Setup:**

```bash
cd mobile-app
./setup-react-native.sh
````

### **Manual Setup:**

```bash
# Create React Native project
npx react-native init DebtGuardianApp
cd DebtGuardianApp

# Install WebView
npm install react-native-webview

# iOS setup (Mac only)
cd ios && pod install && cd ..

# Run on platforms
npx react-native run-ios      # iOS
npx react-native run-android  # Android
```

## � Project Structure

```
mobile-app/
├── 🚀 setup-react-native.sh     # Auto-setup script
├── 🍎 setup-ios.sh              # iOS-specific setup
├── 📖 CROSS_PLATFORM_GUIDE.md   # Detailed guide
├── 📖 MOBILE_APP_GUIDE.md       # Original guide
│
├── ⚛️  react-native/             # Cross-platform app
│   ├── App.js                    # Main app component
│   ├── package.json              # Dependencies
│   └── src/
│       ├── components/           # Reusable components
│       ├── screens/              # App screens
│       └── config/               # Configuration
│
└── 📚 docs/                      # Documentation
```

- **Direct APK**: Share the generated APK file
- **Enterprise**: Use internal distribution methods

## 🌐 Web App URL

The mobile app loads: `https://debtguardian.onrender.com/`

## 📱 App Store Information

### App Name: DebtGuardian

### Description:

Take control of your debt with DebtGuardian - the comprehensive loan management app. Track payments, analyze your financial health, and achieve financial freedom with professional-grade debt management tools.

### Features:

- 📊 Loan Portfolio Management
- 💰 Payment Tracking & History
- 📈 Financial Analytics & Reports
- 🎯 Payoff Calculator & Strategies
- 🔒 Secure Data Management
- 📱 Mobile-Optimized Interface

### Keywords:

loan management, debt tracker, financial planning, EMI calculator, payment tracker, debt payoff, financial health, personal finance

### Category: Finance / Productivity
