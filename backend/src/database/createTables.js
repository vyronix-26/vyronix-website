const pool = require("../config/db");

const columnExists = async (tableName, columnName) => {
  const [rows] = await pool.query(
    `
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
    `,
    [process.env.DB_NAME, tableName, columnName]
  );

  return rows.length > 0;
};

const createTables = async () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('CLIENT', 'ADMIN') NOT NULL DEFAULT 'CLIENT',
      refresh_token VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  await pool.query(usersTable);


  const projectsTable = `
  CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    type ENUM('SOFTWARE', 'UI_DESIGN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

await pool.query(projectsTable);


  const hasRefreshToken = await columnExists("users", "refresh_token");

  if (!hasRefreshToken) {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN refresh_token VARCHAR(500)
    `);
  }

  console.log("Tables checked/created successfully");
};

module.exports = createTables;