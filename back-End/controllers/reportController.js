const Report = require('../models/Report');
const Nurse = require('../models/Nurse');
const NightGuard = require('../models/NightGuard');

const submitReport = async (req, res) => {
  const { message } = req.body;
  const nurseId = req.user.id;

  try {
    const nurse = await Nurse.findById(nurseId);

    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    const report = new Report({
      nurse: nurseId,
      name: nurse.name,
      address: nurse.address,
      specialization: nurse.specialization,
      yearsOfExperience: nurse.yearsOfExperience,
      workingHours: nurse.workingHours,
      message,
    });

    await report.save();

    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    await report.save();

    if (status === 'accepted') {
      const nurse = await Nurse.findById(report.nurse);

      if (nurse) {
       
        nurse.hasGuard = false;
        nurse.workingHours = '7:00 AM - 19:00 PM'; 
        await nurse.save();

        const newNightGuardNurse = await Nurse.findOne({
          hasGuard: false,
          _id: { $ne: nurse._id },
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: nurse.location.coordinates,
              },
              $maxDistance: 10000,
            },
          },
        });

        if (newNightGuardNurse) {
          
          newNightGuardNurse.hasGuard = true;
          newNightGuardNurse.workingHours = '19:00 PM - 7:00 AM';
          await newNightGuardNurse.save();

          const nightGuard = new NightGuard({
            shiftTime: newNightGuardNurse.workingHours,
            date: new Date(),
            location: newNightGuardNurse.location,
            id_nurse: newNightGuardNurse._id,
          });

          await nightGuard.save();

          res.status(200).json({
            message: 'Report status updated successfully. Night guard duty assigned to a nearby nurse.',
            report,
            newNightGuardNurse,
          });
        } else {
          res.status(200).json({
            message: 'Report status updated successfully, but no nearby nurse is available for night guard duty.',
            report,
          });
        }
      }
    } else {
      res.status(200).json({ message: 'Report status updated successfully', report });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitReport,
  getAllReports,
  getReportById,
  updateReportStatus,
};