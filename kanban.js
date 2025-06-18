import { db, auth } from './firebase-config.js';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
  else loadTasks(user.uid);
});

async function loadTasks(uid) {
  const q = query(collection(db, "tasks"), where("user_id", "==", uid));
  onSnapshot(q, (snapshot) => {
    document.querySelectorAll(".task-container").forEach(el => el.innerHTML = "");
    snapshot.forEach(doc => {
      const task = doc.data();
      const card = document.createElement("div");
      card.className = "task-card";
      card.innerText = task.title;
      document.querySelector(`#${task.status.replace(" ", "")} .task-container`).appendChild(card);
    });
  });
}

window.addTask = async function (status) {
  const title = prompt("Task title:");
  if (!title) return;
  await addDoc(collection(db, "tasks"), {
    title,
    status,
    user_id: auth.currentUser.uid,
    created_at: new Date()
  });
};
