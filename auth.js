// auth.js
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  const username = document.getElementById('registerUsername').value.trim();

  if (!username || !email || !password) {
    alert("Please fill out all registration fields.");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCred.user.uid), {
      username,
      email,
      isAdmin: false,
      active: true,
      lastActive: serverTimestamp(),
      lastLogin: serverTimestamp()
    });

    alert('Registration successful! Redirecting to dashboard...');
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (err) {
    console.error("Registration error:", err);
    alert("Registration failed: " + err.message);
  }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, "users", userCred.user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      alert("User record not found in database.");
      await signOut(auth);
      return;
    }

    const userData = userDocSnap.data();

    if (userData.active === false) {
      alert("Your account has been deactivated. Please contact the administrator.");
      await signOut(auth);
      return;
    }

    await updateDoc(userDocRef, {
      lastLogin: serverTimestamp(),
      lastActive: serverTimestamp()
    });

    const isAdmin = userData.isAdmin === true;
    window.location.href = isAdmin ? "admin-panel.html" : "dashboard.html";

  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed: " + err.message);
  }
});

// Logout
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

