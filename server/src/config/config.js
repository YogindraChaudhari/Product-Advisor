require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    apiEndpoint: "https://generativelanguage.googleapis.com/v1",
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    secretKey: process.env.SUPABASE_SECRET_KEY,
  },
};
