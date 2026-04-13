const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("node:path");
const session = require("express-session");
require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("./prismaClient");

app.use(express.json()); // Important for json formatting (Loginpage)

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Serve all static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../public")));

// Get users from prisma
app.get("/api/users", requireLogin, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      manager: true,
      createdAt: true
    }
  });

  res.json(users);
});

// Login functionality
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Look if user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid login" });
    }

    // compare password to username
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid login" });
    }

    // Create session
    req.session.user = {
      id: user.id,
      username: user.username,
      manager: user.manager,
    };

    if (user.manager) {
    res.json({ redirect: "/manager" });
    } else {
    res.json({ redirect: "/employee" });
  }

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user in DB
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        manager: Boolean(req.body.manager),
      },
    });

    res.json({ success: true, userId: user.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// requireLogin for session based routing
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
}

// requireRole for pages only available to specific roles
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/");
    }

    if (role === "manager" && !req.session.user.manager) {
      return res.status(403).send("Forbidden");
    }

    if (role === "employee" && req.session.user.manager) {
      return res.status(403).send("Forbidden");
    }

    next();
  };
}

// Routing
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/index.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/register.html"));
});
app.get("/employee", requireLogin, requireRole("employee"), (req, res) =>
  res.sendFile(path.join(__dirname, "../public/html/employeePages/employee.html")),
);
app.get("/employee/questionnaires", requireLogin, requireRole("employee"), (req, res) =>
  res.sendFile(path.join(__dirname, "../public/html/employeePages/employeeQuestionnaires.html")),
);
app.get("/manager", requireLogin, requireRole("manager"), (req, res) =>
  res.sendFile(path.join(__dirname, "../public/manager.html")),
);

// Destroy current session if logout is recieved
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
