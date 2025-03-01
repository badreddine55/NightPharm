const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// Create a medicine (Superadmin and Nurses only)
router.post('/', protect, checkRole(['superadmin', 'nurse']), medicineController.createMedicine);

// Get all medicines (Superadmin, Nurses, and Users)
router.get('/', protect, medicineController.getAllMedicines);

// Get a specific medicine by ID (Superadmin, Nurses, and Users)
router.get('/:id', protect, medicineController.getMedicineById);

// Update a medicine (Superadmin and Nurses only)
router.put('/:id', protect, checkRole(['superadmin', 'nurse']), medicineController.updateMedicine);

// Delete a medicine (Superadmin and Nurses only)
router.delete('/:id', protect, checkRole(['superadmin', 'nurse']), medicineController.deleteMedicine);

module.exports = router;