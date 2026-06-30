/**
 * Projects Routes
 *
 * This file defines all API endpoints related to project management.
 * It maps HTTP routes to their corresponding controller methods and
 * applies the required validation, authentication, authorization,
 * and upload middleware.
 *
 * Available endpoints:
 * - GET    /          Retrieve all projects with optional filtering.
 * - GET    /slug/:slug Retrieve a single project by its slug.
 * - GET    /:id       Retrieve a single project by its ID.
 * - POST   /          Create a new project with optional image upload (Admin only).
 * - PATCH  /:id       Update an existing project and optionally replace its image (Admin only).
 * - DELETE /:id       Delete a project (Admin only).
 *
 * Middleware flow:
 * 1. Authenticate the user (when required).
 * 2. Verify the user's role (Admin only for write operations).
 * 3. Process uploaded project images using Multer (when applicable).
 * 4. Validate request parameters, body, or query.
 * 5. Execute the corresponding controller action.
 *
 * Notes:
 * - Read operations (GET) are publicly accessible.
 * - Create, update, and delete operations require authentication
 *   and ADMIN authorization.
 * - Image uploads are handled using the "image" field in multipart/form-data.
 */

const express = require("express");

const projectsController = require("./projects.controller");
const projectsValidation = require("./projects.validation");
const { authenticate, authorize } = require("../../middlewares/auth.middleware");
const { createUploader } = require("../../middlewares/upload.middleware");

const uploadProjectImage = createUploader("projects");

const router = express.Router();

router.get(
  "/",
  projectsValidation.validateProjectQuery,
  projectsController.getAllProjects
);

router.get(
  "/slug/:slug",
  projectsValidation.validateProjectSlug,
  projectsController.getProjectBySlug
);

router.get(
  "/:id",
  projectsValidation.validateProjectId,
  projectsController.getProjectById
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  uploadProjectImage.single("image"),
  projectsValidation.validateCreateProject,
  projectsController.createProject
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  uploadProjectImage.single("image"),
  projectsValidation.validateProjectId,
  projectsValidation.validateUpdateProject,
  projectsController.updateProject
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  projectsValidation.validateProjectId,
  projectsController.deleteProject
);

module.exports = router;