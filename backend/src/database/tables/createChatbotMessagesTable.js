const pool = require("../../config/db");

const createChatbotMessagesTable = async () => {
  const chatbotMessagesTable = `
    CREATE TABLE IF NOT EXISTS chatbot_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      sender ENUM('USER', 'BOT') NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `;

  await pool.query(chatbotMessagesTable);
};

module.exports = createChatbotMessagesTable;