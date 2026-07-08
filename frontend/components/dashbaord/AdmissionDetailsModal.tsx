"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Download,
  X,
} from "lucide-react";

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const s = String(status || "").toLowerCase();

  if (s === "approved") {
    return (
      <Badge className="border-green-200 bg-green-100 text-green-700">
        Approved
      </Badge>
    );
  }

  if (s === "rejected") {
    return (
      <Badge className="border-red-200 bg-red-100 text-red-700">
        Rejected
      </Badge>
    );
  }

  return (
    <Badge className="border-amber-200 bg-amber-100 text-amber-700">
      Pending
    </Badge>
  );
}

function formatDate(input?: string) {
  if (!input) return "-";

  const d = new Date(input);

  return Number.isNaN(d.getTime())
    ? input
    : d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
}

function RenderDocument({
  label,
  image,
}: {
  label: string;
  image?: string | null;
}) {
  const handleDownload = () => {
    if (!image) return;

    const link = document.createElement("a");

    link.href = image;

    link.download =
      label === "Aadhaar Card"
        ? "aadhaar-card.jpg"
        : "passport-photo.jpg";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-4">

        {image ? (
          <img
            src={image}
            alt={label}
            className="h-24 w-32 rounded-lg border object-cover"
          />
        ) : (
          <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed text-xs text-slate-400">
            No Image
          </div>
        )}

        <p className="text-[13px] font-medium text-slate-700">
          {label}
        </p>

      </div>

      {image && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          <Download
            size={14}
            className="mr-2"
          />
          Download
        </Button>
      )}

    </div>
  );
}

interface AdmissionDetailsModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;

  selected: any;

  updateStatus: string;
  setUpdateStatus: (value: string) => void;

  saveStatus: () => void;

  updating: boolean;
  updateError: string;
}

export default function AdmissionDetailsModal({
  open,
  setOpen,
  selected,
  updateStatus,
  setUpdateStatus,
  saveStatus,
  updating,
  updateError,
}: AdmissionDetailsModalProps) {

  if (!selected) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent
        className="
          !max-w-[1100px]
          w-[96vw]
          rounded-3xl
          overflow-hidden
          p-0
          max-h-[92vh]
          overflow-y-auto
        "
      >
        {/* Header */}

        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-800">
                📄 Admission Details
              </DialogTitle>
              <p className="mt-1 text-sm text-slate-500">
                Candidate Information & Uploaded Documents
              </p>
            </div>
          </div>
        </div>

        {/* Details Table */}

        <div className="p-2">
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
                    Admission Number
                  </th>
                  <td className="px-6 py-4 text-[13px] font-semibold text-slate-800">
                    {selected.admissionNo}
                  </td>
                </tr>
                <tr className="hover:bg-orange-50 transition">
                  <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Driving Licence
                  </th>
                  <td className="px-6 py-4 text-[13px] font-semibold text-slate-700">
                    {selected.hasDrivingLicence ? "Yes" : "No"}
                  </td>
                </tr>
                <tr className="hover:bg-orange-50 transition">
                  <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Licence Number
                  </th>
                  <td className="px-6 py-4 text-[13px] font-semibold text-slate-700">
                    {selected.drivingLicenceNo || "-"}
                  </td>
                </tr>
                <tr className="hover:bg-orange-50 transition">
                  <th className="bg-slate-50 px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Created Date
                  </th>
                  <td className="px-6 py-4 text-[13px] text-slate-700">
                    {formatDate(selected.createdAt)}
                  </td>
                </tr>
                {/* Aadhaar Card */}
                <tr className="transition hover:bg-orange-50">
                  <th className="bg-slate-50 px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600 align-top">
                    Aadhaar Card
                  </th>
                  <td className="px-6 py-5">
                    <RenderDocument
                      label="Aadhaar Card"
                      image={selected.aadhaarPhoto}
                    />
                  </td>
                </tr>

                {/* Passport Photo */}
                <tr className="transition hover:bg-orange-50">
                  <th className="bg-slate-50 px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600 align-top">
                    Passport Photo
                  </th>
                  <td className="px-6 py-5">
                    <RenderDocument
                      label="Passport Photo"
                      image={selected.passportPhoto}
                    />
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
                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={updateStatus}
                        onChange={(e) =>
                          setUpdateStatus(e.target.value)
                        }
                        className="
                          h-10
                          rounded-xl
                          border
                          border-slate-300
                          bg-white
                          px-4
                          text-[13px]
                          outline-none
                          focus:border-orange-500
                          focus:ring-2
                          focus:ring-orange-200
                        "
                      >
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
                      <Button
                        onClick={saveStatus}
                        disabled={updating}
                        className="
                          h-10
                          rounded-xl
                          bg-orange-500
                          px-6
                          text-[13px]
                          font-semibold
                          hover:bg-orange-600
                        "
                      >
                        {updating
                          ? "Saving..."
                          : "Save Changes"}
                      </Button>
                    </div>
                    {updateError && (
                      <p className="mt-3 text-xs text-red-500">
                        {updateError}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2">

          <p className="text-[11px] text-slate-500">Admission ID :
            <span className="ml-1 font-semibold text-slate-800 text-[11px]">
              {selected.admissionNo}
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}