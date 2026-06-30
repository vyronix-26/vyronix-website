/**
 * User Management Service
 *
 * This service contains the business logic for admin user management.
 * It acts as a bridge between the controller layer and the repository layer.
 *
 * Responsibilities:
 * - Retrieve all users.
 * - Retrieve a single user by ID.
 * - Change a user's active status.
 * - Change a user's role.
 * - Prevent admins from deactivating their own accounts.
 * - Prevent admins from changing their own roles.
 * - Throw application-specific errors when users are not found
 *   or when protected admin actions are attempted.
 *
 * Notes:
 * - Only admins should access these operations through route authorization.
 * - Database operations are delegated to the repository layer.
 * - This service is responsible for business rules and admin safety checks.
 */

const userManagementRepository = require("./userManagement.repository");
const AppError = require("../../utils/AppError");

const getAllUsers = async (filters) => {
  const users = await userManagementRepository.findAllUsers(filters);

  const total = await userManagementRepository.countUsers(filters);

  return {
    total,
    users,
  };
};

const getUserById = async (userId) => {
  const user = await userManagementRepository.findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const changeUserStatus = async (targetUserId, currentAdminId, isActive) => {
  const user = await userManagementRepository.findUserById(targetUserId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (Number(targetUserId) === Number(currentAdminId)) {
    throw new AppError("You cannot deactivate your own account", 400);
  }

  if (user.role === "ADMIN" && isActive === false) {
    const adminsCount = await userManagementRepository.countActiveAdmins();

    if (adminsCount === 1) {
      throw new AppError(
        "Cannot deactivate the last active administrator",
        400
      );
    }
  }

  return userManagementRepository.updateUserStatus(targetUserId, isActive);
};

const changeUserRole = async (targetUserId, currentAdminId, role) => {
  const user = await userManagementRepository.findUserById(targetUserId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (Number(targetUserId) === Number(currentAdminId)) {
    throw new AppError("You cannot change your own role", 400);
  }

  if (user.role === "ADMIN" && role === "CLIENT") {
    const adminsCount = await userManagementRepository.countActiveAdmins();

    if (adminsCount === 1) {
      throw new AppError(
        "Cannot change the role of the last active administrator",
        400
      );
    }
  }

  return userManagementRepository.updateUserRole(targetUserId, role);
};

module.exports = {
  getAllUsers,
  getUserById,
  changeUserStatus,
  changeUserRole,
};