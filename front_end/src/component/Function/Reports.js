import { useEffect, useState } from "react";
import axios from "axios";
import { ReportModal } from "./ReportModal";

const Reports = ({ reportType }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter reports from the last 24 hours if reportType is "Last 24 Hours"
        if (reportType === "Last 24 Hours") {
          const last24Hours = new Date();
          last24Hours.setHours(last24Hours.getHours() - 24);
          const recentReports = response.data.filter(
            (report) => new Date(report.createdAt) >= last24Hours
          );
          setReports(recentReports);
        } else {
          setReports(response.data);
        }
      } catch (err) {
        setError("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [reportType]);

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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-base font-semibold">Reports</h2>
        <p className="text-sm text-gray-500">{reportType}</p>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <table className="w-full border border-gray-300/50">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border border-gray-300/50">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border border-gray-300/50">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border border-gray-300/50">Message</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border border-gray-300/50">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice().reverse().map((report, index) => (
                <tr
                  key={report._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 cursor-pointer`}
                  onClick={() => setSelectedReport(report) || setIsModalOpen(true)}
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
                  <td className="px-4 py-3 border border-gray-300/50">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(report._id, "accepted");
                        }}
                        className="flex items-center gap-1 rounded-full px-2 py-1 bg-green-100"
                      >
                        <span className="text-green-600 font-medium">Accept</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(report._id, "rejected");
                        }}
                        className="flex items-center gap-1 rounded-full px-2 py-1 bg-red-100"
                      >
                        <span className="text-red-600 font-medium">Reject</span>
                      </button>
                    </div>
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
  );
};

export default Reports;
