const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  nameMedicine: { type: String, required: true },
  dosageInstructions: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  safetyThreshold: { type: Number, required: true },
  pharmacyName: { type: String, required: true }, // New field to link medicine to a pharmacy
});

module.exports = mongoose.model('Medicine', MedicineSchema);