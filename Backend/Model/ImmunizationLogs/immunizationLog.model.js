const mongoose = require('mongoose');
const axios = require('axios');

const immunizationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',  // Reference to User model (matches UserModel.js export)
    required: true,
  },
  vaccineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VaccineProduct',  // Reference to Vaccine model
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

// Example function to get vaccine information
async function getVaccineInfo(vaccineId) {
  try {
    const response = await axios.get(`/api/vaccines/${vaccineId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vaccine info:', error);
    return null;
  }
}