const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("node:path");
require("dotenv").config();
const prisma = require("./prismaClient");

const testusername = "P2";
const testpassword = "1234";

// Get users from prisma
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Serve all static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json()); // Important for json formatting (Loginpage)

// midlertidigt login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === testusername && password == testpassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// Routing
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/index.html"));
});
app.get("/employee", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/html/employeePages/employee.html")),
);
app.get("/manager", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/manager.html")),
);

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
