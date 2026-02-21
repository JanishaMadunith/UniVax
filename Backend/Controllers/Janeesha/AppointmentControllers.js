const Appointment = require("../../Model/Janeesha/AppointmentModel");

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

        const newAppointment = new Appointment({
            fullName,
            email,
            phone,
            vaccineType,
            doseNumber,
            ageGroup,
            appointmentDate,
            appointmentTime
        });

        await newAppointment.save();

        res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            appointment: newAppointment
        });

    } catch (error) {
        console.error("Create appointment error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during appointment creation"
        });
    }
};

// Get All Appointments
const getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find();

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No appointments found"
            });
        }

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments
        });

    } catch (error) {
        console.error("Get appointments error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching appointments"
        });
    }
};

// Get Appointment by ID
const getAppointmentById = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            success: true,
            appointment
        });

    } catch (error) {
        console.error("Get appointment error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching appointment"
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

        const updatedAppointment = await Appointment.findByIdAndUpdate(
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
            },
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Appointment updated successfully",
            appointment: updatedAppointment
        });

    } catch (error) {
        console.error("Update appointment error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating appointment"
        });
    }
};

// Delete Appointment
const deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Appointment deleted successfully"
        });

    } catch (error) {
        console.error("Delete appointment error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting appointment"
        });
    }
};

exports.createAppointment = createAppointment;
exports.getAllAppointments = getAllAppointments;
exports.getAppointmentById = getAppointmentById;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
