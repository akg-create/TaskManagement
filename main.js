const user = auth.currentUser;
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    const uid = user.uid;
    loadTasks(uid);
    
    document.getElementById("taskForm").addEventListener("submit", e => {
      e.preventDefault();
      const taskName = document.getElementById("taskName").value;
      db.collection("tasks").add({
        name: taskName,
        status: "todo",
        uid: uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      document.getElementById("taskForm").reset();
    });
  }
});

function loadTasks(uid) {
  db.collection("tasks").where("uid", "==", uid).onSnapshot(snapshot => {
    ['todo', 'inprogress', 'done'].forEach(id => {
      document.getElementById(id).innerHTML = `<h3>${id.replace(/^\w/, c => c.toUpperCase())}</h3>`;
    });
    snapshot.forEach(doc => {
      const task = doc.data();
      const div = document.createElement("div");
      div.textContent = task.name;
      div.draggable = true;
      div.dataset.id = doc.id;
      div.className = "task-card";
      document.getElementById(task.status).appendChild(div);
    });
  });
}

document.addEventListener("dragstart", e => {
  e.dataTransfer.setData("text/plain", e.target.dataset.id);
});
document.querySelectorAll(".column").forEach(col => {
  col.addEventListener("dragover", e => e.preventDefault());
  col.addEventListener("drop", e => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const newStatus = col.id;
    db.collection("tasks").doc(taskId).update({ status: newStatus });
  });
});
