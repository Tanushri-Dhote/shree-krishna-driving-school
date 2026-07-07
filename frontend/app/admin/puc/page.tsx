"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function AdminPucPage() {
  const backendBaseUrl = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:5000";
  }, []);

  const [rows, setRows] = useState<PucRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

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

      await load();
    } catch (e: any) {
      setError(e?.message || "Network error while updating PUC status.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-2 py-6 sm:px-4 lg:px-2 bg-gray-50">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">PUC Submissions</h1>
          <p className="text-neutral-600 mt-2">Review and approve/reject PUC applications.</p>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
        <div className="p-6">
          {loading ? (
            <div className="py-10 text-center text-neutral-600">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center text-neutral-600">No PUC submissions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-neutral-600 bg-neutral-50">
                    <th className="px-4 py-3 font-semibold">PUC No</th>
                    <th className="px-4 py-3 font-semibold">Owner</th>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">RC / Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {rows.map((r) => (
                    <tr key={r.id} className="align-top">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-neutral-900">{r.pucNo}</div>
                        <div className="text-neutral-500 text-xs">ID: {r.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-neutral-900">{r.fullName}</div>
                        <div className="text-neutral-600 text-xs">{r.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-neutral-900">{r.mobileNo}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-neutral-900">{r.rcNumber}</div>
          
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => updateStatus(r.id, "approved")}
                            disabled={loading}
                            className="px-3 py-2 rounded-2xl text-xs font-semibold bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(r.id, "rejected")}
                            disabled={loading}
                            className="px-3 py-2 rounded-2xl text-xs font-semibold bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 disabled:opacity-60"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(r.id, "pending")}
                            disabled={loading}
                            className="px-3 py-2 rounded-2xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 disabled:opacity-60"
                          >
                            Pending
                          </button>
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
    </main>
  );
}

