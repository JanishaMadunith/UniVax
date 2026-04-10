const ImmunizationLog = require("../../Model/ImmunizationLogs/immunizationLog.model.js");
const axios = require('axios');  // For third-party API

class ImmunizationLogService {
  async createLog(data) {
    // Third-party API integration: Fetch vaccine info from CDC API (example)
    try {
      // const vaccineInfo = await axios.get(`https://api.cdc.gov/vaccines/info/${data.vaccineId}`);  // Replace with real API endpoint
      // data.notes = data.notes || `Vaccine details: ${vaccineInfo.data.description}`;  // Enhance notes with API data
    } catch (apiError) {
      console.error('Third-party API error:', apiError);  // Handle gracefully, don't fail creation
    }

    const log = new ImmunizationLog(data);
    const savedLog = await log.save().then((doc) => doc.populate('userId vaccineId'));

    // Professional email notification via Brevo (non-blocking)
    try {
      const senderEmail = process.env.BREVO_SENDER_EMAIL;
      const senderName = process.env.BREVO_SENDER_NAME || 'UniVax Team';
      const apiKey = process.env.BREVO_API_KEY;

      if (senderEmail && apiKey) {
        const patientEmail =
          savedLog?.userId?.email ||
          process.env.BREVO_TEST_RECIPIENT ||
          'patient-test@gmail.com';

        await axios.post(
          'https://api.brevo.com/v3/smtp/email',
          {
            sender: {
              name: senderName,
              email: senderEmail,
            },
            to: [{ email: patientEmail }],
            subject: `Vaccination Certificate - ${savedLog.brand} Dose ${savedLog.doseNumber}`,
            htmlContent: `
              <h2>Immunization Certificate</h2>
              <p>Dear Patient,</p>
              <p>Your vaccination has been successfully recorded.</p>
              <ul>
                <li><strong>Vaccine:</strong> ${savedLog.brand}</li>
                <li><strong>Batch:</strong> ${savedLog.batchNumber}</li>
                <li><strong>Date:</strong> ${new Date(savedLog.dateAdministered).toLocaleDateString()}</li>
                <li><strong>Dose:</strong> ${savedLog.doseNumber}</li>
                <li><strong>Clinic:</strong> ${savedLog.clinic}</li>
              </ul>
              <p>Thank you for keeping your records up to date with UniVax!</p>
            `,
          },
          {
            headers: {
              'api-key': apiKey,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('✓ Brevo email sent successfully');
      } else {
        console.warn('Brevo email skipped: missing BREVO_API_KEY or BREVO_SENDER_EMAIL');
      }
    } catch (emailError) {
      console.error('Brevo email failed (non-blocking):', emailError.message);
    }

    return savedLog;
  }

  async getLogs(userId, role) {
    // Admins and Doctors can see all logs
    // Regular users (Patients) can only see their own logs
    if (role === 'Admin' || role === 'Doctor') {
      return await ImmunizationLog.find().populate('userId vaccineId');
    }
    return await ImmunizationLog.find({ userId }).populate('userId vaccineId');
  }

  async getLogsByUserId(userId) {
    // Get logs for a specific user (patient)
    return await ImmunizationLog.find({ userId }).populate('userId vaccineId');
  }

  async getLogById(id) {
    return await ImmunizationLog.findById(id).populate('userId vaccineId');
  }

  async updateLog(id, data) {
    return await ImmunizationLog.findByIdAndUpdate(id, data, { new: true }).populate('userId vaccineId');
  }

  async deleteLog(id) {
    return await ImmunizationLog.findByIdAndDelete(id);
  }
}

module.exports = new ImmunizationLogService();