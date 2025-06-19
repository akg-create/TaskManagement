import { collection, doc, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskTitle.value;
  const status = status.value;

  const user = auth.currentUser;
  if (!user) return alert("Not signed in!");

  const userTasksCollection = collection(doc(db, "users", user.uid), "tasks");

  await addDoc(userTasksCollection, {
    title,
    status,
    createdAt: serverTimestamp()
  });
});
