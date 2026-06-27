/**
 * Feedback Repository
 *
 * This file handles all database operations related to client feedback.
 * It communicates directly with the MySQL database using the shared pool
 * connection and returns clean JavaScript objects to the service layer.
 *
 * Responsibilities:
 * - Create new client feedback.
 * - Retrieve all feedback for admin users.
 * - Retrieve featured feedback for public display.
 * - Retrieve a single feedback by its ID.
 * - Update the featured status of a feedback.
 * - Delete a feedback by its ID.
 *
 * Database table:
 * - feedback
 *
 * Related table:
 * - users
 *
 * Notes:
 * - This repository does not perform business validation.
 * - Authorization and business rules are handled in the service layer.
 * - Database snake_case fields are mapped to camelCase fields
 *   for cleaner API responses.
 */

const pool = require("../../config/db");

const createFeedback = async ({ clientId, rating, comment }) => {
  const [result] = await pool.query(
    `
    INSERT INTO feedback (client_id, rating, comment)
    VALUES (?, ?, ?)
    `,
    [clientId, rating, comment]
  );

  return findFeedbackById(result.insertId);
};

const findAllFeedback = async () => {
  const [rows] = await pool.query(`
    SELECT
      f.id,
      f.client_id AS clientId,
      f.rating,
      f.comment,
      f.is_featured AS isFeatured,
      f.created_at AS createdAt,
      f.updated_at AS updatedAt,
      u.first_name AS clientFirstName,
      u.last_name AS clientLastName
    FROM feedback f
    JOIN users u ON f.client_id = u.id
    ORDER BY f.created_at DESC
  `);

  return rows;
};

const findPublicFeedback = async () => {
  const [rows] = await pool.query(`
    SELECT
      f.id,
      f.rating,
      f.comment,
      f.created_at AS createdAt,
      u.first_name AS clientFirstName,
      u.last_name AS clientLastName,
      u.profile_image AS clientProfileImage
    FROM feedback f
    JOIN users u ON f.client_id = u.id
    WHERE f.is_featured = TRUE
    ORDER BY f.created_at DESC
  `);

  return rows;
};

const findFeedbackById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      f.id,
      f.client_id AS clientId,
      f.rating,
      f.comment,
      f.is_featured AS isFeatured,
      f.created_at AS createdAt,
      f.updated_at AS updatedAt,
      u.first_name AS clientFirstName,
      u.last_name AS clientLastName
    FROM feedback f
    JOIN users u ON f.client_id = u.id
    WHERE f.id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

const updateFeedbackFeatured = async (id, isFeatured) => {
  const [result] = await pool.query(
    `
    UPDATE feedback
    SET is_featured = ?
    WHERE id = ?
    `,
    [isFeatured, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findFeedbackById(id);
};

const deleteFeedback = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM feedback
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  createFeedback,
  findAllFeedback,
  findPublicFeedback,
  findFeedbackById,
  updateFeedbackFeatured,
  deleteFeedback,
};