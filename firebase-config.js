// firebase-config.js

// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaQdUC88_6-I8t0C0B0TzDCPXOrZ7QJmM",
  authDomain: "taskflow-f0704.firebaseapp.com",
  projectId: "taskflow-f0704",
  storageBucket: "taskflow-f0704.firebasestorage.app",
  messagingSenderId: "415346813355",
  appId: "1:415346813355:web:739918f2359c655eb40aee",
  measurementId: "G-JEGFDSHSPY"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export them so `auth.js` can use them
export { auth, db };
