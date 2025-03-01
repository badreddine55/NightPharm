import { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "../Function/Header";

export default function SendReport() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(
        "http://localhost:5000/api/reports",
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Report sent successfully!");
      setMessage("");
    } catch (error) {
      setError("Failed to send report.");
      console.error("Error sending report:", error);
    } finally {
      setIsSending(false);
    }
  };

  const sidebarItems = [
    { title: "Dashboard", icon: "Home", href: "/dashboard" },
    { title: "Send a Report", icon: "Home", href: "/send-report" },
  ];

  return (
      <>
          <div><Header toggleMenu={() => setIsCollapsed(!isCollapsed)} /></div>
    <div className="min-h-screen flex ">
      <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} items={sidebarItems} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? "ml-[80px]" : "ml-[250px]"
        }`}
      >
        <main className="flex-1 p-6 mt-20 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 transform hover:shadow-2xl transition-shadow duration-300">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Submit Your Report</h1>
            <p className="text-sm text-gray-600 mb-6">
              Let us know what’s on your mind. We’ll handle it promptly.
            </p>

            {error && (
              <div className="mb-4 bg-red-100 text-red-800 p-3 rounded-md text-sm flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-100 text-green-800 p-3 rounded-md text-sm flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lx focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all duration-200 placeholder-gray-400 text-gray-700 resize-none"
                  placeholder="Type your report here..."
                  required
                  disabled={isSending}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center disabled:bg-indigo-400 disabled:cursor-not-allowed"
                disabled={isSending}
              >
                {isSending ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Submit Report
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div></>
  );
}