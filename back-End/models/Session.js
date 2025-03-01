const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  expiry: { type: Date, required: true },
  ipAddress: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Session', SessionSchema);