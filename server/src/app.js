const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const adviceRoutes = require("./routes/adviceRoutes");
const accountRoutes = require("./routes/accountRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://product-advisor-red.vercel.app/sign-in",
      "https://product-advisor-red.vercel.app/",
      "https://product-advisor-red.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());


app.use("/api/advice", adviceRoutes);
app.use("/api/history", adviceRoutes);
app.use("/api/account", accountRoutes);
app.use("/health", healthRoutes);


app.use(errorHandler);

module.exports = app;
