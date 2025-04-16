const OpenAI = require("openai").OpenAI;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config/config");

// OpenAI setup
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// Gemini setup with v1 API
const genAI = new GoogleGenerativeAI(config.gemini.apiKey, {
  apiEndpoint: config.gemini.apiEndpoint,
});

const generateOpenAIResponse = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
};

const generateGeminiResponse = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent([{ text: prompt }]);
  const response = await result.response;
  return response.text();
};

module.exports = {
  generateOpenAIResponse,
  generateGeminiResponse,
};
