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

const addColumnIfNotExists = async (tableName, columnName, columnDefinition) => {
  const exists = await columnExists(tableName, columnName);

  if (!exists) {
    await pool.query(`
      ALTER TABLE ${tableName}
      ADD COLUMN ${columnName} ${columnDefinition}
    `);
  }
};

module.exports = {
  columnExists,
  addColumnIfNotExists,
};