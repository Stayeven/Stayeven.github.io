# Grading System

A web-based grading system for teachers and registrars with Firebase integration.

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

## Troubleshooting
- Clear browser cache if changes don't appear
- Check browser console for errors
- Ensure Firebase configuration is correct in `js/firebase-config.js`
