// routes/nurseRoutes.js
const express = require("express");
const router = express.Router();
const { protect, checkRole } = require("../middleware/authMiddleware");
const {
  createNurse,
  getAllNurses,
  getNurseById,
  updateNurse,
  deleteNurse,
  updateNurseHasGuard,
  getNurseProfile,
  getMyClients,
  getMessages,
  sendMessage,
} = require("../controllers/nurseController");

// Public routes (accessible by authenticated clients)
router.get("/", protect, getAllNurses);
router.get("/messages/:clientId", protect, checkRole("nurse"), getMessages); // Changed :nurseId to :clientId
router.post("/messages", protect, checkRole("nurse"), sendMessage);

// Nurse-specific routes
router.get("/me", protect, checkRole("nurse"), getNurseProfile);
router.get("/my-clients", protect, checkRole("nurse"), getMyClients);

// Superadmin-only routes
router.post("/", protect, checkRole("superadmin"), createNurse);
router.get("/:id", protect, checkRole("superadmin"), getNurseById);
router.put("/:id", protect, checkRole("superadmin"), updateNurse);
router.delete("/:id", protect, checkRole("superadmin"), deleteNurse);
router.put("/:id/has-guard", protect, checkRole("superadmin"), updateNurseHasGuard);

module.exports = router;