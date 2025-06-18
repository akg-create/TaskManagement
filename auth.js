document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = email.value;
  const password = password.value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => {
      console.log("User registered:", userCred.user.uid);
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
});
