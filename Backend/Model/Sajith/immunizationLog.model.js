const mongoose = require('mongoose');

const immunizationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User model
    required: true,
  },
  vaccineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccine',  // Reference to Vaccine model
    required: true,
  },
  dateAdministered: {
    type: Date,
    required: true,
  },
  doseNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  nextDueDate: {
    type: Date,
  },
  clinic: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  digitalCertificate: {
    type: String,  // URL or base64 for certificate
  },
}, { timestamps: true });

module.exports = mongoose.model('ImmunizationLog', immunizationLogSchema);