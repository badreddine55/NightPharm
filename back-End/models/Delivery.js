const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new mongoose.Schema({
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  medicines: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
      nameMedicine: {
        type: String,
        required: true,
      },
      stock: String,
      priceForOne: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      dosageInstructions: String,
      category: String,
      safetyThreshold: String,
    },
  ],
  deliveryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "Delivered",
    enum: ["Delivered", "Pending", "In Transit"], // Example statuses
  },
});

module.exports = mongoose.model('Delivery', deliverySchema);