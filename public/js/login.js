document.addEventListener("DOMContentLoaded", () => {
  let app = document.getElementById("app");
  renderLoginPage(app);
});

function renderLoginPage(container) { 
    container.innerHTML = 
    `<div class="auth">
  <form class="auth-card" id="loginForm">
    <h2>Welcome back</h2>
    <p class="auth-subtitle">Login to your account</p>

    <div class="form-group">
      <label for="username">Username</label>
      <input id="username" type="text" placeholder="Enter username" required />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input id="password" type="password" placeholder="Enter password" required />
    </div>

    <div class="form-options">
      <label class="checkbox">
        <input type="checkbox" checked />
        Remember me
      </label>
    </div>

    <button type="submit" class="btn-primary">Login</button>

    <button id="registerButton" type="button" class="btn-secondary">
      Create account
    </button>
  </form>
</div>`;

  document.getElementById("registerButton").addEventListener("click", () => {
  window.location.href = "/register";
  });
};

document.addEventListener("DOMContentLoaded", () =>
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Login Success");

      window.location.href = data.redirect;

    } else {
      alert(data.error);
      console.log("Login Failed!");
    }

  } catch (error) {
    console.error("Error:", error);
  }
}));