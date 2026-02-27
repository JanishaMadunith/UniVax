const express = require('express');
const router = express.Router();
const doseController = require('../../Controllers/vaccineCatalog/DoseController');
const authMiddleware = require("../../middlewares/auth.middleware"); 

// Validation middleware for doses
const validateDose = (req, res, next) => {
  const { doseNumber, minAge } = req.body;
  const errors = [];

  if (!doseNumber || doseNumber < 1) {
    errors.push('Dose number must be a positive integer');
  }

  if (minAge && (!minAge.value || minAge.value < 0)) {
    errors.push('Min age value must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

// Dose routes
router.post('/vaccine/:vaccineId',authMiddleware(['Doctor', 'Admin']),validateDose, doseController.createDose);
router.get('/vaccine/:vaccineId',authMiddleware(['Patient', 'Doctor', 'Admin']), doseController.getVaccineDoses);
router.get('/:id', authMiddleware(['Patient', 'Doctor', 'Admin']), doseController.getDoseById);
router.put('/:id', authMiddleware(['Doctor', 'Admin']), validateDose, doseController.updateDose);
router.delete('/:id', authMiddleware(['Doctor', 'Admin']), doseController.deleteDose);
router.post('/calculate', authMiddleware(['Doctor', 'Admin']),doseController.calculateDueDate);

module.exports = router;