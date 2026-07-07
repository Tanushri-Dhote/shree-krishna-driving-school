"use client";

import { useMemo, useState } from "react";

type ServiceRow = {
  id: number;
  status: string;
  createdAt: string;
  fullName?: string;
  email?: string;
  licenceNo?: string;
  mobileNo?: string;
};

type LicenceDetailViewProps = {
  licences: ServiceRow[];
  onBack: () => void;
};

function formatDate(input?: string) {
  if (!input) return "-";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function statusColor(s: string) {
  const st = s?.toLowerCase();
  if (st === "approved") return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", label: "Approved", icon: "✅" };
  if (st === "rejected") return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "Rejected", icon: "❌" };
  return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", label: "Pending", icon: "⏳" };
}

export default function LicenceDetailView({ licences, onBack }: LicenceDetailViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalLicences = licences.length;
  const pendingCount = licences.filter((a) => a.status?.toLowerCase() === "pending").length;
  const approvedCount = licences.filter((a) => a.status?.toLowerCase() === "approved").length;
  const rejectedCount = licences.filter((a) => a.status?.toLowerCase() === "rejected").length;

  const filteredData = useMemo(() => {
    return licences.filter((item) => {
      const matchesSearch =
        item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.licenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mobileNo?.includes(searchTerm) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" || item.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [licences, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const kpiCards = [
    { label: "Total Licence Applications", count: totalLicences, icon: "🪪", color: "violet", gradient: "from-violet-50 to-violet-100" },
    { label: "Pending", count: pendingCount, icon: "⏳", color: "amber", gradient: "from-amber-50 to-amber-100" },
    { label: "Approved", count: approvedCount, icon: "✅", color: "green", gradient: "from-green-50 to-green-100" },
    { label: "Rejected", count: rejectedCount, icon: "❌", color: "red", gradient: "from-red-50 to-red-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            🪪 Driving Licence
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Manage and track all driving licence applications</p>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-all"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${card.gradient} border-2 border-${card.color}-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">{card.label}</p>
                <h2 className="mt-3 text-4xl font-black text-slate-900">{card.count}</h2>
              </div>
              <div className="text-4xl">{card.icon}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 font-medium">vs last month</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200 rounded-3xl p-6 shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, licence no, mobile..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 pl-12 text-sm outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
            <svg
              className="absolute left-4 top-3.5 h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            <button className="px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              📥 Export
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Licence No</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Candidate Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Mobile No</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 text-6xl">📂</div>
                      <h3 className="text-lg font-semibold text-slate-600">No Applications Found</h3>
                      <p className="mt-2 text-sm text-slate-500">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => {
                  const sc = statusColor(item.status);
                  return (
                    <tr key={idx} className="hover:bg-violet-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">{item.licenceNo}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{item.fullName}</td>
                      <td className="px-6 py-4 text-slate-700 text-sm">{item.mobileNo}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{item.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs font-bold ${sc.bg} ${sc.border} ${sc.text}`}>
                          <span>{sc.icon}</span>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-violet-500 hover:text-violet-700 font-semibold text-sm transition">👁️ View</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-sm text-slate-600 font-medium">
            Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            <span className="font-bold">{filteredData.length}</span> applications
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 transition"
            >
              ←
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg font-semibold transition ${
                    currentPage === pageNum ? "bg-violet-500 text-white" : "border border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && <span className="px-2 text-slate-500">...</span>}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 transition"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
