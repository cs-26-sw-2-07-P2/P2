document.addEventListener("DOMContentLoaded", () => {
  let app = document.getElementById("app");

  renderRegisterPage(app);

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
});

function renderRegisterPage(container) {
    container.innerHTML = 
    `<div class="auth">
  <form class="auth-card" id="registerForm">
    <h2>Create account</h2>
    <p class="auth-subtitle">Get started in seconds</p>

    <div class="form-group">
      <label>Username</label>
      <input id="username" type="text" placeholder="Enter username" required />
    </div>

    <div class="form-group">
      <label>Password</label>
      <input id="password" type="password" placeholder="Enter password" required />
    </div>

    <div class="form-group">
      <label>Confirm password</label>
      <input id="confirmPassword" type="password" placeholder="Confirm password" />
    </div>

    <label class="checkbox">
      <input type="checkbox" id="isManager" />
      Register as manager
    </label>

    <button type="submit" class="btn-primary">Register</button>
  </form>
</div>`;
};