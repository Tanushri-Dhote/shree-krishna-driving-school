"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200"
      >
        Approved
      </Badge>
    );
  }

  if (s === "rejected") {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200"
      >
        Rejected
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-amber-50 text-amber-700 border-amber-200"
    >
      Pending
    </Badge>
  );
}

function formatDate(input?: string) {
  if (!input) return "-";

  const d = new Date(input);

  if (Number.isNaN(d.getTime())) {
    return input;
  }

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
}

export default function RecentApplicationsTable({
  data,
  loading,
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  openDetails,
}: RecentApplicationsTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}

      <div className="border-b border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Recent Applications
            </h2>

            <p className="text-slate-500 mt-1">
              Manage driving admission requests.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search admission..."
              className="
                h-11
                w-full
                sm:w-64
                rounded-xl
                border
                border-slate-300
                px-4
                outline-none
                focus:border-[#f59e0b]
              "
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
                outline-none
                focus:border-[#f59e0b]
              "
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}

      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Admission No
              </TableHead>

              <TableHead>
                Candidate
              </TableHead>

              <TableHead>
                Mobile
              </TableHead>

              <TableHead>
                Email
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Date
              </TableHead>

              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12"
                >
                  No admissions found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold">
                    {item.admissionNo}
                  </TableCell>

                  <TableCell>
                    {item.fullName}
                  </TableCell>

                  <TableCell>
                    {item.mobileNo}
                  </TableCell>

                  <TableCell>
                    {item.email}
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={item.status}
                    />
                  </TableCell>

                  <TableCell>
                    {formatDate(item.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      onClick={() =>
                        openDetails(item)
                      }
                      className="
                        bg-[#f59e0b]
                        hover:bg-[#d97706]
                        text-white
                      "
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}

      <div className="lg:hidden p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8">
            No admissions found
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="
                border
                border-slate-200
                rounded-2xl
                p-4
              "
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">
                    {item.fullName}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.admissionNo}
                  </p>
                </div>

                <StatusBadge
                  status={item.status}
                />
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-medium">
                    Mobile:
                  </span>{" "}
                  {item.mobileNo}
                </p>

                <p className="break-all">
                  <span className="font-medium">
                    Email:
                  </span>{" "}
                  {item.email}
                </p>

                <p>
                  <span className="font-medium">
                    Date:
                  </span>{" "}
                  {formatDate(item.createdAt)}
                </p>
              </div>

              <Button
                onClick={() =>
                  openDetails(item)
                }
                className="
                  mt-4
                  w-full
                  bg-[#f59e0b]
                  hover:bg-[#d97706]
                "
              >
                View Details
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}