const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("node:path");
const session = require("express-session");
require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("./prismaClient");

// Variables
const dev_mode = false; // only for development
const SINGLETON_ID = 1; // id for questionnaire

app.use(express.json()); // Important for json formatting (Loginpage)

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// Serve all static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../public")));

// Get users from prisma
app.get("/api/users", requireLogin, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
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
      role: user.role,
    };

    if (user.role == "MANAGER") {
      res.json({ redirect: "/manager" });
    } else {
      res.json({ redirect: "/employee" });
    }
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Destroy current session if logout is recieved
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true, redirect: "/" });
});

app.post("/register", async (req, res) => {
  const { username, password, manager } = req.body;

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

    // Justify role
    const role = manager ? "MANAGER" : "EMPLOYEE";

    // create user in DB
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    // create role-specific profile
    await createRoleProfile(user);

    res.json({ success: true, userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Handles Employee and Manager role seperation
async function createRoleProfile(user) {
  if (user.role === "MANAGER") {
    return prisma.manager.create({ data: { userId: user.id } });
  }

  return prisma.employee.create({ data: { userId: user.id } });
}

// Fetch parameters from DB
app.get("/api/parameters", async (req, res) => {
  try {
    const parameters = await prisma.parameter.findMany();
    res.json({ parameters });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parameters" });
  }
});

// Send and update parameters in DB
app.post("/api/parameters", async (req, res) => {
    const { parameters } = req.body;

    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  try {
    console.log("Test") // Insertion to add parameters in DB
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Failed to create parameters" });
  }
})

app.post("/api/jobs", async (req, res) => {
  const { name, parameters } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const job = await prisma.job.create({
      data: {
        name,
        parameters: {
          create: parameters.map(p => ({
            parameterId: p.parameterId,
            weight: p.weight
          }))
        }
      },
      include: {
        parameters: {
          include: {
            parameter: true
          }
        }
      }
    });

    res.json({ success: true, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create job" });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        parameters: {
          include: {
            parameter: true
          }
        }
      }
    });

    res.json({ jobs });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Creates or overrides sent questionnaires in DB
app.post("/api/questionnaires", async (req, res) => {
  const { title, questions } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const manager = await prisma.manager.findUnique({
      where: { userId: req.session.user.id },
    });

    if (!manager) {
      return res.status(403).json({ error: "Not a manager" });
    }

    // ensure singleton exists first
    const questionnaire = await prisma.questionnaire.upsert({
      where: { id: SINGLETON_ID },
      update: { title }, // If questionnaire already exists → only update title
      create: {
        id: SINGLETON_ID,
        title,
        createdById: manager.id,
      },
    });

    // Normalize incoming data
    // Convert datatypes (Prisma requirement)
    const normalized = questions.map(q => ({
      id: q.id ? Number(q.id) : null,
      text: q.text,
      parameterId: Number(q.parameterId),
    }));

    // Extract IDs that already exist in DB (for update/delete logic)
    const incomingIds = normalized
      .filter(q => q.id)
      .map(q => q.id);

    // Delete removed questions
    await prisma.question.deleteMany({
      where: {
        questionnaireId: SINGLETON_ID,
        id: {
          notIn: incomingIds.length ? incomingIds : [-1],
        },
      },
    });

    // Update existing questions
    await Promise.all(
      normalized
        .filter(q => q.id) // Only questions that already exist in DB
        .map(q =>
          prisma.question.update({
            where: { id: q.id },
            data: {
              text: q.text,
              parameterId: q.parameterId,
            },
          })
        )
    );

    // Create new questions
    await prisma.question.createMany({
      data: normalized
        .filter(q => !q.id) // Only new questions (no ID yet)
        .map(q => ({
          text: q.text,
          parameterId: q.parameterId,
          questionnaireId: SINGLETON_ID,
        })),
    });

    // Return updated result
    const updated = await prisma.questionnaire.findUnique({
      where: { id: SINGLETON_ID },
      include: { questions: true },
      // Fetch full updated questionnaire from DB
    });

    res.json({ success: true, questionnaire: updated });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create questionnaire" });
  }
});

// Allow you to get the current questionnaire
app.get("/api/questionnaires", async (req, res) => {
  try {
    const questionnaires = await prisma.questionnaire.findUnique({
    where: { id: SINGLETON_ID },
    include: { questions: true }
  });

    res.json({ success: true, questionnaires });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.post("/api/response", async (req, res) => {
  const { answers } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { userId: req.session.user.id },
    });

    if (!employee) {
      return res.status(403).json({ error: "Not an employee" });
    }

    const response = await prisma.response.upsert({
      where: {
        employeeId: employee.id,
      },
      update: {
        answers: {
          deleteMany: {}, // remove old answers
          create: answers.map(a => ({
            questionId: a.questionId,
            value: a.value,
          })),
        },
      },
      create: {
        employeeId: employee.id,
        answers: {
          create: answers.map(a => ({
            questionId: a.questionId,
            value: a.value,
          })),
        },
      },
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save responses" });
  }
});

app.get("/api/response", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { userId: req.session.user.id },
    });

    if (!employee) {
      return res.status(403).json({ error: "Not an employee" });
    }

    const response = await prisma.response.findUnique({
      where: {
        employeeId: employee.id, // unique field
      },
      include: {
        answers: true,
      },
    });

    res.json({ success: true, response });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch response" });
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
    if (!req.session.user) return res.redirect("/");

    if (req.session.user.role !== role) {
      return res.status(403).send("Forbidden");
    }

    next();
  };
}

// Get user (Used for navbar role)
app.get("/api/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    user: req.session.user
  });
});

// Get employee
app.get("/api/employee", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { userId: req.session.user.id },
    });

    res.json({ success: true, employee });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// Routing
const routes = [
  {
    path: "/",
    file: "index.html",
  },
  {
    path: "/register",
    file: "register.html",
  },
  {
    path: "/employee",
    file: "/employee.html",
    middleware: [requireLogin, requireRole("EMPLOYEE")],
  },
  {
    path: "/employee/questionnaires/selected",
    file: "employeePages/employeeSelectedQuestionnaire.html",
    middleware: [requireLogin, requireRole("EMPLOYEE")],
  },
  {
    path: "/manager",
    file: "/manager.html",
    middleware: [requireLogin, requireRole("MANAGER")],
  }
];

const htmlPath = (file) => path.join(__dirname, "../public/html", file);
const registerPageRoutes = (app, routes) => {
  routes.forEach(({ path: routePath, file, middleware = [] }) => {
    const appliedMiddleware = dev_mode ? [] : middleware;

    app.get(routePath, ...appliedMiddleware, (req, res) => {
      res.sendFile(htmlPath(file));
    });
  });
};
registerPageRoutes(app, routes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
