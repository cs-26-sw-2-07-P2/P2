document.addEventListener("DOMContentLoaded", () => {
  let app = document.getElementById("app");
  renderLoginPage(app);
});

function renderLoginPage(container) {
    container.innerHTML = 
    `<div id="loginBody">
    <form id="loginForm">
      <h2>Login</h2>
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

      <button type="submit">Login</button>
      <button id="registerButton" type="button">Register</button>
      <label>
        <input type="checkbox" checked="checked" name="remember" /> Remember me?
      </label>
    </form>
    </div>`;

  document.getElementById("registerButton").addEventListener("click", () => {
  window.location.href = "/register";
  });
};

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
});
document.getElementById("registerButton").addEventListener("click", () => {
  window.location.href = "/register";
});