'use strict'

// placeholder data until backend is ready. Skal nok laves et fetch request til the server.
let teamMembers = [
    { name: "Alice", email: "alice@email.com", phone: "12345678", department: "YOUR MOM" },
    { name: "Bob", email: "bob@email.com", phone: "87654321", department: "YOUR MOM" },
    { name: "Clara", email: "clara@email.com", phone: "11223344", department: "YOUR MOM" }
];

document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < teamMembers.length; i++) {
        let memberDiv = document.createElement("div");
        memberDiv.className = "teamMember";
        memberDiv.innerHTML = 
            "<h3>" + teamMembers[i].name + "</h3>" +
            "<p>Email: " + teamMembers[i].email + "</p>" +
            "<p>Phone: " + teamMembers[i].phone + "</p>" +
            "<p>Department: " + teamMembers[i].department + "</p>";
        document.getElementById("teamContainer").appendChild(memberDiv);
    }
});