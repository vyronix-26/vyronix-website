/**
 * Project Requests Repository
 *
 * This file handles all database operations related to project requests.
 * It communicates directly with the MySQL database using the shared pool
 * connection and returns clean JavaScript objects to the service layer.
 *
 * Responsibilities:
 * - Create a new project request.
 * - Retrieve all project requests for admin users.
 * - Retrieve all requests submitted by a specific client.
 * - Retrieve a single request by its ID.
 * - Update request status and admin note.
 * - Delete a request by its ID.
 *
 * Database table:
 * - project_requests
 *
 * Related table:
 * - users
 *
 * Notes:
 * - This repository does not handle business validation.
 * - Authorization rules should be handled in the service/controller layer.
 * - Database snake_case fields are mapped to camelCase fields
 *   for cleaner API responses.
 */

const pool = require("../../config/db");

const createRequest = async (requestData) => {
  const {
    clientId,
    accountName,
    email,
    projectType,
    clientNumber,
    description,
  } = requestData;

  const [result] = await pool.query(
    `
    INSERT INTO project_requests
    (client_id, account_name, email, project_type, client_number, description)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [clientId, accountName, email, projectType, clientNumber, description]
  );

  return findRequestById(result.insertId);
};

const findAllRequests = async () => {
  const [rows] = await pool.query(
    `
    SELECT
      pr.id,
      pr.client_id AS clientId,
      pr.account_name AS accountName,
      pr.email,
      pr.project_type AS projectType,
      pr.client_number AS clientNumber,
      pr.description,
      pr.status,
      pr.admin_note AS adminNote,
      pr.created_at AS createdAt,
      pr.updated_at AS updatedAt,
      u.first_name AS clientFirstName,
      u.last_name AS clientLastName
    FROM project_requests pr
    JOIN users u ON pr.client_id = u.id
    ORDER BY pr.created_at DESC
    `
  );

  return rows;
};

const findRequestsByClientId = async (clientId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      client_id AS clientId,
      account_name AS accountName,
      email,
      project_type AS projectType,
      client_number AS clientNumber,
      description,
      status,
      admin_note AS adminNote,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM project_requests
    WHERE client_id = ?
    ORDER BY created_at DESC
    `,
    [clientId]
  );

  return rows;
};

const findRequestById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      pr.id,
      pr.client_id AS clientId,
      pr.account_name AS accountName,
      pr.email,
      pr.project_type AS projectType,
      pr.client_number AS clientNumber,
      pr.description,
      pr.status,
      pr.admin_note AS adminNote,
      pr.created_at AS createdAt,
      pr.updated_at AS updatedAt,
      u.first_name AS clientFirstName,
      u.last_name AS clientLastName
    FROM project_requests pr
    JOIN users u ON pr.client_id = u.id
    WHERE pr.id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

const updateRequestStatus = async (id, { status, adminNote }) => {
  const [result] = await pool.query(
    `
    UPDATE project_requests
    SET status = ?, admin_note = ?
    WHERE id = ?
    `,
    [status, adminNote || null, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findRequestById(id);
};

const deleteRequest = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM project_requests
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  createRequest,
  findAllRequests,
  findRequestsByClientId,
  findRequestById,
  updateRequestStatus,
  deleteRequest,
};