const pool = require("../../config/db");
const { addColumnIfNotExists } = require("../schemaHelpers");

const createServicesTable = async () => {
  const servicesTable = `
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  await pool.query(servicesTable);

  await addColumnIfNotExists("services", "is_active", "BOOLEAN DEFAULT TRUE");
  await addColumnIfNotExists("services", "display_order", "INT DEFAULT 0");
};

module.exports = createServicesTable;