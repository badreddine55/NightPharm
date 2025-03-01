const Delivery = require('../models/Delivery');
const Supplier = require('../models/Supplier');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');



// Create a new delivery
const createDelivery = async (req, res) => {
  const { medicines, deliveryDate, pharmacyName } = req.body;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the supplier
    const existingSupplier = await Supplier.findById(decoded.id);
    if (!existingSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Fetch the pharmacy by name
    const pharmacy = await Pharmacy.findOne({ name: pharmacyName });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    // Process medicines
    const medicineNames = medicines.map(med => med.nameMedicine);
    const foundMedicines = await Medicine.find({ nameMedicine: { $in: medicineNames } });

    const medicineMap = {};
    foundMedicines.forEach(med => {
      medicineMap[med.nameMedicine] = med._id;
    });

    // Create new medicines if they don't exist
    const newMedicines = medicines.filter(med => !medicineMap[med.nameMedicine]);
    if (newMedicines.length > 0) {
      const newMedicineDocs = newMedicines.map(med => ({
        nameMedicine: med.nameMedicine,
        dosageInstructions: med.dosageInstructions || '-', // Default value
        category: med.category || '-', // Default value
        stock: med.stock || med.quantity, // Default to the quantity being delivered
        price: med.priceForOne || 0, // Default value
        safetyThreshold: med.safetyThreshold || 0, // Default value
        pharmacyName: pharmacyName, // Include pharmacyName
      }));

      const createdMedicines = await Medicine.insertMany(newMedicineDocs);
      createdMedicines.forEach(med => {
        medicineMap[med.nameMedicine] = med._id;
      });
    }

    // Calculate the total amount of all medicines in the delivery
    const totalAmount = medicines.reduce((total, medicine) => {
      return total + (medicine.amount || medicine.priceForOne * medicine.quantity);
    }, 0);

    // Update the supplier's Amount field with the total amount
    existingSupplier.Amount += totalAmount;
    await existingSupplier.save();

    // Create the delivery
    const delivery = new Delivery({
      pharmacy: pharmacy._id,
      namePharmacy: pharmacy.name,
      supplier: decoded.id,
      medicines: medicines.map(med => ({
        medicine: medicineMap[med.nameMedicine],
        nameMedicine: med.nameMedicine,
        stock: med.stock || med.quantity, // Default to the quantity being delivered
        priceForOne: med.priceForOne || 0, // Default value
        quantity: med.quantity || 0, // Default value
        amount: med.amount || med.priceForOne * med.quantity,
        dosageInstructions: med.dosageInstructions || '-', // Default value
        category: med.category || '-', // Default value
        safetyThreshold: med.safetyThreshold || 0, // Default value
      })),
      deliveryDate: new Date(deliveryDate),
      status: 'Delivered',
    });

    const createdDelivery = await delivery.save();
    res.status(201).json(createdDelivery);
  } catch (error) {
    console.error("Error creating delivery:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all deliveries
const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('supplier', 'SuppliersInfo Address phoneNumber email')
      .populate('pharmacy', 'name')
      .populate('medicines.medicine', 'nameMedicine dosageInstructions category safetyThreshold');

    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single delivery by ID
const getDeliveryById = async (req, res) => {
  const { id } = req.params;

  try {
    const delivery = await Delivery.findById(id)
      .populate('supplier', 'SuppliersInfo Address phoneNumber email')
      .populate('pharmacy', 'name')
      .populate('medicines.medicine', 'nameMedicine dosageInstructions category safetyThreshold');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all deliveries for a specific supplier
const getSupplierDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ supplier: mongoose.Types.ObjectId(req.user.id) })
      .populate('supplier', 'SuppliersInfo Address phoneNumber email')
      .populate('pharmacy', 'name')
      .populate('medicines.medicine', 'nameMedicine dosageInstructions category safetyThreshold');

    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a delivery by ID
const updateDelivery = async (req, res) => {
  const { id } = req.params;
  const { medicines, deliveryDate, pharmacyName } = req.body;

  try {
    const pharmacy = await Pharmacy.findOne({ name: pharmacyName });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const medicineNames = medicines.map(med => med.nameMedicine);
    const foundMedicines = await Medicine.find({ name: { $in: medicineNames } });

    if (foundMedicines.length !== medicineNames.length) {
      return res.status(404).json({ message: 'One or more medicines not found' });
    }

    const medicineMap = {};
    foundMedicines.forEach(med => {
      medicineMap[med.name] = med._id;
    });

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      id,
      {
        pharmacy: pharmacy._id,
        namePharmacy: pharmacy.name,
        medicines: medicines.map(med => ({
          medicine: medicineMap[med.nameMedicine],
          nameMedicine: med.nameMedicine,
          stock: med.stock || '-',
          priceForOne: med.priceForOne,
          quantity: med.quantity,
          amount: med.amount || med.priceForOne * med.quantity,
          dosageInstructions: med.dosageInstructions || '-',
          category: med.category || '-',
          safetyThreshold: med.safetyThreshold || '-',
        })),
        deliveryDate: new Date(deliveryDate),
      },
      { new: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a delivery by ID
const deleteDelivery = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(id);

    if (!deletedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  getSupplierDeliveries,
  updateDelivery,
  deleteDelivery,
};