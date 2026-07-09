"use client";

import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function StatusBadge({ status }: { status: string }) {
  const s = String(status || "").toLowerCase();

  if (s === "approved") {
    return (
      <Badge className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700 hover:bg-green-50">
        Approved
      </Badge>
    );
  }

  if (s === "rejected") {
    return (
      <Badge className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold text-red-700 hover:bg-red-50">
        Rejected
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-50">
      Pending
    </Badge>
  );
}

function formatDate(input?: string) {
  if (!input) return "-";

  const d = new Date(input);

  if (Number.isNaN(d.getTime())) return input;

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface RecentApplicationsTableProps {
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
}
export default function RecentApplicationsTable({
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
}: RecentApplicationsTableProps) {
  return (
    <div className="w-full py-2">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

        {/* Header */}

        <div className="flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
              📝 Driving Admissions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track the admission applications.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search candidate..."
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* Status Filter */}
           <select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="h-11 w-full sm:w-44 rounded-xl border border-slate-300 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 cursor-pointer"
>
  <option value="all">All Status</option>
  <option value="pending">Pending</option>
  <option value="approved">Approved</option>
  <option value="rejected">Rejected</option>
</select>

            {/* Total Applications */}

            <div className="flex items-center rounded-xl bg-orange-50 px-3 py-2">

              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Total Applications
              </span>

              <span className="ml-2 rounded-lg bg-orange-500 px-2.5 py-1 text-sm font-bold text-white">
                {data.length}
              </span>

            </div>

          </div>

        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto lg:block">
          <Table>
            <TableHeader>

              <TableRow className="bg-slate-100 hover:bg-slate-100">

                <TableHead className="px-6 py-4 text-[13px] font-bold text-slate-700">
                  Admission No
                </TableHead>

                <TableHead className="px-6 py-4 text-[13px] font-bold text-slate-700">
                  Candidate
                </TableHead>

                <TableHead className="px-6 py-4 text-[13px] font-bold text-slate-700">
                  Mobile
                </TableHead>

                <TableHead className="px-6 py-4 text-[13px] font-bold text-slate-700">
                  Email
                </TableHead>

                <TableHead className="px-6 py-4 text-[13px] font-bold text-slate-700">
                  Status
                </TableHead>

                {/* <TableHead className="px-6 py-4 text-[13px] font-bold text-slate-700">
                  Amount / Paid
                </TableHead> */}

                <TableHead className="px-6 py-4 text-[13px] font-bold text-slate-700">
                  Date
                </TableHead>

                <TableHead className="px-6 py-4 text-right text-[13px] font-bold text-slate-700">
                  Action
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>

                      <p className="mt-4 text-sm font-medium text-slate-500">
                        Loading applications...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center">

                      <div className="mb-4 text-6xl">
                        📂
                      </div>

                      <h3 className="text-lg font-semibold text-slate-600">
                        No Applications Found
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        New applications will appear here.
                      </p>

                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow
                    key={item.id}
                    className="transition hover:bg-orange-50 text-[14px]"
                  >
                    <TableCell className="px-6 py-4 font-bold text-[11px] text-slate-800">
                      {item.admissionNo}
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <p className="font-semibold text-slate-800 text-[11px]">
                        {item.fullName}
                      </p>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-[11px] text-slate-700">
                      {item.mobileNo}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-[11px] text-slate-600">
                      {item.email}
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </TableCell>


                    <TableCell className="px-6 py-4 whitespace-nowrap text-[11px] text-slate-500">
                      {formatDate(item.createdAt)}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-right">
                    
                      <Eye
  size={22}
  onClick={() => openDetails(item)}
  className="cursor-pointer text-orange-500 hover:text-orange-600 hover:scale-110 transition-all duration-200"
/>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}

        <div className="space-y-4 p-4 lg:hidden">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-5xl">📂</div>

              <h3 className="mt-3 text-lg font-semibold text-slate-600">
                No Applications Found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                New applications will appear here.
              </p>
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {item.fullName}
                    </h3>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {item.admissionNo}
                    </p>
                  </div>

                  <StatusBadge status={item.status} />
                </div>

                <div className="mt-4 space-y-2 text-[13px]">
                  <p>
                    <span className="font-semibold">
                      Mobile :
                    </span>{" "}
                    {item.mobileNo}
                  </p>

                  <p className="break-all">
                    <span className="font-semibold">
                      Email :
                    </span>{" "}
                    {item.email}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Date :
                    </span>{" "}
                    {formatDate(item.createdAt)}
                  </p>
                </div>

                <Button
                  onClick={() => openDetails(item)}
                  className="mt-5 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                >
                  View Details
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}

        <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            Showing page{" "}
            <span className="font-semibold text-slate-900">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {totalPages}
            </span>{" "}
            • Total{" "}
            <span className="font-semibold text-orange-600">
              {totalRecords}
            </span>{" "}
            applications
          </p>

          <div className="flex items-center gap-2 text-[11px]">

            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-xl text-[11px]"
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(page - 3, 0),
                Math.min(page + 2, totalPages)
              )
              .map((p) => (
                <Button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={
                    page === p
                      ? "bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-10 w-10 p-0"
                      : "rounded-xl h-10 w-10 p-0 text-sm"
                  }
                  variant={page === p ? "default" : "outline"}
                >
                  {p}
                </Button>
              ))}

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="rounded-xl text-[11px]"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}