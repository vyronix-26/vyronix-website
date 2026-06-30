const pool = require("../../config/db");
const { addColumnIfNotExists } = require("../schemaHelpers");

const createUsersTable = async () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      phone VARCHAR(30),
      password VARCHAR(255) NOT NULL,
      role ENUM('CLIENT', 'ADMIN') NOT NULL DEFAULT 'CLIENT',
      profile_image VARCHAR(500),
      is_active BOOLEAN DEFAULT TRUE,
      email_verified BOOLEAN DEFAULT FALSE,
      last_login TIMESTAMP NULL,
      refresh_token VARCHAR(500),
      reset_password_token VARCHAR(255),
      reset_password_expires DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  await pool.query(usersTable);

  await addColumnIfNotExists(
    "users",
    "first_name",
    "VARCHAR(50) NOT NULL DEFAULT ''"
  );

  await addColumnIfNotExists(
    "users",
    "last_name",
    "VARCHAR(50) NOT NULL DEFAULT ''"
  );

  await addColumnIfNotExists(
    "users",
    "phone",
    "VARCHAR(30)"
  );

  await addColumnIfNotExists(
    "users",
    "profile_image",
    "VARCHAR(500)"
  );

  await addColumnIfNotExists(
    "users",
    "is_active",
    "BOOLEAN DEFAULT TRUE"
  );

  await addColumnIfNotExists(
    "users",
    "email_verified",
    "BOOLEAN DEFAULT FALSE"
  );

  await addColumnIfNotExists(
    "users",
    "last_login",
    "TIMESTAMP NULL"
  );

  await addColumnIfNotExists(
    "users",
    "refresh_token",
    "VARCHAR(500)"
  );

  await addColumnIfNotExists(
    "users",
    "reset_password_token",
    "VARCHAR(255)"
  );

  await addColumnIfNotExists(
    "users",
    "reset_password_expires",
    "DATETIME NULL"
  );
};

module.exports = createUsersTable;