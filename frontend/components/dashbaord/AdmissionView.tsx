"use client";

import RecentApplicationsTable from "./RecentApplicationsTable";
import DashboardShell from "./DashboardShell";

export default function AdmissionView({
  data,
  loading,
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  openDetails,
}: {
  data: any[];
  loading: boolean;
  query: string;
  setQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  openDetails: (row: any) => void;
}) {
  return (
    <DashboardShell>
      <div className="mt-5">
        <RecentApplicationsTable
          data={data}
          loading={loading}
          query={query}
          setQuery={setQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          openDetails={openDetails}
        />
      </div>
    </DashboardShell>
  );
}

