jest.mock('axios', () => ({
  post: jest.fn(),
}));

const axios = require('axios');

const mockPopulate = jest.fn();
const mockSave = jest.fn();

jest.mock('../../Model/ImmunizationLogs/immunizationLog.model.js', () => {
  return jest.fn().mockImplementation(() => ({
    save: mockSave,
  }));
});

const ImmunizationLogService = require('../../Services/ImmunizationLogs/immunizationLog.service');

describe('ImmunizationLogService.createLog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BREVO_API_KEY = 'test-key';
    process.env.BREVO_SENDER_EMAIL = 'sender@example.com';
    process.env.BREVO_SENDER_NAME = 'UniVax Team';
  });

  it('should return saved document with populated fields', async () => {
    const mockData = {
      userId: '67a1b2c3d4e5f6g7h8i9j0k1',
      vaccineId: '67b2c3d4e5f6g7h8i9j0k1',
      dateAdministered: new Date(),
      doseNumber: 1,
      clinic: 'Central Clinic',
      brand: 'Pfizer',
      batchNumber: 'EW0172',
      notes: 'No side effects',
    };

    const populatedLog = {
      _id: 'log123',
      ...mockData,
      userId: { _id: mockData.userId, email: 'patient@example.com' },
      vaccineId: { _id: mockData.vaccineId, name: 'Pfizer' },
    };

    mockPopulate.mockResolvedValue(populatedLog);
    mockSave.mockResolvedValue({
      populate: mockPopulate,
    });
    axios.post.mockResolvedValue({ data: { messageId: 'mail123' } });

    const log = await ImmunizationLogService.createLog(mockData);

    expect(log).toHaveProperty('_id');
    expect(log.clinic).toBe('Central Clinic');
    expect(log).toHaveProperty('userId');
    expect(log).toHaveProperty('vaccineId');
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});
