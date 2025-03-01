import React, { useState, useEffect } from "react";
import { MapPin, Clock, Phone, Search } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import PharmacyDetailsModal from "./PharmacyDetailsModal";

export default function PharmacyList() {
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDutyStatus, setFilterDutyStatus] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

  const handleDelete = async (pharmacyId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/pharmacy/${pharmacyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setPharmacies((prev) => prev.filter((pharmacy) => pharmacy._id !== pharmacyId));
    } catch (error) {
      console.error("Failed to delete pharmacy:", error);
    }
  };

  const handlePharmacyClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPharmacy(null);
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="morocco-pharmacies" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nearby Pharmacies</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover pharmacies near you in Morocco, available 24/7 for your needs.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="relative mb-4 md:mb-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              className="w-full md:w-[300px] pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {filteredPharmacies.map((pharmacy) => {
            const BASE_URL = "http://localhost:5000";
            const imageUrl = pharmacy.image ? `${BASE_URL}${pharmacy.image}` : "/placeholder.svg";

            return (
              <motion.div
                key={pharmacy._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                variants={fadeInUp}
                onClick={() => handlePharmacyClick(pharmacy)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={pharmacy.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      console.error(`Failed to load image for ${pharmacy.name}: ${imageUrl}`);
                      e.target.src = "/placeholder.svg"; // Fallback to placeholder on error
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pharmacy.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                    <span>
                      Lat: {pharmacy.location.coordinates[1]}, Lon: {pharmacy.location.coordinates[0]}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-2 text-teal-600" />
                    <span>{pharmacy.openHours || "Not specified"}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Phone className="h-4 w-4 mr-2 text-teal-600" />
                    <span>{pharmacy.contactNumber || "N/A"}</span>
                  </div>
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded transition-colors duration-300">
                    View Details
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {isDetailsModalOpen && selectedPharmacy && (
          <PharmacyDetailsModal pharmacy={selectedPharmacy} onClose={handleCloseModal} />
        )}
      </div>
    </section>
  );
}