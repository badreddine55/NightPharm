const mongoose = require('mongoose');

const NurseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  dateOfBirth: { type: Date },
  role: {
    type: String,
    enum: ['nurse'],
    default: 'nurse',
  },
  hasGuard: { type: Boolean, default: false },
  specialization: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  workingHours: { type: String, required: true },
  pharmacyName: { type: String, required: true }, // New field for pharmacy name
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

// Create a geospatial index on the location field
NurseSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Nurse', NurseSchema);