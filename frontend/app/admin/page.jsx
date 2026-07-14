"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import Sidebar from "../../components/dashbaord/Sidebar";
import DashboardView from "../../components/dashbaord/DashboardView";
import AdmissionView from "../../components/dashbaord/AdmissionView";
import PucView from "../../components/dashbaord/PucView";
import LicenceView from "../../components/dashbaord/LicenceView";
import LicenceExcelView from "../../components/dashbaord/LicenceExcelView";
import InsuranceView from "../../components/dashbaord/InsuranceView";
import MaintenanceView from "../../components/dashbaord/MaintenanceView";
import AdmissionDetailsModal from "../../components/dashbaord/AdmissionDetailsModal";


import AdminOtpModal from "../../components/admin/AdminOtpModal";

export default function SuperAdminDashboardPage() {
  const backendBaseUrl = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:5000"
    );
  }, []);

  const [adminAuthed, setAdminAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeModule, setActiveModule] = useState("dashboard");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [admissions, setAdmissions] = useState([]);
  const [licences, setLicences] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [pucs, setPucs] = useState([]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [updateStatus, setUpdateStatus] = useState("pending");

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  async function fetchAllData() {
    try {
      setLoading(true);

      const [admRes, licRes, insRes, pucRes] = await Promise.all([
        fetch(`${backendBaseUrl}/api/admissions`).catch(() => null),
        fetch(`${backendBaseUrl}/api/licences`).catch(() => null),
        fetch(`${backendBaseUrl}/api/insurances`).catch(() => null),
        fetch(`${backendBaseUrl}/api/pucs`).catch(() => null),
      ]);

      const [admPayload, licPayload, insPayload, pucPayload] = await Promise.all([
        admRes?.json().catch(() => null),
        licRes?.json().catch(() => null),
        insRes?.json().catch(() => null),
        pucRes?.json().catch(() => null),
      ]);

      setAdmissions(admPayload?.data || []);
      setLicences(licPayload?.data || []);
      setInsurances(insPayload?.data || []);
      setPucs(pucPayload?.data || []);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("admin_auth_token");
    const expiresAtRaw = localStorage.getItem("admin_auth_expiresAt");

    const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : NaN;
    const tokenValid =
      Boolean(token) && !Number.isNaN(expiresAt) && Date.now() < expiresAt;

    setAdminAuthed(tokenValid);
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!adminAuthed) return;
    if (activeModule === "dashboard") {
      fetchAllData();
    }
  }, [adminAuthed, activeModule]);

  const filteredAdmissions = useMemo(() => {
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
          : item.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [admissions, query, statusFilter]);

  function openDetails(admission) {
    setSelected(admission);
    setUpdateStatus(admission.status);
    setDetailsOpen(true);
  }

  async function saveStatus() {
    if (!selected) return;

    try {
      setUpdating(true);

      const res = await fetch(`${backendBaseUrl}/api/admissions/${selected.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: updateStatus,
        }),
      });

      if (!res.ok) {
        const p = await res.json().catch(() => null);
        setUpdateError(p?.message || "Failed to update status");
        toast.error(p?.message || "Failed to update status");
        return;
      }

      toast.success("Status updated successfully.");
      await fetchAllData();
      setDetailsOpen(false);
    } catch (error) {
      setUpdateError("Failed to update status");
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  if (!authLoading && !adminAuthed) {
    return (
      <AdminOtpModal
        backendBaseUrl={backendBaseUrl}
        onVerified={() => {
          setAdminAuthed(true);
          window.location.pathname = "/admin";
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />

      <div className="flex-1 overflow-y-auto h-screen">
        <div className="p-4 lg:p-8">
          {activeModule === "dashboard" && (
            <DashboardView
              admissions={admissions}
              licences={licences}
              insurances={insurances}
              pucs={pucs}
              onNavigate={setActiveModule}
              onRefresh={fetchAllData}
            />
          )}

          {activeModule === "admission" && (
            <AdmissionView
              data={filteredAdmissions}
              loading={loading}
              query={query}
              setQuery={setQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              openDetails={openDetails}
            />
          )}

          {activeModule === "puc" && <PucView />}
          {activeModule === "licence" && <LicenceView />}
          {activeModule === "licence_excel" && <LicenceExcelView />}
          {activeModule === "insurance" && <InsuranceView />}
          {activeModule === "maintenance" && <MaintenanceView />}


          {loading && (
            <div className="flex justify-center mt-4">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

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

