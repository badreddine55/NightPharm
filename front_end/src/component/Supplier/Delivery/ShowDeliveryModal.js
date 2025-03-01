import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

export default function ShowDeliveryModal({ isOpen, onClose, deliveryId }) {
  const [deliveryDetails, setDeliveryDetails] = useState(null);

  useEffect(() => {
    if (isOpen && deliveryId) {
      fetchDeliveryDetails();
    }
  }, [isOpen, deliveryId]);

  const fetchDeliveryDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/deliveries/${deliveryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveryDetails(response.data);
    } catch (error) {
      console.error("Error fetching delivery details:", error);
    }
  };

  if (!isOpen || !deliveryDetails) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Delivery Details"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lx bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-700">Delivery Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
          >
            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between">
            <strong className="text-gray-700">Pharmacy:</strong>
            <span>{deliveryDetails.pharmacy.name}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Delivery Date:</strong>
            <span>{new Date(deliveryDetails.deliveryDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Status:</strong>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                deliveryDetails.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {deliveryDetails.status}
            </span>
          </div>
          <div>
            <strong className="text-gray-700">Medicines:</strong>
            <ul className="mt-2 space-y-3">
              {deliveryDetails.medicines.map((medicine, index) => (
                <li
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <span>
                    {medicine.nameMedicine} - Qty: {medicine.quantity}
                  </span>
                  <span className="text-teal-600">${medicine.priceForOne}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}