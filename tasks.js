import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const taskTitleInput = document.getElementById("taskTitle");
  const statusInput = document.getElementById("status");

  const title = taskTitleInput.value.trim();
  const status = statusInput.value;
  const user = auth.currentUser;

  if (!user) return alert("You must be signed in to create a task.");
  if (!title) return alert("Task title cannot be empty.");

  try {
    await addDoc(collection(db, "tasks"), {
      title,
      status,  // this is now the actual value
      user_id: user.uid,
      created_at: serverTimestamp()
    });

    taskTitleInput.value = "";
    statusInput.value = "ToDo";
    document.getElementById("taskModal").classList.add("hidden");
  } catch (err) {
    alert("Error adding task: " + err.message);
  }
});
