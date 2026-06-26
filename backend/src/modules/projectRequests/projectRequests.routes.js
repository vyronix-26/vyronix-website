/**
 * Project Requests Routes
 *
 * This file defines all API endpoints related to project request management.
 * It maps HTTP routes to their corresponding controller methods and
 * applies the required validation, authentication, and authorization middleware.
 *
 * Available endpoints:
 * - POST   /              Submit a new project request (Client only).
 * - GET    /my-requests   Retrieve all requests submitted by the authenticated client.
 * - GET    /my-requests/:id Retrieve a specific request submitted by the authenticated client.
 * - GET    /              Retrieve all project requests (Admin only).
 * - GET    /:id           Retrieve a specific project request by its ID (Admin only).
 * - PATCH  /:id/status    Update the status and admin note of a project request (Admin only).
 * - DELETE /:id           Delete a project request (Admin only).
 *
 * Middleware flow:
 * 1. Authenticate the user.
 * 2. Verify the user's role (CLIENT or ADMIN).
 * 3. Validate request parameters or request body.
 * 4. Execute the corresponding controller action.
 *
 * Notes:
 * - Clients can only create requests and access their own requests.
 * - Admins can manage all project requests.
 * - Ownership checks for client requests are handled in the service layer.
 */

const express = require("express");

const projectRequestsController = require("./projectRequests.controller");
const projectRequestsValidation = require("./projectRequests.validation");
const {
  authenticate,
  authorize,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("CLIENT"),
  projectRequestsValidation.validateCreateRequest,
  projectRequestsController.createRequest
);

router.get(
  "/my-requests",
  authenticate,
  authorize("CLIENT"),
  projectRequestsController.getMyRequests
);

router.get(
  "/my-requests/:id",
  authenticate,
  authorize("CLIENT"),
  projectRequestsValidation.validateRequestId,
  projectRequestsController.getMyRequestById
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  projectRequestsController.getAllRequests
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  projectRequestsValidation.validateRequestId,
  projectRequestsController.getRequestByIdForAdmin
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  projectRequestsValidation.validateRequestId,
  projectRequestsValidation.validateUpdateStatus,
  projectRequestsController.updateRequestStatus
);

router.delete(
  "/:id",
  authenticate,
 authorize("ADMIN"),
  projectRequestsValidation.validateRequestId,
  projectRequestsController.deleteRequest
);

module.exports = router;