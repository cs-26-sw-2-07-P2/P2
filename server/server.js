const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("node:path");
require("dotenv").config();

const testusername = "P2";
const testpassword = "1234";

// Serve all static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json()); // Important for json formatting (Loginpage)

// Attempt to load database if USE_DB=true
let pool = null;
const useDb = process.env.USE_DB === "true";

if (useDb) {
  try {
    pool = require("./db"); // only require db if USE_DB
    console.log("Database module loaded.");
  } catch (err) {
    console.warn("Database not available. Running in frontend-only mode.");
  }
}

// API route: only enable real queries if pool exists
app.get("/api/users", async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: "Database not connected yet" });
  }

  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

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
