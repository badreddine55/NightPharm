const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if Super Admin already exists
    const superAdminExists = await User.findOne({ email: 'beddine330@gmail.com' });
    if (superAdminExists) {
      console.log('Super Admin already exists');
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('superadmin123', salt);

    // Create the Super Admin
    await User.create({
      name: 'Super Admin',
      email: 'beddine330@gmail.com',
      password: hashedPassword,
      role: 'superadmin', // Ensure the role is set to 'superadmin'
    });

    console.log('Super Admin seeded successfully');
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedSuperAdmin();