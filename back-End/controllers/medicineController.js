const Medicine = require('../models/Medicine');

const createMedicine = async (req, res) => {
  const { nameMedicine, dosageInstructions, category, stock, price, safetyThreshold, pharmacyName } = req.body;

  try {
    const medicine = new Medicine({
      nameMedicine,
      dosageInstructions,
      category,
      stock,
      price,
      safetyThreshold,
      pharmacyName, // Include pharmacyName
    });

    await medicine.save();
    res.status(201).json({ message: 'Medicine created successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllMedicines = async (req, res) => {
  try {
    const { pharmacyName } = req.query; // Optional query parameter to filter by pharmacy
    const query = pharmacyName ? { pharmacyName } : {};
    const medicines = await Medicine.find(query);
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMedicineById = async (req, res) => {
  const { id } = req.params;

  try {
    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateMedicine = async (req, res) => {
  const { id } = req.params;
  const { nameMedicine, dosageInstructions, category, stock, price, safetyThreshold, pharmacyName } = req.body;

  try {
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { nameMedicine, dosageInstructions, category, stock, price, safetyThreshold, pharmacyName },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json({ message: 'Medicine updated successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteMedicine = async (req, res) => {
  const { id } = req.params;

  try {
    const medicine = await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};