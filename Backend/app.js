const express = require("express");
const userRoutes = require("./Routes/Tharusha/UserRoutes");
const appointmentRoutes = require("./Routes/Janeesha/AppointmentRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/appointments", appointmentRoutes);

module.exports = app;