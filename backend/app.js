const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/admin", require("./src/routes/admin.routes"));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
console.log("Auth routes loaded");
console.log("Admin routes loaded");

module.exports = app;
