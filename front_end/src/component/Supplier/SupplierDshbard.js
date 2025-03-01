import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "../Function/Header";

import { useNavigate } from "react-router-dom";
import ShowDeliveryModal from "./Delivery/ShowDeliveryModal"; // Import the ShowDeliveryModal component

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null); // State to track the selected delivery ID
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get('http://localhost:5000/api/deliveries', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);
  const handleAddDeliveryClick = () => {
    navigate('/AddDelivery');
  };
  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle row click
  const handleRowClick = (deliveryId) => {
    setSelectedDeliveryId(deliveryId); // Set the selected delivery ID
    setIsModalOpen(true); // Open the modal
  };

  return (
    <>
      <div><Header toggleMenu={() => setIsCollapsed(!isCollapsed)} /></div>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? "ml-[80px]" : "ml-[250px]"
          }`}
        >
          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto p-6 mt-20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Deliveries</h1>
                <p className="text-sm text-gray-500">
                  Manage your deliveries and their details here.
                </p>
              </div>
              <div className="flex gap-2">
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
                      placeholder="Search for a pharmacy"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <button
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors h-10 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800"
                onClick={handleAddDeliveryClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add_Delivery
              </button>
              </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Pharmacy
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Number of Medicines
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Delivery Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveries.map((delivery) => (
                    <tr
                      key={delivery._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => handleRowClick(delivery._id)} // Add onClick handler
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {delivery.pharmacy.name}
                      </td>
                      <td className="px-6 py-4">
                        {delivery.medicines.length}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(delivery.deliveryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            delivery.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : delivery.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          {/* Add your action icon here */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* Show Delivery Modal */}
      <ShowDeliveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deliveryId={selectedDeliveryId}
      />
    </>
  );
}