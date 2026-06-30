const chatbotService = require("./chatbot.service");

const handleMessage = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    const response = await chatbotService.sendMessage({
      userId,
      message: req.body.message,
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleMessage,
};