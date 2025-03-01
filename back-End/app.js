const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Added missing import
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const nurseRoutes = require('./routes/nurseRoutes');
const reportRoutes = require('./routes/reportRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const clientRoutes = require('./routes/clientRoutes');
const nightGuardRoutes = require('./routes/nightGuardRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const assignNightGuard = require('./scripts/assignNightGuard');
const resetNightGuard = require('./scripts/resetNightGuard');
const cron = require('node-cron');
const countRoutes = require('./routes/countRoute');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS configuration
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-google-token'],
    credentials: true,
  })
);

// Handle preflight requests for all routes
app.options('*', cors());

// Parse JSON bodies
app.use(express.json());

// Scheduled tasks using cron
cron.schedule('30 11 * * *', () => {
  console.log('Running reset night guard script...');
  resetNightGuard();
});

cron.schedule('0 0 * * *', () => {
  console.log('Running assign night guard script...');
  assignNightGuard();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nurses', nurseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/night-guards', nightGuardRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api', countRoutes);

// Error handler middleware
app.use(errorHandler);

module.exports = app;