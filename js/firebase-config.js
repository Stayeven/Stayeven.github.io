// Firebase configuration for cloud data storage
// This allows grades to sync across different devices

// Firebase configuration - Replace with your own Firebase project credentials
// Get these from: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyBb0B9U62L70aIlZf4OFbwIlh1Uy9pBygE",
  authDomain: "grading-system-ad597.firebaseapp.com",
  databaseURL: "https://grading-system-ad597-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "grading-system-ad597",
  storageBucket: "grading-system-ad597.firebasestorage.app",
  messagingSenderId: "270157910575",
  appId: "1:270157910575:web:fff439c7eac1040e616cda"
};

// Initialize Firebase
let database = null;
let isFirebaseConfigured = false;

function initFirebase() {
    // Check if Firebase config is set
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.warn('Firebase not configured. Using localStorage only (data won\'t sync across devices).');
        return false;
    }
    
    try {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        isFirebaseConfigured = true;
        console.log('Firebase initialized successfully!');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Save data to Firebase
function saveToFirebase(key, data) {
    if (!isFirebaseConfigured) {
        return Promise.resolve(); // Silently skip if not configured
    }
    
    return database.ref(key).set(data)
        .then(() => {
            console.log('Data saved to Firebase:', key);
        })
        .catch((error) => {
            console.error('Error saving to Firebase:', error);
        });
}

// Load data from Firebase
function loadFromFirebase(key) {
    if (!isFirebaseConfigured) {
        return Promise.resolve(null);
    }
    
    return database.ref(key).once('value')
        .then((snapshot) => {
            return snapshot.val();
        })
        .catch((error) => {
            console.error('Error loading from Firebase:', error);
            return null;
        });
}

// Delete data from Firebase
function deleteFromFirebase(key) {
    if (!isFirebaseConfigured) {
        return Promise.resolve();
    }
    
    return database.ref(key).remove()
        .catch((error) => {
            console.error('Error deleting from Firebase:', error);
        });
}

// Initialize on page load
initFirebase();
