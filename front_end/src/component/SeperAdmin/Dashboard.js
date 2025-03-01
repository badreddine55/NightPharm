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
        <main className="flex-1 overflow-y-auto p-6 mt-20" >

      <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} />
          {/* Count Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "All Nurse", value: counts.nurseCount },
              { title: "All Report", value: counts.reportCount },
              { title: "All User", value: counts.userCount },
              { title: "All Supplier", value: counts.supplierCount },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="p-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {item.title}
                    </h3>
                    <p className="text-2xl font-bold">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reports Section */}
          <div className="mt-6">
            <div className="p-0">
              <Reports reportType="Last 24 Hours" />
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}