import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "../Function/Header";
import { MoreVertical } from "lucide-react";

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nursePharmacy, setNursePharmacy] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null); // Track selected medicine
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const menuRef = useRef(null);

  useEffect(() => {
    fetchNurseProfile();
  }, []);

  useEffect(() => {
    if (nursePharmacy) {
      fetchMedicines();
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

  const fetchMedicines = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/medicines", {
        headers: { Authorization: `Bearer ${token}` },
        params: { pharmacyName: nursePharmacy },
      });
      setMedicines(response.data || []);
    } catch (error) {
      setError("Failed to load medicines. Please try again later.");
      console.error("Error fetching medicines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuClick = (event, medicineId) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setOpenMenuId(openMenuId === medicineId ? null : medicineId);
  };

  const handleDelete = async (medicineId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/medicines/${medicineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines((prev) => prev.filter((med) => med._id !== medicineId));
    } catch (error) {
      setError("Failed to delete medicine.");
      console.error("Failed to delete medicine:", error);
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleRowClick = (medicine) => {
    setSelectedMedicine(medicine); // Set the selected medicine
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedMedicine(null); // Clear the selected medicine
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.nameMedicine?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div>
        <Header toggleMenu={() => setIsCollapsed(!isCollapsed)} />
      </div>
      <div className="min-h-screen flex">
        <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? "ml-[80px]" : "ml-[250px]"
          }`}
        >
          <main className="flex-1 overflow-y-auto p-6 mt-20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Medicine Management</h1>
                <p className="text-sm text-gray-500">
                  Manage medicines for {nursePharmacy || "your pharmacy"}.
                </p>
              </div>
              <div className="w-full max-w-sm min-w-[200px]">
                <div className="relative flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Search for a Medicine"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {isLoading ? (
              <p className="text-gray-500">Loading medicines...</p>
            ) : filteredMedicines.length === 0 ? (
              <p className="text-gray-500">No medicines found for {nursePharmacy || "your pharmacy"}.</p>
            ) : (
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Medicine Name</th>
                      <th scope="col" className="px-6 py-3">Dosage Instructions</th>
                      <th scope="col" className="px-6 py-3">Category</th>
                      <th scope="col" className="px-6 py-3">Stock</th>
                      <th scope="col" className="px-6 py-3">Price</th>
                      <th scope="col" className="px-6 py-3">Safety Threshold</th>
                      <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicines.map((medicine) => (
                      <tr
                        key={medicine._id}
                        className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(medicine)} // Trigger modal on row click
                      >
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {medicine.nameMedicine || "N/A"}
                        </th>
                        <td className="px-6 py-4">{medicine.dosageInstructions || "N/A"}</td>
                        <td className="px-6 py-4">{medicine.category || "N/A"}</td>
                        <td className="px-6 py-4">{medicine.stock ?? "N/A"}</td>
                        <td className="px-6 py-4">${medicine.price?.toFixed(2) || "N/A"}</td>
                        <td className="px-6 py-4">{medicine.safetyThreshold ?? "N/A"}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(event) => handleMenuClick(event, medicine._id)}
                            className="p-1 rounded-full hover:bg-gray-200"
                          >
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {openMenuId && (
              <div
                ref={menuRef}
                className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg"
                style={{ top: menuPosition.top, left: menuPosition.left }}
              >
                <button
                  onClick={() => handleDelete(openMenuId)}
                  className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}

            {/* Modal for displaying medicine details */}
            {isModalOpen && selectedMedicine && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-semibold mb-4">{selectedMedicine.nameMedicine}</h2>
                  <div className="space-y-2">
                    <p><strong>Dosage Instructions:</strong> {selectedMedicine.dosageInstructions || "N/A"}</p>
                    <p><strong>Category:</strong> {selectedMedicine.category || "N/A"}</p>
                    <p><strong>Stock:</strong> {selectedMedicine.stock ?? "N/A"}</p>
                    <p><strong>Price:</strong> ${selectedMedicine.price?.toFixed(2) || "N/A"}</p>
                    <p><strong>Safety Threshold:</strong> {selectedMedicine.safetyThreshold ?? "N/A"}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}