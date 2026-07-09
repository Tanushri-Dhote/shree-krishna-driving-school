"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
type LicenceStatus = "pending" | "approved" | "rejected";
import { Eye } from "lucide-react";
import { toast } from "sonner";


type LicenceRow = {
  id: number;
  licenceNo: string;
  applicationNo?: string;
  fullName: string;
  email: string;
  mobileNo: string;
   dob?: string; 
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

import DashboardShell from "./DashboardShell";

export default function LicenceView() {
  const backendBaseUrl = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:5000";
  }, []);

  const [rows, setRows] = useState<LicenceRow[]>([]);

  // If backend stores image paths like /uploads/file.png (not data:), render them.
  const resolveImageSrc = (src?: string) => {
    const v = String(src || "").trim();
    if (!v) return "";
    if (v.startsWith("data:")) return v;
    // If it is already an absolute URL
    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    // Otherwise treat as backend-relative path
    return `${backendBaseUrl}${v.startsWith("/") ? "" : "/"}${v}`;
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [applicationNumber, setApplicationNumber] = useState("");

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
      const data = (payload?.data || []) as any[];

      // Map possible backend field names to our UI model.
      // This prevents missing previews when backend uses different keys for signature.
      setRows(
        data.map((d) => ({
          ...(d as LicenceRow),
          applicationNo: d.applicationNo ?? "",
          signaturePhoto:
            d.signaturePhoto ?? d.signature ?? d.signPhoto ?? d.signatureImage ?? "",
        }))
      );
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

 async function updateStatus(
  id: number,
  status: LicenceStatus,
  applicationNumber?: string
) {
  try {
    setError("");

    const res = await fetch(`${backendBaseUrl}/api/licences/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        applicationNumber,
      }),
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      const message = payload?.message || "Failed to update status.";
      setError(message);
      toast.error(message);
      return;
    }

    await load();

    toast.success("Licence status updated successfully.");

    setApplicationNumber("");

    setSelected(null);
  } catch (e: any) {
    const message =
      e?.message || "Network error while updating licence status.";

    setError(message);
    toast.error(message);
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
    <DashboardShell>
      <div className="mt-5">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  🪪  Licence Applications
                </h2>

                <p className="mt-1 text-slate-500">
                  Manage driving licence applications.
                </p>
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

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter Application No"
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const appNo = String((e.target as HTMLInputElement).value || "").trim();
                      setSearch(appNo);
                      try {
                        sessionStorage.setItem("licence_app_no_filter", appNo);
                      } catch {
                        // ignore
                      }
                    }
                  }}
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
                        Licence No
                      </th>

                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">
                        Candidate
                      </th>

                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">
                        Mobile
                      </th>

                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">
                        Email
                      </th>

                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">
                        Date
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

                        <td className="px-6 py-4 font-bold text-[11px]">
                          {item.licenceNo}
                        </td>

                        <td className="px-6 py-4">

                          <div>

                            <p className="font-semibold text-slate-800 text-[11px]">
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

                        <td className="px-6 py-4">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-[11px] text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString("en-IN")}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <Eye
                            size={22}
                            onClick={() => {
                              setSelected(item);
                              setApplicationNumber(item.applicationNo || "");
                            }}
                            className="cursor-pointer text-orange-500 hover:text-orange-600 hover:scale-110 transition-all duration-200"
                            aria-label="View Details"
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

        {/* Documents Preview Modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/55 backdrop-blur-sm p-4"
          >
            <div className="flex min-h-full items-center justify-center">
              <div className="bg-white rounded-3xl w-full max-w-[1100px] shadow-2xl max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        📄 Licence Details
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Candidate Information & Uploaded Documents
                      </p>
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

                {/* Details Table */}
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
    Date of Birth
  </th>

  <td className="px-6 py-4 text-[13px] text-slate-700">
    {selected.dob
      ? new Date(selected.dob).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "-"}
  </td>
</tr>
                        <tr className="hover:bg-orange-50 transition">
                          <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            Licence Number
                          </th>
                          <td className="px-6 py-4 text-[13px] font-semibold text-slate-800">
                            {selected.licenceNo}
                          </td>
                        </tr>
                        <tr className="hover:bg-orange-50 transition">
                          <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            Created Date
                          </th>
                          <td className="px-6 py-4 text-[13px] text-slate-700">
                            {new Date(selected.createdAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </td>
                        </tr>

                        {/* PAN Card */}
                        <tr className="transition hover:bg-orange-50">
                          <th className="bg-slate-50 px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600 align-top">
                            PAN Card
                          </th>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {selected.panPhoto?.startsWith("data:") ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={selected.panPhoto}
                                    alt="PAN Card"
                                    className="h-24 w-32 rounded-lg border object-cover"
                                  />
                                ) : (
                                  <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed text-xs text-slate-400">
                                    No Image
                                  </div>
                                )}
                                <p className="text-[13px] font-medium text-slate-700">
                                  PAN Card
                                </p>
                              </div>

                              {selected.panPhoto ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = resolveImageSrc(selected.panPhoto) || selected.panPhoto;
                                    link.download = `${selected.fullName}_PAN.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                >
                                  Download
                                </Button>
                              ) : null}


                            </div>
                          </td>
                        </tr>

                        {/* Aadhaar Card */}
                        <tr className="transition hover:bg-orange-50">
                          <th className="bg-slate-50 px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600 align-top">
                            Aadhaar Card
                          </th>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {selected.aadhaarPhoto?.startsWith("data:") ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={selected.aadhaarPhoto}
                                    alt="Aadhaar Card"
                                    className="h-24 w-32 rounded-lg border object-cover"
                                  />
                                ) : (
                                  <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed text-xs text-slate-400">
                                    No Image
                                  </div>
                                )}
                                <p className="text-[13px] font-medium text-slate-700">
                                  Aadhaar Card
                                </p>
                              </div>

                              {selected.aadhaarPhoto ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = selected.aadhaarPhoto;
                                    link.download = `${selected.fullName}_Aadhaar.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                >
                                  Download
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>

                        {/* Signature Photo */}
                        <tr className="transition hover:bg-orange-50">
                          <th className="bg-slate-50 px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600 align-top">
                            Signature
                          </th>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {(() => {
                                  const src = resolveImageSrc(selected.signaturePhoto);
                                  if (src) {
                                    return (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={src}
                                        alt="Signature"
                                        className="h-24 w-32 rounded-lg border object-cover"
                                      />
                                    );
                                  }
                                  return (
                                    <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed text-xs text-slate-400">
                                      No Image
                                    </div>
                                  );
                                })()}

                                <p className="text-[13px] font-medium text-slate-700">
                                  Signature Specimen
                                </p>
                              </div>

                              {selected.signaturePhoto ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = selected.signaturePhoto;
                                    link.download = `${selected.fullName}_Signature.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                >
                                  Download
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>

                        {/* Current Status */}
                        <tr className="transition hover:bg-orange-50">
                          <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            Current Status
                          </th>
                          <td className="px-6 py-4">
                            <StatusBadge status={selected.status} />
                          </td>
                        </tr>

                        {/* Status Update */}
                        <tr className="transition hover:bg-orange-50">
                          <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                            Update Status
                          </th>

                          <td className="px-6 py-4">

                            <div className="space-y-3">

                              <select
                                value={selected.status}
                                onChange={(e) => {
                                  const value = e.target.value as LicenceStatus;

                                  setSelected({
                                    ...selected,
                                    status: value,
                                  });
                                }}
                                className="h-10 rounded-xl border border-slate-300 px-4"
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>

                              {selected.status === "approved" && (
                                <input
                                  type="text"
                                  placeholder="Enter Application Number"
                                  value={applicationNumber}
                                  onChange={(e) => setApplicationNumber(e.target.value)}
                                  className="w-full rounded-xl border border-slate-300 px-4 py-2"
                                />
                              )}

                              <Button
                                onClick={() => {

                                  if (
                                    selected.status === "approved" &&
                                    applicationNumber.trim() === ""
                                  ) {
                                    alert("Please enter Application Number");
                                    return;
                                  }

                                  updateStatus(
                                    selected.id,
                                    selected.status as LicenceStatus,
                                    applicationNumber
                                  );
                                }}
                                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"

                              >
                                Save
                              </Button>

                            </div>

                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2">
                  <p className="text-[11px] text-slate-500">
                    Licence ID :
                    <span className="ml-1 font-semibold text-slate-800 text-[11px]">
                      {selected.licenceNo}
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
