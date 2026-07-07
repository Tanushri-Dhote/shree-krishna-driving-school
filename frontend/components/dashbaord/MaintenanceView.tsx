import { useEffect, useMemo, useState } from "react";
import { Check, Plus, Trash2, X, Edit2 } from "lucide-react";

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
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Maintenance Excel</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={20} />
            Add New
          </button>
          <button
            onClick={load}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={() => {
              // prepare CSV from rows and trigger download
              if (!rows || rows.length === 0) {
                alert("No records to download");
                return;
              }
              const headers = [
                "sr",
                "bookingDate",
                "agentName",
                "phoneNumber",
                "customerName",
                "product",
                "policyType",
                "makeModel",
                "vehicleNumber",
                "company",
                "startDate",
                "endDate",
                "amountRs",
                "createdAt",
                "updatedAt",
              ];

              const escape = (v: any) => {
                if (v === null || v === undefined) return "";
                const s = typeof v === "string" ? v : String(v);
                return `"${s.replace(/"/g, '""')}"`;
              };

              const dateFields = new Set(["bookingDate", "startDate", "endDate", "createdAt", "updatedAt"]);
              function formatDateDMY(v: any) {
                if (v === null || v === undefined || v === "") return "";
                const d = v instanceof Date ? v : new Date(v);
                if (Number.isNaN(d.getTime())) return String(v);
                const dd = String(d.getDate()).padStart(2, "0");
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const yyyy = d.getFullYear();
                return `${dd}-${mm}-${yyyy}`;
              }

              const csvRows = [headers.join(",")];
              const exportRows = [...rows].sort((a, b) => {
                const va = a.sr ?? a.id;
                const vb = b.sr ?? b.id;
                return (va ?? 0) - (vb ?? 0);
              });
              for (const r of exportRows) {
                const row = headers
                  .map((h) => {
                    const val = (r as any)[h];
                    if (dateFields.has(h)) return escape(formatDateDMY(val));
                    return escape(val);
                  })
                  .join(",");
                csvRows.push(row);
              }

              const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `maintenance_export_${new Date().toISOString().slice(0,10)}.csv`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
          >
            Download Excel
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-6 bg-slate-50 border-2 border-green-200 rounded-lg">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Add New Maintenance Record</h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* NOTE: based on your table fields request */}
            <input
              type="number"
              placeholder="SR"
              value={createData.sr ?? ""}
              onChange={(e) => setCreateData({ ...createData, sr: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="date"
              placeholder="Booking Date"
              value={createData.bookingDate ? new Date(createData.bookingDate).toISOString().split("T")[0] : ""}
              onChange={(e) => setCreateData({ ...createData, bookingDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              placeholder="Agent Name"
              value={createData.agentName ?? ""}
              onChange={(e) => setCreateData({ ...createData, agentName: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={createData.phoneNumber ?? ""}
              onChange={(e) => setCreateData({ ...createData, phoneNumber: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              placeholder="Customer Name"
              value={createData.customerName ?? ""}
              onChange={(e) => setCreateData({ ...createData, customerName: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              placeholder="Product"
              value={createData.product ?? ""}
              onChange={(e) => setCreateData({ ...createData, product: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              placeholder="Policy Type"
              value={createData.policyType ?? ""}
              onChange={(e) => setCreateData({ ...createData, policyType: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              placeholder="Make Model"
              value={createData.makeModel ?? ""}
              onChange={(e) => setCreateData({ ...createData, makeModel: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              placeholder="Vehicle Number"
              value={createData.vehicleNumber ?? ""}
              onChange={(e) => setCreateData({ ...createData, vehicleNumber: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              placeholder="Company"
              value={createData.company ?? ""}
              onChange={(e) => setCreateData({ ...createData, company: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="date"
              placeholder="Start Date"
              value={createData.startDate ? new Date(createData.startDate).toISOString().split("T")[0] : ""}
              onChange={(e) => setCreateData({ ...createData, startDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="date"
              placeholder="End Date"
              value={createData.endDate ? new Date(createData.endDate).toISOString().split("T")[0] : ""}
              onChange={(e) => setCreateData({ ...createData, endDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="number"
              placeholder="Amount (Rs)"
              value={createData.amountRs ?? ""}
              onChange={(e) => setCreateData({ ...createData, amountRs: e.target.value === "" ? null : parseFloat(e.target.value) })}
              className="col-span-2 md:col-span-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mt-4 flex gap-2 justify-end">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
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

      {/* Table with ONLY requested fields */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">SR</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">BOOKING Date</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Agent Name</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Phone Number</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Customer name</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Product</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Policy Type</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Make Model</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Vehicle number</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Company</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Start Date</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">End Date</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Rs</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={14} className="px-4 py-8 text-center text-slate-500">
                  No maintenance records found
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-slate-200 hover:bg-slate-50 ${
                    editingId === row.id ? "bg-blue-50" : ""
                  }`}
                >
                  {editingId === row.id ? (
                    <>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={editData.sr ?? ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              sr: e.target.value === "" ? null : parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
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
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={editData.agentName ?? ""}
                          onChange={(e) => setEditData({ ...editData, agentName: e.target.value })}
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={editData.phoneNumber ?? ""}
                          onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={editData.customerName ?? ""}
                          onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={editData.product ?? ""}
                          onChange={(e) => setEditData({ ...editData, product: e.target.value })}
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={editData.policyType ?? ""}
                          onChange={(e) => setEditData({ ...editData, policyType: e.target.value })}
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={editData.makeModel ?? ""}
                          onChange={(e) => setEditData({ ...editData, makeModel: e.target.value })}
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={editData.vehicleNumber ?? ""}
                          onChange={(e) => setEditData({ ...editData, vehicleNumber: e.target.value })}
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={editData.company ?? ""}
                          onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
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
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
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
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={editData.amountRs ?? ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              amountRs: e.target.value === "" ? null : parseFloat(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                        />
                      </td>

                      <td className="px-2 py-2 flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Save"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-2 py-2">{row.sr ?? "-"}</td>
                      <td className="px-2 py-2">{formatDate(row.bookingDate)}</td>
                      <td className="px-2 py-2">{row.agentName ?? "-"}</td>
                      <td className="px-2 py-2">{row.phoneNumber ?? "-"}</td>
                      <td className="px-2 py-2">{row.customerName ?? "-"}</td>
                      <td className="px-2 py-2">{row.product ?? "-"}</td>
                      <td className="px-2 py-2">{row.policyType ?? "-"}</td>
                      <td className="px-2 py-2">{row.makeModel ?? "-"}</td>
                      <td className="px-2 py-2">{row.vehicleNumber ?? "-"}</td>
                      <td className="px-2 py-2">{row.company ?? "-"}</td>
                      <td className="px-2 py-2">{formatDate(row.startDate)}</td>
                      <td className="px-2 py-2">{formatDate(row.endDate)}</td>
                      <td className="px-2 py-2">
                        {row.amountRs !== null && row.amountRs !== undefined ? `₹${row.amountRs}` : "-"}
                      </td>

                      <td className="px-2 py-2 flex gap-2">
                        <button
                          onClick={() => startEdit(row)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-slate-600">
        Showing {filtered.length} of {rows.length} records
      </div>
    </div>
  );
}

