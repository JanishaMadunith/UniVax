const ImmunizationLog = require("../../Model/Sajith/immunizationLog.model");
//const axios = require('axios');  // For third-party API

class ImmunizationLogService {
  async createLog(data) {
    // Third-party API integration: Fetch vaccine info from CDC API (example)
    try {
      const vaccineInfo = await axios.get(`https://api.cdc.gov/vaccines/info/${data.vaccineId}`);  // Replace with real API endpoint
      data.notes = data.notes || `Vaccine details: ${vaccineInfo.data.description}`;  // Enhance notes with API data
    } catch (apiError) {
      console.error('Third-party API error:', apiError);  // Handle gracefully, don't fail creation
    }

    const log = new ImmunizationLog(data);
    return await log.save();
  }

  async getLogs(userId, role) {
    const query = role === 'admin' ? {} : { userId };  // Admins see all, users see own
    return await ImmunizationLog.find(query).populate('userId vaccineId');  // Populate references for integration
  }

  async getLogById(id) {
    return await ImmunizationLog.findById(id).populate('userId vaccineId');
  }

  async updateLog(id, data) {
    return await ImmunizationLog.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteLog(id) {
    return await ImmunizationLog.findByIdAndDelete(id);
  }
}

module.exports = new ImmunizationLogService();