// API Service for Vaccines and Doses
const API_URL = import.meta.env.VITE_API_URL;

// Helper function for making API calls
const makeRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
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
    try {
      return await makeRequest(`/vaccines?${queryParams}`);
    } catch (error) {
      // If no vaccines found (404), return empty array instead of throwing
      if (error.message.includes('No vaccines found')) {
        return { success: true, count: 0, data: [] };
      }
      throw error;
    }
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
    try {
      return await makeRequest(`/doses/vaccine/${vaccineId}`);
    } catch (error) {
      // If no doses found (404), return empty array instead of throwing
      if (error.message.includes('No doses found') || error.message.includes('not exist')) {
        return { success: true, count: 0, data: [] };
      }
      throw error;
    }
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

// ============== USER API CALLS ==============

export const userAPI = {
  // Get all users
  getAllUsers: async () => {
    try {
      return await makeRequest('/api/V1/users', {
        method: 'GET',
      });
    } catch (error) {
      if (error.message.includes('No users found')) {
        return { success: true, count: 0, users: [] };
      }
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    return makeRequest(`/api/V1/users/${id}`, {
      method: 'GET',
    });
  },

  // Update user
  updateUser: async (id, userData) => {
    return makeRequest(`/api/V1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  deleteUser: async (id) => {
    return makeRequest(`/api/V1/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Change user role
  changeUserRole: async (id, newRole) => {
    return makeRequest(`/api/V1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole }),
    });
  },

  // Suspend/Unsuspend user account
  updateAccountStatus: async (id, status) => {
    return makeRequest(`/api/V1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ accountStatus: status }),
    });
  },
};
