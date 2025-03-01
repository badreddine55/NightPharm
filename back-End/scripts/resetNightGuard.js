const mongoose = require('mongoose');
const Nurse = require('../models/Nurse');

const resetNightGuard = async () => {
  try {
    // Update all nurses' hasGuard status to false and workingHours to '7:00 AM - 19:00 PM'
    await Nurse.updateMany({}, { hasGuard: false, workingHours: '7:00 AM - 19:00 PM' });

    console.log('All nurses have been updated: hasGuard set to false and workingHours reset.');
  } catch (error) {
    console.error('Error resetting night guard:', error);
  }
};

// Export the function
module.exports = resetNightGuard;