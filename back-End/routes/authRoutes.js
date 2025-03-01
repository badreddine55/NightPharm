const express = require('express');
const {
  login,
  forgetPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;