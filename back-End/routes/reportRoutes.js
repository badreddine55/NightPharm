const express = require('express');
const { protect, checkRole } = require('../middleware/authMiddleware');
const {
  submitReport,
  getAllReports,
  getReportById,
  updateReportStatus,
} = require('../controllers/reportController');

const router = express.Router();

// Nurse submits a report
router.post('/', protect, checkRole('nurse'), submitReport);

// Super admin gets all reports
router.get('/', protect, checkRole('superadmin'), getAllReports);

// Super admin gets a specific report
router.get('/:id', protect, checkRole('superadmin'), getReportById);

// Super admin updates report status
router.put('/:id', protect, checkRole('superadmin'), updateReportStatus);

module.exports = router;