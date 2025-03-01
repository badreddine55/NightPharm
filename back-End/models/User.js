const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  role: {
    type: String,
    enum: ['user', 'superadmin', 'nurse'],
    default: 'user',
  },
  preferredPharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model('User', UserSchema);