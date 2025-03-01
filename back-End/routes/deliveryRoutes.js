const express = require('express');
const { createDelivery, getAllDeliveries, getDeliveryById ,getSupplierDeliveries} = require('../controllers/deliveryController');
const { getMedicineFromDeliveryById,updateMedicineInDelivery} = require('../controllers/deliveryToMedicineController');
const { protect, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect routes and allow specific roles
// Protect the delivery routes
router.post('/', protect, checkRole(['Supplier']), createDelivery); // Create a delivery
router.get('/', protect, checkRole(['Supplier','superadmin', 'nurse']), getAllDeliveries); // Get all deliveries (if role is Supplier or Admin)
router.get('/:id', protect, checkRole(['Supplier','superadmin', 'nurse']), getDeliveryById); // Get delivery by id
router.get('/supplierDeliveries', protect, checkRole('Supplier'), getSupplierDeliveries);
router.get('/:deliveryId/medicine/:medicineId', protect, checkRole(['nurse']), getMedicineFromDeliveryById);
router.put('/:deliveryId/medicine/:medicineId', protect, checkRole(['nurse']), updateMedicineInDelivery);


module.exports = router;
