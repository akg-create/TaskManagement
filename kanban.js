import { db, auth } from './firebase-config.js';
import {
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { updateLastActive } from './utils.js';  

function setupDragAndDrop() {
  document.querySelectorAll('.task-container').forEach(container => {
    container.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      container.classList.add('drag-over');  
    });

    container.addEventListener('dragleave', e => {
      container.classList.remove('drag-over');  
    });

    container.addEventListener('drop', async e => {
      e.preventDefault();
      container.classList.remove('drag-over');  

      const taskId = e.dataTransfer.getData("text/plain");
      const newStatus = container.closest('.column').id;

      if (taskId && newStatus) {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { status: newStatus });

        await updateLastActive(); 
      }
    });
  });
}

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

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✖";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = async e => {
        e.stopPropagation();
        if (confirm("Delete this task?")) {
          await deleteDoc(doc(db, "tasks", taskId));

          await updateLastActive();  
        }
      };
      card.appendChild(deleteBtn);

      card.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", taskId);
        e.dataTransfer.effectAllowed = "move";
      });

      const container = document.querySelector(`#${task.status} .task-container`);
      if (container) container.appendChild(card);
    });

    setupDragAndDrop(); 
  });
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDocSnap = await getDoc(doc(db, "users", user.uid));
  const userData = userDocSnap.data();

  if (!userDocSnap.exists() || userData.active === false) {
    alert("Your account has been deactivated. Please contact the administrator.");
    await signOut(auth);
    window.location.href = "login.html";
    return;
  }

  loadTasks(user.uid);
  updateLastActive();
});

window.addTask = async function () {
  const title = prompt("Enter task title:");
  if (!title) return;

  await addDoc(collection(db, "tasks"), {
    title,
    status: "ToDo",
    user_id: auth.currentUser.uid,
    created_at: new Date()
  });

  await updateLastActive();  // <-- NEW: update user's last active time on adding task
};
