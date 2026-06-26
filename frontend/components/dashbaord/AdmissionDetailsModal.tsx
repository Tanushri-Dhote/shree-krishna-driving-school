"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, X } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const s = String(status || "").toLowerCase();
  if (s === "approved") return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
  if (s === "rejected") return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
  return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>;
}

function formatDate(input?: string) {
  if (!input) return "-";
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? input : d.toLocaleString();
}

function RenderDocument({ label, image }: { label: string; image?: string | null }) {
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = label.toLowerCase().includes("aadhaar") ? "aadhaar-image.jpg" : "passport-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

return (
  <div className="rounded-xl border bg-white p-3">
    <div className="mb-2 flex items-center justify-between">
      <p className="text-sm font-medium text-slate-700">
        {label}
      </p>

      {image && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 text-xs font-medium text-orange-600"
        >
          <Download size={14} />
          Download
        </button>
      )}
    </div>

    {image ? (
      <img
        src={image}
        alt={label}
        className="mx-auto h-28 w-auto rounded-lg object-contain"
      />
    ) : (
      <div className="flex h-28 items-center justify-center rounded-lg border border-dashed text-sm text-slate-500">
        No Image
      </div>
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
    !max-w-[1200px]
    w-[95vw]
    max-h-[90vh]
    overflow-y-auto
    rounded-3xl
    p-0
  "
      >

        {/* Header */}

        <div className="px-2 py-2 border-b flex justify-between items-start">
          <div>
            <DialogTitle className="text-3xl font-bold text-slate-900">
              {selected.fullName}
            </DialogTitle>

            <p className="text-slate-500 mt-2">
              Admission No :
              <span className="font-semibold text-slate-900 ml-2">
                {selected.admissionNo}
              </span>
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={24} />
          </button>

        </div>

        {/* Status */}
        <div className="px-4 py-2 border-b bg-gray-50 flex items-center gap-6">
          <StatusBadge status={selected.status} />
          <p className="text-gray-600">
            Created Date :
            <span className="font-medium text-slate-900 ml-2">
              {formatDate(selected.createdAt)}
            </span>
          </p>

        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_420px]">
          {/* Left */}
          <div className="border-r p-8">
            <h2 className="mb-6 text-2xl font-semibold">
              Candidate Information
            </h2>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="w-48 bg-slate-50 px-5 py-4 font-medium text-slate-600">
                      Full Name
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {selected.fullName}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-slate-50 px-5 py-4 font-medium text-slate-600">
                      Mobile Number
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {selected.mobileNo}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-slate-50 px-5 py-4 font-medium text-slate-600">
                      Email Address
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 break-all">
                      {selected.email}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-slate-50 px-5 py-4 font-medium text-slate-600">
                      Driving Licence
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {selected.hasDrivingLicence ? "Yes" : "No"}
                    </td>
                  </tr>

                  {selected.drivingLicenceNo && (
                    <tr className="border-b">
                      <td className="bg-slate-50 px-5 py-4 font-medium text-slate-600">
                        Licence Number
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {selected.drivingLicenceNo}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td className="bg-slate-50 px-5 py-4 font-medium text-slate-600">
                      Admission No
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {selected.admissionNo}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right */}

         <div className="p-6">
  <h2 className="text-xl font-semibold mb-4">
    Uploaded Documents
  </h2>

  <div className="grid grid-cols-2 gap-4">
    <RenderDocument
      label="Aadhaar Card"
      image={selected.aadhaarPhoto}
    />

    <RenderDocument
      label="Passport Photo"
      image={selected.passportPhoto}
    />
  </div>
</div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-8 py-6">

          <h2 className="text-xl font-semibold mb-4">
            Status Update
          </h2>

          <div className="flex items-center gap-4">

            <select
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              className="h-12 flex-1 rounded-xl border px-4 outline-none focus:border-orange-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <Button
              onClick={saveStatus}
              disabled={updating}
              className="h-12 px-8 rounded-xl bg-orange-500 hover:bg-orange-600"
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>

          </div>

          {updateError && (
            <p className="mt-3 text-red-500">
              {updateError}
            </p>
          )}

        </div>

      </DialogContent>
    </Dialog>
  );
}