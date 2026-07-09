"use client";

import { useEffect, useMemo, useState } from "react";
import { MdOutlineDownloading, MdRefresh } from "react-icons/md";
import * as XLSX from "xlsx";

import DashboardShell from "./DashboardShell";

type LicenceStatus = "pending" | "approved" | "rejected";

type LicenceRow = {
  id: number;
  licenceNo?: string;
  fullName?: string;
  email?: string;
  mobileNo?: string;
  dob?: string;
  status?: LicenceStatus | string;
  createdAt?: string;
  applicationNumber?: string;

  // Excel-required fields (may or may not exist in backend)
  applicationNo?: string;

  // Aadhaar image (backend stores it as URL or data URL)
  aadhaarPhoto?: string;
};

function resolveImageSrc(src?: string | null, backendBaseUrl?: string) {
  const v = String(src || "").trim();
  if (!v) return "";
  if (v.startsWith("data:")) return v;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (!backendBaseUrl) return v;
  return `${backendBaseUrl}${v.startsWith("/") ? "" : "/"}${v}`;
}

function safeImageText(input?: string | null) {
  if (!input) return "-";
  const v = String(input).trim();
  if (!v) return "-";
  // Keep it spreadsheet-friendly: export URL/data-uri as text
  return v;
}


function safeDateString(input?: string | null) {
  if (!input) return "-";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function safeDMY(input?: string | null) {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function safeDOB(input?: string | null) {
  if (!input) return "-";

  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}
export default function LicenceExcelView() {
  const backendBaseUrl = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:5000";
  }, []);

  const [rows, setRows] = useState<LicenceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState("");

  const [applicationNoFilter, setApplicationNoFilter] = useState("");

  useEffect(() => {
    try {
      const v = sessionStorage.getItem("licence_app_no_filter") || "";
      setApplicationNoFilter(v);
      setSearch(v);
    } catch {
      // ignore
    }
  }, []);


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
      setRows((payload?.data || []) as LicenceRow[]);
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

  const approvedRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows
      .filter((r) => String(r.status || "").toLowerCase() === "approved")
      .filter((r) => {
        if (!q) return true;
        const name = String(r.fullName || "").toLowerCase();
        const appNo = String(r.applicationNo || r.applicationNumber || "").toLowerCase();
        const aadhaar = String(r.aadhaarPhoto || "").toLowerCase();
        const licenceNo = String(r.licenceNo || "").toLowerCase();
        return [name, appNo, aadhaar, licenceNo].some((v) => v.includes(q));
      });
  }, [rows, search]);

  const exportData = useMemo(() => {
    return [...approvedRows]
      .sort((a, b) => {
        // stable ordering: createdAt desc if present, otherwise id
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (ta !== tb) return ta - tb;
        return (a.id || 0) - (b.id || 0);
      })
      .map((r, idx) => {
        const application =
          r.applicationNo || r.applicationNumber || "-";
        const aadhaar = resolveImageSrc(r.aadhaarPhoto ?? "", backendBaseUrl) || "-";

        return {
          "Sr. No": idx + 1,
          Name: r.fullName ?? "-",
          "Application number": application,
          Date: safeDMY(r.createdAt),
          "Date of Birth": safeDOB(r.dob),
        };
      });
  }, [approvedRows]);

  return (
    <DashboardShell>
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Driving Licence Excel</h2>

          <div className="flex gap-3">
            <MdRefresh
              onClick={load}
              className={`cursor-pointer text-4xl text-orange-500 hover:text-orange-600 transition-colors ${loading ? "animate-spin pointer-events-none" : ""}`}
              title="Refresh"
            />

            <button
              onClick={() => {
                if (!exportData || exportData.length === 0) {
                  alert("No approved licence records to download");
                  return;
                }

                const worksheet = XLSX.utils.json_to_sheet(exportData);
                worksheet["!cols"] = [
                  { wch: 8 },
                  { wch: 30 },
                  { wch: 22 },
                  { wch: 15 },
                  { wch: 18 },
                ];

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Licence");

                XLSX.writeFile(
                  workbook,
                  `licence_approved_export_${new Date().toISOString().slice(0, 10)}.xlsx`
                );
              }}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
            >
              <MdOutlineDownloading className="text-lg" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>
        ) : null}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Search approved licences by name / application / aadhaar / licence no..."
            value={search}
            onChange={(e) => {
              const v = e.target.value;
              setSearch(v);
              try {
                sessionStorage.setItem("licence_app_no_filter", v.trim());
              } catch {
                // ignore
              }
            }}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          <div className="p-6">
            {loading ? (
              <div className="py-12 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                Loading approved licences...
              </div>
            ) : approvedRows.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                No approved licence records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">Sr. No</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">Name</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">Application number</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Date</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">
                        Date of Birth
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {approvedRows
                      .slice()
                      .sort((a, b) => {
                        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        if (ta !== tb) return ta - tb;
                        return (a.id || 0) - (b.id || 0);
                      })
                      .map((r, idx) => (
                        <tr key={r.id} className="transition hover:bg-orange-50">
                          <td className="px-6 py-4 font-bold text-[12px] text-slate-800">{idx + 1}</td>
                          <td className="px-6 py-4 text-[13px] text-slate-700">{r.fullName ?? "-"}</td>
                          <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap font-semibold">
                            {r.applicationNo || r.applicationNumber || "-"}
                          </td>
                          <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">
                            {safeDateString(r.createdAt)}
                          </td>
                         <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">
  {safeDOB(r.dob)}
</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          Showing {approvedRows.length} approved records
        </div>
      </div>
    </DashboardShell>
  );
}

