const Supplier = require('../models/Supplier');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password handling

// Create a new supplier
const createSupplier = async (req, res) => {
  const { SuppliersInfo, Address, DeliveryDate, Amount, Status, phoneNumber, email, password, role = 'Supplier' } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const supplier = new Supplier({
      SuppliersInfo,
      Address,
      DeliveryDate,
      Amount,
      Status,
      phoneNumber,
      email,
      password: hashedPassword,
      role
    });

    await supplier.save();
    res.status(201).json({ message: 'Supplier created successfully', supplier });
  } catch (error) {
    console.error('Error creating supplier:', error); // Error log for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginSupplier = async (req, res) => {
  const { email, password } = req.body;

  try {
    const supplier = await Supplier.findOne({ email });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token (without the role)
    const token = jwt.sign(
      { id: supplier._id, email: supplier.email }, // Exclude role from JWT
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send the token and role in the response
    res.status(200).json({ message: 'Login successful', token, role: supplier.role });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error('Error fetching supplier by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update supplier details
const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { SuppliersInfo, Address, DeliveryDate, Amount, Status, phoneNumber, email, password } = req.body;

  try {
    const updatedData = { SuppliersInfo, Address, DeliveryDate, Amount, Status, phoneNumber, email };

    // Hash the password only if it's provided in the update
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const supplier = await Supplier.findByIdAndUpdate(id, updatedData, { new: true });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.status(200).json({ message: 'Supplier updated successfully', supplier });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  loginSupplier,
};
