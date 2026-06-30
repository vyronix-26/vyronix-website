/**
 * Notifications Controller
 *
 * This controller handles all HTTP requests related to user notifications.
 * It receives request data from authenticated users, calls the notifications
 * service layer, and returns structured JSON responses.
 *
 * Responsibilities:
 * - Retrieve notifications for the authenticated user.
 * - Return unread notifications count.
 * - Mark a single notification as read.
 * - Mark all notifications as read.
 * - Forward errors to the global error handler using next(error).
 *
 * Response format:
 * - success: indicates whether the request completed successfully.
 * - unreadCount: number of unread notifications for the authenticated user.
 * - results: number of returned notifications.
 * - message: describes the result of update operations.
 * - data: contains the returned notification or notifications.
 *
 * Notes:
 * - The authenticated user's ID is taken from req.user.id.
 * - Ownership checks are handled in the service layer.
 * - Database operations are handled in the repository layer.
 */

const notificationsService = require("./notifications.service");

const getMyNotifications = async (req, res, next) => {
  try {
    const result = await notificationsService.getMyNotifications(req.user.id);

    res.status(200).json({
      success: true,
      unreadCount: result.unreadCount,
      results: result.notifications.length,
      data: {
        notifications: result.notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await notificationsService.markNotificationAsRead(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await notificationsService.markAllNotificationsAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};