import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Function/Sidebar";
import Header from "../Function/Header";
import Reports from "../Function/Reports";

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [counts, setCounts] = useState({
    nurseCount: 0,
    reportCount: 0,
    userCount: 0,
    supplierCount: 0,
  });

  useEffect(() => {
    // Fetch data from API when component mounts
    axios
      .get("http://localhost:5000/api/counts")
      .then((response) => {
        if (response.data.success) {
          setCounts(response.data.counts);
        }
      })
      .catch((error) => {
        console.error("Error fetching counts data:", error);
      });
  }, []);

  return (
    <>
    <div><Header toggleMenu={() => setIsCollapsed(!isCollapsed)} /></div>
    <div className="min-h-screen flex">
      {/* Sidebar */}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? "ml-[80px]" : "ml-[250px]"
        }`}
      >
        {/* Header */}

        

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">

      <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} />

        </main>
      </div>
    </div>
    </>
  );
}