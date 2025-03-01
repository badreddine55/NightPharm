import React, { useState, useEffect, useRef } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, ArrowUpDown, MoreVertical } from "lucide-react";
import axios from "axios";
import EditNurseModal from "./EditNurseModal";
import AddNurseModal from "./AddNurseModal";

// Input Component
const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Checkbox Component
const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${className}`}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={`flex items-center justify-center text-current`}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// Nurse Management Component
export default function NursesManagement() {
  const [nurses, setNurses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get("http://localhost:5000/api/nurses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNurses(response.data.nurses || []);
      } catch (error) {
        console.error("Error fetching nurses:", error);
      }
    } else {
      console.error("No token found.");
    }
  };

  const handleAddNurse = async (newNurse) => {
    setNurses((prevNurses) => [...prevNurses, newNurse.nurse]); // Adjust based on response structure
    try {
      await fetchNurses();
    } catch (error) {
      console.error("Failed to fetch ADD nurses:", error);
    }
  };

  const handleUpdateNurse = async (updatedNurse) => {
    try {
      await fetchNurses();
    } catch (error) {
      console.error("Failed to fetch updated nurses:", error);
    }
  };

  const filteredNurses = nurses.filter((nurse) => {
    const name = nurse.name?.toLowerCase() || "";
    const email = nurse.email?.toLowerCase() || "";
    const searchQueryLower = searchQuery.toLowerCase();

    const matchesSearch = name.includes(searchQueryLower) || email.includes(searchQueryLower);

    const matchesSpecialization = filterSpecialization
      ? nurse.specialization === filterSpecialization
      : true;

    const matchesExperience = filterExperience
      ? nurse.yearsOfExperience.toString() === filterExperience
      : true;

    return matchesSearch && matchesSpecialization && matchesExperience;
  });

  const sortedNurses = filteredNurses.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.yearsOfExperience - b.yearsOfExperience;
    } else {
      return b.yearsOfExperience - a.yearsOfExperience;
    }
  });

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleMenuClick = (event, nurseId) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom, left: rect.left });
    setOpenMenuId(openMenuId === nurseId ? null : nurseId);
  };

  const handleEdit = (nurse) => {
    setSelectedNurse(nurse);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (nurseId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/nurses/${nurseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNurses((prevNurses) => prevNurses.filter((nurse) => nurse._id !== nurseId));

      console.log("Nurse deleted successfully:", nurseId);
    } catch (error) {
      console.error("Failed to delete nurse:", error);
    } finally {
      setOpenMenuId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Nurse Management</h1>
          <p className="text-sm text-gray-500">
            Manage your nurses and their account permissions here.
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
                placeholder="Search for a Nurse"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full max-w-sm min-w-[200px]">
            <div className="relative rounded-md">
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Specialization</option>
                <option value="Pediatric">Pediatric</option>
                <option value="Geriatric">Geriatric</option>
                <option value="General">General</option>
                <option value="Emergency">Emergency</option>
                <option value="Surgical">Surgical</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
                className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors h-10 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800"
            onClick={() => setIsAddModalOpen(true)}
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
            Add_Nurse
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nurse Name
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Specialization
                  <button onClick={toggleSortOrder} className="ml-1.5">
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </button>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Years of Experience
              </th>
              <th scope="col" className="px-6 py-3">
                Working Hours
              </th>
              <th scope="col" className="px-6 py-3">
                Pharmacy Name
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedNurses.map((nurse) => (
              <tr
                key={nurse._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{nurse.name}</div>
                      <div className="text-sm text-gray-500">{nurse.email}</div>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{nurse.specialization}</td>
                <td className="px-6 py-4">{nurse.yearsOfExperience}</td>
                <td className="px-6 py-4">{nurse.workingHours}</td>
                <td className="px-6 py-4">{nurse.pharmacyName || "N/A"}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(event) => handleMenuClick(event, nurse._id)}
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

      {openMenuId && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(sortedNurses.find((nurse) => nurse._id === openMenuId));
            }}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(openMenuId)}
            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}

      {isAddModalOpen && (
        <AddNurseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddNurse}
        />
      )}

      {isEditModalOpen && (
        <EditNurseModal
          nurse={selectedNurse}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateNurse}
        />
      )}
    </div>
  );
}