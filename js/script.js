function selectRole(role) {
  document.querySelectorAll(".role-option").forEach((option) => {
    option.classList.remove("selected");
  });

  const selectedOption = event.currentTarget;
  selectedOption.classList.add("selected");
  document.getElementById(role).checked = true;
}

// Authorized users with their roles
const authorizedUsers = {
  'brocalrhiankate@gmail.com': 'teacher',
  'edrichjumaoas@gmail.com': 'registrar',
  'liganellakatrina@gmail.com': 'teacher',
  'nathanaudleybasas@gmail.com': 'teacher'
};

const correctPassword = 'CCCS2026';

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("username").value.toLowerCase().trim();
  const password = document.getElementById("password").value;
  const role = document.querySelector('input[name="role"]:checked');

  if (!role) {
    alert("Please select your role (Teacher or Registrar)");
    return;
  }

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  // Check password
  if (password !== correctPassword) {
    alert("Incorrect password. Please try again.");
    return;
  }

  // Check if email is authorized
  if (!authorizedUsers.hasOwnProperty(email)) {
    alert("Access denied. This email is not authorized to access the system.");
    return;
  }

  // Check if the selected role matches the authorized role
  const authorizedRole = authorizedUsers[email];
  if (role.value !== authorizedRole) {
    alert(`Access denied. This email is authorized as ${authorizedRole}, not ${role.value}.`);
    return;
  }

  // Redirect based on role
  if (role.value === "teacher") {
    window.location.href = "html/teacher-dashboard.html";
  } else {
    window.location.href = "html/registrar-dashboard.html";
  }
});
