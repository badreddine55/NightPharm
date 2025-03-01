const { assignNightGuard } = require('../services/nightGuardService');

/**
 * Handles the assignment of a nurse to night guard.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const assignNurseToNightGuard = async (req, res) => {
  const { nurseId, shiftTime, date, location } = req.body;

  try {
    
    const nightGuard = await assignNightGuard(nurseId, shiftTime, date, location);

    res.status(201).json({
      message: 'Nurse assigned to night guard successfully',
      nightGuard,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  assignNurseToNightGuard,
};