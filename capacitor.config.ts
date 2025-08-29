import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fimax.appug',
  appName: 'FIMAX APP UG',
  webDir: 'build',
  plugins: {
    Downloader: {}
  }
};

export default config;
