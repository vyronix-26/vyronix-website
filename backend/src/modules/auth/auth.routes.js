const express = require("express");

const authController = require("./auth.controller");
const authValidation = require("./auth.validation");
const { authenticate, authorize } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", authValidation.validateSignup, authController.signup);

router.post("/login", authValidation.validateLogin, authController.login);

router.post(
  "/refresh-token",
  authValidation.validateRefreshToken,
  authController.refreshToken
);

router.post("/logout", authenticate, authController.logout);

router.get("/me", authenticate, authController.getMe);

router.get(
  "/admin-test",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

router.get(
  "/client-test",
  authenticate,
  authorize("CLIENT"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Client",
    });
  }
);

module.exports = router;