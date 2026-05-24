# DeeMech Pro - Live OTA (Over-The-Air) Updates

To bypass the iOS App Store and Android Google Play review processes for UI and bug fixes, the application now utilizes **Capgo's Capacitor Updater**.

### 1. Setup Capgo CLI
You need to install the Capgo CLI globally to send updates from your command line:
```bash
npm install -g @capgo/cli
```

### 2. Login & Add App
In your terminal, login to Capgo and attach this project:
```bash
npx @capgo/cli login
npx @capgo/cli app add
```
*(Follow the prompts to link your account and app bundle ID, e.g., `com.deemech.pro`)*

### 3. Push an OTA Update to All Users
When you make changes to the React code (`.tsx`, `.css`, or AI Prompts in `geminiService.ts`), you can instantly deploy those changes to users' phones.

1. Build your new web assets first:
   ```bash
   npm run build
   ```
2. Upload the new code directly to Capgo's servers to distribute to devices:
   ```bash
   npx @capgo/cli bundle upload
   npx @capgo/cli bundle set
   ```

### How it works inside the App:
- In `App.tsx`, we added `CapacitorUpdater.notifyAppReady();`. This tells the OTA engine that the new code successfully booted without crashing.
- Whenever a user opens the app, the plugin automatically checks the Capgo server in the background for your latest uploaded bundle. 
- The next time the user restarts the app, their phone instantly swaps to the new code without ever downloading an update from the App Store!

*Note: Native plugin changes (like adding a new Capacitor camera or bluetooth plugin to `package.json`) still require you to build a new APK/IPA and do a full App Store update.*