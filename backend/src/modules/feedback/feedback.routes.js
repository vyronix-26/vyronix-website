/**
 * Feedback Routes
 *
 * This file defines all API endpoints related to client feedback.
 * It maps HTTP routes to their corresponding controller methods and
 * applies the required authentication, authorization, and validation middleware.
 *
 * Available endpoints:
 * - GET    /public              Retrieve featured feedback for public display.
 * - POST   /                    Submit new feedback (Client only).
 * - GET    /admin               Retrieve all feedback (Admin only).
 * - PATCH  /admin/:id/featured  Update the featured status of a feedback (Admin only).
 * - DELETE /admin/:id           Delete a feedback (Admin only).
 *
 * Middleware flow:
 * 1. Authenticate the user (when required).
 * 2. Verify the user's role (CLIENT or ADMIN).
 * 3. Validate route parameters and request body.
 * 4. Execute the corresponding controller action.
 *
 * Notes:
 * - Public feedback is accessible without authentication.
 * - Only authenticated CLIENT users can submit feedback.
 * - Only authenticated ADMIN users can manage feedback.
 * - Business rules are handled in the service layer.
 */

const express = require("express");

const feedbackController = require("./feedback.controller");
const feedbackValidation = require("./feedback.validation");
const {
  authenticate,
  authorize,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/public", feedbackController.getPublicFeedback);

router.post(
  "/",
  authenticate,
  authorize("CLIENT"),
  feedbackValidation.validateCreateFeedback,
  feedbackController.createFeedback
);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  feedbackController.getAllFeedback
);

router.patch(
  "/admin/:id/featured",
  authenticate,
  authorize("ADMIN"),
  feedbackValidation.validateFeedbackId,
  feedbackValidation.validateUpdateFeatured,
  feedbackController.updateFeedbackFeatured
);

router.delete(
  "/admin/:id",
  authenticate,
  authorize("ADMIN"),
  feedbackValidation.validateFeedbackId,
  feedbackController.deleteFeedback
);

module.exports = router;