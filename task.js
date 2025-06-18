document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskTitle.value;
  const status = status.value;

  const user = auth.currentUser;
  if (!user) return alert("Not signed in!");

  await db.collection("users")
    .doc(user.uid)
    .collection("tasks")
    .add({ title, status, createdAt: firebase.firestore.Timestamp.now() });
});
