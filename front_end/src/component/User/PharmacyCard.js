import React from "react";
import { Building2, Clock, Phone, MapPin, Edit, Trash2 } from "lucide-react";

const PharmacyCard = ({ pharmacy, handleEdit, handleDelete, onClick }) => {
  if (!pharmacy) {
    return (
      <div className="p-4 border rounded-lg shadow-sm">
        No pharmacy data available
      </div>
    );
  }

  // Base URL for the server (adjust if your backend runs on a different port/host in production)
  const BASE_URL = "http://localhost:5000";
  const imageUrl = pharmacy.image ? `${BASE_URL}${pharmacy.image}` : "/placeholder.svg";

  return (
    <div
      className="overflow-hidden border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="w-full h-48 relative flex-shrink-0">
        <img
          src={imageUrl}
          alt={pharmacy.name}
          className="object-cover w-full h-full"
          onError={(e) => {
            console.error(`Failed to load image for ${pharmacy.name}: ${imageUrl}`);
            e.target.src = "/placeholder.svg"; // Fallback to placeholder on error
          }}
        />
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              pharmacy.isOnDuty
                ? "bg-teal-100 text-teal-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {pharmacy.isOnDuty ? "On Duty" : "Off Duty"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-2">{pharmacy.name}</h3>
        <div className="space-y-2 text-sm text-gray-600 flex-grow">
          {/* Open Hours */}
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{pharmacy.openHours || "Not specified"}</span>
          </div>

          {/* Contact Number */}
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span>{pharmacy.contactNumber || "Not available"}</span>
          </div>

          {/* Location */}
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>
              {pharmacy.location?.coordinates
                ? `Lat: ${pharmacy.location.coordinates[1].toFixed(4)}, Lon: ${pharmacy.location.coordinates[0].toFixed(4)}`
                : "Location not available"}
            </span>
          </div>
        </div>


      </div>
    </div>
  );
};

export default PharmacyCard;