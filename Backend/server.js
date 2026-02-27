require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const userRoutes = require("./Routes/users/UserRoutes");
const vaccineRoutes = require("./Routes/vaccineCatalog/VaccineRoutes");
const doseRoutes = require("./Routes/vaccineCatalog/DoseRoutes");
const appointmentRoutes = require("./Routes/Appointment/AppointmentRoutes");
const authMiddleware = require("./middlewares/auth.middleware");  // Placeholder for JWT/role check
const immunizationLogRoutes = require("./Routes/ImmunizationLogs/immunizationLog.routes");  // New route for immunization logs

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/V1/users", userRoutes);
app.use("/api/V1/vaccines", vaccineRoutes);
app.use("/api/V1/doses", doseRoutes);
app.use("/api/V1/appointments", appointmentRoutes);
app.use("/api/V1/logs",immunizationLogRoutes)  // Register immunization log routes

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// Only connect and start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  if (!MONGO_URI) {
    console.error("✗ MONGO_URI is not defined in .env file");
    process.exit(1);
  }

  // Connect to MongoDB and start server
  mongoose
    .connect(MONGO_URI) 
    .then(() => {
      console.log("✓ Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`✓ Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("✗ Database connection failed:", err.message);
      process.exit(1);
    });
}

module.exports = app;

