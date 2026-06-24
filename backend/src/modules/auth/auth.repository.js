const pool = require("../../config/db");

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email = ? LIMIT 1`,
    [email]
  );

  return rows[0];
};

const createUser = async ({ fullName, email, password }) => {
  const [result] = await pool.query(
    `INSERT INTO users (full_name, email, password, role)
     VALUES (?, ?, ?, 'CLIENT')`,
    [fullName, email, password]
  );

  return {
    id: result.insertId,
    fullName,
    email,
    role: "CLIENT",
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