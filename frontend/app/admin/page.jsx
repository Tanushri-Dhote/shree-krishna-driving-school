"use client";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "../../components/dashbaord/Sidebar";
import DashboardHeader from "../../components/dashbaord/DashboardHeader";
import KPICards from "../../components/dashbaord/KPICards";
import StatusCards from "../../components/dashbaord/StatusCards";
import ServiceManagement from "../../components/dashbaord/ServiceManagement";
import RecentApplicationsTable from "../../components/dashbaord/RecentApplicationsTable";
import AdmissionDetailsModal from "../../components/dashbaord/AdmissionDetailsModal";

export default function SuperAdminDashboardPage() {
  const backendBaseUrl = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:3001"
    );
  }, []);

  const [activeModule, setActiveModule] =
    useState("dashboard");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [admissions, setAdmissions] = useState([]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [updateStatus, setUpdateStatus] =
    useState("pending");

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] =
    useState("");

  async function fetchAdmissions() {
    try {
      setLoading(true);

      const res = await fetch(
        `${backendBaseUrl}/api/admissions`
      );

      const payload = await res.json();

      setAdmissions(payload?.data || []);
    } catch (err) {
      setError("Failed to load admissions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return admissions.filter((item) => {
      const matchesSearch =
        !q ||
        item.fullName?.toLowerCase().includes(q) ||
        item.admissionNo?.toLowerCase().includes(q) ||
        item.mobileNo?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : item.status?.toLowerCase() ===
            statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [admissions, query, statusFilter]);

 const pendingCount = admissions.filter(
  (a) =>
    a.status?.toLowerCase() === "pending"
).length;

 const approvedTodayCount = admissions.filter(
  (a) =>
    a.status?.toLowerCase() === "approved"
).length;

  function openDetails(admission) {
    setSelected(admission);
    setUpdateStatus(admission.status);
    setDetailsOpen(true);
  }

  async function saveStatus() {
    if (!selected) return;

    try {
      setUpdating(true);

      await fetch(
        `${backendBaseUrl}/api/admissions/${selected.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: updateStatus,
          }),
        }
      );

      await fetchAdmissions();

      setDetailsOpen(false);
    } catch (error) {
      setUpdateError(
        "Failed to update status"
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
  <div className="flex min-h-screen bg-slate-100">
    <Sidebar
      activeModule={activeModule}
      setActiveModule={setActiveModule}
    />

    <div className="flex-1 overflow-auto">
      <div className="p-4 lg:p-8">
        {/* Header */}
        <DashboardHeader />

        {/* KPI Cards */}

        <div className="mt-5">
          <KPICards
            admissions={admissions.length}
          />
        </div>

        {/* Status Cards */}

        <div className="mt-5">
          <StatusCards
            pending={pendingCount}
            approved={approvedTodayCount}
          />
        </div>

        {/* Service Management */}

        <div className="mt-5">
          <ServiceManagement />
        </div>

        {/* Admissions Table */}

        <div className="mt-5">
          <RecentApplicationsTable
            data={filtered}
            loading={loading}
            query={query}
            setQuery={setQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            openDetails={openDetails}
          />
        </div>

        {/* Error */}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>

    {/* Admission Details Modal */}

    <AdmissionDetailsModal
      selected={selected}
      open={detailsOpen}
      setOpen={setDetailsOpen}
      updateStatus={updateStatus}
      setUpdateStatus={setUpdateStatus}
      saveStatus={saveStatus}
      updating={updating}
      updateError={updateError}
    />
  </div>
);
}