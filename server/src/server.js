const app = require("./app");
const config = require("./config/config");

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Gemini API Key Loaded: ${config.gemini.apiKey ? config.gemini.apiKey.substring(0, 10) + "..." : "MISSING"}`);
  console.log(`Groq API Key Loaded: ${config.groq.apiKey ? config.groq.apiKey.substring(0, 10) + "..." : "MISSING"}`);
});
