/**
 * Notifications Routes
 *
 * This file defines all API endpoints related to user notifications.
 * It maps HTTP routes to their corresponding controller methods and
 * applies the required authentication and validation middleware.
 *
 * Available endpoints:
 * - GET    /            Retrieve all notifications for the authenticated user.
 * - PATCH  /:id/read    Mark a specific notification as read.
 * - PATCH  /read-all    Mark all notifications as read.
 *
 * Middleware flow:
 * 1. Authenticate the user.
 * 2. Validate route parameters (when applicable).
 * 3. Execute the corresponding controller action.
 *
 * Notes:
 * - All notification endpoints require authentication.
 * - Users can only access and modify their own notifications.
 * - Ownership checks are handled in the service layer.
 */

const express = require("express");

const notificationsController = require("./notifications.controller");
const notificationsValidation = require("./notifications.validation");
const { authenticate } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authenticate, notificationsController.getMyNotifications);

router.patch(
  "/:id/read",
  authenticate,
  notificationsValidation.validateNotificationId,
  notificationsController.markNotificationAsRead
);

router.patch(
  "/read-all",
  authenticate,
  notificationsController.markAllNotificationsAsRead
);

module.exports = router;