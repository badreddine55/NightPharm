import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import axios from "axios";
import PharmacyCard from "./PharmacyCard";
import Sidebar from './Sidebar'
import PharmacyDetailsModal from "./PharmacyDetailsModal"; // Import the new modal

import Header from "../Function/Header";

export default function PharmacyShow() {
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDutyStatus, setFilterDutyStatus] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // State for details modal
  const [isCollapsed, setIsCollapsed] = useState(false);
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
          <main className="flex-1 overflow-y-auto p-6 mt-10">
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
    
            </div>
          </div>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <PharmacyCard
                key={pharmacy._id}
                pharmacy={pharmacy}
                onClick={() => handlePharmacyClick(pharmacy)} // Add onClick handler
              />
            ))}
          </div>
    
    
    
          {isDetailsModalOpen && selectedPharmacy && (
            <PharmacyDetailsModal
              pharmacy={selectedPharmacy}
              onClose={() => setIsDetailsModalOpen(false)} // Close the details modal
            />
          )}
        </div>
          </main>
        </div>
      </div>
    </>
  );
}
