/**
 * Profile Repository
 *
 * This file handles all database operations related to user profiles.
 * It communicates directly with the MySQL database using the shared pool
 * connection and returns clean JavaScript objects to the service layer.
 *
 * Responsibilities:
 * - Retrieve a user's profile by ID.
 * - Update editable profile information.
 * - Retrieve the user's hashed password.
 * - Update the user's password.
 * - Check if a phone number already exists.
 *
 * Database table:
 * - users
 *
 * Main fields:
 * - first_name
 * - last_name
 * - email
 * - phone
 * - profile_image
 * - role
 * - is_active
 * - email_verified
 * - last_login
 * - created_at
 * - updated_at
 *
 * Notes:
 * - The repository does not perform business validation.
 * - Validation and authorization are handled in the service layer.
 * - Profile images are uploaded before reaching this repository.
 * - Database snake_case fields are mapped to camelCase fields
 *   for cleaner API responses.
 */

const pool = require("../../config/db");

const findProfileById = async (userId) => {
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
    [userId]
  );

  return rows[0];
};

const findUserByPhone = async (phone) => {
  const [rows] = await pool.query(
    `
    SELECT id, phone
    FROM users
    WHERE phone = ?
    LIMIT 1
    `,
    [phone]
  );

  return rows[0];
};

const updateProfile = async (userId, profileData) => {
  const fieldsMap = {
    firstName: "first_name",
    lastName: "last_name",
    phone: "phone",
    profileImage: "profile_image",
  };

  const fields = [];
  const values = [];

  Object.keys(profileData).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(fieldsMap, key)) {
      fields.push(`${fieldsMap[key]} = ?`);
      values.push(profileData[key]);
    }
  });

  if (fields.length === 0) {
    return findProfileById(userId);
  }

  values.push(userId);

  const [result] = await pool.query(
    `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    values
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findProfileById(userId);
};

const findUserPasswordById = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT id, password
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [userId]
  );

  return rows[0];
};

const updatePassword = async (userId, hashedPassword) => {
  await pool.query(
    `
    UPDATE users
    SET password = ?
    WHERE id = ?
    `,
    [hashedPassword, userId]
  );
};

module.exports = {
  findProfileById,
  findUserByPhone,
  updateProfile,
  findUserPasswordById,
  updatePassword,
};