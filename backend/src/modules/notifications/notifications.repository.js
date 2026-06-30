/**
 * Notifications Repository
 *
 * This file handles all database operations related to notifications.
 * It communicates directly with the MySQL database using the shared pool
 * connection and returns clean JavaScript objects to the service layer.
 *
 * Responsibilities:
 * - Create a notification for a single user.
 * - Create notifications for multiple users in a single bulk operation.
 * - Retrieve all notifications for a specific user.
 * - Retrieve a single notification by its ID.
 * - Mark a notification as read.
 * - Mark all notifications for a user as read.
 * - Count unread notifications for a user.
 *
 * Database table:
 * - notifications
 *
 * Main fields:
 * - user_id
 * - title
 * - message
 * - type
 * - reference_id
 * - is_read
 * - created_at
 *
 * Notes:
 * - This repository does not perform business validation.
 * - Authorization checks should be handled in the service layer.
 * - Database snake_case fields are mapped to camelCase fields
 *   for cleaner API responses.
 */

const pool = require("../../config/db");

const createNotification = async ({
  userId,
  title,
  message,
  type = "SYSTEM",
  referenceId = null,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO notifications (user_id, title, message, type, reference_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, title, message, type, referenceId]
  );

  return findNotificationById(result.insertId);
};

const createNotificationsForUsers = async ({
  userIds,
  title,
  message,
  type = "SYSTEM",
  referenceId = null,
}) => {
  if (!userIds.length) return;

  const values = userIds.map((userId) => [
    userId,
    title,
    message,
    type,
    referenceId,
  ]);

  await pool.query(
    `
    INSERT INTO notifications (user_id, title, message, type, reference_id)
    VALUES ?
    `,
    [values]
  );
};

const findUserIdsByRole = async (role) => {
  const [rows] = await pool.query(
    `
    SELECT id
    FROM users
    WHERE role = ? AND is_active = TRUE
    `,
    [role]
  );

  return rows.map((row) => row.id);
};

const findNotificationsByUserId = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      user_id AS userId,
      title,
      message,
      type,
      reference_id AS referenceId,
      is_read AS isRead,
      created_at AS createdAt
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
};

const findNotificationById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      user_id AS userId,
      title,
      message,
      type,
      reference_id AS referenceId,
      is_read AS isRead,
      created_at AS createdAt
    FROM notifications
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

const markAsRead = async (id, userId) => {
  const [result] = await pool.query(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = ? AND user_id = ?
    `,
    [id, userId]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findNotificationById(id);
};

const markAllAsRead = async (userId) => {
  await pool.query(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = ?
    `,
    [userId]
  );
};

const countUnreadNotifications = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT COUNT(*) AS unreadCount
    FROM notifications
    WHERE user_id = ? AND is_read = FALSE
    `,
    [userId]
  );

  return rows[0].unreadCount;
};

module.exports = {
  createNotification,
  createNotificationsForUsers,
  findUserIdsByRole,
  findNotificationsByUserId,
  findNotificationById,
  markAsRead,
  markAllAsRead,
  countUnreadNotifications,
};