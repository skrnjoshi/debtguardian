# 📱 DebtGuardian APK Build Guide

How to create a downloadable Android APK from your React Native app.

## 🎯 Quick APK Creation

### **Step 1: Create React Native Project**

```bash
cd /Users/saikirandonkana/Downloads/DebtGuardian/mobile-app

# Create the React Native project
npx react-native init DebtGuardianApp --version latest
cd DebtGuardianApp

# Install WebView dependency
npm install react-native-webview
```

### **Step 2: Use Complete Project**

```bash
# The complete React Native project is already available in DebtGuardianApp/
cd DebtGuardianApp/

# Install dependencies if not already installed
npm install
```

### **Step 3: Build APK**

```bash
# Navigate to Android directory
cd android

# Build debug APK (for testing)
./gradlew assembleDebug

# Build release APK (for distribution)
./gradlew assembleRelease
```

### **Step 4: Find Your APK**

```bash
# Debug APK location:
android/app/build/outputs/apk/debug/app-debug.apk

# Release APK location:
android/app/build/outputs/apk/release/app-release.apk
```

## 📱 **Install APK on Android Device**

### **Method 1: USB Transfer**

1. Copy APK to your Android device
2. Open file manager on Android
3. Tap the APK file
4. Allow "Install from unknown sources" if prompted
5. Tap "Install"

### **Method 2: Share via Cloud**

1. Upload APK to Google Drive/Dropbox
2. Download on Android device
3. Install as above

### **Method 3: Direct Install via ADB**

```bash
# Connect Android device via USB
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 🚀 **Automated APK Builder Script**

Let me create an automated script for you:

```bash
#!/bin/bash
# This will be in build-apk.sh

echo "🏗️  Building DebtGuardian APK..."

# Check if React Native project exists
if [ ! -d "DebtGuardianApp" ]; then
    echo "Creating React Native project..."
    npx react-native init DebtGuardianApp --version latest
    cd DebtGuardianApp
    npm install

    # Project files are already in place with App.tsx and WebView setup
else
    cd DebtGuardianApp
fi

# Build APK
echo "Building APK..."
cd android
./gradlew assembleRelease

echo "✅ APK built successfully!"
echo "📁 Location: android/app/build/outputs/apk/release/app-release.apk"
```

## 📋 **APK Details**

### **What the APK Contains:**

- 📱 Native Android app container
- 🌐 WebView loading https://debtguardian.onrender.com/
- 🎨 Custom app icon and splash screen
- 📴 Offline capabilities
- 🔒 No browser UI (true app experience)

### **APK Specifications:**

```
App Name: DebtGuardian
Package: com.debtguardian.app
Version: 1.0.0
Min SDK: 21 (Android 5.0+)
Target SDK: 34 (Android 14)
Size: ~25-30 MB
```

## 🔧 **Prerequisites**

### **Required Software:**

- ✅ Node.js 16+
- ✅ React Native CLI
- ✅ Android Studio
- ✅ Android SDK
- ✅ JDK 11+

### **Check Your Setup:**

```bash
node --version        # Should be 16+
npm --version         # Should be recent
react-native --version # Should be installed
java -version         # Should be JDK 11+
```

## 🎨 **Customization Options**

### **Change App Name:**

Edit `android/app/src/main/res/values/strings.xml`:

```xml
<string name="app_name">DebtGuardian</string>
```

### **Change Package Name:**

Edit `android/app/build.gradle`:

```gradle
applicationId "com.debtguardian.app"
```

### **Change App Icon:**

Replace files in `android/app/src/main/res/mipmap-*/`

### **Change Website URL:**

Edit `App.js`:

```javascript
const WEBSITE_URL = "https://debtguardian.onrender.com/";
```

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **"Command not found: gradlew"**

```bash
chmod +x gradlew
```

#### **"SDK location not found"**

Create `android/local.properties`:

```
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

#### **"Build failed"**

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

#### **"React Native not found"**

```bash
npm install -g react-native-cli
```

## 📦 **Distribution Options**

### **For Personal Use:**

- ✅ Share APK file directly
- ✅ Install on your devices
- ✅ Share with friends/family

### **For Public Distribution:**

- 🏪 Google Play Store (requires developer account $25 one-time)
- 📱 Alternative app stores (APKPure, F-Droid)
- 🌐 Direct download from your website

## 🎯 **Next Steps After APK Creation**

1. **Test on Multiple Devices**

   - Different Android versions
   - Various screen sizes
   - Different network conditions

2. **App Store Preparation**

   - Create developer account
   - Generate signed APK
   - Prepare store listing
   - Upload screenshots

3. **Version Management**
   - Increment version code for updates
   - Tag releases in git
   - Maintain changelog

## ✅ **Quick Start Commands**

```bash
# Create and build APK in one go
cd mobile-app
./build-apk.sh

# Or manual step-by-step
npx react-native init DebtGuardianApp
cd DebtGuardianApp
npm install react-native-webview
npx react-native run-android  # Test first
cd android && ./gradlew assembleRelease
```

## 🎉 **Success!**

Once you have the APK:

1. **Install on your Android device**
2. **Test all features work**
3. **Share with others**
4. **Consider Play Store submission**

Your DebtGuardian app will work exactly like the website but as a native Android app!
