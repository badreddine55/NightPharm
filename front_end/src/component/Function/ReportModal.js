


export function ReportModal({ report, isOpen, onClose }: ReportModalProps) {
  if (!isOpen || !report) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Report Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[calc(85vh-8rem)]">
          <div className="flex items-center gap-2">
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
            <span className="text-sm text-gray-500">
              Created on {formatDate(report.createdAt)}
            </span>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Nurse Information
              </h3>
              <div className="rounded-lg border bg-gray-50 p-3">
                <p>
                  <strong>Name:</strong> {report.name}
                </p>
                <p>
                  <strong>Address:</strong> {report.address}
                </p>
                <p>
                  <strong>Specialization:</strong> {report.specialization}
                </p>
                <p>
                  <strong>Years of Experience:</strong>{" "}
                  {report.yearsOfExperience}
                </p>
                <p>
                  <strong>Working Hours:</strong> {report.workingHours}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Message</h3>
              <div className="rounded-lg border bg-gray-50 p-3">
                {report.message}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
