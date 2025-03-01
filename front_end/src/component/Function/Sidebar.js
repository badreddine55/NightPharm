import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Package,
  Building2,
  Settings,
} from "lucide-react";

export default function Sidebar({ isCollapsed, closeMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/");
  };


  const navItems = [
    { title: "Home", icon: Home, href: "/Dashboard" },
    { title: "Report History", icon: FileText, href: "/HistoryOfReports" },
    { title: "Nurses Management", icon: Users, href: "/NursesManagement" },
    { title: "Supplier Management", icon: Package, href: "/SupplierManagement" },
    { title: "Pharmacy Management", icon: Building2, href: "/PharmacyManagement" },
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-teal-500 transform transition-all duration-300 ease-in-out mt-[3.5rem] ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 space-y-1 p-2">
            {navItems.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.href)}
                className={`flex items-center w-full rounded-lg px-3 py-3 text-sm font-medium ${
                  item.title === "Home"
                    ? "bg-white text-teal-500" // For Home button
                    : location.pathname === item.href
                    ? "bg-black text-white"  // Active state for other items
                    : "text-white hover:bg-white/10" // Default state for other items
                }`}
              >
              <item.icon
              className={`h-5 w-5 ${
                item.title === "Home"
                  ? "text-teal-500" // Blue color for Home icon
                  : location.pathname === item.href
                  ? "text-white"      // Active icon color for other items
                  : "text-white"      // Default icon color for other items
              }`}
            />
                {!isCollapsed && <span className="ml-3">{item.title}</span>}
              </button>
            ))}
          </nav>

          <div className="border-t border-white/10 p-2 bg-teal-500">
          <button
            onClick={() => navigate("/Settings")}
            className={`flex items-center w-full rounded-lg px-3 py-3 text-sm font-medium text-white hover:bg-white/10`}
          >
            <Settings className="h-5 w-5 text-white" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center w-full rounded-lg px-3 py-3 text-sm font-medium text-white hover:bg-white/10`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M19.5 12H9" />
            </svg>
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
        </div>
      </div>

      {isCollapsed && (
        <div
          className="fixed inset-0  lg:hidden"
          onClick={() => closeMenu(false)}
        />
      )}
    </>
  );
}
