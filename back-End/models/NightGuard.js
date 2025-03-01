const mongoose = require('mongoose');

const NightGuardSchema = new mongoose.Schema({
  shiftTime: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  id_nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse', required: true },
});

module.exports = mongoose.model('NightGuard', NightGuardSchema);