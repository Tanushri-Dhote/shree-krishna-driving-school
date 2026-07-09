import { useEffect, useMemo, useState } from "react";
import { Check, Plus, Trash2, X, Edit2 } from "lucide-react";
import { MdOutlineDownloading, MdRefresh } from "react-icons/md";

import * as XLSX from "xlsx";


type MaintenanceRow = {
  id: number;

  // Excel-like fields requested
  sr: number | null;
  bookingDate: string | null;
  agentName: string | null;
  phoneNumber: string | null;
  customerName: string | null;
  product: string | null;
  policyType: string | null;
  makeModel: string | null;
  vehicleNumber: string | null;
  company: string | null;
  startDate: string | null;
  endDate: string | null;
  amountRs: number | null;
  createdAt: string;
  updatedAt: string;
};

function formatDate(input?: string | null) {
  if (!input) return "-";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

import DashboardShell from "./DashboardShell";

export default function MaintenanceView() {
  const backendBaseUrl = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:3001";
  }, []);

  const [rows, setRows] = useState<MaintenanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<MaintenanceRow>>({});

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createData, setCreateData] = useState<Partial<MaintenanceRow>>({
    sr: null,
    bookingDate: null,
    agentName: "",
    phoneNumber: "",
    customerName: "",
    product: "",
    policyType: "",
    makeModel: "",
    vehicleNumber: "",
    company: "",
    startDate: null,
    endDate: null,
    amountRs: null,
  });

  // Filters
  const [search, setSearch] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${backendBaseUrl}/api/maintenance`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setError(payload?.message || "Failed to fetch Maintenance records.");
        return;
      }
      const fetched = (payload?.data as MaintenanceRow[]) || [];
      // sort ascending by `sr` when present, fallback to `id`
      fetched.sort((a, b) => {
        const va = a.sr ?? a.id;
        const vb = b.sr ?? b.id;
        return (va ?? 0) - (vb ?? 0);
      });
      setRows(fetched);
    } catch (e: any) {
      setError(e?.message || "Network error while fetching Maintenance records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      return [
        `${r.sr ?? ""}`,
        r.agentName ?? "",
        r.phoneNumber ?? "",
        r.customerName ?? "",
        r.product ?? "",
        r.policyType ?? "",
        r.makeModel ?? "",
        r.vehicleNumber ?? "",
        r.company ?? "",
      ]
        .some((value) => value.toString().toLowerCase().includes(q));
    });
  }, [rows, search]);

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this maintenance record?")) return;
    try {
      const res = await fetch(`${backendBaseUrl}/api/maintenance/${id}`, {
        method: "DELETE",
        headers: { "x-is-admin": "true" },
      });
      if (!res.ok) {
        alert("Failed to delete maintenance record");
        return;
      }
      await load();
    } catch {
      alert("Error deleting maintenance record");
    }
  }

  function startEdit(row: MaintenanceRow) {
    setEditingId(row.id);
    setEditData({ ...row });
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      const res = await fetch(`${backendBaseUrl}/api/maintenance/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-is-admin": "true",
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        alert("Failed to update: " + (payload?.message || "Unknown error"));
        return;
      }

      setEditingId(null);
      setEditData({});
      await load();
    } catch (e: any) {
      alert("Error updating maintenance record: " + e.message);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  async function handleCreate() {
    // No strict required fields for Excel-style create


    try {
      setCreating(true);
      const res = await fetch(`${backendBaseUrl}/api/maintenance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-is-admin": "true",
        },
        body: JSON.stringify(createData),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        alert("Failed to create: " + (payload?.message || "Unknown error"));
        return;
      }

      setShowCreateForm(false);
      setCreateData({
        sr: null,
        bookingDate: null,
        agentName: "",
        phoneNumber: "",
        customerName: "",
        product: "",
        policyType: "",
        makeModel: "",
        vehicleNumber: "",
        company: "",
        startDate: null,
        endDate: null,
        amountRs: null,
      });

      setCreating(false);
      await load();
    } catch (e: any) {
      alert("Error creating maintenance record: " + e.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <DashboardShell>
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Maintenance Excel</h2>
          <div className="flex gap-3">
            <Plus
              size={32}
              onClick={() => setShowCreateForm(true)}
              className={`cursor-pointer text-4xl text-orange-500 hover:text-orange-600 transition-colors ${loading ? "animate-spin pointer-events-none" : ""
                }`} />
            <MdRefresh
              onClick={load}
              className={`cursor-pointer text-4xl text-orange-500 hover:text-orange-600 transition-colors ${loading ? "animate-spin pointer-events-none" : ""
                }`}
             
            />
            <button
              onClick={() => {
                if (!rows || rows.length === 0) {
                  alert("No records to download");
                  return;
                }

                function formatDateDMY(v: any) {
                  if (!v) return "";
                  const d = new Date(v);
                  if (Number.isNaN(d.getTime())) return String(v);

                  const dd = String(d.getDate()).padStart(2, "0");
                  const mm = String(d.getMonth() + 1).padStart(2, "0");
                  const yyyy = d.getFullYear();

                  return `${dd}-${mm}-${yyyy}`;
                }

                const exportRows = [...rows]
                  .sort((a, b) => (a.sr ?? a.id) - (b.sr ?? b.id))
                  .map((r) => ({
                    "SR": r.sr,
                    "Booking Date": formatDateDMY(r.bookingDate),
                    "Agent Name": r.agentName,
                    "Phone Number": r.phoneNumber,
                    "Customer Name": r.customerName,
                    "Product": r.product,
                    "Policy Type": r.policyType,
                    "Make Model": r.makeModel,
                    "Vehicle Number": r.vehicleNumber,
                    "Company": r.company,
                    "Start Date": formatDateDMY(r.startDate),
                    "End Date": formatDateDMY(r.endDate),
                    "Amount (Rs)": r.amountRs,
                    "Created At": formatDateDMY(r.createdAt),
                    "Updated At": formatDateDMY(r.updatedAt),
                  }));

                const worksheet = XLSX.utils.json_to_sheet(exportRows);

                // Optional: Set column widths
                worksheet["!cols"] = [
                  { wch: 6 },   // SR
                  { wch: 15 },  // Booking Date
                  { wch: 25 },  // Agent Name
                  { wch: 18 },  // Phone Number
                  { wch: 25 },  // Customer Name
                  { wch: 20 },  // Product
                  { wch: 18 },  // Policy Type
                  { wch: 20 },  // Make Model
                  { wch: 18 },  // Vehicle Number
                  { wch: 20 },  // Company
                  { wch: 15 },  // Start Date
                  { wch: 15 },  // End Date
                  { wch: 12 },  // Amount
                  { wch: 15 },  // Created At
                  { wch: 15 },  // Updated At
                ];

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Maintenance");

                XLSX.writeFile(
                  workbook,
                  `maintenance_export_${new Date().toISOString().slice(0, 10)}.xlsx`
                );
              }}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
            >
              <MdOutlineDownloading className="text-lg" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="mb-6 p-6 bg-slate-50 border-2 border-green-200 rounded-lg">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Add New Maintenance Record</h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {/* NOTE: based on your table fields request */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  SR <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={createData.sr ?? ""}
                  onChange={(e) =>
                    setCreateData({
                      ...createData,
                      sr: e.target.value === "" ? null : parseInt(e.target.value, 10),
                    })
                  }
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Booking Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  placeholder="Booking Date"
                  value={createData.bookingDate ? new Date(createData.bookingDate).toISOString().split("T")[0] : ""}
                  onChange={(e) => setCreateData({ ...createData, bookingDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Agent Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Agent Name"
                  value={createData.agentName ?? ""}
                  onChange={(e) => setCreateData({ ...createData, agentName: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Phone Number
                </label>

                <div className="flex items-center border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
                  <span className="px-3 py-2 bg-slate-100 border-r border-slate-300 text-slate-700">
                    +91
                  </span>

                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={createData.phoneNumber ?? ""}
                    onChange={(e) => {
                      // Allow only digits and limit to 10
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setCreateData({
                        ...createData,
                        phoneNumber: value,
                      });
                    }}
                    maxLength={10}
                    className="w-full px-3 py-2 rounded-r-lg focus:outline-none"
                  />
                </div>

              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={createData.customerName ?? ""}
                  onChange={(e) => setCreateData({ ...createData, customerName: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Product <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Product"
                  value={createData.product ?? ""}
                  onChange={(e) => setCreateData({ ...createData, product: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Polity Type<span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Policy Type"
                  value={createData.policyType ?? ""}
                  onChange={(e) => setCreateData({ ...createData, policyType: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Make Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Make Model"
                  value={createData.makeModel ?? ""}
                  onChange={(e) => setCreateData({ ...createData, makeModel: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Vehicle Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Vehicle Number"
                  value={createData.vehicleNumber ?? ""}
                  onChange={(e) => setCreateData({ ...createData, vehicleNumber: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Company"
                  value={createData.company ?? ""}
                  onChange={(e) => setCreateData({ ...createData, company: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Start date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  placeholder="Start Date"
                  value={createData.startDate ? new Date(createData.startDate).toISOString().split("T")[0] : ""}
                  onChange={(e) => setCreateData({ ...createData, startDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  End Date <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  placeholder="End Date"
                  value={createData.endDate ? new Date(createData.endDate).toISOString().split("T")[0] : ""}
                  onChange={(e) => setCreateData({ ...createData, endDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>


              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Amount
                </label>

                <div className="flex items-center border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
                  <span className="px-3 py-2 bg-slate-100 border-r border-slate-300 text-slate-700 font-medium">
                    ₹
                  </span>

                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={createData.amountRs ?? ""}
                    onChange={(e) =>
                      setCreateData({
                        ...createData,
                        amountRs: e.target.value === "" ? null : parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 flex gap-2 justify-end">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-2 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 text-[13px]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-[13px]"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>
        )}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Search by SR, Agent, Customer, Product, Company, or Vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table with ONLY requested fields (UI aligned with LicenceView) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          <div className="p-6">
            {loading ? (
              <div className="py-12 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                Loading maintenance...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-500">No maintenance records found matching criteria.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700">SR</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">BOOKING Date</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Agent Name</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Phone Number</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Customer name</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Product</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Policy Type</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Make Model</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Vehicle number</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Company</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Start Date</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">End Date</th>
                      <th className="px-6 py-4 text-left text-[13px] font-bold text-slate-700 whitespace-nowrap">Rs</th>
                      <th className="px-6 py-4 text-right text-[13px] font-bold text-slate-700 whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((row) => (
                      <tr
                        key={row.id}
                        className={`transition hover:bg-orange-50 ${editingId === row.id ? "bg-blue-50" : ""}`}
                      >
                        {editingId === row.id ? (
                          <>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                value={editData.sr ?? ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    sr: e.target.value === "" ? null : parseInt(e.target.value, 10),
                                  })
                                }
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="date"
                                value={
                                  editData.bookingDate
                                    ? new Date(editData.bookingDate).toISOString().split("T")[0]
                                    : ""
                                }
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    bookingDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                                  })
                                }
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editData.agentName ?? ""}
                                onChange={(e) => setEditData({ ...editData, agentName: e.target.value })}
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editData.phoneNumber ?? ""}
                                onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editData.customerName ?? ""}
                                onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editData.product ?? ""}
                                onChange={(e) => setEditData({ ...editData, product: e.target.value })}
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editData.policyType ?? ""}
                                onChange={(e) => setEditData({ ...editData, policyType: e.target.value })}
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editData.makeModel ?? ""}
                                onChange={(e) => setEditData({ ...editData, makeModel: e.target.value })}
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editData.vehicleNumber ?? ""}
                                onChange={(e) => setEditData({ ...editData, vehicleNumber: e.target.value })}
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editData.company ?? ""}
                                onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="date"
                                value={
                                  editData.startDate ? new Date(editData.startDate).toISOString().split("T")[0] : ""
                                }
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    startDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                                  })
                                }
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="date"
                                value={
                                  editData.endDate ? new Date(editData.endDate).toISOString().split("T")[0] : ""
                                }
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    endDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                                  })
                                }
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                value={editData.amountRs ?? ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    amountRs: e.target.value === "" ? null : parseFloat(e.target.value),
                                  })
                                }
                                className="w-full h-9 px-3 border border-blue-200 rounded-xl bg-white outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={saveEdit}
                                  className="p-2 text-green-700 hover:bg-green-100 rounded-xl"
                                  title="Save"
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-2 text-red-700 hover:bg-red-100 rounded-xl"
                                  title="Cancel"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 font-bold text-[11px] text-slate-800">
                              {row.sr ?? "-"}
                            </td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{formatDate(row.bookingDate)}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{row.agentName ?? "-"}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{row.phoneNumber ?? "-"}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{row.customerName ?? "-"}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{row.product ?? "-"}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{row.policyType ?? "-"}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{row.makeModel ?? "-"}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{row.vehicleNumber ?? "-"}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{row.company ?? "-"}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{formatDate(row.startDate)}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">{formatDate(row.endDate)}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">
                              {row.amountRs !== null && row.amountRs !== undefined ? `₹${row.amountRs}` : "-"}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => startEdit(row)}
                                  className="p-2 text-blue-700 hover:bg-blue-100 rounded-xl"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(row.id)}
                                  className="p-2 text-red-700 hover:bg-red-100 rounded-xl"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          Showing {filtered.length} of {rows.length} records
        </div>
      </div>
    </DashboardShell>
  );
}

