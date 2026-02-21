const immunizationLogService = require('../../services/immunizationLog.service');

const createLog = async (req, res) => {
  try {
    const log = await immunizationLogService.createLog(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLogs = async (req, res) => {
  try {
    const logs = await immunizationLogService.getLogs(req.user.id, req.user.role);  // From auth middleware
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLogById = async (req, res) => {
  try {
    const log = await immunizationLogService.getLogById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLog = async (req, res) => {
  try {
    const log = await immunizationLogService.updateLog(req.params.id, req.body);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteLog = async (req, res) => {
  try {
    const log = await immunizationLogService.deleteLog(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLog, getLogs, getLogById, updateLog, deleteLog };