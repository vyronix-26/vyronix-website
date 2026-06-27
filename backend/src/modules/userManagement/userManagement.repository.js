/**
 * Users Repository
 *
 * This file handles all database operations related to users.
 * It communicates directly with the MySQL database using the shared pool
 * connection and returns clean JavaScript objects to the service layer.
 *
 * Responsibilities:
 * - Retrieve all users.
 * - Retrieve a single user by ID.
 * - Update a user's active status.
 * - Update a user's role.
 * - Count active admin accounts.
 *
 * Database table:
 * - users
 *
 * Main fields:
 * - first_name
 * - last_name
 * - email
 * - phone
 * - role
 * - profile_image
 * - is_active
 * - email_verified
 * - last_login
 * - created_at
 * - updated_at
 *
 * Notes:
 * - This repository does not perform business validation.
 * - Authorization and business rules are handled in the service layer.
 * - Database snake_case fields are mapped to camelCase fields
 *   for cleaner API responses.
 */

const pool = require("../../config/db");

const findAllUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  role,
  isActive,
}) => {
  const offset = (page - 1) * limit;

  let query = `
    SELECT
      id,
      first_name AS firstName,
      last_name AS lastName,
      email,
      phone,
      role,
      profile_image AS profileImage,
      is_active AS isActive,
      email_verified AS emailVerified,
      last_login AS lastLogin,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM users
    WHERE 1 = 1
  `;

  const values = [];

  if (search) {
    query += `
      AND (
        first_name LIKE ?
        OR last_name LIKE ?
        OR email LIKE ?
      )
    `;

    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (role) {
    query += " AND role = ?";
    values.push(role);
  }

  if (isActive !== undefined) {
    query += " AND is_active = ?";
    values.push(isActive);
  }

  query += `
    ORDER BY created_at DESC
    LIMIT ?
    OFFSET ?
  `;

  values.push(Number(limit), Number(offset));

  const [rows] = await pool.query(query, values);

  return rows;
};

const countUsers = async ({ search = "", role, isActive }) => {
  let query = `
    SELECT COUNT(*) AS total
    FROM users
    WHERE 1 = 1
  `;

  const values = [];

  if (search) {
    query += `
      AND (
        first_name LIKE ?
        OR last_name LIKE ?
        OR email LIKE ?
      )
    `;

    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (role) {
    query += " AND role = ?";
    values.push(role);
  }

  if (isActive !== undefined) {
    query += " AND is_active = ?";
    values.push(isActive);
  }

  const [rows] = await pool.query(query, values);

  return rows[0].total;
};

const findUserById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      first_name AS firstName,
      last_name AS lastName,
      email,
      phone,
      role,
      profile_image AS profileImage,
      is_active AS isActive,
      email_verified AS emailVerified,
      last_login AS lastLogin,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

const updateUserStatus = async (id, isActive) => {
  const [result] = await pool.query(
    `
    UPDATE users
    SET is_active = ?
    WHERE id = ?
    `,
    [isActive, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findUserById(id);
};

const updateUserRole = async (id, role) => {
  const [result] = await pool.query(
    `
    UPDATE users
    SET role = ?
    WHERE id = ?
    `,
    [role, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findUserById(id);
};

const countActiveAdmins = async () => {
  const [rows] = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'ADMIN'
      AND is_active = TRUE
    `
  );

  return rows[0].total;
};

module.exports = {
  findAllUsers,
  countUsers,
  findUserById,
  updateUserStatus,
  updateUserRole,
  countActiveAdmins,
};