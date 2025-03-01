import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "../Function/Header";
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react";

export default function ListDeliveries() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [formData, setFormData] = useState({
    dosageInstructions: "",
    safetyThreshold: "",
    stock: "",
  });
  const [nursePharmacy, setNursePharmacy] = useState(null);

  useEffect(() => {
    fetchNurseProfile();
  }, []);

  useEffect(() => {
    if (nursePharmacy) {
      fetchDeliveries();
    }
  }, [nursePharmacy]);

  const fetchNurseProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      console.log("No token found in localStorage");
      return;
    }
  
    console.log("Fetching nurse profile with token:", token);
    try {
      const response = await axios.get("http://localhost:5000/api/nurses/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Nurse profile response:", response.data);
      setNursePharmacy(response.data.pharmacyName);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch nurse profile.";
      setError(errorMsg);
      console.error("Error fetching nurse profile:", {
        message: errorMsg,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  };

  const fetchDeliveries = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:5000/api/deliveries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched deliveries:", response.data);
      const filteredDeliveries = nursePharmacy
        ? response.data.filter((delivery) => delivery.pharmacy?.name === nursePharmacy)
        : response.data;
      setDeliveries(filteredDeliveries || []);
    } catch (error) {
      setError("Failed to fetch deliveries.");
      console.error("Error fetching deliveries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdateModal = (deliveryId, medicine) => {
    console.log("Opening modal with deliveryId:", deliveryId, "medicine:", medicine);
    setSelectedMedicine({ deliveryId, medicineId: medicine.medicine || medicine._id, ...medicine });
    setFormData({
      dosageInstructions: medicine.dosageInstructions || "",
      safetyThreshold: medicine.safetyThreshold || "",
      stock: medicine.stock || "",
    });
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !selectedMedicine) return;
  
    console.log("Updating with:", {
      deliveryId: selectedMedicine.deliveryId,
      medicineId: selectedMedicine.medicineId,
      formData,
    });
  
    setError(null);
  
    try {
      // Fetch the existing medicine from the database (if it exists)
      const existingMedicineResponse = await axios.get(
        `http://localhost:5000/api/medicines?nameMedicine=${selectedMedicine.nameMedicine}&pharmacyName=${nursePharmacy}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const existingMedicine = existingMedicineResponse.data[0]; // Assuming the API returns an array
  
      // Calculate the new stock
      const newStock = existingMedicine
        ? existingMedicine.stock + selectedMedicine.quantity // Add delivery quantity to existing stock
        : selectedMedicine.quantity; // Use delivery quantity as new stock
  
      // Update the medicine in the delivery and move it to the Medicine collection
      const response = await axios.put(
        `http://localhost:5000/api/deliveries/${selectedMedicine.deliveryId}/medicine/${selectedMedicine.medicineId}`,
        {
          newStock: newStock, // Use the calculated new stock
          dosageInstructions: formData.dosageInstructions,
          safetyThreshold: formData.safetyThreshold,
          nameMedicine: selectedMedicine.nameMedicine,
          category: selectedMedicine.category,
          priceForOne: selectedMedicine.priceForOne,
          pharmacyName: nursePharmacy,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Update response:", response.data);
  
      // Update the local state to reflect the changes
      setDeliveries((prev) =>
        prev
          .map((delivery) =>
            delivery._id === selectedMedicine.deliveryId
              ? {
                  ...delivery,
                  medicines: delivery.medicines.filter(
                    (med) => (med.medicine || med._id) !== selectedMedicine.medicineId
                  ),
                }
              : delivery
          )
          .filter((delivery) => {
            if (delivery._id === selectedMedicine.deliveryId && delivery.medicines.length === 0) {
              console.log("Removing delivery from state:", delivery._id);
              return false;
            }
            return true;
          })
      );
  
      setModalOpen(false);
      setSelectedMedicine(null);
      fetchMedicinesForPharmacy(); // Refresh medicines after update
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update medicine.");
      console.error("Error updating medicine:", error.response?.data || error);
    }
  };
  const fetchMedicinesForPharmacy = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/medicines", {
        headers: { Authorization: `Bearer ${token}` },
        params: { pharmacyName: nursePharmacy },
      });
      // Assuming a separate component or global state manages medicines; here we just log
      console.log("Updated medicines for pharmacy:", response.data);
    } catch (error) {
      console.error("Error refreshing medicines:", error);
    }
  };

  const toggleRow = (deliveryId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [deliveryId]: !prev[deliveryId],
    }));
  };

  const sidebarItems = [
    { title: "Dashboard", icon: "Home", href: "/dashboard" },
    { title: "Send a Report", icon: "Home", href: "/send-report" },
    { title: "List of Deliveries", icon: "Home", href: "/ListDeliveries" },
  ];

  return (
    <>
      <div>
        <Header toggleMenu={() => setIsCollapsed(!isCollapsed)} />
      </div>
      <div className="min-h-screen flex">
        <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} items={sidebarItems} />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? "ml-[80px]" : "ml-[250px]"
          }`}
        >
          <main className="flex-1 overflow-y-auto p-6 mt-20">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">List of Deliveries</h1>
              <p className="text-sm text-gray-600 mb-6">
                View all delivery records for {nursePharmacy || "your pharmacy"} below.
              </p>

              {error && (
                <div className="mb-4 bg-red-100 text-red-800 p-3 rounded-md text-sm flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="text-center text-gray-600">Loading deliveries...</div>
              ) : deliveries.length === 0 ? (
                <div className="text-center text-gray-600">
                  No deliveries found for {nursePharmacy || "your pharmacy"}.
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pharmacy
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Supplier
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Medicines
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Delivery Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span className="sr-only">Expand</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {deliveries.map((delivery) => (
                          <>
                            <tr
                              key={delivery._id}
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => toggleRow(delivery._id)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {delivery.pharmacy?.name || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {delivery.supplier?.SuppliersInfo || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {delivery.medicines.length} Medicine
                                {delivery.medicines.length !== 1 ? "s" : ""}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(delivery.deliveryDate).toLocaleDateString() || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    delivery.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {delivery.status || "N/A"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {expandedRows[delivery._id] ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </td>
                            </tr>
                            {expandedRows[delivery._id] && (
                              <tr>
                                <td colSpan="6" className="px-6 py-4 bg-gray-100">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-gray-900">
                                      <thead className="bg-gray-200">
                                        <tr>
                                          <th className="px-4 py-2 text-left font-medium">Action</th>
                                          <th className="px-4 py-2 text-left font-medium">Name</th>
                                          <th className="px-4 py-2 text-left font-medium">Quantity</th>
                                          <th className="px-4 py-2 text-left font-medium">Price/Unit</th>
                                          <th className="px-4 py-2 text-left font-medium">Amount</th>
                                          <th className="px-4 py-2 text-left font-medium">Category</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {delivery.medicines.map((medicine) => (
                                          <tr key={medicine._id} className="border-b border-gray-200">
                                            <td className="px-4 py-2">
                                              <button
                                                onClick={() => openUpdateModal(delivery._id, medicine)}
                                                className="text-blue-600 hover:text-blue-800"
                                              >
                                                <Edit2 size={16} />
                                              </button>
                                            </td>
                                            <td className="px-4 py-2">{medicine.nameMedicine || "N/A"}</td>
                                            <td className="px-4 py-2">{medicine.quantity || "N/A"}</td>
                                            <td className="px-4 py-2">
                                              ${medicine.priceForOne?.toFixed(2) || "N/A"}
                                            </td>
                                            <td className="px-4 py-2">${medicine.amount || "N/A"}</td>
                                            <td className="px-4 py-2">{medicine.category || "N/A"}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {modalOpen && selectedMedicine && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Medicine</h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={selectedMedicine.nameMedicine || ""}
                          disabled
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dosage Instructions</label>
                        <input
                          type="text"
                          value={formData.dosageInstructions}
                          onChange={(e) =>
                            setFormData({ ...formData, dosageInstructions: e.target.value })
                          }
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Safety Threshold</label>
                        <input
                          type="number"
                          value={formData.safetyThreshold}
                          onChange={(e) =>
                            setFormData({ ...formData, safetyThreshold: e.target.value })
                          }
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}