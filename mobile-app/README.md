# DebtGuardian Mobile App

This directory contains the mobile app versions that use WebView to display the DebtGuardian web application.

## 🚀 Quick Start

### Android App (WebView)

The Android app loads `https://debtguardian.onrender.com/` in a WebView component, providing a native app experience.

### Features:

- ✅ Full web app functionality through WebView
- ✅ Native app icon and splash screen
- ✅ Hide browser UI for app-like experience
- ✅ Handle back button navigation
- ✅ Network connectivity detection
- ✅ Push notifications support (future)
- ✅ Biometric authentication (future)

## 📁 Directory Structure

```
mobile-app/
├── android/                 # Android WebView app
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/        # Java/Kotlin source files
│   │   │   ├── res/         # Resources (layouts, icons, etc.)
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── gradle/
│   ├── build.gradle
│   └── settings.gradle
├── ios/                     # iOS WebView app (future)
└── README.md               # This file
```

## 🛠 Build Instructions

### Android APK:

1. Install Android Studio
2. Open the `android/` project
3. Connect Android device or start emulator
4. Click "Run" or use `./gradlew assembleDebug`

### Distribution:

- **Play Store**: Submit through Google Play Console
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
