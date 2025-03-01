
import { useState } from "react"
import axios from "axios"
import Sidebar from "./Sidebar"
import Header from "../Function/Header"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, Calendar, Package, DollarSign, Hash, Tag, Truck } from "lucide-react"

export default function AddDelivery() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [medicines, setMedicines] = useState([])
  const [currentMedicine, setCurrentMedicine] = useState({
    nameMedicine: "",
    priceForOne: 0,
    quantity: 0,
    amount: 0,
    category: "",
  })
  const [deliveryDate, setDeliveryDate] = useState("2025-01-30")
  const [pharmacyName, setPharmacyName] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const updatedMedicine = { ...currentMedicine, [name]: value }

    if (name === "priceForOne" || name === "quantity") {
      updatedMedicine.amount = updatedMedicine.priceForOne * updatedMedicine.quantity
    }

    setCurrentMedicine(updatedMedicine)
  }

  const addMedicine = () => {
    if (
      !currentMedicine.nameMedicine ||
      currentMedicine.priceForOne <= 0 ||
      currentMedicine.quantity <= 0 ||
      !currentMedicine.category
    ) {
      setError("Please fill all fields correctly.")
      return
    }

    setMedicines([...medicines, currentMedicine])
    setCurrentMedicine({
      nameMedicine: "",
      priceForOne: 0,
      quantity: 0,
      amount: 0,
      category: "",
    })
    setError("")
  }

  const removeMedicine = (index) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index)
    setMedicines(updatedMedicines)
  }
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
      medicines: medicines.map((medicine) => ({
        nameMedicine: medicine.nameMedicine,
        priceForOne: medicine.priceForOne,
        quantity: medicine.quantity,
        amount: medicine.amount,
        category: medicine.category,
        dosageInstructions: "-", // Default value
        safetyThreshold: 0, // Default value
        stock: medicine.quantity, // Set stock to the quantity being delivered
        pharmacyName: pharmacyName, // Include pharmacyName
      })),
      deliveryDate,
      pharmacyName,
    };
  
    try {
      const response = await axios.post("http://localhost:5000/api/deliveries", deliveryData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Delivery submitted successfully:", response.data);
      setMedicines([]);
      setPharmacyName("");
      setError("");
      navigate("/SupplierDshbard");
    } catch (error) {
      console.error("Error submitting delivery:", error);
      setError("Failed to submit delivery. Please try again.");
    }
  };

  return (
    <>
      <div>
        <Header toggleMenu={() => setIsCollapsed(!isCollapsed)} />
      </div>
      <div className="min-h-screen flex ">
        <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-[80px]" : "ml-[250px]"}`}>
          <main className="container mx-auto px-4 py-8 mt-16">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <Package className="mr-2" /> Add Medicines for Delivery
              </h1>
              {error && <p className="text-red-500 mb-4 p-2 bg-red-100 rounded">{error}</p>}
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pharmacyName"
                        value={pharmacyName}
                        onChange={(e) => setPharmacyName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter pharmacy name"
                      />
                      <Truck className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Medicine Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                      <input
                        type="text"
                        name="nameMedicine"
                        value={currentMedicine.nameMedicine}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter medicine name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price for One</label>
                      <div className="relative">
                        <input
                          type="number"
                          name="priceForOne"
                          value={currentMedicine.priceForOne}
                          onChange={handleInputChange}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0.00"
                        />
                        <DollarSign className="absolute left-2 top-2.5 text-gray-400" size={20} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <div className="relative">
                        <input
                          type="number"
                          name="quantity"
                          value={currentMedicine.quantity}
                          onChange={handleInputChange}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0"
                        />
                        <Hash className="absolute left-2 top-2.5 text-gray-400" size={20} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          name="amount"
                          value={currentMedicine.amount}
                          readOnly
                          className="w-full pl-7 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                        />
                        <DollarSign className="absolute left-2 top-2.5 text-gray-400" size={20} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="category"
                          value={currentMedicine.category}
                          onChange={handleInputChange}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter category"
                        />
                        <Tag className="absolute left-2 top-2.5 text-gray-400" size={20} />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="mr-2" size={16} /> Add Medicine
                  </button>
                </div>
              </form>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Added Medicines</h2>
                {medicines.length > 0 ? (
                  <ul className="space-y-2">
                    {medicines.map((medicine, index) => (
                      <li key={index} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                        <span>
                          {medicine.nameMedicine} - {medicine.quantity} units (${medicine.amount.toFixed(2)})
                        </span>
                        <button onClick={() => removeMedicine(index)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No medicines added yet.</p>
                )}
              </div>

              <button
                type="button"
                onClick={submitDelivery}
                className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Truck className="mr-2" size={18} /> Submit Delivery
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

