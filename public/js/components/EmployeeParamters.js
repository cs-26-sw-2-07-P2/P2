function saveParameters() {
    const name = document.getElementById("nameInput").value;
    const email = document.getElementById("emailInput").value;
    const phone = document.getElementById("phoneInput").value;
    const department = document.getElementById("departmentInput").value;

    if (!name || !email) {
        document.getElementById("statusMessage").textContent = "Please fill in your name and email.";
        return;
    } 

    const parameters = { name, email, phone, department };

    fetch("http://localhost:3000/employee/parameters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parameters)
    })
    .then(response => { 
        document.getElementById("statusMessage").textContent =
            response.ok ? "Saved!" : "Something went wrong.";
    })
    .catch(() => { 
        document.getElementById("statusMessage").textContent = "Could not reach the server.";
    });
}
