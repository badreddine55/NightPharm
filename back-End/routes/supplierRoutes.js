const express = require('express');
const router = express.Router();
const {
  createSupplier,
  loginSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');  // Import individual controller functions

const { protect, checkRole } = require('../middleware/authMiddleware');

// Define the routes
router.post('/', protect, checkRole(['superadmin', 'nurse']), createSupplier); // Use the exported createSupplier function
router.post('/login', loginSupplier); // Use the exported loginSupplier function
router.get('/', protect, checkRole(['superadmin', 'nurse']), getAllSuppliers); // Use the exported getAllSuppliers function
router.get('/:id', protect, checkRole(['superadmin', 'nurse']), getSupplierById); // Use the exported getSupplierById function
router.put('/:id', protect, checkRole(['superadmin', 'nurse']), updateSupplier); // Use the exported updateSupplier function
router.delete('/:id', protect, checkRole(['superadmin', 'nurse']), deleteSupplier); // Use the exported deleteSupplier function

module.exports = router;
