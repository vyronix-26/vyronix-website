const Joi = require("joi");

const AppError = require("../../utils/AppError");

const messageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(1000).required().messages({
    "string.empty": "Message is required",
    "string.min": "Message is required",
    "string.max": "Message must be at most 1000 characters",
    "any.required": "Message is required",
  }),
});

const validateMessage = (req, res, next) => {
  const { error, value } = messageSchema.validate(req.body, {
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

module.exports = {
  validateMessage,
};