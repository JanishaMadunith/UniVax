const express = require('express');
const router = express.Router();
const { createLog, getLogs, getLogById, updateLog, deleteLog } = require("../../Controllers/ImmunizationLogs/immunization.controller.js");
const authMiddleware = require('../../middlewares/auth.middleware.js');  // Placeholder for JWT/role check

// Protected routes
router.post('/', authMiddleware(['doctor', 'admin']), createLog);  // Only doctors/admins create
router.get('/', authMiddleware(['user', 'doctor', 'admin']), getLogs);
router.get('/:id', authMiddleware(['user', 'doctor', 'admin']), getLogById);
router.put('/:id', authMiddleware(['doctor', 'admin']), updateLog);
router.delete('/:id', authMiddleware(['admin']), deleteLog);  // Only admins delete

module.exports = router;