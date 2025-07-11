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
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const username = document.getElementById('registerUsername').value;

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", userCred.user.uid), {
    username,
    email,
    active: true,        
    lastActive: null     
  });
  alert('Registration successful! Redirecting to dashboard...');
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1500); 
}); 

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const userDocRef = doc(db, "users", userCred.user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      alert("User record not found.");
      return;
    }

    const userData = userDocSnap.data();

    // Block login if user is deactivated
    if (userData.active === false) {
      alert("Your account has been deactivated. Please contact the administrator.");
      return;
    }

    // Log last login timestamp
    await updateDoc(userDocRef, {
      lastLogin: serverTimestamp()
    });

    const isAdmin = userData.isAdmin === true;

    if (isAdmin) {
      const goToAdmin = confirm("You're logged in as Admin. Go to Admin Panel?");
      if (goToAdmin) {
        window.location.href = "admin-panel.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } else {
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    alert("Login failed: " + err.message);
  }
});

// Logout
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};
