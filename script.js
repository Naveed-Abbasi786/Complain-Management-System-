const firebaseConfig = {
  apiKey: "AIzaSyA3yLZAwBVmExHzjRyPfxdM0qTLdFqv0PU",
  authDomain: "smit-project-2e795.firebaseapp.com",
  databaseURL: "https://smit-project-2e795-default-rtdb.firebaseio.com",
  projectId: "smit-project-2e795",
  storageBucket: "smit-project-2e795.appspot.com",
  messagingSenderId: "384148425800",
  appId: "1:384148425800:web:772f4e6a6d0bbb5298dc7d",
  measurementId: "G-88WEKMVCEX",
};
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
console.log(fb.auth);
var database = firebase.database();


document.addEventListener("DOMContentLoaded", function () {
  fetchComplaintStatus();
});

function sign() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;
   // Check if any of the fields is empty
   if (!name || !email || !pass) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  // Check if email is valid
  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Check if password is at least 6 characters long
  if (pass.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      window.location.assign("sign-up.html");
      console.log(user);
      alert("Thanks for Sign in");
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // alert("plis Check the Correct Email,Password")
      alert(errorMessage)
      console.log(errorMessage);
      // ..
    });

  // databse sign save the database
  obj = {
    name: name,
    email: email,
    password: pass,
  };
  fb.database().ref("email/").push(obj);
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  // Function to validate email address format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
}

// sign up

function sin_up() {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  // Check if any of the fields is empty
  if (!email || !pass) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  // Check if email is valid
  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Check if password is at least 6 characters long
  if (pass.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  // Sign in with Firebase authentication
  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      window.location.assign("complan.html");
      console.log(user);
      alert("Go To Complaint Panel");
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
        alert("Please check the provided email and password.");
      console.log(errorMessage);
    });
}

// Function to validate email address format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



// Complain panel user

async function sub(){
  let nam = document.getElementById("name").value;
  let fth = document.getElementById("father").value;
  let crs = document.getElementById("course").value;
  let bth = document.getElementById("batch").value;
  let com = document.getElementById("com").value;
  let sub_btn = document.getElementById("Sumbit-btn-2");
  sub_btn.style = "Background:white;color:yellow";
  let key = fb.database().ref("complain").push().key;
  if (!nam || !fth || !crs || !bth || !com) {
    alert("Please fill in all fields before submitting.");
    return; 
  }
  let dataobj = {
    name: nam,
    father: fth,
    course: crs,
    batch: bth,
    complain: com,
    key: key,
  };

  fb.database().ref("complain").child(key).set(dataobj);
}
function chek() {
  window.location.assign("Status.html");
}
function stats() {
  window.location.assign("Status.html");
}

// admin panel

// Fetch complaints and display them in the table
firebase.database().ref("complain").on("child_added", (snapshot) => {
  let complaintId = snapshot.key;
  let data = snapshot.val();

  // Create table row
  let table = document.getElementById("table");
  if (!table) {
    console.error("Table element not found");
    return;
  }

  let tr = document.createElement("tr");
  tr.id = complaintId;

  // Creating table cells and buttons
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");
  let td4 = document.createElement("td");
  let td5 = document.createElement("td");
  let td6 = document.createElement("td");
  let td7 = document.createElement("td");

  td1.textContent = data.name;
  td2.textContent = data.father;
  td3.textContent = data.course;
  td4.textContent = data.batch;
  td5.textContent = data.complain;

  let solvedButton = document.createElement("button");
  solvedButton.textContent = "Solved";
  solvedButton.className = "Solved";
  solvedButton.onclick = function() {
    let status = "Solved";
    updateStatus(complaintId, status, solvedButton);
  };

  let rejectedButton = document.createElement("button");
  rejectedButton.textContent = "Rejected";
  rejectedButton.className = "Rejected";
  rejectedButton.onclick = function() {
    let status = "Rejected";
    updateStatus(complaintId, status, rejectedButton);
  };

  td6.appendChild(solvedButton);
  td7.appendChild(rejectedButton);

  // Appending cells to row
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tr.appendChild(td5);
  tr.appendChild(td6);
  tr.appendChild(td7);

  table.appendChild(tr);

  // Store the complaint ID in local storage to mark it as added
  localStorage.setItem(complaintId, true);
});

// Function to update complaint status
function updateStatus(complaintId, status, button) {
  firebase.database().ref("complain/" + complaintId).update({
    status: status
  }).then(() => {
    console.log("Complaint status updated successfully.");
    button.disabled = true;
    button.style.opacity = 0.5;
  }).catch((error) => {
    console.error("Error updating complaint status:", error);
  });
}

// Function to fetch and display complaint status
function fetchComplaintStatus() {
  firebase.database().ref("complain").on("child_added", (snapshot) => {
    const { name, status } = snapshot.val();
    if (status) {
     let compl =document.getElementById("complaintStatus");
     compl.innerHTML = `<p>${name} ${status}</p>`;
    }
  });
}

document.addEventListener("DOMContentLoaded", fetchComplaintStatus);



