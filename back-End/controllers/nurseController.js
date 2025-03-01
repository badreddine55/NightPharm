const Nurse = require('../models/Nurse');
const Message = require('../models/message');
const bcrypt = require('bcryptjs');

const Client = require("../models/client");
const NightGuard = require('../models/NightGuard');
const jwt = require('jsonwebtoken');

const createNurse = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, location, dateOfBirth, specialization, yearsOfExperience, workingHours, pharmacyName } = req.body;

    const existingNurse = await Nurse.findOne({ email });
    if (existingNurse) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nurse = new Nurse({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      location,
      dateOfBirth,
      specialization,
      yearsOfExperience,
      workingHours,
      pharmacyName,
    });

    await nurse.save();
    res.status(201).json({ message: 'Nurse created successfully', nurse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllNurses = async (req, res) => {
  try {
    const nurses = await Nurse.find().select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!nurses || nurses.length === 0) {
      return res.status(404).json({ message: 'No nurses found' });
    }

    res.json({ message: 'All nurses retrieved successfully', nurses });
  } catch (error) {
    console.error('Error in getAllNurses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNurseById = async (req, res) => {
  const { id } = req.params;

  try {
    const nurse = await Nurse.findById(id).select('-password');
    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    res.json({ message: 'Nurse found', nurse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateNurse = async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, address, location, dateOfBirth, hasGuard, specialization, yearsOfExperience, workingHours, pharmacyName } = req.body;

  try {
    const nurse = await Nurse.findByIdAndUpdate(
      id,
      { name, email, phoneNumber, address, location, dateOfBirth, hasGuard, specialization, yearsOfExperience, workingHours, pharmacyName },
      { new: true }
    ).select('-password');

    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    res.json({ message: 'Nurse updated successfully', nurse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateNurseHasGuard = async (req, res) => {
  const { id } = req.params;
  const { hasGuard } = req.body;

  try {
    const workingHours = hasGuard ? '19:00 PM - 7:00 AM' : '7:00 AM - 19:00 PM';

    const nurse = await Nurse.findByIdAndUpdate(
      id,
      { hasGuard, workingHours },
      { new: true }
    ).select('-password');

    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    if (hasGuard === true) {
      const nightGuard = new NightGuard({
        shiftTime: nurse.workingHours,
        date: new Date(),
        location: nurse.location,
        id_nurse: nurse._id,
      });

      await nightGuard.save();
    }

    res.status(200).json({
      message: 'Nurse hasGuard status and workingHours updated successfully',
      nurse,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteNurse = async (req, res) => {
  const { id } = req.params;

  try {
    const nurse = await Nurse.findByIdAndDelete(id);
    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    res.json({ message: 'Nurse deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNurseProfile = async (req, res) => {
  try {
    const nurse = await Nurse.findById(req.user.id).select('-password');
    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }
    res.json(nurse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getMyClients = async (req, res) => {
  try {
    const nurseId = req.user.id;

    // Find distinct sender Client IDs where receiver is the nurse
    const clientIds = await Message.distinct("sender", {
      receiver: nurseId,
      receiverModel: "Nurse",
      senderModel: "Client",
    });

    // Fetch client details
    const clients = await Client.find({ _id: { $in: clientIds } }).select("name email");

    res.status(200).json({ clients });
  } catch (error) {
    console.error("Error in getMyClients:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get messages between nurse and client
// @route   GET /api/nurses/messages/:clientId
// @access  Private (nurse)
const getMessages = async (req, res) => {
  try {
    const { clientId } = req.params;
    const nurseId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: nurseId, receiver: clientId },
        { sender: clientId, receiver: nurseId },
      ],
    }).sort("createdAt");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Send a message to a client
// @route   POST /api/nurses/messages
// @access  Private (nurse)
const sendMessage = async (req, res) => {
  try {
    const { clientId, content } = req.body; // Changed from nurseId to clientId
    const nurseId = req.user.id;

    if (!clientId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const message = new Message({
      sender: nurseId,
      receiver: clientId,
      senderModel: "Nurse",
      receiverModel: "Client",
      content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createNurse,
  getAllNurses,
  getNurseById,
  updateNurse,
  deleteNurse,
  updateNurseHasGuard,
  getNurseProfile,
  getMyClients, // New
  getMessages,
  sendMessage,
};