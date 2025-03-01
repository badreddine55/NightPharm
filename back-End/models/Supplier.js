const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  SuppliersInfo: { type: String, required: true },
  Address: { type: String, required: true },
  DeliveryDate: { type: Date, required: true },
  Amount: { type: Number, required: true },
  Status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },
  phoneNumber: { type: String, required: true }, 
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  role: { type: String, default: 'Supplier' }, // Added role field
});

module.exports = mongoose.model('Supplier', SupplierSchema);
