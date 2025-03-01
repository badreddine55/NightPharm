const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Nurse = require('../models/Nurse');
const Supplier = require('../models/Supplier'); // Import the Supplier model
const generateToken = require('../utils/generateToken');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in User, Nurse, or Supplier collections
    let user =
      (await User.findOne({ email })) ||
      (await Nurse.findOne({ email })) ||
      (await Supplier.findOne({ email }));

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a token for the user (without the role)
    const token = generateToken(user);

    // Send the token and role in the response
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot Password for User, Nurse, and Supplier
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists in User, Nurse, or Supplier collections
    let user =
      (await User.findOne({ email })) ||
      (await Nurse.findOne({ email })) ||
      (await Supplier.findOne({ email }));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token and hash it
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set the reset token and expiration time
    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send the reset password email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) requested a password reset.\n\n
        Click the following link or paste it in your browser to reset your password:\n\n
        http://${req.headers.host}/api/auth/reset-password/${resetToken}\n\n
        If you did not request this, please ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset Password for User, Nurse, and Supplier
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hash the provided token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the user with the matching reset token and check if it's still valid
    let user =
      (await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      })) ||
      (await Nurse.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      })) ||
      (await Supplier.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      }));

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password and save it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  login,
  forgetPassword,
  resetPassword,
};