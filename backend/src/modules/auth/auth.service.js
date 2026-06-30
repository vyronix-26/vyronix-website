const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const crypto = require("crypto");

const authRepository = require("./auth.repository");
const AppError = require("../../utils/AppError");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateToken");

const buildSafeUser = (user) => {
  return {
    id: user.id,
    firstName: user.first_name || user.firstName,
    lastName: user.last_name || user.lastName,
    email: user.email,
    role: user.role,
    profileImage: user.profile_image || user.profileImage || null,
    isActive: user.is_active ?? user.isActive,
    emailVerified: user.email_verified ?? user.emailVerified,
    lastLogin: user.last_login || user.lastLogin || null,
  };
};

const generateAuthTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const hashedRefreshToken = await argon2.hash(refreshToken);

  await authRepository.updateRefreshToken(user.id, hashedRefreshToken);

  return {
    accessToken,
    refreshToken,
  };
};

const signup = async ({ firstName, lastName, email, password }) => {
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await argon2.hash(password);

  const user = await authRepository.createUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const tokens = await generateAuthTokens(user);

  return {
    user,
    tokens,
  };
};

const login = async ({ email, password }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await argon2.verify(user.password, password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  await authRepository.updateLastLogin(user.id);

  const safeUser = buildSafeUser({
    ...user,
    last_login: new Date(),
  });

  const tokens = await generateAuthTokens(safeUser);

  return {
    user: safeUser,
    tokens,
  };
};

const refreshToken = async (refreshTokenValue) => {
  if (!refreshTokenValue) {
    throw new AppError("Refresh token is required", 400);
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshTokenValue, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await authRepository.findUserAuthById(decoded.id);

  if (!user || !user.refresh_token) {
    throw new AppError("Refresh token is not valid", 401);
  }

  const isRefreshTokenValid = await argon2.verify(
    user.refresh_token,
    refreshTokenValue
  );

  if (!isRefreshTokenValid) {
    throw new AppError("Refresh token is not valid", 401);
  }

  const safeUser = buildSafeUser(user);
  const tokens = await generateAuthTokens(safeUser);

  return {
    user: safeUser,
    tokens,
  };
};

const logout = async (userId) => {
  await authRepository.clearRefreshToken(userId);

  return {
    message: "Logged out successfully",
  };
};

const forgotPassword = async (email) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    return {
      message: "If this email exists, a reset password token has been generated",
    };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await authRepository.updateResetPasswordToken(user.id, resetToken, expiresAt);

  return {
    message: "Reset password token generated successfully",
    resetToken,
  };
};

const resetPassword = async ({ token, password }) => {
  const user = await authRepository.findUserByResetToken(token);

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const hashedPassword = await argon2.hash(password);

  await authRepository.updatePassword(user.id, hashedPassword);

  return {
    message: "Password reset successfully",
  };
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
};