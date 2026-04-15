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