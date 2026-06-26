/**
 * Services Validation Middleware
 *
 * This file defines all validation rules for service-related requests.
 * It uses Joi to validate request body and route parameters before
 * the request reaches the controller.
 *
 * Responsibilities:
 * - Validate service creation data.
 * - Validate service update data.
 * - Validate service ID from route parameters.
 * - Return clear validation error messages using AppError.
 *
 * Main validations:
 * - title: required for create, optional for update, 3-150 characters.
 * - description: required for create, optional for update, at least 10 characters.
 * - isActive: optional boolean indicating whether the service is active.
 * - displayOrder: optional non-negative integer controlling service order.
 *
 * Notes:
 * - Service images are uploaded using Multer.
 * - The uploaded image path is handled in the controller and is not validated here.
 * - Business rules are handled in the service layer.
 *
 * Exported middleware:
 * - validateCreateService
 * - validateUpdateService
 * - validateServiceId
 */


const Joi = require("joi");

const AppError = require("../../utils/AppError");

const createServiceSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "Service title is required",
    "string.min": "Service title must be at least 3 characters",
    "string.max": "Service title must be at most 150 characters",
    "any.required": "Service title is required",
  }),

  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "Service description is required",
    "string.min": "Service description must be at least 10 characters",
    "any.required": "Service description is required",
  }),

  isActive: Joi.boolean().optional(),

  displayOrder: Joi.number().integer().min(0).optional(),
});

const updateServiceSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150),

  description: Joi.string().trim().min(10),

  isActive: Joi.boolean(),

  displayOrder: Joi.number().integer().min(0),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update service",
  });

const serviceIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Service id must be a number",
    "number.integer": "Service id must be an integer",
    "number.positive": "Service id must be positive",
    "any.required": "Service id is required",
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
  validateCreateService: validate(createServiceSchema, "body"),
  validateUpdateService: validate(updateServiceSchema, "body"),
  validateServiceId: validate(serviceIdSchema, "params"),
};