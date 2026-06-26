/**
 * Services Routes
 *
 * This file defines all API endpoints related to service management.
 * It maps HTTP routes to their corresponding controller methods and
 * applies the required validation, authentication, authorization,
 * and upload middleware.
 *
 * Available endpoints:
 * - GET    /          Retrieve all services.
 * - GET    /:id       Retrieve a single service by its ID.
 * - POST   /          Create a new service with image upload (Admin only).
 * - PATCH  /:id       Update an existing service and optionally replace its image (Admin only).
 * - DELETE /:id       Delete a service (Admin only).
 *
 * Middleware flow:
 * 1. Authenticate the user (when required).
 * 2. Verify the user's role (Admin only for write operations).
 * 3. Process uploaded service images using Multer (when applicable).
 * 4. Validate request parameters and request body.
 * 5. Execute the corresponding controller action.
 *
 * Notes:
 * - Read operations (GET) are publicly accessible.
 * - Create, update, and delete operations require authentication
 *   and ADMIN authorization.
 * - Image uploads are handled using the "image" field in multipart/form-data.
 */

const express = require("express");

const servicesController = require("./services.controller");
const servicesValidation = require("./services.validation");
const { authenticate, authorize } = require("../../middlewares/auth.middleware");
const { createUploader } = require("../../middlewares/upload.middleware");

const uploadServiceImage = createUploader("services");

const router = express.Router();

router.get("/", servicesController.getAllServices);

router.get(
  "/:id",
  servicesValidation.validateServiceId,
  servicesController.getServiceById
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  uploadServiceImage.single("image"),
  servicesValidation.validateCreateService,
  servicesController.createService
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  uploadServiceImage.single("image"),
  servicesValidation.validateServiceId,
  servicesValidation.validateUpdateService,
  servicesController.updateService
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  servicesValidation.validateServiceId,
  servicesController.deleteService
);

module.exports = router;