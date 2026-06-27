/**
 * Notifications Service
 *
 * This service contains the business logic for notification management.
 * It acts as a bridge between the controller layer and the repository layer.
 *
 * Responsibilities:
 * - Retrieve all notifications for the authenticated user.
 * - Retrieve the user's unread notifications count.
 * - Mark a specific notification as read.
 * - Mark all notifications as read.
 * - Enforce ownership checks before allowing access to notifications.
 * - Throw application-specific errors when notifications are not found
 *   or access is denied.
 *
 * Notes:
 * - The authenticated user's ID is provided by the authentication middleware.
 * - Database operations are delegated to the repository layer.
 * - This service is responsible only for business rules and authorization checks.
 */

const notificationsRepository = require("./notifications.repository");
const AppError = require("../../utils/AppError");

const getMyNotifications = async (userId) => {
  const [notifications, unreadCount] = await Promise.all([
    notificationsRepository.findNotificationsByUserId(userId),
    notificationsRepository.countUnreadNotifications(userId),
  ]);

  return {
    unreadCount,
    notifications,
  };
};

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await notificationsRepository.findNotificationById(
    notificationId
  );

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (notification.userId !== userId) {
    throw new AppError("You are not allowed to access this notification", 403);
  }

  const updatedNotification = await notificationsRepository.markAsRead(
    notificationId,
    userId
  );

  if (!updatedNotification) {
    throw new AppError("Notification not found", 404);
  }

  return updatedNotification;
};

const markAllNotificationsAsRead = async (userId) => {
  await notificationsRepository.markAllAsRead(userId);
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};