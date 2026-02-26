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
  groq: {
    apiKey: process.env.GROQ_API_KEY,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    secretKey: process.env.SUPABASE_SECRET_KEY,
  },
  crawlers: {
    firecrawlApiKey: process.env.FIRECRAWL_API_KEY,
    jinaApiKey: process.env.JINA_API_KEY,
  },
};
