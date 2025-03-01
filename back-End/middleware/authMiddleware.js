// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Client = require('../models/client'); // Replace User with Client
const Nurse = require('../models/Nurse');
const User = require('../models/User'); 
const Supplier = require('../models/Supplier');

const googleClient = new OAuth2Client('84784187497-r4iuulv6ucflh4jn438d4sp3e6ujmhdb.apps.googleusercontent.com');

const protect = async (req, res, next) => {
  let token;

  // Check for JWT (for nurses and suppliers)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('JWT Token received:', token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded JWT:', decoded);

      req.user = await Client.findById(decoded.id) || 
                 await Nurse.findById(decoded.id) || 
                 await Supplier.findById(decoded.id)||
                 await User.findById(decoded.id);

      if (!req.user) {
        console.log('User not found in database ');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      console.log('JWT auth successful:', { id: req.user._id, role: req.user.role });
      next();
    } catch (error) {
      console.error('Error verifying JWT:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } 
  // Check for Google OAuth token (for clients)
  else if (req.headers['x-google-token']) {
    token = req.headers['x-google-token'];
    console.log('Google Token received:', token);

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: '84784187497-r4iuulv6ucflh4jn438d4sp3e6ujmhdb.apps.googleusercontent.com',
      });
      const payload = ticket.getPayload();
      console.log('Google token payload:', payload);

      let client = await Client.findOne({ googleId: payload.sub });
      if (!client) {
        client = new Client({
          googleId: payload.sub,
          email: payload.email,
          name: payload.name,
          role: 'client'
        });
        await client.save();
      }

      req.user = {
        id: client._id,
        googleId: client.googleId,
        role: client.role,
        email: client.email
      };

      console.log('Google auth successful:', req.user);
      next();
    } catch (error) {
      console.error('Error verifying Google token:', error);
      return res.status(401).json({ message: 'Not authorized, Google token failed' });
    }
  } 
  else {
    console.log('No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const checkRole = (roles) => async (req, res, next) => {
  console.log('Checking role for:', req.user?.role);
  try {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Not authorized, no user role' });
    }

    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of the following roles: ${roles.join(', ')}`,
      });
    }

    console.log('Role check passed');
    next();
  } catch (error) {
    console.error('Error in checkRole:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { protect, checkRole };