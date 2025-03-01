const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse',
    required: true,
  },
  name: { type: String, required: true },
  address: { type: String, required: true },
  specialization: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  workingHours: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', ReportSchema);