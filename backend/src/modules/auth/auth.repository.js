const pool = require("../../config/db");

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email = ? LIMIT 1`,
    [email]
  );

  return rows[0];
};

const createUser = async ({ fullName, email, password, role = "CLIENT" }) => {
  const [result] = await pool.query(
    `INSERT INTO users (full_name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [fullName, email, password, role]
  );

  return {
    id: result.insertId,
    fullName,
    email,
    role,
  };
};

const findUserById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, full_name AS fullName, email, role, created_at AS createdAt
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
};