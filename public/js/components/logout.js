export async function logout() {
    try {
        const response = await fetch("/logout", {
            method: "POST"
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Logout successful");

            window.location.href = data.redirect;
        } else {
            alert(data.error);
            console.log("Could not logout!");
        }
    } catch (error) {
        console.log("Error:", error)
    }
}