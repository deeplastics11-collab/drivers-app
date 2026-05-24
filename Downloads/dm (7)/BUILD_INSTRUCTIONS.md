# DeeMech Pro - Mobile Build Instructions

This project uses **Vite** and **Capacitor** to compile your React web app into native installable applications for both **Android** and **iOS**.

## Prerequisites
1. **Node.js** installed on your machine.
2. **Android Studio** (for building the Android APK/AAB).
3. **Xcode** (for building the iOS App - Requires a Mac).

## How to Build the App

### 1. Install Dependencies
Run this in your terminal to ensure everything is downloaded:
```bash
npm install
npm install @capacitor/ios
npx cap add ios
```

### 2. Build the Web Assets
Before compiling to mobile, you must build the production web files:
```bash
npm run build
```

### 3. Sync to Native Platforms
Copy the built web assets into the Android and iOS folders:
```bash
npx cap sync
```

### 4. Open and Compile Android
```bash
npx cap open android
```
- This will launch **Android Studio**.
- Wait for Gradle to finish syncing.
- Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate your Android installable file.

### 5. Open and Compile iOS (Mac Only)
```bash
npx cap open ios
```
- This will launch **Xcode**.
- Select your developer account/signing certificate.
- Select your target device (or "Any iOS Device").
- Go to **Product > Archive** to build the app for the App Store.

## Freemium Mechanics
- The free version now defaults to a limited toolset (Quick Specs, Unit Converter, Part Finder).
- Premium tools (Smart Assist, Failure Prediction, Visual Scan, Labor Guide, etc.) have built-in lock gates on the Dashboard.
- When accessed, users are redirected to the `PremiumUpgrade` screen.
- You can hook up real in-app purchases by replacing `upgradeUserPremium` in `PremiumUpgrade.tsx` with RevenueCat or Capacitor native purchase hooks.