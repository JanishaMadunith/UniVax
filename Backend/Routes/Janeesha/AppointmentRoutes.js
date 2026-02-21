const express = require("express");
const router = express.Router();
const AppointmentController = require("../../Controllers/Janeesha/AppointmentControllers");

router.post("/create", AppointmentController.createAppointment);
router.get("/", AppointmentController.getAllAppointments);
router.get("/:id", AppointmentController.getAppointmentById);
router.put("/:id", AppointmentController.updateAppointment);
router.delete("/:id", AppointmentController.deleteAppointment);

module.exports = router;
