const DoseRequirement = require('../../Model/vaccineCatalog/DoseModel');
const VaccineProduct = require('../../Model/vaccineCatalog/VaccineModel');

// @desc    CREATE dose requirement
// @route   POST /api/doses/vaccine/:vaccineId
const createDose = async (req, res) => {
  try {
    const vaccine = await VaccineProduct.findById(req.params.vaccineId);
    
    if (!vaccine) {
      return res.status(404).json({
        success: false,
        error: 'Vaccine not found'
      });
    }

    // Check if dose number already exists
    const existingDose = await DoseRequirement.findOne({
      vaccineId: req.params.vaccineId,
      doseNumber: req.body.doseNumber,
      status: 'active'
    });

    if (existingDose) {
      return res.status(400).json({
        success: false,
        error: `Dose ${req.body.doseNumber} already exists for this vaccine`
      });
    }

    const dose = await DoseRequirement.create({
      ...req.body,
      vaccineId: req.params.vaccineId,
      version: 1
    });

    res.status(201).json({
      success: true,
      data: dose,
      message: 'Dose requirement created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    GET all doses for a vaccine
// @route   GET /api/doses/vaccine/:vaccineId
const getVaccineDoses = async (req, res) => {
  try {
    const doses = await DoseRequirement.find({
      vaccineId: req.params.vaccineId,
      status: { $ne: 'superseded' }
    }).sort({ doseNumber: 1 });

    res.status(200).json({
      success: true,
      count: doses.length,
      data: doses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    GET single dose by ID
// @route   GET /api/doses/:id
const getDoseById = async (req, res) => {
  try {
    const dose = await DoseRequirement.findById(req.params.id)
      .populate('vaccineId', 'name manufacturer');

    if (!dose) {
      return res.status(404).json({
        success: false,
        error: 'Dose requirement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dose
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    UPDATE a dose requirement
// @route   PUT /api/doses/:id
const updateDose = async (req, res) => {
  try {
    const oldDose = await DoseRequirement.findById(req.params.id);
    
    if (!oldDose) {
      return res.status(404).json({
        success: false,
        error: 'Dose requirement not found'
      });
    }

    // If significant change, create new version
    if (req.body.minAge || req.body.intervalFromPrevious) {
      // Mark old version as superseded
      await DoseRequirement.findByIdAndUpdate(req.params.id, {
        status: 'superseded',
        validUntil: new Date()
      });

      // Create new version
      const newDose = await DoseRequirement.create({
        ...oldDose.toObject(),
        ...req.body,
        _id: undefined,
        version: oldDose.version + 1,
        validFrom: new Date(),
        validUntil: null,
        status: 'active'
      });

      return res.status(200).json({
        success: true,
        data: newDose,
        message: 'Dose requirement updated with new version'
      });
    }

    // Minor update
    const dose = await DoseRequirement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: dose,
      message: 'Dose requirement updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    DELETE a dose requirement
// @route   DELETE /api/doses/:id
const deleteDose = async (req, res) => {
  try {
    const dose = await DoseRequirement.findById(req.params.id);

    if (!dose) {
      return res.status(404).json({
        success: false,
        error: 'Dose requirement not found'
      });
    }

    // Soft delete
    dose.status = 'superseded';
    dose.validUntil = new Date();
    await dose.save();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Dose requirement deleted (soft delete)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Calculate next due date
// @route   POST /api/doses/calculate
const calculateDueDate = async (req, res) => {
  try {
    const { vaccineId, patientAgeMonths, lastDoseDate, doseNumber } = req.body;

    const dose = await DoseRequirement.findOne({
      vaccineId,
      doseNumber: doseNumber || 1,
      status: 'active'
    });

    if (!dose) {
      return res.status(404).json({
        success: false,
        error: 'Dose requirements not found'
      });
    }

    let dueDate = null;
    let status = 'eligible';

    // First dose - based on age
    if (doseNumber === 1 || !lastDoseDate) {
      if (patientAgeMonths >= dose.minAge.value) {
        dueDate = new Date();
      } else {
        // Calculate future date when age requirement will be met
        const birthDate = new Date();
        birthDate.setMonth(birthDate.getMonth() - patientAgeMonths);
        dueDate = new Date(birthDate);
        dueDate.setMonth(dueDate.getMonth() + dose.minAge.value);
        status = 'future';
      }
    } 
    // Subsequent doses - based on interval
    else if (lastDoseDate) {
      const lastDose = new Date(lastDoseDate);
      dueDate = new Date(lastDose);
      
      if (dose.intervalFromPrevious.exactDays) {
        dueDate.setDate(dueDate.getDate() + dose.intervalFromPrevious.exactDays);
      } else if (dose.intervalFromPrevious.minDays) {
        dueDate.setDate(dueDate.getDate() + dose.intervalFromPrevious.minDays);
      }

      // Check if overdue
      if (new Date() > dueDate) {
        status = 'overdue';
      }
    }

    res.status(200).json({
      success: true,
      data: {
        dueDate,
        status,
        doseNumber: dose.doseNumber,
        minAgeRequired: dose.minAge,
        interval: dose.intervalFromPrevious
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createDose,
  getVaccineDoses,
  getDoseById,
  updateDose,
  deleteDose,
  calculateDueDate
};