const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const projectsRoutes = require("./modules/projects/projects.routes");
const servicesRoutes = require("./modules/services/services.routes");
const projectRequestsRoutes = require("./modules/projectRequests/projectRequests.routes");
const profileRoutes = require("./modules/profile/profile.routes");
const notificationsRoutes = require("./modules/notifications/notifications.routes");
const userManagementRoutes = require(
    "./modules/userManagement/userManagement.routes"
);
const feedbackRoutes = require("./modules/feedback/feedback.routes");
const reportsRoutes = require("./modules/reports/reports.routes");
const chatbotRoutes = require("./modules/chatbot/chatbot.routes");




const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Vyronix API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/project-requests", projectRequestsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/admin/users", userManagementRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin/reports", reportsRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use(errorMiddleware);

module.exports = app;