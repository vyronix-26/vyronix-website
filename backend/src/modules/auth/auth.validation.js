const Joi = require("joi");

const AppError = require("../../utils/AppError");
const { nameRegex, emailRegex, passwordRegex } = require("../../utils/regex");

const signupSchema = Joi.object({
  firstName: Joi.string().pattern(nameRegex).required().messages({
    "string.empty": "First name is required",
    "string.pattern.base":
      "First name must contain only letters and spaces, 3-50 characters",
    "any.required": "First name is required",
  }),

  lastName: Joi.string().pattern(nameRegex).required().messages({
    "string.empty": "Last name is required",
    "string.pattern.base":
      "Last name must contain only letters and spaces, 3-50 characters",
    "any.required": "Last name is required",
  }),

  email: Joi.string().pattern(emailRegex).required().messages({
    "string.empty": "Email is required",
    "string.pattern.base": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base":
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    "any.required": "Password is required",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
    "any.required": "Confirm password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.empty": "Email is required",
    "string.pattern.base": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "string.empty": "Refresh token is required",
    "any.required": "Refresh token is required",
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.empty": "Email is required",
    "string.pattern.base": "Invalid email format",
    "any.required": "Email is required",
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Reset token is required",
    "any.required": "Reset token is required",
  }),

  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base":
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    "any.required": "Password is required",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
    "any.required": "Confirm password is required",
  }),
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(new AppError(message, 400));
    }

    next();
  };
};

module.exports = {
  validateSignup: validate(signupSchema),
  validateLogin: validate(loginSchema),
  validateRefreshToken: validate(refreshTokenSchema),
  validateForgotPassword: validate(forgotPasswordSchema),
  validateResetPassword: validate(resetPasswordSchema),
};