document.addEventListener("DOMContentLoaded", () => {
  let app = document.getElementById("app");

  renderRegisterPage(app);
});

function renderRegisterPage(container) {
    container.innerHTML = 
    `<div id="registerBody">
    <form id="registerForm">
      <h2>Register</h2>
      <label for="username"><b>Username</b></label>
      <input
        id="username"
        type="text"
        placeholder="Enter Username"
        name="username"
        required
      />

      <label for="password"><b>Password</b></label>
      <input
        id="password"
        type="password"
        placeholder="Enter Password"
        name="password"
        required
      />

      <label for="password"><b>Confirm Password</b></label>
      <input id="confirmPassword" type="password" placeholder="Confirm password" />

      <label><input type="checkbox" id="isManager" />Register as manager</label>

      <button type="submit">Register</button>
    </form>
    </div>`;
};

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const isManager = document.getElementById("isManager").checked;

  if (password !== confirmPassword) {
    alert("Passwords are not the same!");
    return;
  }

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, manager: isManager }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Successfully registered!");
      window.location.href = "/";
    } else {
      console.log(data.error || "Failed to register!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});