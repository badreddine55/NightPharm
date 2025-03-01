const express = require('express');
const router = express.Router();
const { getCounts } = require('../controllers/countController');

// Route to get counts
router.get('/counts', getCounts);

module.exports = router;