import { useState, useEffect } from "react";
import axios from "axios";

export default function EditSupplierModal({ supplier, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    SuppliersInfo: "",
    Address: "",
    DeliveryDate: "",
    Amount: 0,
    Status: "Pending",
    phoneNumber: "",
    email: "",
    password: "",
  });

  // Populate form data when the supplier prop changes
  useEffect(() => {
    if (supplier) {
      setFormData({
        SuppliersInfo: supplier.SuppliersInfo,
        Address: supplier.Address,
        DeliveryDate: supplier.DeliveryDate,
        Amount: supplier.Amount,
        Status: supplier.Status,
        phoneNumber: supplier.phoneNumber,
        email: supplier.email,
        password: supplier.password,
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Check if DeliveryDate has been modified
      const originalDeliveryDate = supplier.DeliveryDate;
      const updatedDeliveryDate = formData.DeliveryDate;

      // If DeliveryDate has not been modified, retain the original value
      const finalFormData = {
        ...formData,
        DeliveryDate: updatedDeliveryDate || originalDeliveryDate,
      };

      const response = await axios.put(
        `http://localhost:5000/api/suppliers/${supplier._id}`,
        finalFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate(response.data); // Notify parent component about the updated supplier
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to update supplier:", error);
    }
  };

  if (!isOpen || !supplier) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[90vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Supplier Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Suppliers Info</label>
              <input
                type="text"
                name="SuppliersInfo"
                value={formData.SuppliersInfo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
              <input
                type="datetime-local"
                name="DeliveryDate"
                value={formData.DeliveryDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                name="Amount"
                value={formData.Amount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="Status"
                value={formData.Status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
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
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}