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
      slug VARCHAR(180) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      github_url VARCHAR(500),
      live_url VARCHAR(500),
      type ENUM('SOFTWARE', 'UI_DESIGN') NOT NULL,
      category VARCHAR(100) NOT NULL,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  await pool.query(projectsTable);

  const hasSlug = await columnExists("projects", "slug");
  if (!hasSlug) {
    await pool.query(`
      ALTER TABLE projects
      ADD COLUMN slug VARCHAR(180) NOT NULL UNIQUE
    `);
  }

  const hasCategory = await columnExists("projects", "category");
  if (!hasCategory) {
    await pool.query(`
      ALTER TABLE projects
      ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT 'GENERAL'
    `);
  }

  const hasIsFeatured = await columnExists("projects", "is_featured");
  if (!hasIsFeatured) {
    await pool.query(`
      ALTER TABLE projects
      ADD COLUMN is_featured BOOLEAN DEFAULT FALSE
    `);
  }

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