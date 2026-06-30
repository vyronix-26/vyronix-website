/**
 * Reports Routes
 *
 * This file defines all API endpoints related to reports and dashboard data.
 * It maps HTTP routes to their corresponding controller methods and
 * applies the required authentication and authorization middleware.
 *
 * Available endpoints:
 * - GET /dashboard    Retrieve the complete admin dashboard report.
 *
 * Middleware flow:
 * 1. Authenticate the user.
 * 2. Verify the user has the ADMIN role.
 * 3. Execute the corresponding controller action.
 *
 * Notes:
 * - All report endpoints are restricted to ADMIN users.
 * - Business logic is handled in the service layer.
 * - Database operations are handled in the repository layer.
 */

const express = require("express");

const reportsController = require("./reports.controller");
const {
  authenticate,
  authorize,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorize("ADMIN"),
  reportsController.getDashboardReport
);

module.exports = router;