/**
 * Feedback Validation Middleware
 *
 * This file defines all validation rules for feedback-related requests.
 * It uses Joi to validate request body data and route parameters before
 * the request reaches the controller.
 *
 * Responsibilities:
 * - Validate feedback creation data.
 * - Validate featured status update data.
 * - Validate feedback ID from route parameters.
 * - Return clear validation error messages using AppError.
 *
 * Main validations:
 * - rating: required integer between 1 and 5.
 * - comment: required text, 5-1000 characters.
 * - isFeatured: required boolean value for marking feedback as featured or not featured.
 * - id: required route parameter, must be a positive integer.
 *
 * Notes:
 * - The clientId is not validated here because it is taken from the authenticated user.
 * - Authorization rules are handled in the routes using middleware.
 * - Business rules are handled in the service layer.
 *
 * Exported middleware:
 * - validateCreateFeedback
 * - validateUpdateFeatured
 * - validateFeedbackId
 */

const Joi = require("joi");

const AppError = require("../../utils/AppError");

const createFeedbackSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
    "any.required": "Rating is required",
  }),

  comment: Joi.string().trim().min(5).max(1000).required().messages({
    "string.empty": "Feedback comment is required",
    "string.min": "Feedback comment must be at least 5 characters",
    "string.max": "Feedback comment must be at most 1000 characters",
    "any.required": "Feedback comment is required",
  }),
});

const updateFeaturedSchema = Joi.object({
  isFeatured: Joi.boolean().required().messages({
    "any.required": "Featured status is required",
  }),
});

const feedbackIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Feedback id must be a number",
    "number.integer": "Feedback id must be an integer",
    "number.positive": "Feedback id must be positive",
    "any.required": "Feedback id is required",
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
  validateCreateFeedback: validate(createFeedbackSchema, "body"),
  validateUpdateFeatured: validate(updateFeaturedSchema, "body"),
  validateFeedbackId: validate(feedbackIdSchema, "params"),
};