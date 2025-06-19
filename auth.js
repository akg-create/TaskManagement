import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const username = document.getElementById('registerUsername').value;

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", userCred.user.uid), {
    username,
    email
  });
  alert('Registration successful! Redirecting to dashboard...');
  setTimeout(() => {
    window.location.href = "dashboard.html";
}, 1500);

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  await signInWithEmailAndPassword(auth, email, password);
  window.location.href = "dashboard.html";
});

// Logout
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};
 
