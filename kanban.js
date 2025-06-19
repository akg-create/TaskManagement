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

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
  else {
    loadTasks(user.uid);
    setupDragAndDrop();
  }
});

async function loadTasks(uid) {
  const q = query(collection(db, "tasks"), where("user_id", "==", uid));
  onSnapshot(q, (snapshot) => {
    document.querySelectorAll(".task-container").forEach(el => el.innerHTML = "");

    snapshot.forEach(docSnap => {
      const task = docSnap.data();
      const taskId = docSnap.id;

      const card = document.createElement("div");
      card.className = "task-card";
      card.draggable = true;
      card.dataset.id = taskId;

      // Task title
      const title = document.createElement("span");
      title.innerText = task.title;

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "✖";
      deleteBtn.style.float = "right";
      deleteBtn.onclick = async () => {
        if (confirm("Delete this task?")) {
          await deleteDoc(doc(db, "tasks", taskId));
        }
      };

      card.appendChild(title);
      card.appendChild(deleteBtn);

      // Drag events
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData("text/plain", taskId);
      });

      const containerId = task.status.replace(/\s+/g, "");
      const container = document.querySelector(`#${containerId} .task-container`);
      if (container) container.appendChild(card);
    });
  });
}

// Add new task to "To Do"
window.addTask = async function () {
  const title = prompt("Task title:");
  if (!title) return;
  await addDoc(collection(db, "tasks"), {
    title,
    status: "ToDo",
    user_id: auth.currentUser.uid,
    created_at: new Date()
  });
};

// Setup drag-and-drop listeners
function setupDragAndDrop() {
  document.querySelectorAll('.task-container').forEach(container => {
    container.addEventListener('dragover', (e) => e.preventDefault());
    container.addEventListener('drop', async (e) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      const newStatus = container.parentElement.id;

      await updateDoc(doc(db, "tasks", taskId), {
        status: newStatus
      });
    });
  });
}
