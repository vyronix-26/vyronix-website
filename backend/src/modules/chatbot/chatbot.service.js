const { GoogleGenAI } = require("@google/genai");

const chatbotRepository = require("./chatbot.repository");
const AppError = require("../../utils/AppError");

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("GEMINI_API_KEY is not configured", 500);
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

const sendMessage = async ({ userId = null, message }) => {

  await chatbotRepository.saveMessage({
    userId,
    sender: "USER",
    message,
  });

  let botMessage;

  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction:
          "You are the Vyronix website assistant. Answer clearly, briefly, and in the same language as the user. Help users understand the company's services, projects, pricing, technologies, and how to request a project. If you don't know the answer, politely say so.",
      },
    });

    botMessage =
      typeof response.text === "string" && response.text.trim()
        ? response.text.trim()
        : "I could not process your request right now.";
  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error(error);

    if (error.status === 403) {
      botMessage =
        "The AI service is not authorized. Please check your Gemini API key and project permissions.";
    } else if (error.status === 429) {
      botMessage =
        "The AI service is busy. Please try again in a few moments.";
    } else {
      botMessage =
        "Sorry, the chatbot service is currently unavailable.";
    }
  }

  await chatbotRepository.saveMessage({
    userId,
    sender: "BOT",
    message: botMessage,
  });

  return {
    sender: "BOT",
    message: botMessage,
  };
};

module.exports = {
  sendMessage,
};