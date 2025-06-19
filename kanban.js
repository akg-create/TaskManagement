import { db, auth } from './firebase-config.js';
import {
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Load tasks for the logged-in user
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
  else loadTasks(user.uid);
});

// Load tasks and attach to DOM
async function loadTasks(uid) {
  const q = query(collection(db, "tasks"), where("user_id", "==", uid));
  onSnapshot(q, (snapshot) => {
    document.querySelectorAll(".task-container").forEach(el => el.innerHTML = "");

    snapshot.forEach(docSnap => {
      const task = docSnap.data();
      const taskId = docSnap.id;

      // Create task card
      const card = document.createElement("div");
      card.className = "task-card";
      card.draggable = true;
      card.dataset.id = taskId;
      card.innerText = task.title;

      // Drag start handler
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData("text/plain", taskId);
      });

      // Add delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "✖";
      deleteBtn.style.float = "right";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.onclick = async () => {
        if (confirm("Delete this task?")) {
          await deleteDoc(doc(db, "tasks", taskId));
        }
      };

      card.appendChild(deleteBtn);

      const columnId = task.status.replace(/\s+/g, "");
      const container = document.querySelector(`#${columnId} .task-container`);
      if (container) container.appendChild(card);
    });
  });
}

// Add a new task
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

// Drop logic for moving tasks between columns
document.querySelectorAll('.task-container').forEach(container => {
  container.addEventListener('dragover', (e) => e.preventDefault());

  container.addEventListener('drop', async (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const newStatus = container.parentElement.id;

    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status: newStatus });
  });
});
