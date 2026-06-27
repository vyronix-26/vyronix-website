/**
 * Profile Service
 *
 * This service contains the business logic for user profile management.
 * It acts as a bridge between the controller layer and the repository layer.
 *
 * Responsibilities:
 * - Retrieve the authenticated user's profile.
 * - Update editable profile fields.
 * - Update the user's password.
 * - Verify that the profile or user exists before continuing.
 * - Validate the current password before changing it.
 * - Prevent users from reusing their current password as the new password.
 * - Throw application-specific errors when business rules are violated.
 *
 * Notes:
 * - Profile image upload is handled by Multer before reaching this service.
 * - The controller provides the uploaded image path as profileImage.
 * - Database operations are delegated to the repository layer.
 * - This service is responsible only for business rules and validation logic.
 */

const argon2 = require("argon2");

const profileRepository = require("./profile.repository");
const AppError = require("../../utils/AppError");

const getProfile = async (userId) => {
  const profile = await profileRepository.findProfileById(userId);

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  return profile;
};

const updateProfile = async (userId, profileData) => {
  const profile = await profileRepository.findProfileById(userId);

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  if (profileData.phone) {
    const userWithSamePhone = await profileRepository.findUserByPhone(
      profileData.phone
    );

    if (userWithSamePhone && userWithSamePhone.id !== userId) {
      throw new AppError("Phone number is already used", 409);
    }
  }

  return profileRepository.updateProfile(userId, profileData);
};

const updatePassword = async (userId, passwordData) => {
  const { currentPassword, newPassword } = passwordData;

  const user = await profileRepository.findUserPasswordById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isCurrentPasswordCorrect = await argon2.verify(
    user.password,
    currentPassword
  );

  if (!isCurrentPasswordCorrect) {
    throw new AppError("Current password is incorrect", 400);
  }

  const isSamePassword = await argon2.verify(user.password, newPassword);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      400
    );
  }

  const hashedPassword = await argon2.hash(newPassword);

  await profileRepository.updatePassword(userId, hashedPassword);
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
};