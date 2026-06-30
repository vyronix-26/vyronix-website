/**
 * User Management Routes
 *
 * This file defines all API endpoints related to admin user management.
 * It maps HTTP routes to their corresponding controller methods and
 * applies the required authentication, authorization, and validation middleware.
 *
 * Available endpoints:
 * - GET    /             Retrieve all users.
 * - GET    /:id          Retrieve a specific user by ID.
 * - PATCH  /:id/status   Update a user's active status.
 * - PATCH  /:id/role     Update a user's role.
 *
 * Middleware flow:
 * 1. Authenticate the user.
 * 2. Verify the user has the ADMIN role.
 * 3. Validate route parameters and request body.
 * 4. Execute the corresponding controller action.
 *
 * Notes:
 * - All endpoints in this module are restricted to ADMIN users.
 * - Business rules, such as preventing admins from modifying their own
 *   account status or role, are handled in the service layer.
 */

const express = require("express");

const userManagementController = require("./userManagement.controller");
const userManagementValidation = require("./userManagement.validation");

const {
  authenticate,
  authorize,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get(
  "/",
  userManagementController.getAllUsers
);

router.get(
  "/:id",
  userManagementValidation.validateUserId,
  userManagementController.getUserById
);

router.patch(
  "/:id/status",
  userManagementValidation.validateUserId,
  userManagementValidation.validateUpdateStatus,
  userManagementController.changeUserStatus
);

router.patch(
  "/:id/role",
  userManagementValidation.validateUserId,
  userManagementValidation.validateUpdateRole,
  userManagementController.changeUserRole
);

module.exports = router;