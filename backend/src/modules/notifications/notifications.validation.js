/**
 * Notifications Validation Middleware
 *
 * This file defines all validation rules for notification-related requests.
 * It uses Joi to validate route parameters before the request reaches
 * the controller.
 *
 * Responsibilities:
 * - Validate notification ID from route parameters.
 * - Return clear validation error messages using AppError.
 *
 * Main validations:
 * - id: required, must be a positive integer.
 *
 * Notes:
 * - Business rules, ownership checks, and notification state validation
 *   are handled in the service layer.
 *
 * Exported middleware:
 * - validateNotificationId
 */

const Joi = require("joi");

const AppError = require("../../utils/AppError");

const notificationIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Notification id must be a number",
    "number.integer": "Notification id must be an integer",
    "number.positive": "Notification id must be positive",
    "any.required": "Notification id is required",
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
  validateNotificationId: validate(notificationIdSchema, "params"),
};