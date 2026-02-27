const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    vaccineType: {
        type: String,
        required: true,
        trim: true
    },
    doseNumber: {
        type: Number,
        required: true
    },
    ageGroup: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("AppointmentModel", appointmentSchema);
