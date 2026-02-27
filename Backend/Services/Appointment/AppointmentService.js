const Appointment = require("../../Model/Appointment/AppointmentModel");

// Create Appointment Service
const createAppointment = async (appointmentData) => {
    try {
        const newAppointment = new Appointment(appointmentData);
        await newAppointment.save();
        return {
            success: true,
            message: "Appointment created successfully",
            appointment: newAppointment
        };
    } catch (error) {
        throw {
            status: 500,
            message: "Server error during appointment creation",
            error: error.message
        };
    }
};

// Get All Appointments Service
const getAllAppointments = async () => {
    try {
        const appointments = await Appointment.find();

        if (!appointments || appointments.length === 0) {
            throw {
                status: 404,
                message: "No appointments found"
            };
        }

        return {
            success: true,
            count: appointments.length,
            appointments
        };
    } catch (error) {
        if (error.status) {
            throw error;
        }
        throw {
            status: 500,
            message: "Server error while fetching appointments",
            error: error.message
        };
    }
};

// Get Appointment by ID Service
const getAppointmentById = async (appointmentId) => {
    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            throw {
                status: 404,
                message: "Appointment not found"
            };
        }

        return {
            success: true,
            appointment
        };
    } catch (error) {
        if (error.status) {
            throw error;
        }
        throw {
            status: 500,
            message: "Server error while fetching appointment",
            error: error.message
        };
    }
};

// Update Appointment Service
const updateAppointment = async (appointmentId, updateData) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            throw {
                status: 404,
                message: "Appointment not found"
            };
        }

        return {
            success: true,
            message: "Appointment updated successfully",
            appointment: updatedAppointment
        };
    } catch (error) {
        if (error.status) {
            throw error;
        }
        throw {
            status: 500,
            message: "Server error while updating appointment",
            error: error.message
        };
    }
};

// Delete Appointment Service
const deleteAppointment = async (appointmentId) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(appointmentId);

        if (!appointment) {
            throw {
                status: 404,
                message: "Appointment not found"
            };
        }

        return {
            success: true,
            message: "Appointment deleted successfully"
        };
    } catch (error) {
        if (error.status) {
            throw error;
        }
        throw {
            status: 500,
            message: "Server error while deleting appointment",
            error: error.message
        };
    }
};

exports.createAppointment = createAppointment;
exports.getAllAppointments = getAllAppointments;
exports.getAppointmentById = getAppointmentById;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
