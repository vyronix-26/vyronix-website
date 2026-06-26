const pool = require("../../config/db");
const { addColumnIfNotExists } = require("../schemaHelpers");

const createProjectsTable = async () => {
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

  await addColumnIfNotExists("projects", "slug", "VARCHAR(180) UNIQUE");
  await addColumnIfNotExists("projects", "category", "VARCHAR(100) NOT NULL DEFAULT 'GENERAL'");
  await addColumnIfNotExists("projects", "is_featured", "BOOLEAN DEFAULT FALSE");
};

module.exports = createProjectsTable;