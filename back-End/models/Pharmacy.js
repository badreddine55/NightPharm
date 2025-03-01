const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  contactNumber: {
    type: String,
    required: true,
  },
  openHours: {
    type: String,
    required: true,
  },
  isOnDuty: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: "",
  },
});

pharmacySchema.index({ location: "2dsphere" });

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

module.exports = Pharmacy;
