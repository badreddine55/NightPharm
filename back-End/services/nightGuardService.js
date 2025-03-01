const NightGuard = require('../models/NightGuard');
const Nurse = require('../models/Nurse');

/**
 * Assigns a nurse to night guard and records the assignment in the database.
 * @param {string} nurseId - The ID of the nurse to assign.
 * @param {string} shiftTime - The shift time (e.g., "10 PM - 6 AM").
 * @param {Date} date - The date of the night guard shift.
 * @param {string} location - The location of the night guard shift.
 * @returns {Object} - The created night guard record.
 * @throws {Error} - If the nurse is not found or an error occurs.
 */
const assignNightGuard = async (nurseId, shiftTime, date, location) => {
  try {
    // Check if the nurse exists
    const nurse = await Nurse.findById(nurseId);
    if (!nurse) {
      throw new Error('Nurse not found');
    }

    // Create a new night guard record
    const nightGuard = new NightGuard({
      shiftTime,
      date,
      location,
      id_nurse: nurseId,
    });

    // Save the night guard record to the database
    await nightGuard.save();

    console.log('Night guard assignment recorded successfully:', nightGuard);
    return nightGuard;
  } catch (error) {
    console.error('Error assigning night guard:', error);
    throw error;
  }
};

module.exports = {
  assignNightGuard,
};