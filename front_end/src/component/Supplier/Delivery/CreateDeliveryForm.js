import { useState } from "react";
import axios from "axios";

export default function CreateDeliveryForm() {
  const [medicines, setMedicines] = useState([]);
  const [currentMedicine, setCurrentMedicine] = useState({
    nameMedicine: "",
    stock: 0,
    priceForOne: 0,
    quantity: 0,
    dosageInstructions: "",
    category: "",
    safetyThreshold: 0,
  });
  const [deliveryDate, setDeliveryDate] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");

  const handleMedicineChange = (e) => {
    const { name, value } = e.target;
    setCurrentMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedicine = () => {
    setMedicines((prev) => [...prev, currentMedicine]);
    setCurrentMedicine({
      nameMedicine: "",
      stock: 0,
      priceForOne: 0,
      quantity: 0,
      dosageInstructions: "",
      category: "",
      safetyThreshold: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (medicines.length === 0) {
      alert("Please add at least one medicine.");
      return;
    }
    const deliveryData = { medicines, deliveryDate, pharmacyName };
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/deliveries", deliveryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Delivery created successfully!");
      setMedicines([]);
      setCurrentMedicine({
        nameMedicine: "",
        stock: 0,
        priceForOne: 0,
        quantity: 0,
        dosageInstructions: "",
        category: "",
        safetyThreshold: 0,
      });
      setDeliveryDate("");
      setPharmacyName("");
    } catch (error) {
      console.error("Error creating delivery:", error);
      alert("Failed to create delivery. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-teal-700 mb-6">Create New Delivery</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Pharmacy Name & Delivery Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pharmacy Name
            </label>
            <input
              type="text"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              placeholder="Enter pharmacy name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Delivery Date
            </label>
            <input
              type="datetime-local"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              required
            />
          </div>
        </div>

        {/* Medicine Form */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-teal-600 mb-4">Add Medicine</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Medicine Name", name: "nameMedicine", type: "text" },
              { label: "Stock", name: "stock", type: "number" },
              { label: "Price per Unit", name: "priceForOne", type: "number" },
              { label: "Quantity", name: "quantity", type: "number" },
              { label: "Dosage Instructions", name: "dosageInstructions", type: "text" },
              { label: "Category", name: "category", type: "text" },
              { label: "Safety Threshold", name: "safetyThreshold", type: "number" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={currentMedicine[field.name]}
                  onChange={handleMedicineChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddMedicine}
            className="mt-4 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
          >
            Add Medicine
          </button>
        </div>

        {/* List of Added Medicines */}
        {medicines.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-teal-600">Added Medicines</h3>
            <ul className="space-y-3">
              {medicines.map((medicine, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow-sm"
                >
                  <span>
                    <strong>{medicine.nameMedicine}</strong> - Qty: {medicine.quantity}, Price: $
                    {medicine.priceForOne}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200 shadow-md"
          >
            Submit Delivery
          </button>
        </div>
      </form>
    </div>
  );
}