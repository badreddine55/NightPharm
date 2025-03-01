const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const pharmacyController = require('../controllers/pharmacyController');
const Pharmacy = require('../models/Pharmacy');
const upload = require('../config/multerConfig'); // Assuming multer config is extracted

// Public routes (no authentication required)
router.get('/', pharmacyController.getAllPharmacies);
router.get('/:id', pharmacyController.getPharmacyById);

// Route to fetch nearby pharmacies
router.get('/nearby', async (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const nearbyPharmacies = await Pharmacy.findNearby(latitude, longitude); // Assuming this method exists
    res.status(200).json(nearbyPharmacies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected routes (authentication and role-based access control required)
router.post('/', protect, checkRole(['superadmin']), upload.single('image'), pharmacyController.createPharmacy);
router.put('/:id',protect, checkRole(['superadmin']), upload.single('image'), pharmacyController.updatePharmacy);
router.delete('/:id', protect, checkRole(['superadmin']), pharmacyController.deletePharmacy);

module.exports = router;