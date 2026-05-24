import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deemech.pro',
  appName: 'DeeMechPro',
  webDir: 'dist',
  plugins: {
    CapacitorUpdater: {
      updateUrl: 'https://raw.githubusercontent.com/deeplastics11-collab/drivers-app/main/update.json',
      autoUpdate: true,
    }
  }
};

export default config;
