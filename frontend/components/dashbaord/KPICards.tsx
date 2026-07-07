"use client";

import { Card } from "@/components/ui/card";

export default function KPICards({
  admissionsCount,
}: {
  admissionsCount: number;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Card className="rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-sm font-medium text-slate-500">
          Total Admissions
        </div>
        <div className="mt-2 text-3xl font-bold text-slate-900">
          {admissionsCount}
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Pending and approved admissions requests.
        </div>
      </Card>

      <Card className="rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-sm font-medium text-slate-500">
          Active Services
        </div>
        <div className="mt-2 text-3xl font-bold text-slate-900">
          4
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Driving Admissions, Licence, Insurance, and PUC.
        </div>
      </Card>
    </div>
  );
}
