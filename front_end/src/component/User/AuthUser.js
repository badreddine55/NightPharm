
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "../Function/Header";
import { MoreVertical } from "lucide-react";

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nursePharmacy, setNursePharmacy] = useState(null);
  const menuRef = useRef(null);







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
          <main className="flex-1 overflow-y-auto p-6 mt-20">


            {openMenuId && (
              <div
                ref={menuRef}
                className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg"
                style={{ top: menuPosition.top, left: menuPosition.left }}
              >

              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}