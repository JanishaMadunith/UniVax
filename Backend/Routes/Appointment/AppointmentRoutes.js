const express = require("express");
const router = express.Router();
const AppointmentController = require("../../Controllers/Appointment/AppointmentControllers");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/create",authMiddleware(['Patient']), AppointmentController.createAppointment);
router.get("/",authMiddleware(['Admin']), AppointmentController.getAllAppointments);
router.get("/:id",authMiddleware(['Patient', 'Doctor', 'Admin']), AppointmentController.getAppointmentById);
router.put("/:id",authMiddleware(['Patient', 'Admin']), AppointmentController.updateAppointment);
router.delete("/:id",authMiddleware(['Patient', 'Admin']), AppointmentController.deleteAppointment);

module.exports = router;
