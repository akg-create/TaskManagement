// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaQdUC88_6-I8t0C0B0TzDCPXOrZ7QJmM",
  authDomain: "taskflow-f0704.firebaseapp.com",
  projectId: "taskflow-f0704",
  storageBucket: "taskflow-f0704.firebasestorage.app",
  messagingSenderId: "415346813355",
  appId: "1:415346813355:web:739918f2359c655eb40aee",
  measurementId: "G-JEGFDSHSPY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


///npm install firebase
