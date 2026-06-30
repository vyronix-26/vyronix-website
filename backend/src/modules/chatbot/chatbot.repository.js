const pool = require("../../config/db");

const saveMessage = async ({ userId = null, sender, message }) => {
  const [result] = await pool.query(
    `
    INSERT INTO chatbot_messages (user_id, sender, message)
    VALUES (?, ?, ?)
    `,
    [userId, sender, message]
  );

  return {
    id: result.insertId,
    userId,
    sender,
    message,
  };
};

module.exports = {
  saveMessage,
};