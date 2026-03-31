// API Service for Vaccines and Doses
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for making API calls
const makeRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============== VACCINE API CALLS ==============

export const vaccineAPI = {
  // Get all vaccines
  getAllVaccines: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    return makeRequest(`/vaccines?${queryParams}`);
  },

  // Get single vaccine by ID
  getVaccineById: async (id) => {
    return makeRequest(`/vaccines/${id}`);
  },

  // Create new vaccine
  createVaccine: async (vaccineData) => {
    return makeRequest('/vaccines', {
      method: 'POST',
      body: JSON.stringify(vaccineData),
    });
  },

  // Update vaccine
  updateVaccine: async (id, vaccineData) => {
    return makeRequest(`/vaccines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vaccineData),
    });
  },

  // Delete vaccine
  deleteVaccine: async (id, reason = '') => {
    return makeRequest(`/vaccines/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  },

  // Get vaccine history/versions
  getVaccineHistory: async (id) => {
    return makeRequest(`/vaccines/${id}/history`);
  },
};

// ============== DOSE API CALLS ==============

export const doseAPI = {
  // Get all doses for a vaccine
  getVaccineDoses: async (vaccineId) => {
    return makeRequest(`/doses/vaccine/${vaccineId}`);
  },

  // Get single dose by ID
  getDoseById: async (id) => {
    return makeRequest(`/doses/${id}`);
  },

  // Create new dose for a vaccine
  createDose: async (vaccineId, doseData) => {
    return makeRequest(`/doses/vaccine/${vaccineId}`, {
      method: 'POST',
      body: JSON.stringify(doseData),
    });
  },

  // Update dose
  updateDose: async (id, doseData) => {
    return makeRequest(`/doses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doseData),
    });
  },

  // Delete dose
  deleteDose: async (id) => {
    return makeRequest(`/doses/${id}`, {
      method: 'DELETE',
    });
  },

  // Calculate next due date
  calculateDueDate: async (vaccineId, patientAgeMonths, lastDoseDate = null, doseNumber = 1) => {
    return makeRequest('/doses/calculate', {
      method: 'POST',
      body: JSON.stringify({
        vaccineId,
        patientAgeMonths,
        lastDoseDate,
        doseNumber,
      }),
    });
  },
};
