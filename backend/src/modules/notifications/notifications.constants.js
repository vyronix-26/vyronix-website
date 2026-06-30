/**
 * Notification Types
 *
 * This file defines the available notification type constants
 * used throughout the application.
 *
 * These constants help maintain consistency across the system
 * and prevent hardcoded string values.
 *
 * Available notification types:
 * - PROJECT_REQUEST: Notifications related to project requests.
 * - PROJECT: Notifications related to projects.
 * - SERVICE: Notifications related to services.
 * - SYSTEM: General system notifications.
 */

const NOTIFICATION_TYPES = {
  PROJECT_REQUEST: "PROJECT_REQUEST",
  PROJECT: "PROJECT",
  SERVICE: "SERVICE",
  SYSTEM: "SYSTEM",
};

module.exports = {
  NOTIFICATION_TYPES,
};