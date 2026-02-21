const express = require("express");
const userRoutes = require("./Routes/Tharusha/UserRoutes");
const vaccineRoutes = require("./Routes/Dillon/VaccineRoutes");
const doseRoutes = require("./Routes/Dillon/DoseRoutes");
const appointmentRoutes = require("./Routes/Janeesha/AppointmentRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/vaccines", vaccineRoutes);
app.use("/doses", doseRoutes);
app.use("/appointments", appointmentRoutes);

module.exports = app;
