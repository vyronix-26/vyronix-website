/**
 * Users Validation Middleware
 *
 * This file defines all validation rules for user management-related requests.
 * It uses Joi to validate request body data and route parameters before
 * the request reaches the controller.
 *
 * Responsibilities:
 * - Validate user ID from route parameters.
 * - Validate account status update data.
 * - Validate user role update data.
 * - Return clear validation error messages using AppError.
 *
 * Main validations:
 * - id: required route parameter, must be a positive integer.
 * - isActive: required boolean value for activating or deactivating a user account.
 * - role: required value and must be either CLIENT or ADMIN.
 *
 * Notes:
 * - Authorization rules are handled in the routes using middleware.
 * - Business rules, such as preventing invalid admin actions, are handled in the service layer.
 *
 * Exported middleware:
 * - validateUserId
 * - validateUpdateStatus
 * - validateUpdateRole
 */

const Joi = require("joi");

const AppError = require("../../utils/AppError");

const userIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "User id must be a number",
    "number.integer": "User id must be an integer",
    "number.positive": "User id must be positive",
    "any.required": "User id is required",
  }),
});

const updateStatusSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    "any.required": "Account status is required",
  }),
});

const updateRoleSchema = Joi.object({
  role: Joi.string().valid("CLIENT", "ADMIN").required().messages({
    "any.only": "Role must be CLIENT or ADMIN",
    "any.required": "Role is required",
  }),
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
  validateUserId: validate(userIdSchema, "params"),
  validateUpdateStatus: validate(updateStatusSchema, "body"),
  validateUpdateRole: validate(updateRoleSchema, "body"),
};