/**
 * Profile Validation Middleware
 *
 * This file defines all validation rules for profile-related requests.
 * It uses Joi to validate request body data before the request reaches
 * the controller.
 *
 * Responsibilities:
 * - Validate profile update data.
 * - Validate password update data.
 * - Return clear validation error messages using AppError.
 *
 * Main validations:
 * - firstName: optional, must contain only letters and match the configured name pattern.
 * - lastName: optional, must contain only letters and match the configured name pattern.
 * - phone: optional, must be a valid phone number format.
 * - currentPassword: required when changing password.
 * - newPassword: required, must match the configured password strength pattern.
 * - confirmNewPassword: required and must match newPassword.
 *
 * Notes:
 * - Email and role are not updated from this validation schema.
 * - Profile image upload is handled by Multer and passed separately as req.file.
 * - Business rules, such as checking the current password, are handled in the service layer.
 *
 * Exported middleware:
 * - validateUpdateProfile
 * - validateUpdatePassword
 */

const Joi = require("joi");

const AppError = require("../../utils/AppError");
const { nameRegex, passwordRegex } = require("../../utils/regex");

const updateProfileSchema = Joi.object({
  firstName: Joi.string().pattern(nameRegex).messages({
    "string.pattern.base":
      "First name must contain only letters and match the required length",
  }),

  lastName: Joi.string().pattern(nameRegex).messages({
    "string.pattern.base":
      "Last name must contain only letters and match the required length",
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s]{7,30}$/)
    .allow(null, "")
    .messages({
      "string.pattern.base": "Phone number must be valid",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update profile",
  });

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
    "any.required": "Current password is required",
  }),

  newPassword: Joi.string().pattern(passwordRegex).required().messages({
    "string.empty": "New password is required",
    "string.pattern.base":
      "New password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    "any.required": "New password is required",
  }),

  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "string.empty": "Confirm new password is required",
      "any.required": "Confirm new password is required",
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
  validateUpdateProfile: validate(updateProfileSchema, "body"),
  validateUpdatePassword: validate(updatePasswordSchema, "body"),
};