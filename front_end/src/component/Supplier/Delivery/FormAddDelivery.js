import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormAddDelivery = ({ supplierId, onDeliverySubmit }) => {
  const [medicines, setMedicines] = useState([]);
  const [currentMedicine, setCurrentMedicine] = useState({
    nameMedicine: "",
    priceForOne: 0,
    quantity: 0,
    amount: 0,
    category: "",
  });
  const [deliveryDate, setDeliveryDate] = useState("2025-01-30");
  const [pharmacyName, setPharmacyName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedMedicine = { ...currentMedicine, [name]: value };
    if (name === "priceForOne" || name === "quantity") {
      updatedMedicine.amount = updatedMedicine.priceForOne * updatedMedicine.quantity;
    }
    setCurrentMedicine(updatedMedicine);
  };

  const addMedicine = () => {
    if (
      !currentMedicine.nameMedicine ||
      currentMedicine.priceForOne <= 0 ||
      currentMedicine.quantity <= 0 ||
      !currentMedicine.category
    ) {
      setError("Please fill all fields correctly.");
      return;
    }
    setMedicines([...medicines, currentMedicine]);
    setCurrentMedicine({
      nameMedicine: "",
      priceForOne: 0,
      quantity: 0,
      amount: 0,
      category: "",
    });
    setError("");
  };

  const submitDelivery = async () => {
    if (medicines.length === 0) {
      setError("Please add at least one medicine.");
      return;
    }
    if (!pharmacyName) {
      setError("Please enter a pharmacy name.");
      return;
    }
    const deliveryData = {
      supplierId,
      medicines: medicines.map((medicine) => ({
        nameMedicine: medicine.nameMedicine,
        priceForOne: medicine.priceForOne,
        quantity: medicine.quantity,
        amount: medicine.amount,
        category: medicine.category,
        dosageInstructions: "-",
        safetyThreshold: 0,
      })),
      deliveryDate,
      pharmacyName,
    };
    try {
      const response = await axios.post("http://localhost:5000/api/deliveries", deliveryData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onDeliverySubmit(response.data);
      setMedicines([]);
      setPharmacyName("");
      setError("");
      navigate("/Dashboard");
    } catch (error) {
      console.error("Error submitting delivery:", error);
      setError("Failed to submit delivery. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-teal-50 to-white rounded-2xl shadow-2xl max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-teal-800 mb-8 text-center">Add Medicines to Delivery</h1>
      {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg text-center font-medium mb-6">{error}</p>}
      <form className="space-y-8">
        <div>
          <label className="block text-lg font-semibold text-teal-700 mb-2">
            Pharmacy Name
          </label>
          <input
            type="text"
            name="pharmacyName"
            value={pharmacyName}
            onChange={(e) => setPharmacyName(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-teal-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition duration-200 placeholder-gray-400"
            placeholder="Enter pharmacy name"
          />
        </div>
        <div className="bg-teal-50 p-8 rounded-2xl shadow-inner">
          <h2 className="text-2xl font-bold text-teal-700 mb-6">Medicine Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Medicine Name", name: "nameMedicine", type: "text" },
              { label: "Price per Unit", name: "priceForOne", type: "number" },
              { label: "Quantity", name: "quantity", type: "number" },
              { label: "Amount", name: "amount", type: "number", readOnly: true },
              { label: "Category", name: "category", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-lg font-semibold text-teal-700 mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={currentMedicine[field.name]}
                  onChange={handleInputChange}
                  readOnly={field.readOnly}
                  className={`w-full p-4 rounded-xl border-2 border-teal-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition duration-200 placeholder-gray-400 ${
                    field.readOnly ? "bg-teal-100 cursor-not-allowed" : ""
                  }`}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addMedicine}
            className="mt-6 px-8 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition duration-200 shadow-lg w-full sm:w-auto"
          >
            Add Medicine
          </button>
        </div>

        {medicines.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-teal-700">Added Medicines</h2>
            <ul className="space-y-4">
              {medicines.map((medicine, index) => (
                <li
                  key={index}
                  className="bg-teal-50 p-5 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <span className="text-lg text-teal-800 font-medium">
                    {medicine.nameMedicine} - {medicine.quantity} units
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label className="block text-lg font-semibold text-teal-700 mb-2">
            Delivery Date
          </label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-teal-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition duration-200"
          />
        </div>

        <button
          type="button"
          onClick={submitDelivery}
          className="w-full px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition duration-200 shadow-lg text-lg"
        >
          Submit Delivery
        </button>
      </form>
    </div>
  );
};

export default FormAddDelivery;