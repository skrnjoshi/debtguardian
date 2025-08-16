# DebtGuardian React Native App

## 🎯 Overview
Cross-platform mobile app for iOS and Android using React Native with WebView integration.

## 🚀 Quick Start

### Prerequisites:
- Node.js 16+
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Setup:
```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new React Native project
npx react-native init DebtGuardianApp
cd DebtGuardianApp

# Install WebView dependency
npm install react-native-webview

# iOS setup (Mac only)
cd ios && pod install && cd ..

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

## 📱 Features

### Current:
- ✅ Cross-platform (iOS + Android)
- ✅ WebView integration
- ✅ Native navigation
- ✅ Splash screen
- ✅ Deep linking
- ✅ Network detection

### Future Enhancements:
- 🔔 Push notifications
- 🔐 Biometric authentication
- 📷 Camera integration
- 📱 Native modules
- 🔄 Offline support
- 📊 Native analytics

## 📂 Project Structure

```
DebtGuardianApp/
├── App.js                 # Main app component
├── components/
│   ├── WebViewScreen.js   # WebView wrapper
│   ├── SplashScreen.js    # Loading screen
│   └── ErrorScreen.js     # Error handling
├── utils/
│   ├── config.js          # App configuration
│   └── helpers.js         # Utility functions
├── android/               # Android-specific code
├── ios/                   # iOS-specific code
└── package.json
```

## 🔧 Configuration

The app loads: `https://debtguardian.onrender.com/`

## 📦 Distribution

### iOS:
- Build with Xcode
- Submit to App Store Connect
- TestFlight for beta testing

### Android:
- Build APK/AAB with Gradle
- Submit to Google Play Console
- Internal testing available
