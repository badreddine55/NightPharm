const Nurse = require('../models/Nurse');
const Report = require('../models/Report');
const User = require('../models/User');
const Supplier = require('../models/Supplier');

const getCounts = async (req, res) => {
  try {
    // Get the count of all Nurses
    const nurseCount = await Nurse.countDocuments();

    // Get the count of all Reports
    const reportCount = await Report.countDocuments();

    // Get the count of all Users
    const userCount = await User.countDocuments();

    // Get the count of all Suppliers
    const supplierCount = await Supplier.countDocuments();

    // Return the counts in the response
    res.status(200).json({
      success: true,
      counts: {
        nurseCount,
        reportCount,
        userCount,
        supplierCount,
      },
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch counts',
      error: error.message,
    });
  }
};

module.exports = { getCounts };