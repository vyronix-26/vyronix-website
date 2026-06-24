const Joi = require("joi");

const AppError = require("../../utils/AppError");
const { nameRegex, emailRegex, passwordRegex } = require("../../utils/regex");

const signupSchema = Joi.object({
  fullName: Joi.string().pattern(nameRegex).required().messages({
    "string.empty": "Full name is required",
    "string.pattern.base": "Full name must contain only letters and spaces, 3-50 characters",
    "any.required": "Full name is required",
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
};