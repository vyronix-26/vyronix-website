const pool = require("../../config/db");

const createProjectRequestsTable = async () => {
  const projectRequestsTable = `
    CREATE TABLE IF NOT EXISTS project_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      client_id INT NOT NULL,
      account_name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      project_type VARCHAR(100) NOT NULL,
      client_number VARCHAR(30) NOT NULL,
      description TEXT NOT NULL,
      status ENUM('PENDING', 'IN_REVIEW', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
      admin_note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  await pool.query(projectRequestsTable);
};

module.exports = createProjectRequestsTable;