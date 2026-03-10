# Firebase Setup Guide

To enable cross-device data syncing, follow these steps:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "grading-system")
4. Disable Google Analytics (optional)
5. Click "Create project"

## 2. Set Up Realtime Database

1. In your Firebase project, click "Realtime Database" in the left menu
2. Click "Create Database"
3. Choose location (closest to your users)
4. Start in **test mode** (we'll secure it later)
5. Click "Enable"

## 3. Get Your Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register your app (name it anything)
6. Copy the `firebaseConfig` object

## 4. Update Your Code

1. Open `js/firebase-config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

## 5. Secure Your Database (Important!)

1. Go back to "Realtime Database" in Firebase Console
2. Click the "Rules" tab
3. Replace the rules with:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Note:** These rules allow anyone to read/write. For production, you should add authentication.

## 6. Test It!

1. Push your code to GitHub
2. Open your site on one device and add some grades
3. Open the same site on another device
4. The grades should appear automatically!

## How It Works

- Data is saved to both localStorage (backup) and Firebase (cloud)
- When loading, it checks Firebase first, then falls back to localStorage
- If Firebase is not configured, it works offline with localStorage only
- All devices sync automatically through Firebase

## Free Tier Limits

Firebase free tier includes:
- 1 GB stored data
- 10 GB/month downloaded data
- 100 simultaneous connections

This is more than enough for a school grading system!

## Troubleshooting

**Data not syncing?**
- Check browser console (F12) for errors
- Verify Firebase config is correct
- Make sure database rules allow read/write
- Check your internet connection

**Still using localStorage?**
- If Firebase config has placeholder values, it falls back to localStorage
- This means data won't sync across devices
- Update the config in `js/firebase-config.js`
