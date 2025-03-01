import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import axios from "axios";
import EditPharmacyModal from "./EditPharmacyModal";
import AddPharmacyModal from "./AddPharmacyModal";
import PharmacyCard from "./PharmacyCard";
import PharmacyDetailsModal from "./PharmacyDetailsModal"; // Import the new modal

export default function PharmacyManagement() {
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDutyStatus, setFilterDutyStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // State for details modal

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pharmacy");
      setPharmacies(response.data || []);
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
    }
  };

  const handleAddPharmacy = async (newPharmacy) => {
    setPharmacies((prevPharmacies) => [...prevPharmacies, newPharmacy]);
    try {
      await fetchPharmacies();
    } catch (error) {
      console.error("Failed to fetch ADD pharmacies:", error);
    }
  };

  const handleUpdatePharmacy = async (updatedPharmacy) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/pharmacy/${updatedPharmacy._id}`,
        updatedPharmacy,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchPharmacies();
  

    } catch (error) {
      console.error("Failed to update pharmacy:", error);
    }
  };
  const handleDelete = async (pharmacyId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/pharmacy/${pharmacyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setPharmacies((prevPharmacies) =>
        prevPharmacies.filter((pharmacy) => pharmacy._id !== pharmacyId)
      );
    } catch (error) {
      console.error("Failed to delete pharmacy:", error);
    }
  };

  const handleEdit = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsEditModalOpen(true);
  };

  const handlePharmacyClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsDetailsModalOpen(true); // Open the details modal
  };

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const name = pharmacy.name?.toLowerCase() || "";
    const searchQueryLower = searchQuery.toLowerCase();

    const matchesSearch = name.includes(searchQueryLower);
    const matchesDutyStatus = filterDutyStatus
      ? pharmacy.isOnDuty === (filterDutyStatus === "true")
      : true;

    return matchesSearch && matchesDutyStatus;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Pharmacy Management</h1>
          <p className="text-sm text-gray-500">Manage your pharmacies and their duty status here.</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              className="w-full md:w-[200px] pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Search pharmacies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterDutyStatus}
            onChange={(e) => setFilterDutyStatus(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Status</option>
            <option value="true">On Duty</option>
            <option value="false">Off Duty</option>
          </select>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-md hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" />
            Add Pharmacy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {filteredPharmacies.map((pharmacy) => (
          <PharmacyCard
            key={pharmacy._id}
            pharmacy={pharmacy}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            onClick={() => handlePharmacyClick(pharmacy)} // Add onClick handler
          />
        ))}
      </div>

      {isAddModalOpen && (
        <AddPharmacyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddPharmacy}
        />
      )}

      {isEditModalOpen && selectedPharmacy && (
        <EditPharmacyModal
          pharmacy={selectedPharmacy}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdatePharmacy}
        />
      )}

      {isDetailsModalOpen && selectedPharmacy && (
        <PharmacyDetailsModal
          pharmacy={selectedPharmacy}
          onClose={() => setIsDetailsModalOpen(false)} // Close the details modal
        />
      )}
    </div>
  );
}