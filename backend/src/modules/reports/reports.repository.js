/**
 * Dashboard Repository
 *
 * This file handles all database operations related to the admin dashboard.
 * It communicates directly with the MySQL database using the shared pool
 * connection and retrieves aggregated statistics and recent activity.
 *
 * Responsibilities:
 * - Retrieve user statistics.
 * - Retrieve project statistics.
 * - Retrieve service statistics.
 * - Retrieve project request statistics.
 * - Retrieve feedback statistics.
 * - Retrieve the latest registered users.
 * - Retrieve the latest submitted project requests.
 *
 * Database tables:
 * - users
 * - projects
 * - services
 * - project_requests
 * - feedback
 *
 * Notes:
 * - This repository performs read-only operations.
 * - Business logic is handled in the service layer.
 * - Database snake_case fields are mapped to camelCase fields
 *   for cleaner API responses.
 */

const pool = require("../../config/db");

const getUsersStats = async () => {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) AS totalUsers,
      SUM(role = 'CLIENT') AS totalClients,
      SUM(role = 'ADMIN') AS totalAdmins,
      SUM(is_active = TRUE) AS activeUsers,
      SUM(is_active = FALSE) AS inactiveUsers
    FROM users
  `);

  return rows[0];
};

const getProjectsStats = async () => {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) AS totalProjects,
      SUM(type = 'SOFTWARE') AS softwareProjects,
      SUM(type = 'UI_DESIGN') AS uiDesignProjects,
      SUM(is_featured = TRUE) AS featuredProjects
    FROM projects
  `);

  return rows[0];
};

const getServicesStats = async () => {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) AS totalServices,
      SUM(is_active = TRUE) AS activeServices,
      SUM(is_active = FALSE) AS inactiveServices
    FROM services
  `);

  return rows[0];
};

const getProjectRequestsStats = async () => {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) AS totalRequests,
      SUM(status = 'PENDING') AS pendingRequests,
      SUM(status = 'IN_REVIEW') AS inReviewRequests,
      SUM(status = 'ACCEPTED') AS acceptedRequests,
      SUM(status = 'REJECTED') AS rejectedRequests
    FROM project_requests
  `);

  return rows[0];
};

const getFeedbackStats = async () => {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) AS totalFeedback,
      ROUND(AVG(rating), 1) AS averageRating,
      SUM(is_featured = TRUE) AS featuredFeedback
    FROM feedback
  `);

  return rows[0];
};

const getLatestUsers = async () => {
  const [rows] = await pool.query(`
    SELECT
      id,
      first_name AS firstName,
      last_name AS lastName,
      email,
      role,
      is_active AS isActive,
      created_at AS createdAt
    FROM users
    ORDER BY created_at DESC
    LIMIT 5
  `);

  return rows;
};

const getLatestProjectRequests = async () => {
  const [rows] = await pool.query(`
    SELECT
      pr.id,
      pr.account_name AS accountName,
      pr.project_type AS projectType,
      pr.status,
      pr.created_at AS createdAt,
      u.first_name AS clientFirstName,
      u.last_name AS clientLastName
    FROM project_requests pr
    JOIN users u ON pr.client_id = u.id
    ORDER BY pr.created_at DESC
    LIMIT 5
  `);

  return rows;
};

module.exports = {
  getUsersStats,
  getProjectsStats,
  getServicesStats,
  getProjectRequestsStats,
  getFeedbackStats,
  getLatestUsers,
  getLatestProjectRequests,
};