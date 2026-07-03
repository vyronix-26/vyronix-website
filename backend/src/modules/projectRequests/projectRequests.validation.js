/**
 * Project Requests Validation Middleware
 *
 * This file defines all validation rules for project request-related APIs.
 * It uses Joi to validate request body data and route parameters before
 * the request reaches the controller.
 *
 * Responsibilities:
 * - Validate project request creation data.
 * - Validate project request status update data.
 * - Validate project request ID from route parameters.
 * - Return clear validation error messages using AppError.
 *
 * Main validations:
 * - accountName: required for creating a request, 3-150 characters.
 * - email: required, must be a valid email address.
 * - projectType: required, 2-100 characters.
 * - clientNumber: required, must be a valid phone number format.
 * - description: required, at least 10 characters.
 * - status: required for status updates and must match one of the allowed request statuses.
 * - adminNote: optional admin note, can be empty or null.
 * - id: required route parameter, must be a positive integer.
 *
 * Notes:
 * - The clientId is not validated here because it is taken from the authenticated user.
 * - Business rules and authorization checks are handled in the service/controller layer.
 *
 * Exported middleware:
 * - validateCreateRequest
 * - validateUpdateStatus
 * - validateRequestId
 */

const Joi = require("joi");

const AppError = require("../../utils/AppError");
const { REQUEST_STATUS } = require("./projectRequests.constants");

const createRequestSchema = Joi.object({
  accountName: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "Account name is required",
    "string.min": "Account name must be at least 3 characters",
    "string.max": "Account name must be at most 150 characters",
    "any.required": "Account name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email address is required",
    "string.email": "Invalid email address",
    "any.required": "Email address is required",
  }),

  projectType: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Project type is required",
    "string.min": "Project type must be at least 2 characters",
    "string.max": "Project type must be at most 100 characters",
    "any.required": "Project type is required",
  }),

  clientNumber: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s]{7,30}$/)
    .required()
    .messages({
      "string.empty": "Client number is required",
      "string.pattern.base": "Client number must be a valid phone number",
      "any.required": "Client number is required",
    }),

  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "Project description is required",
    "string.min": "Project description must be at least 10 characters",
    "any.required": "Project description is required",
  }),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      REQUEST_STATUS.PENDING,
      REQUEST_STATUS.IN_REVIEW,
      REQUEST_STATUS.ACCEPTED,
      REQUEST_STATUS.REJECTED
    )
    .required()
    .messages({
      "any.only": "Invalid request status",
      "string.empty": "Status is required",
      "any.required": "Status is required",
    }),

  adminNote: Joi.string().trim().allow(null, "").optional(),
  admin_note: Joi.string().trim().allow(null, "").optional(),
});

const requestIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Request id must be a number",
    "number.integer": "Request id must be an integer",
    "number.positive": "Request id must be positive",
    "any.required": "Request id is required",
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
  validateCreateRequest: validate(createRequestSchema, "body"),
  validateUpdateStatus: validate(updateStatusSchema, "body"),
  validateRequestId: validate(requestIdSchema, "params"),
};