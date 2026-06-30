const express = require("express");

const chatbotController = require("./chatbot.controller");
const chatbotValidation = require("./chatbot.validation");

const router = express.Router();

router.post(
  "/message",
  chatbotValidation.validateMessage,
  chatbotController.handleMessage
);

module.exports = router;