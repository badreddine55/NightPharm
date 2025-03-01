import { Building2, Clock, Phone, MapPin, X } from "lucide-react";

const PharmacyDetailsModal = ({ pharmacy, onClose }) => {
  if (!pharmacy) return null;

  // Base URL for the server (adjust if your backend runs on a different port/host in production)
  const BASE_URL = "http://localhost:5000";
  const imageUrl = pharmacy.image ? `${BASE_URL}${pharmacy.image}` : "/placeholder.svg";

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[90vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg overflow-hidden flex flex-col">
        {/* Image Section */}
        <div className="relative w-full h-64 sm:h-80">
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
          <div
            className={`absolute top-4 left-4 px-3 py-1.5 text-sm font-semibold rounded-full ${
              pharmacy.isOnDuty ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {pharmacy.isOnDuty ? "On Duty" : "Off Duty"}
          </div>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 bg-white/70 hover:bg-white/90 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <Building2 className="h-7 w-7 text-gray-500" />
            <h3 className="text-xl font-semibold">{pharmacy.name || "Unnamed Pharmacy"}</h3>
          </div>
          <div className="space-y-4 text-base text-gray-600">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3" />
              <span>{pharmacy.openHours || "Not specified"}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3" />
              <span>{pharmacy.contactNumber || "Not available"}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-3" />
              <span>
                {pharmacy.location?.coordinates
                  ? `Lat: ${pharmacy.location.coordinates[1].toFixed(4)}, Lon: ${pharmacy.location.coordinates[0].toFixed(4)}`
                  : "Location not available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyDetailsModal;