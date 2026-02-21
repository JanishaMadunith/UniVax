const express = require('express');
const router = express.Router();
const doseController = require('../../Controllers/Dillon/DoseController');

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
router.post('/vaccine/:vaccineId', validateDose, doseController.createDose);
router.get('/vaccine/:vaccineId', doseController.getVaccineDoses);
router.get('/:id', doseController.getDoseById);
router.put('/:id', validateDose, doseController.updateDose);
router.delete('/:id', doseController.deleteDose);
router.post('/calculate', doseController.calculateDueDate);

module.exports = router;