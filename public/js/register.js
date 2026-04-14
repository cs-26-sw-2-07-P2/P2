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