/**
 * Profile Routes
 *
 * This file defines all API endpoints related to user profile management.
 * It maps HTTP routes to their corresponding controller methods and
 * applies the required authentication, validation, and upload middleware.
 *
 * Available endpoints:
 * - GET    /            Retrieve the authenticated user's profile.
 * - PATCH  /            Update the authenticated user's profile and optionally upload a profile image.
 * - PATCH  /password    Update the authenticated user's password.
 *
 * Middleware flow:
 * 1. Authenticate the user.
 * 2. Process uploaded profile image using Multer (when applicable).
 * 3. Validate request body.
 * 4. Execute the corresponding controller action.
 *
 * Notes:
 * - All profile endpoints require authentication.
 * - Profile image uploads are handled using the "image" field in multipart/form-data.
 * - Password updates require the current password for verification.
 */

const express = require("express");

const profileController = require("./profile.controller");
const profileValidation = require("./profile.validation");
const { authenticate } = require("../../middlewares/auth.middleware");
const { createUploader } = require("../../middlewares/upload.middleware");

const router = express.Router();

const uploadProfileImage = createUploader("profiles");

router.get("/", authenticate, profileController.getProfile);

router.patch(
  "/",
  authenticate,
  uploadProfileImage.single("image"),
  profileValidation.validateUpdateProfile,
  profileController.updateProfile
);

router.patch(
  "/password",
  authenticate,
  profileValidation.validateUpdatePassword,
  profileController.updatePassword
);

module.exports = router;