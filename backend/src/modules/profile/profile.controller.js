/**
 * Profile Controller
 *
 * This controller handles all HTTP requests related to user profile management.
 * It receives validated request data, handles uploaded profile image paths,
 * calls the profile service layer, and returns structured JSON responses.
 *
 * Responsibilities:
 * - Retrieve the authenticated user's profile.
 * - Update profile information.
 * - Update the user's password.
 * - Forward errors to the global error handler using next(error).
 *
 * Response format:
 * - success: indicates whether the request completed successfully.
 * - message: describes the result of update operations.
 * - data: contains the returned profile.
 *
 * Notes:
 * - The authenticated user's ID is taken from req.user.id.
 * - Uploaded profile images are handled by Multer before reaching this controller.
 * - The uploaded image path is converted to profileImage and passed to the service layer.
 * - Business logic is handled in the service layer.
 * - Database operations are handled in the repository layer.
 */

const profileService = require("./profile.service");

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profileImage = req.file
      ? `/uploads/profiles/${req.file.filename}`
      : undefined;

    const profile = await profileService.updateProfile(req.user.id, {
      ...req.body,
      ...(profileImage && { profileImage }),
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    await profileService.updatePassword(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
};