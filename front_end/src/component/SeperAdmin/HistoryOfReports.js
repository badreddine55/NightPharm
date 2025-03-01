import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Function/Sidebar";
import Header from "../Function/Header";
import { ReportModal } from "../Function/ReportModal";

export default function HistoryOfReports() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [counts, setCounts] = useState({
    nurseCount: 0,
    reportCount: 0,
    userCount: 0,
    supplierCount: 0,
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sectionTitle = "Reports";
  const sectionDescription = "History of Reports"; // Can be dynamic

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(response.data); // Update the state with the fetched reports
      } catch (err) {
        setError("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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

  const handleUpdateStatus = async (reportId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/reports/${reportId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? { ...report, status } : report
        )
      );
    } catch (error) {
      console.error("Failed to update report status", error);
    }
  };

  return (
    <>
      <div>
        <Header toggleMenu={() => setIsCollapsed(!isCollapsed)} />
      </div>
      <div className="min-h-screen flex mt-20">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? "ml-[80px]" : "ml-[250px]"
          }`}
        >
          {/* Header */}

          <main className="container py-6 ml-[20px]">
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

            <div className="mt-6">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-base font-semibold">{sectionTitle}</h2>
                  <p className="text-sm text-gray-500">{sectionDescription}</p>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                  <>
                    <table className="w-full border border-gray-300/50">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border border-gray-300/50">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border border-gray-300/50">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border border-gray-300/50">
                            Message
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports
                          .slice()
                          .reverse()
                          .map((report, index) => (
                            <tr
                              key={report._id}
                              className={`${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              } hover:bg-gray-100 cursor-pointer`}
                              onClick={() =>
                                setSelectedReport(report) || setIsModalOpen(true)
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    report.status === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : report.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {report.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300/50">
                                {report.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300/50">
                                {report.message}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    <ReportModal
                      report={selectedReport}
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      handleUpdateStatus={handleUpdateStatus}
                    />
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}