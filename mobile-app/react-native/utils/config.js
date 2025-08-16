// App Configuration
export const APP_CONFIG = {
  // Web App URL
  webAppUrl: 'https://debtguardian.onrender.com/',
  
  // App Info
  appName: 'DebtGuardian',
  appVersion: '1.0.0',
  
  // Colors (should match your web app theme)
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af',
  backgroundColor: '#f8f9fa',
  errorColor: '#dc3545',
  successColor: '#28a745',
  
  // App Store Info
  bundleId: {
    ios: 'com.debtguardian.app',
    android: 'com.debtguardian.app',
  },
  
  // Deep Link Configuration
  scheme: 'debtguardian',
  host: 'debtguardian.onrender.com',
  
  // Features Toggle
  features: {
    pushNotifications: false, // Enable when ready
    biometricAuth: false,     // Enable when ready
    offlineMode: false,       // Enable when ready
    analytics: false,         // Enable when ready
  },
  
  // Network Configuration
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  
  // App Store URLs (update when published)
  storeUrls: {
    ios: 'https://apps.apple.com/app/debtguardian/id123456789',
    android: 'https://play.google.com/store/apps/details?id=com.debtguardian.app',
  },
  
  // Support
  supportEmail: 'support@debtguardian.com',
  websiteUrl: 'https://debtguardian.onrender.com',
};
