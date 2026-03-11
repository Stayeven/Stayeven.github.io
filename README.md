# Grading System

A web-based grading system for teachers and registrars with Firebase integration.

## Documentation

### For Users:

- **[Complete User Guide](docs/USER-GUIDE.md)** - Detailed guide in English
- **[Encoding Steps (Visual)](docs/ENCODING-STEPS.txt)** - Step-by-step visual guide

### For Developers:

- **[Firebase Setup](FIREBASE_SETUP.md)** - Firebase configuration guide

## Features

- Role-based login (Teacher/Registrar)
- Grade management by section, subject, and quarter
- Firebase cloud sync
- Notification system for registrars

## GitHub Pages Deployment

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set Source to "Deploy from a branch"
4. Select branch: `main` (or `master`)
5. Select folder: `/ (root)`
6. Click Save

Your site will be available at: `https://username.github.io/repository-name/`

## Login Credentials

- Password: `CCCS2026`
- Authorized users are configured in `js/script.js`

## Local Development

Simply open `index.html` in a browser or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

## Firebase Connection Test

Open `firebase-test.html` in your browser to verify Firebase is working:

- Tests Firebase SDK loading
- Tests database connection
- Tests read/write permissions
- Shows detailed error messages

## Troubleshooting

### Firebase Not Connecting

1. Open `firebase-test.html` to diagnose the issue
2. Check browser console (F12) for error messages
3. Verify Firebase configuration in `js/firebase-config.js`
4. Check Firebase database rules (should allow read/write for testing)
5. Ensure internet connection is active

### Grades Not Saving

1. Open browser console (F12) and look for:
   - ✅ "Saved to Firebase successfully" (good)
   - ❌ "Firebase save failed" (problem)
2. Run `firebase-test.html` to check connection
3. Check Firebase Console for data at: `https://console.firebase.google.com/`

### GitHub Pages Issues

- Clear browser cache if changes don't appear
- Wait 2-3 minutes after pushing for GitHub Pages to rebuild
- Check that `.nojekyll` file exists in root
- Open `test.html` on your deployed site to check file loading
