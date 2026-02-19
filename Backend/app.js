const express = require("express");
const userRoutes = require("./Routes/Tharusha/UserRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use('/api/immunization-logs', immunizationLogRoutes);

module.exports = app;