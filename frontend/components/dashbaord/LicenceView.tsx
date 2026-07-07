"use client";

import { useEffect, useMemo, useState } from "react";

type LicenceStatus = "pending" | "approved" | "rejected";

type LicenceRow = {
  id: number;
  licenceNo: string;
  fullName: string;
  email: string;
  mobileNo: string;
  panPhoto: string;
  aadhaarPhoto: string;
  signaturePhoto: string;
  status: LicenceStatus;
  createdAt: string;
};

function StatusBadge({ status }: { status: string }) {
  const cfg = useMemo(() => {
    const s = String(status || "").toLowerCase();
    if (s === "approved") {
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        label: "Approved",
      };
    }
    if (s === "rejected") {
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        label: "Rejected",
      };
    }
    return {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
      label: "Pending",
    };
  }, [status]);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

export default function LicenceView() {
  const backendBaseUrl = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:5000";
  }, []);

  const [rows, setRows] = useState<LicenceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected item modal details
  const [selected, setSelected] = useState<LicenceRow | null>(null);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${backendBaseUrl}/api/licences`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setError(payload?.message || "Failed to fetch Licence submissions.");
        return;
      }
      setRows((payload?.data as LicenceRow[]) || []);
    } catch (e: any) {
      setError(e?.message || "Network error while fetching Licence submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id: number, status: LicenceStatus) {
    try {
      const res = await fetch(`${backendBaseUrl}/api/licences/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setError(payload?.message || "Failed to update status.");
        return;
      }

      // Update selected state if it is currently open
      if (selected && selected.id === id) {
        setSelected((prev) => prev ? { ...prev, status } : null);
      }

      await load();
    } catch (e: any) {
      setError(e?.message || "Network error while updating status.");
    }
  }

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesStatus =
        statusFilter === "all" || r.status.toLowerCase() === statusFilter.toLowerCase();

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.mobileNo.toLowerCase().includes(q) ||
        r.licenceNo.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [rows, search, statusFilter]);

  return (
    <div className="mt-5">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                🪪 Licence Submissions
              </h2>
              <p className="text-slate-500 mt-1">Review and manage client driving licence applications.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm w-full sm:w-60"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 text-sm bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="py-12 text-center text-slate-500">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Loading submissions...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No submissions found matching criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-600 bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3.5 font-semibold">Licence No</th>
                    <th className="px-4 py-3.5 font-semibold">Owner</th>
                    <th className="px-4 py-3.5 font-semibold">Contact No</th>
                    <th className="px-4 py-3.5 font-semibold">Status</th>
                    <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map((r) => (
                    <tr key={r.id} className="align-middle hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{r.licenceNo}</div>
                        <div className="text-slate-400 text-[11px]">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">{r.fullName}</div>
                        <div className="text-slate-500 text-xs">{r.email}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-slate-900 font-medium">{r.mobileNo}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelected(r)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200"
                          >
                            View Documents
                          </button>

                          <select
                            value={r.status}
                            onChange={(e) => updateStatus(r.id, e.target.value as LicenceStatus)}
                            className="px-2 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approve</option>
                            <option value="rejected">Reject</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Documents Preview Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-xs font-bold text-orange-500 tracking-wider uppercase">
                  Application Review
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selected.fullName} — {selected.licenceNo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-10 h-10 rounded-full hover:bg-slate-200 text-slate-500 font-bold transition-all text-xl flex items-center justify-center border border-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <div className="grid md:grid-cols-2 gap-6 mb-6 text-sm">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                  <p className="text-slate-400 text-xs">Email ID</p>
                  <p className="text-slate-800 font-semibold mt-0.5">{selected.email}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                  <p className="text-slate-400 text-xs">Mobile Number</p>
                  <p className="text-slate-800 font-semibold mt-0.5">{selected.mobileNo}</p>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                📄 Submitted Documents
              </h4>

              <div className="grid md:grid-cols-3 gap-6">

                {/* PAN Photo */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm text-center flex flex-col justify-between">
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm">PAN Card</h5>
                    <p className="text-[11px] text-slate-400 mb-2">PAN card registration photo</p>
                  </div>
                  <div className="aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 relative group">
                    {selected.panPhoto.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selected.panPhoto} alt="PAN Card" className="object-contain w-full h-full p-1" />
                    ) : (
                      <p className="text-slate-400 text-xs">No preview available</p>
                    )}
                  </div>
                  <a
                    href={selected.panPhoto}
                    download={`${selected.fullName}_PAN.png`}
                    className="mt-3 block text-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-200"
                  >
                    Download File
                  </a>
                </div>

                {/* Aadhaar Photo */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm text-center flex flex-col justify-between">
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm">Aadhaar Card</h5>
                    <p className="text-[11px] text-slate-400 mb-2">Aadhaar card verification photo</p>
                  </div>
                  <div className="aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 relative group">
                    {selected.aadhaarPhoto.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selected.aadhaarPhoto} alt="Aadhaar Card" className="object-contain w-full h-full p-1" />
                    ) : (
                      <p className="text-slate-400 text-xs">No preview available</p>
                    )}
                  </div>
                  <a
                    href={selected.aadhaarPhoto}
                    download={`${selected.fullName}_Aadhaar.png`}
                    className="mt-3 block text-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-200"
                  >
                    Download File
                  </a>
                </div>

                {/* Signature Photo */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm text-center flex flex-col justify-between">
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm">Signature Specimen</h5>
                    <p className="text-[11px] text-slate-400 mb-2">Applicant signature photo</p>
                  </div>
                  <div className="aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 relative group">
                    {selected.signaturePhoto.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selected.signaturePhoto} alt="Signature Specimen" className="object-contain w-full h-full p-1" />
                    ) : (
                      <p className="text-slate-400 text-xs">No preview available</p>
                    )}
                  </div>
                  <a
                    href={selected.signaturePhoto}
                    download={`${selected.fullName}_Signature.png`}
                    className="mt-3 block text-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-200"
                  >
                    Download File
                  </a>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Current Status:</span>
                <StatusBadge status={selected.status} />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "approved")}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 text-white transition-all shadow-sm"
                >
                  Approve Application
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "rejected")}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
