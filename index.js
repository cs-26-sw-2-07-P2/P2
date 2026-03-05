const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("William er en Bot!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});