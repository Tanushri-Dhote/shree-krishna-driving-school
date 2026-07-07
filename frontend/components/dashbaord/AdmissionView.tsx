"use client";

import RecentApplicationsTable from "./RecentApplicationsTable";

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
  );
}

