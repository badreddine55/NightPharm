const Delivery = require("../models/Delivery");
const Medicine = require("../models/Medicine");

const updateMedicineInDelivery = async (req, res) => {
  const { deliveryId, medicineId } = req.params;
  const { newStock, dosageInstructions, safetyThreshold, nameMedicine, category, priceForOne, pharmacyName } = req.body;

  console.log("Received update request:", { deliveryId, medicineId, body: req.body });

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      console.log("Delivery not found for ID:", deliveryId);
      return res.status(404).json({ message: "Delivery not found" });
    }

    const medicineIndex = delivery.medicines.findIndex(
      (med) => (med.medicine?.toString() === medicineId) || (med._id?.toString() === medicineId)
    );

    if (medicineIndex === -1) {
      console.log("Medicine not found in delivery:", { deliveryId, medicineId });
      const newMedicine = new Medicine({
        nameMedicine: nameMedicine || "Unknown",
        dosageInstructions: dosageInstructions || "-",
        category: category || "-",
        stock: newStock || "0",
        price: priceForOne || 0,
        safetyThreshold: safetyThreshold || "0",
        pharmacyName: pharmacyName || delivery.pharmacy?.name || "Unknown", // Use provided pharmacyName or fall back to delivery's pharmacy
      });
      await newMedicine.save();
      return res.status(201).json({
        message: "Medicine not found in delivery, created new medicine",
        newMedicine,
      });
    }

    const medicineInDelivery = delivery.medicines[medicineIndex];

    medicineInDelivery.stock = newStock;
    medicineInDelivery.dosageInstructions = dosageInstructions || medicineInDelivery.dosageInstructions;
    medicineInDelivery.safetyThreshold = safetyThreshold || medicineInDelivery.safetyThreshold;

    const existingMedicine = await Medicine.findOne({ nameMedicine: medicineInDelivery.nameMedicine });

    if (!existingMedicine) {
      const newMedicine = new Medicine({
        nameMedicine: medicineInDelivery.nameMedicine,
        dosageInstructions: medicineInDelivery.dosageInstructions,
        category: medicineInDelivery.category || "-",
        stock: newStock,
        price: medicineInDelivery.priceForOne || 0,
        safetyThreshold: medicineInDelivery.safetyThreshold,
        pharmacyName: pharmacyName || delivery.pharmacy?.name || "Unknown", // Use provided pharmacyName or fall back to delivery's pharmacy
      });
      await newMedicine.save();
    } else {
      existingMedicine.stock = newStock;
      existingMedicine.dosageInstructions = dosageInstructions || existingMedicine.dosageInstructions;
      existingMedicine.safetyThreshold = safetyThreshold || existingMedicine.safetyThreshold;
      await existingMedicine.save();
    }

    delivery.medicines.splice(medicineIndex, 1);

    if (delivery.medicines.length === 0) {
      console.log("No medicines left in delivery, removing delivery:", deliveryId);
      await Delivery.findByIdAndDelete(deliveryId);
      return res.status(200).json({
        message: "Medicine updated, moved to Medicine collection, and delivery removed as it had no medicines left",
      });
    } else {
      await delivery.save();
      res.status(200).json({
        message: "Medicine updated and moved to Medicine collection",
        updatedDelivery: delivery,
      });
    }
  } catch (error) {
    console.error("Error in updateMedicineInDelivery:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMedicineFromDeliveryById = async (req, res) => {
  const { deliveryId, medicineId } = req.params;

  console.log("Fetching medicine with:", { deliveryId, medicineId });

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const medicineInDelivery = delivery.medicines.find(
      (med) => (med.medicine?.toString() === medicineId) || (med._id?.toString() === medicineId)
    );
    if (!medicineInDelivery) {
      return res.status(404).json({ message: "Medicine not found in this delivery" });
    }

    res.status(200).json({ medicine: medicineInDelivery });
  } catch (error) {
    console.error("Error in getMedicineFromDeliveryById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  updateMedicineInDelivery,
  getMedicineFromDeliveryById,
};