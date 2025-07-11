// utils.js
import { auth, db } from './firebase-config.js';
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export async function updateLastActive() {
  const user = auth.currentUser;
  if (user) {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        lastActive: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to update lastActive:", err);
    }
  }
}
