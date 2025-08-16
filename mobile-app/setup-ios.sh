#!/bin/bash

echo "🍎 iOS Setup for DebtGuardian React Native App"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ iOS development is only available on macOS${NC}"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "ios" ]; then
    echo -e "${RED}❌ Please run this from the React Native project root${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 iOS-specific setup for DebtGuardian...${NC}"

# Install iOS dependencies
echo -e "${YELLOW}📦 Installing CocoaPods dependencies...${NC}"
cd ios
pod install
cd ..

# Update iOS project configuration
echo -e "${YELLOW}⚙️  Updating iOS configuration...${NC}"

# Create iOS-specific config
cat > ios/DebtGuardianApp/Info.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleDisplayName</key>
    <string>DebtGuardian</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSExceptionDomains</key>
        <dict>
            <key>localhost</key>
            <dict>
                <key>NSExceptionAllowsInsecureHTTPLoads</key>
                <true/>
            </dict>
            <key>debtguardian.onrender.com</key>
            <dict>
                <key>NSExceptionRequiresForwardSecrecy</key>
                <false/>
                <key>NSExceptionMinimumTLSVersion</key>
                <string>TLSv1.0</string>
                <key>NSIncludesSubdomains</key>
                <true/>
            </dict>
        </dict>
    </dict>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>DebtGuardian needs location access to provide location-based financial services.</string>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
</dict>
</plist>
EOF

echo -e "${GREEN}✅ Info.plist updated${NC}"

# Create launch screen
echo -e "${YELLOW}🎨 Setting up launch screen...${NC}"

cat > ios/DebtGuardianApp/LaunchScreen.storyboard << 'EOF'
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="7702" systemVersion="14D136" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES">
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="7701"/>
    </dependencies>
    <scenes>
        <!--View Controller-->
        <scene sceneID="EHf-IW-A2E">
            <objects>
                <viewController id="01J-lp-oVM" sceneMemberID="viewController">
                    <layoutGuides>
                        <viewControllerLayoutGuide type="top" id="Llm-lL-Icb"/>
                        <viewControllerLayoutGuide type="bottom" id="xb3-aO-Qok"/>
                    </layoutGuides>
                    <view key="view" contentMode="scaleToFill" id="Ze5-6b-2t3">
                        <rect key="frame" x="0.0" y="0.0" width="375" height="667"/>
                        <autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/>
                        <subviews>
                            <label opaque="NO" clipsSubviews="YES" userInteractionEnabled="NO" contentMode="left" horizontalHuggingPriority="251" verticalHuggingPriority="251" text="DebtGuardian" textAlignment="center" lineBreakMode="middleTruncation" baselineAdjustment="alignBaselines" minimumFontSize="18" translatesAutoresizingMaskIntoConstraints="NO" id="GJd-Yh-RWb">
                                <rect key="frame" x="0.0" y="202" width="375" height="43"/>
                                <fontDescription key="fontDescription" type="boldSystem" pointSize="36"/>
                                <color key="textColor" red="0.0" green="0.0" blue="0.0" alpha="1" colorSpace="calibratedRGB"/>
                                <nil key="highlightedColor"/>
                            </label>
                        </subviews>
                        <color key="backgroundColor" red="1" green="1" blue="1" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
                        <constraints>
                            <constraint firstItem="GJd-Yh-RWb" firstAttribute="centerX" secondItem="Ze5-6b-2t3" secondAttribute="centerX" id="QLY-1N-Y0W"/>
                            <constraint firstItem="GJd-Yh-RWb" firstAttribute="centerY" secondItem="Ze5-6b-2t3" secondAttribute="centerY" constant="-100" id="moa-c2-u7t"/>
                            <constraint firstItem="GJd-Yh-RWb" firstAttribute="leading" secondItem="Ze5-6b-2t3" secondAttribute="leading" id="x7j-FC-K8j"/>
                        </constraints>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="iYj-Kq-Ea1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="53" y="375"/>
        </scene>
    </scenes>
</document>
EOF

echo -e "${GREEN}✅ Launch screen created${NC}"

# Instructions for Xcode
echo -e "${GREEN}🎉 iOS setup complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps in Xcode:${NC}"
echo "1. Open: ios/DebtGuardianApp.xcworkspace"
echo "2. Select your development team for code signing"
echo "3. Update Bundle Identifier to: com.debtguardian.app"
echo "4. Add app icons (1024x1024 for App Store, various sizes for devices)"
echo "5. Test on simulator: npx react-native run-ios"
echo ""
echo -e "${YELLOW}🚀 To run:${NC}"
echo "npx react-native run-ios"
echo "npx react-native run-ios --simulator=\"iPhone 15 Pro\""
echo ""
echo -e "${YELLOW}📱 For physical device:${NC}"
echo "1. Connect iPhone via USB"
echo "2. Trust the developer in iPhone Settings"
echo "3. npx react-native run-ios --device"
