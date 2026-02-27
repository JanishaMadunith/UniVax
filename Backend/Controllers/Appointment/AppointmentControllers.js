const AppointmentService = require("../../Services/Appointment/AppointmentService");

// Create Appointment
const createAppointment = async (req, res, next) => {
    try {
        const {
            fullName,
            email,
            phone,
            vaccineType,
            doseNumber,
            ageGroup,
            appointmentDate,
            appointmentTime
        } = req.body;

        // Validation
        if (!fullName || !email || !phone || !vaccineType || !doseNumber || !ageGroup || !appointmentDate || !appointmentTime) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const result = await AppointmentService.createAppointment({
            fullName,
            email,
            phone,
            vaccineType,
            doseNumber,
            ageGroup,
            appointmentDate,
            appointmentTime
        });

        res.status(201).json(result);

    } catch (error) {
        console.error("Create appointment error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error during appointment creation"
        });
    }
};

// Get All Appointments
const getAllAppointments = async (req, res, next) => {
    try {
        const result = await AppointmentService.getAllAppointments();
        res.status(200).json(result);

    } catch (error) {
        console.error("Get appointments error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error while fetching appointments"
        });
    }
};

// Get Appointment by ID
const getAppointmentById = async (req, res, next) => {
    try {
        const result = await AppointmentService.getAppointmentById(req.params.id);
        res.status(200).json(result);

    } catch (error) {
        console.error("Get appointment error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error while fetching appointment"
        });
    }
};

// Update Appointment
const updateAppointment = async (req, res, next) => {
    try {
        const {
            fullName,
            email,
            phone,
            vaccineType,
            doseNumber,
            ageGroup,
            appointmentDate,
            appointmentTime
        } = req.body;

        const result = await AppointmentService.updateAppointment(
            req.params.id,
            {
                fullName,
                email,
                phone,
                vaccineType,
                doseNumber,
                ageGroup,
                appointmentDate,
                appointmentTime
            }
        );

        res.status(200).json(result);

    } catch (error) {
        console.error("Update appointment error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error while updating appointment"
        });
    }
};

// Delete Appointment
const deleteAppointment = async (req, res, next) => {
    try {
        const result = await AppointmentService.deleteAppointment(req.params.id);
        res.status(200).json(result);

    } catch (error) {
        console.error("Delete appointment error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error while deleting appointment"
        });
    }
};

exports.createAppointment = createAppointment;
exports.getAllAppointments = getAllAppointments;
exports.getAppointmentById = getAppointmentById;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
