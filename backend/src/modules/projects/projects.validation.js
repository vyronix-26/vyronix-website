/**
 * Project Validation Middleware
 *
 * This file defines all validation rules for project-related requests.
 * It uses Joi to validate request body, route parameters, and query parameters
 * before the request reaches the controller.
 *
 * Responsibilities:
 * - Validate project creation data.
 * - Validate project update data.
 * - Validate project ID from route parameters.
 * - Validate optional project filters from query parameters.
 * - Return clear validation error messages using AppError.
 *
 * Main validations:
 * - title: required for create, optional for update, 3-150 characters.
 * - description: required for create, optional for update, at least 10 characters.
 * - imageUrl: optional, must be a valid URL if provided. Uploaded images are handled through Multer.
 * - githubUrl: optional, must be a valid URL if provided.
 * - liveUrl: optional, must be a valid URL if provided.
 * - type: required for create, optional for update, must be either SOFTWARE or UI_DESIGN.
 * - category: required for create, optional for update, must match one of the supported categories.
 * - isFeatured: optional boolean flag indicating whether the project is featured.
 *
 * Exported middleware:
 * - validateCreateProject
 * - validateUpdateProject
 * - validateProjectId
 * - validateProjectSlug
 * - validateProjectQuery
 */

const Joi = require("joi");

const AppError = require("../../utils/AppError");
const { PROJECT_TYPES } = require("./projects.constants");

const categories = [
  "WEB_APP",
  "E_COMMERCE",
  "DASHBOARD",
  "LANDING_PAGE",
  "PORTFOLIO",
  "MOBILE_APP_UI",
  "WEBSITE_UI",
  "DASHBOARD_UI",
  "BRANDING",
  "GENERAL",
];

const createProjectSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required(),

  description: Joi.string().trim().min(10).required(),

  imageUrl: Joi.string().uri().optional(),

  githubUrl: Joi.string().uri().allow(null, ""),

  liveUrl: Joi.string().uri().allow(null, ""),

  type: Joi.string()
    .valid(PROJECT_TYPES.SOFTWARE, PROJECT_TYPES.UI_DESIGN)
    .required(),

  category: Joi.string().valid(...categories).required(),

  isFeatured: Joi.boolean().optional(),
});

const updateProjectSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150),

  description: Joi.string().trim().min(10),

  imageUrl: Joi.string().uri().optional(),

  githubUrl: Joi.string().uri().allow(null, ""),

  liveUrl: Joi.string().uri().allow(null, ""),

  type: Joi.string().valid(PROJECT_TYPES.SOFTWARE, PROJECT_TYPES.UI_DESIGN),

  category: Joi.string().valid(...categories),

  isFeatured: Joi.boolean(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update project",
  });

const projectIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const projectSlugSchema = Joi.object({
  slug: Joi.string().trim().min(3).max(180).required(),
});

const projectQuerySchema = Joi.object({
  type: Joi.string().valid(PROJECT_TYPES.SOFTWARE, PROJECT_TYPES.UI_DESIGN),

  category: Joi.string().valid(...categories),

  search: Joi.string().trim().max(100),

  featured: Joi.boolean(),

  sort: Joi.string().valid("newest", "oldest").default("newest"),

  page: Joi.number().integer().positive().default(1),

  limit: Joi.number().integer().positive().max(50).default(9),
});

const validate = (schema, property) => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    return next(new AppError(message, 400));
  }

  req[property] = value;
  next();
};

module.exports = {
  validateCreateProject: validate(createProjectSchema, "body"),
  validateUpdateProject: validate(updateProjectSchema, "body"),
  validateProjectId: validate(projectIdSchema, "params"),
  validateProjectSlug: validate(projectSlugSchema, "params"),
  validateProjectQuery: validate(projectQuerySchema, "query"),
};