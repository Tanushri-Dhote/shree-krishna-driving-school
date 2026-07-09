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

  page,
  totalPages,
  totalRecords,
  onPageChange,
}: {
  data: any[];
  loading: boolean;
  query: string;
  setQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  openDetails: (row: any) => void;

  page: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
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
          page={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
        />
      </div>
    </DashboardShell>
  );
}