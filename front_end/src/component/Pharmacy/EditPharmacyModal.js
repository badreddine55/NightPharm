import { useState, useEffect } from "react";
import axios from "axios";

export default function EditPharmacyModal({ pharmacy, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    contactNumber: "",
    openHours: "",
    isOnDuty: false,
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (pharmacy) {
      setFormData({
        name: pharmacy.name || "",
        location: pharmacy.location || { type: "Point", coordinates: [0, 0] },
        contactNumber: pharmacy.contactNumber || "",
        openHours: pharmacy.openHours || "",
        isOnDuty: pharmacy.isOnDuty || false,
        image: pharmacy.image || "",
      });
      setImageFile(null); // Reset image file
    }
  }, [pharmacy]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "latitude" || name === "longitude") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates:
            name === "latitude"
              ? [prev.location.coordinates[0], parseFloat(value)]
              : [parseFloat(value), prev.location.coordinates[1]],
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setImageFile(file);
      setFormData((prev) => ({
        ...prev,
        image: `/uploads/${file.name}`, // Update image path
      }));
      setError(""); // Clear any previous error
    } else {
      setError("Please upload a .png, .jpg, or .jpeg file.");
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("location", JSON.stringify(formData.location));
    formDataToSend.append("contactNumber", formData.contactNumber);
    formDataToSend.append("openHours", formData.openHours);
    formDataToSend.append("isOnDuty", formData.isOnDuty.toString());
  
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    } else {
      formDataToSend.append("image", formData.image); // Retain existing image path
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/pharmacy/${pharmacy._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to update pharmacy:", error.response?.data || error.message);
      setError("Failed to update pharmacy: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen || !pharmacy) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[90vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Pharmacy Details</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pharmacy Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.location.coordinates[1]}
                onChange={handleChange}
                step="any"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.location.coordinates[0]}
                onChange={handleChange}
                step="any"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Open Hours</label>
              <input
                type="text"
                name="openHours"
                value={formData.openHours}
                onChange={handleChange}
                placeholder="e.g., 9 AM - 9 PM"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Image</label>
              {formData.image && (
                <img
                  src={`http://localhost:5000${formData.image}`}
                  alt="Current Pharmacy"
                  className="mt-1 w-32 h-32 object-cover"
                  onError={(e) => console.error('Image load error:', e)}
                />
              )}
              <label className="block text-sm font-medium text-gray-700 mt-2">New Image (.png, .jpg, .jpeg)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageChange}
                className="mt-1 block w-full p-2"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isOnDuty"
                  checked={formData.isOnDuty}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Currently On Duty</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}