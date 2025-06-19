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

// Set up drag and drop event listeners
function setupDragAndDrop() {
  document.querySelectorAll('.task-container').forEach(container => {
    container.addEventListener('dragover', e => e.preventDefault());
    container.addEventListener('drop', async e => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData("text/plain");
      const newStatus = container.parentElement.id;  // Should be ToDo, InProgress, Done

      if (taskId && newStatus) {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { status: newStatus });
      }
    });
  });
}

// Load tasks and render them with delete and drag support
async function loadTasks(uid) {
  const q = query(collection(db, "tasks"), where("user_id", "==", uid));
  onSnapshot(q, snapshot => {
    document.querySelectorAll(".task-container").forEach(el => el.innerHTML = "");

    snapshot.forEach(docSnap => {
      const task = docSnap.data();
      const taskId = docSnap.id;

      const card = document.createElement("div");
      card.className = "task-card";
      card.draggable = true;
      card.dataset.id = taskId;
      card.textContent = task.title;

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✖";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = async e => {
        e.stopPropagation(); // prevent triggering drag or other events
        if (confirm("Delete this task?")) {
          await deleteDoc(doc(db, "tasks", taskId));
        }
      };
      card.appendChild(deleteBtn);

      // Drag start event
      card.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", taskId);
      });

      // Append to the right column (matching id exactly)
      const container = document.querySelector(`#${task.status} .task-container`);
      if (container) container.appendChild(card);
    });
  });
}

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
  else {
    loadTasks(user.uid);
    setupDragAndDrop();
  }
});

// Add a new task, always default to 'ToDo'
window.addTask = async function () {
  const title = prompt("Enter task title:");
  if (!title) return;

  await addDoc(collection(db, "tasks"), {
    title,
    status: "ToDo",
    user_id: auth.currentUser.uid,
    created_at: new Date()
  });
};

