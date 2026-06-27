const pool = require("../../config/db");

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email = ? LIMIT 1`,
    [email]
  );

  return rows[0];
};

const createUser = async ({ firstName, lastName, email, password }) => {
  const [result] = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, role)
     VALUES (?, ?, ?, ?, 'CLIENT')`,
    [firstName, lastName, email, password]
  );

  return {
    id: result.insertId,
    firstName,
    lastName,
    email,
    role: "CLIENT",
  };
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
      created_at AS createdAt
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

const findUserAuthById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows[0];
};

const updateRefreshToken = async (userId, hashedRefreshToken) => {
  await pool.query(
    `UPDATE users SET refresh_token = ? WHERE id = ?`,
    [hashedRefreshToken, userId]
  );
};

const clearRefreshToken = async (userId) => {
  await pool.query(
    `UPDATE users SET refresh_token = NULL WHERE id = ?`,
    [userId]
  );
};

const updateLastLogin = async (userId) => {
  await pool.query(
    `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`,
    [userId]
  );
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  findUserAuthById,
  updateRefreshToken,
  clearRefreshToken,
  updateLastLogin,
};