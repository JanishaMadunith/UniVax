const express = require('express');
const router = express.Router();
const vaccineController = require('../../Controllers/vaccineCatalog/VaccineController');
const authMiddleware = require("../../middlewares/auth.middleware");

// Validation middleware (you can move this to a separate file)
const validateVaccine = (req, res, next) => {
  const { name, manufacturer, cvxCode, totalDoses } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Vaccine name must be at least 2 characters');
  }

  if (!manufacturer) {
    errors.push('Manufacturer is required');
  }

  if (!cvxCode || !/^\d+$/.test(cvxCode)) {
    errors.push('Valid CVX code is required (numeric)');
  }

  if (!totalDoses || totalDoses < 1) {
    errors.push('Total doses must be at least 1');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

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

// Vaccine CRUD routes
router.route('/')
  .get(authMiddleware(['Patient', 'Doctor', 'Admin']), vaccineController.getAllVaccines)
  .post(authMiddleware(['Doctor', 'Admin']), validateVaccine, vaccineController.createVaccine);

router.route('/:id')
  .get(authMiddleware(['Patient', 'Doctor', 'Admin']), vaccineController.getVaccineById)
  .put(authMiddleware(['Doctor', 'Admin']), validateVaccine, vaccineController.updateVaccine)
  .delete(authMiddleware(['Doctor', 'Admin']), vaccineController.deleteVaccine);

router.get('/:id/history', authMiddleware(['Patient', 'Doctor', 'Admin']), vaccineController.getVaccineHistory);

module.exports = router;