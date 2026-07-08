"use client";

import type { ReactNode } from "react";
import DashboardHeader from "./DashboardHeader";

export default function DashboardShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <DashboardHeader />
      {title ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
      ) : null}
      {children}
    </div>
  );
}

