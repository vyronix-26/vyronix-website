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
 * - imageUrl: required for create, optional for update, must be a valid URL.
 * - githubUrl: optional, must be a valid URL if provided.
 * - liveUrl: optional, must be a valid URL if provided.
 * - type: required for create, optional for update, must be either SOFTWARE or UI_DESIGN.
 *
 * Exported middleware:
 * - validateCreateProject
 * - validateUpdateProject
 * - validateProjectId
 * - validateProjectQuery
 */

const Joi = require("joi");

const AppError = require("../../utils/AppError");
const { PROJECT_TYPES } = require("./projects.constants");

const createProjectSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "Project title is required",
    "string.min": "Project title must be at least 3 characters",
    "string.max": "Project title must be at most 150 characters",
    "any.required": "Project title is required",
  }),

  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "Project description is required",
    "string.min": "Project description must be at least 10 characters",
    "any.required": "Project description is required",
  }),

  imageUrl: Joi.string().uri().required().messages({
    "string.empty": "Project image URL is required",
    "string.uri": "Project image must be a valid URL",
    "any.required": "Project image URL is required",
  }),

  githubUrl: Joi.string().uri().allow(null, "").messages({
    "string.uri": "GitHub URL must be a valid URL",
  }),

  liveUrl: Joi.string().uri().allow(null, "").messages({
    "string.uri": "Live URL must be a valid URL",
  }),

  type: Joi.string()
    .valid(PROJECT_TYPES.SOFTWARE, PROJECT_TYPES.UI_DESIGN)
    .required()
    .messages({
      "any.only": "Project type must be SOFTWARE or UI_DESIGN",
      "string.empty": "Project type is required",
      "any.required": "Project type is required",
    }),
});

const updateProjectSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).messages({
    "string.min": "Project title must be at least 3 characters",
    "string.max": "Project title must be at most 150 characters",
  }),

  description: Joi.string().trim().min(10).messages({
    "string.min": "Project description must be at least 10 characters",
  }),

  imageUrl: Joi.string().uri().messages({
    "string.uri": "Project image must be a valid URL",
  }),

  githubUrl: Joi.string().uri().allow(null, "").messages({
    "string.uri": "GitHub URL must be a valid URL",
  }),

  liveUrl: Joi.string().uri().allow(null, "").messages({
    "string.uri": "Live URL must be a valid URL",
  }),

  type: Joi.string()
    .valid(PROJECT_TYPES.SOFTWARE, PROJECT_TYPES.UI_DESIGN)
    .messages({
      "any.only": "Project type must be SOFTWARE or UI_DESIGN",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update project",
  });

const projectIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Project id must be a number",
    "number.integer": "Project id must be an integer",
    "number.positive": "Project id must be positive",
    "any.required": "Project id is required",
  }),
});

const projectQuerySchema = Joi.object({
  type: Joi.string()
    .valid(PROJECT_TYPES.SOFTWARE, PROJECT_TYPES.UI_DESIGN)
    .optional()
    .messages({
      "any.only": "Project type must be SOFTWARE or UI_DESIGN",
    }),
});

const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    return next(new AppError(message, 400));
  }

  req.body = value;
  next();
};

const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    return next(new AppError(message, 400));
  }

  req.params = value;
  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    return next(new AppError(message, 400));
  }

  req.query = value;
  next();
};

module.exports = {
  validateCreateProject: validateBody(createProjectSchema),
  validateUpdateProject: validateBody(updateProjectSchema),
  validateProjectId: validateParams(projectIdSchema),
  validateProjectQuery: validateQuery(projectQuerySchema),
};