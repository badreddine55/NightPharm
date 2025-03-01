const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Pharmacy = require('../models/Pharmacy');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
      cb(null, uniqueName);
    } else {
      cb(new Error('Only .png, .jpg, and .jpeg files are allowed'));
    }
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, and .jpeg files are allowed'));
    }
  },
});

// Create Pharmacy
const createPharmacy = async (req, res) => {
  const { name, location, contactNumber, openHours, isOnDuty } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

  console.log('Saving image to:', path.join(__dirname, 'uploads', req.file?.filename || 'no-file'));

  try {
    const pharmacy = new Pharmacy({
      name,
      location: JSON.parse(location),
      contactNumber,
      openHours,
      isOnDuty: isOnDuty === 'true',
      image: imagePath,
    });

    await pharmacy.save();
    res.status(201).json({ message: 'Pharmacy created successfully', pharmacy });
  } catch (error) {
    if (req.file && fs.existsSync(path.join(__dirname, 'uploads', req.file.filename))) {
      fs.unlinkSync(path.join(__dirname, 'uploads', req.file.filename));
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Pharmacies
const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.status(200).json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Pharmacy by ID
const getPharmacyById = async (req, res) => {
  const { id } = req.params;

  try {
    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }
    res.status(200).json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Pharmacy
const updatePharmacy = async (req, res) => {
  const { id } = req.params;
  const { name, location, contactNumber, openHours, isOnDuty } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, 'uploads', req.file.filename)); // Clean up uploaded file
      }
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const updateData = {
      name,
      location: location ? JSON.parse(location) : pharmacy.location,
      contactNumber,
      openHours,
      isOnDuty: isOnDuty === 'true',
    };

    if (imagePath) {
      // Delete the old image if it exists
      if (pharmacy.image && fs.existsSync(path.join(__dirname, '..', pharmacy.image))) {
        fs.unlinkSync(path.join(__dirname, '..', pharmacy.image)); // Adjust path relative to server root
      }
      updateData.image = imagePath; // Update with new image path
    }

    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: 'Pharmacy updated successfully', pharmacy: updatedPharmacy });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, 'uploads', req.file.filename));
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Pharmacy
const deletePharmacy = async (req, res) => {
  const { id } = req.params;

  try {
    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    // Delete the associated image file if it exists
    if (pharmacy.image && fs.existsSync(path.join(__dirname, '..', pharmacy.image))) {
      fs.unlinkSync(path.join(__dirname, '..', pharmacy.image));
    }

    await Pharmacy.findByIdAndDelete(id);
    res.status(200).json({ message: 'Pharmacy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPharmacy,
  getAllPharmacies,
  getPharmacyById,
  updatePharmacy,
  deletePharmacy,
};