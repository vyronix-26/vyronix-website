/**
 * User Management Controller
 *
 * This controller handles all HTTP requests related to admin user management.
 * It receives validated request data, calls the user management service layer,
 * and returns structured JSON responses.
 *
 * Responsibilities:
 * - Retrieve all users.
 * - Retrieve a single user by ID.
 * - Update a user's account status.
 * - Update a user's role.
 * - Forward errors to the global error handler using next(error).
 *
 * Response format:
 * - success: indicates whether the request completed successfully.
 * - results: number of returned users when fetching multiple users.
 * - message: describes the result of update operations.
 * - data: contains the returned user or users.
 *
 * Notes:
 * - The authenticated admin's ID is taken from req.user.id.
 * - Authorization is handled in the routes using middleware.
 * - Business rules (such as preventing admins from modifying their own account)
 *   are handled in the service layer.
 * - Database operations are handled in the repository layer.
 */

const userManagementService = require("./userManagement.service");

const getAllUsers = async (req, res, next) => {
  try {
    const result = await userManagementService.getAllUsers({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      role: req.query.role,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
    });

    res.status(200).json({
      success: true,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      total: result.total,
      results: result.users.length,
      data: {
        users: result.users,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userManagementService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const changeUserStatus = async (req, res, next) => {
  try {
    const user = await userManagementService.changeUserStatus(
      Number(req.params.id),
      req.user.id,
      req.body.isActive
    );

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const changeUserRole = async (req, res, next) => {
  try {
    const user = await userManagementService.changeUserRole(
      Number(req.params.id),
      req.user.id,
      req.body.role
    );

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  changeUserStatus,
  changeUserRole,
};