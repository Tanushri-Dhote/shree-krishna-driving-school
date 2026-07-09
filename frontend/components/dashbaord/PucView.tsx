"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";


type PucStatus = "pending" | "approved" | "rejected";

type PucRow = {
  id: number;
  pucNo: string;
  fullName: string;
  email: string;
  mobileNo: string;
  rcNumber: string;
  status: PucStatus;
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

import DashboardShell from "./DashboardShell";

export default function PucView() {
  const backendBaseUrl = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:5000";
  }, []);

  const [rows, setRows] = useState<PucRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected item modal details
  const [selected, setSelected] = useState<PucRow | null>(null);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${backendBaseUrl}/api/pucs`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setError(payload?.message || "Failed to fetch PUC submissions.");
        return;
      }
      setRows((payload?.data as PucRow[]) || []);
    } catch (e: any) {
      setError(e?.message || "Network error while fetching PUC submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id: number, status: PucStatus) {
    setError("");
    try {
      const res = await fetch(`${backendBaseUrl}/api/pucs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setError(payload?.message || "Failed to update PUC status.");
        return;
      }

      if (selected && selected.id === id) {
        setSelected((prev) => (prev ? { ...prev, status } : null));
      }

      await load();
    } catch (e: any) {
      setError(e?.message || "Network error while updating PUC status.");
    }
  }

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesStatus =
        statusFilter === "all" ||
        r.status.toLowerCase() === statusFilter.toLowerCase();

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.mobileNo.toLowerCase().includes(q) ||
        r.pucNo.toLowerCase().includes(q) ||
        r.rcNumber.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [rows, search, statusFilter]);

  return (
    <DashboardShell>
      <div className="mt-5">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  🧾 PUC Applications
                </h2>
                <p className="mt-1 text-slate-500">Review and approve/reject PUC applications.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search application..."
                  className="
          h-11
          w-full
          sm:w-64
          rounded-xl
          border
          border-slate-300
          px-4
          text-sm
          outline-none
          focus:border-orange-500
        "
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="
          h-11
          rounded-xl
          border
          border-slate-300
          px-4
          text-sm
          outline-none
          focus:border-orange-500
        "
                >
                  <option value="all">All Status</option>
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
                    <tr className="bg-slate-100">
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">
                        PUC No
                      </th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">
                        Owner
                      </th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">
                        Mobile
                      </th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">
                        RC / Vehicle
                      </th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-[13px] font-bold text-slate-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRows.map((item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-orange-50 text-[14px]"
                      >
                        <td className="px-6 py-4 font-bold text-[11px] whitespace-nowrap">
                          {item.pucNo}
                        </td>

                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-800 text-[11px] whitespace-nowrap">
                              {item.fullName}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-[11px] text-slate-700">
                          {item.mobileNo}
                        </td>

                        <td className="px-6 py-4 text-[11px] text-slate-600">
                          {item.email}
                        </td>

                        <td className="px-6 py-4 text-[11px] text-slate-600">
                          {item.rcNumber}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Eye
                            size={22}
                            onClick={() => setSelected(item)}
                            className="cursor-pointer text-orange-500 hover:text-orange-600 hover:scale-110 transition-all duration-200"
                           
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>


        {/* Details Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 backdrop-blur-sm p-4">
            <div className="flex min-h-full items-center justify-center">
              <div className="bg-white rounded-3xl w-full max-w-[900px] shadow-2xl max-h-[92vh] flex flex-col">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">📄 PUC Details</h3>
                      <p className="mt-1 text-sm text-slate-500">Candidate Information & Application Status</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="w-10 h-10 rounded-full hover:bg-slate-200 text-slate-500 font-bold transition-all text-xl flex items-center justify-center border border-slate-200"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <table className="min-w-full">
                      <tbody className="divide-y divide-slate-100">

                        <tr className="hover:bg-orange-50 transition">
                          <th className="w-60 bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            Full Name
                          </th>
                          <td className="px-6 py-4 text-[13px] font-semibold text-slate-800">
                            {selected.fullName}
                          </td>
                        </tr>

                        <tr className="hover:bg-orange-50 transition">
                          <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            Mobile Number
                          </th>
                          <td className="px-6 py-4 text-[13px] text-slate-700">
                            {selected.mobileNo}
                          </td>
                        </tr>

                        <tr className="hover:bg-orange-50 transition">
                          <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            Email Address
                          </th>
                          <td className="px-6 py-4 text-[13px] text-slate-700 break-all">
                            {selected.email}
                          </td>
                        </tr>

                        <tr className="hover:bg-orange-50 transition">
                          <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            PUC Number
                          </th>
                          <td className="px-6 py-4 text-[13px] font-semibold text-slate-800">
                            {selected.pucNo}
                          </td>
                        </tr>

                        <tr className="hover:bg-orange-50 transition">
                          <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            RC / Vehicle
                          </th>
                          <td className="px-6 py-4 text-[13px] font-semibold text-slate-800">
                            {selected.rcNumber}
                          </td>
                        </tr>

                        <tr className="transition hover:bg-orange-50">
                          <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            Current Status
                          </th>
                          <td className="px-6 py-4">
                            <StatusBadge status={selected.status} />
                          </td>
                        </tr>

                        <tr className="transition hover:bg-orange-50">
                          <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            Update Status
                          </th>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <select
                                value={selected.status}
                                onChange={(e) =>
                                  updateStatus(selected.id, e.target.value as PucStatus)
                                }
                                className="
                                h-10
                                rounded-xl
                                border
                                border-slate-300
                                bg-white
                                px-4
                                text-[13px]
                                outline-none
                                focus:border-orange-500
                                focus:ring-2
                                focus:ring-orange-200
                              "
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2">
                  <p className="text-[11px] text-slate-500">
                    PUC ID :
                    <span className="ml-1 font-semibold text-slate-800 text-[11px]">
                      {selected.pucNo}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="text-[11px] font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}


