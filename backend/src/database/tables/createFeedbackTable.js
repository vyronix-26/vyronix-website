const pool = require("../../config/db");

const createFeedbackTable = async () => {
  const feedbackTable = `
    CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      client_id INT NOT NULL,
      rating INT NOT NULL,
      comment TEXT NOT NULL,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  await pool.query(feedbackTable);
};

module.exports = createFeedbackTable;