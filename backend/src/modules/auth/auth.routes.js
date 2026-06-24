const express = require("express");

const authController = require("./auth.controller");
const authValidation = require("./auth.validation");
const { authenticate } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", authValidation.validateSignup, authController.signup);
router.post("/login", authValidation.validateLogin, authController.login);
router.get("/me", authenticate, authController.getMe);

module.exports = router;