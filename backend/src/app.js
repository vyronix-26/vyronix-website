const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const projectsRoutes = require("./modules/projects/projects.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Vyronix API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);

app.use(errorMiddleware);

module.exports = app;