const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const adviceRoutes = require("./routes/adviceRoutes");
const accountRoutes = require("./routes/accountRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

// Middleware
// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://product-advisor-red.vercel.app/login",
      "https://product-advisor-red.vercel.app/",
      "https://product-advisor-red.vercel.app",
    ], // Allow local and production frontEnd URLs
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    credentials: true, // Allow cookies and other credentials
  })
);
app.use(express.json());

// Routes
app.use("/api/advice", adviceRoutes);
app.use("/api/account", accountRoutes);
app.use("/health", healthRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
