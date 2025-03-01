const express = require('express');
const { assignNurseToNightGuard } = require('../controllers/nightGuardController');

const router = express.Router();

// Assign a nurse to night guard
router.post('/night-guards', assignNurseToNightGuard);

module.exports = router;