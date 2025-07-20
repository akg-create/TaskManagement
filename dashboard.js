import { auth, db } from './firebase-config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  collection, getDocs, query, where, Timestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let userData = [];
let taskData = [];

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "login.html";
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists() || !userDoc.data().isAdmin) {
    alert("Access Denied");
    return location.href = "login.html";
  }

  await fetchData();
  renderCharts();
});

async function fetchData() {
  const usersSnap = await getDocs(collection(db, "users"));
  userData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const tasksSnap = await getDocs(collection(db, "tasks"));
  taskData = tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

function renderCharts() {
  // Example: Pie Chart - Active vs Inactive
  const activeCount = userData.filter(u => u.active).length;
  const inactiveCount = userData.length - activeCount;

  new Chart(document.getElementById("activeUserChart"), {
    type: 'pie',
    data: {
      labels: ['Active', 'Inactive'],
      datasets: [{
        data: [activeCount, inactiveCount],
        backgroundColor: ['#2ecc71', '#e74c3c'],
      }]
    }
  });

  // More chart logic (bar charts, line charts) will go here
}

window.logout = async function () {
  await signOut(auth);
  location.href = "login.html";
