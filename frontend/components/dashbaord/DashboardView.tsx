"use client";

import { useMemo } from "react";

/* ─── Types ─── */
type ServiceRow = {
  id: number;
  status: string;
  createdAt: string;
  fullName?: string;
  email?: string;
  admissionNo?: string;
  insuranceNo?: string;
  licenceNo?: string;
  pucNo?: string;
  vehicleNo?: string;
  mobileNo?: string;
};

type DashboardProps = {
  admissions: ServiceRow[];
  licences: ServiceRow[];
  insurances: ServiceRow[];
  pucs: ServiceRow[];
  onNavigate: (module: string) => void;
  onRefresh: () => void;
};

/* ─── Helpers ─── */
function formatDate(input?: string) {
  if (!input) return "-";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(input?: string) {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function statusColor(s: string) {
  const st = s?.toLowerCase();
  if (st === "approved") return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", label: "Approved" };
  if (st === "rejected") return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "Rejected" };
  return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", label: "Pending" };
}

/* ─── Donut Chart ─── */
function DonutChart({ segments, size = 160 }: { segments: { value: number; color: string; label: string }[]; size?: number }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) {
    return (
      <div style={{ width: size, height: size }} className="flex items-center justify-center">
        <svg viewBox="0 0 36 36" width={size} height={size}>
          <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="5" />
        </svg>
      </div>
    );
  }
  let cumulativePercent = 0;
  const radius = 14;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 36 36" width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      {segments.map((seg, i) => {
        const percent = seg.value / total;
        const offset = cumulativePercent * circumference;
        const dash = percent * circumference;
        cumulativePercent += percent;
        return (
          <circle
            key={i}
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="5"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/* ─── Mini Bar Chart ─── */
function BarChart({ data, maxHeight = 100 }: { data: { label: string; value: number }[]; maxHeight?: number }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-full">
      {data.map((d, i) => {
        const h = Math.max((d.value / maxVal) * maxHeight, 4);
        return (
          <div key={i} className="flex flex-col items-center flex-1 min-w-0">
            <div className="text-[10px] text-slate-500 mb-1 font-medium">{d.value || ""}</div>
            <div
              className="w-full max-w-[32px] rounded-t-md transition-all"
              style={{
                height: h,
                background: i % 2 === 0
                  ? "linear-gradient(180deg, #f59e0b, #fbbf24)"
                  : "linear-gradient(180deg, #8b5cf6, #a78bfa)",
              }}
            />
            <div className="text-[10px] text-slate-400 mt-1 truncate w-full text-center">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Component ─── */
export default function DashboardView({
  admissions,
  licences,
  insurances,
  pucs,
  onNavigate,
  onRefresh,
}: DashboardProps) {
  /* ── KPI Stats ── */
  const totalAdmissions = admissions.length;
  const totalLicences = licences.length;
  const totalInsurances = insurances.length;
  const totalPucs = pucs.length;

  /* ── Admission Status Breakdown ── */
  const pendingAdm = admissions.filter((a) => a.status?.toLowerCase() === "pending").length;
  const approvedAdm = admissions.filter((a) => a.status?.toLowerCase() === "approved").length;
  const rejectedAdm = admissions.filter((a) => a.status?.toLowerCase() === "rejected").length;

  /* ── Monthly Applications (last 12 months) ── */
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const counts: Record<string, number> = {};
    months.forEach((m) => (counts[m] = 0));
    const all = [...admissions, ...licences, ...insurances, ...pucs];
    all.forEach((item) => {
      const d = new Date(item.createdAt);
      if (d.getFullYear() === now.getFullYear()) {
        counts[months[d.getMonth()]] = (counts[months[d.getMonth()]] || 0) + 1;
      }
    });
    return months.map((m) => ({ label: m, value: counts[m] || 0 }));
  }, [admissions, licences, insurances, pucs]);

  /* ── Service Distribution ── */
  const totalAll = totalAdmissions + totalLicences + totalInsurances + totalPucs;
  const pctAdm = totalAll ? Math.round((totalAdmissions / totalAll) * 100) : 0;
  const pctLic = totalAll ? Math.round((totalLicences / totalAll) * 100) : 0;
  const pctIns = totalAll ? Math.round((totalInsurances / totalAll) * 100) : 0;
  const pctPuc = totalAll ? Math.round((totalPucs / totalAll) * 100) : 0;

  /* ── Recent Activity Feed ── */
  const recentActivity = useMemo(() => {
    const all = [
      ...admissions.map((a) => ({ ...a, service: "Admission", refNo: a.admissionNo })),
      ...licences.map((a) => ({ ...a, service: "Driving Licence", refNo: a.licenceNo })),
      ...insurances.map((a) => ({ ...a, service: "Insurance", refNo: a.insuranceNo || a.vehicleNo })),
      ...pucs.map((a) => ({ ...a, service: "PUC", refNo: a.pucNo })),
    ];
    return all
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [admissions, licences, insurances, pucs]);

  /* ── Recent Applications Table ── */
  const recentApps = useMemo(() => {
    const all = [
      ...admissions.map((a) => ({ ...a, service: "Driving Admission", refNo: a.admissionNo })),
      ...licences.map((a) => ({ ...a, service: "Driving Licence", refNo: a.licenceNo })),
      ...insurances.map((a) => ({ ...a, service: "Insurance", refNo: a.insuranceNo })),
      ...pucs.map((a) => ({ ...a, service: "PUC", refNo: a.pucNo })),
    ];
    return all
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [admissions, licences, insurances, pucs]);

  /* ── Service Trend (last 30 days stacked) ── */
  const last30Data = useMemo(() => {
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const inRange = (d: string) => (now - new Date(d).getTime()) <= thirtyDaysMs;
    return {
      admissions: admissions.filter((a) => inRange(a.createdAt)).length,
      licences: licences.filter((a) => inRange(a.createdAt)).length,
      insurances: insurances.filter((a) => inRange(a.createdAt)).length,
      pucs: pucs.filter((a) => inRange(a.createdAt)).length,
    };
  }, [admissions, licences, insurances, pucs]);

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const serviceIconColors = [
    { icon: "🚗", bg: "bg-orange-50", border: "border-orange-200", accent: "text-orange-600" },
    { icon: "🪪", bg: "bg-violet-50", border: "border-violet-200", accent: "text-violet-600" },
    { icon: "🛡️", bg: "bg-emerald-50", border: "border-emerald-200", accent: "text-emerald-600" },
    { icon: "📄", bg: "bg-blue-50", border: "border-blue-200", accent: "text-blue-600" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-2">
            Welcome Back, Admin! <span className="text-3xl">👋</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">{todayStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">VB</div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">Vikas Bhoyar</p>
              <p className="text-[11px] text-slate-500 font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KPI Stat Cards Row ─── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        {[
          {
            title: "Total Admissions",
            value: totalAdmissions,
            icon: "👥",
            color: {
              bg: "bg-orange-500",
              light: "bg-orange-50",
              text: "text-orange-500",
              chart: "text-orange-400",
            },
          },
          {
            title: "Driving Licence",
            value: totalLicences,
            icon: "🪪",
            color: {
              bg: "bg-blue-500",
              light: "bg-blue-50",
              text: "text-blue-500",
              chart: "text-blue-400",
            },
          },
          {
            title: "Insurance",
            value: totalInsurances,
            icon: "🛡️",
            color: {
              bg: "bg-emerald-500",
              light: "bg-emerald-50",
              text: "text-white-500",
              chart: "text-emerald-400",
            },
          },
          {
            title: "PUC Requests",
            value: totalPucs,
            icon: "📄",
            color: {
              bg: "bg-violet-500",
              light: "bg-violet-50",
              text: "text-violet-500",
              chart: "text-violet-400",
            },
          }
        ].map((card, index) => (
          <div
            key={index}
            onClick={() =>
              onNavigate(
                ["admission", "licence", "insurance", "puc"][index]
              )
            }
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              {/* Left */}

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${card.color.bg} text-2xl text-white shadow-lg`}
                >
                  {card.icon}
                </div>

                <div>

                  <p className="text-xs font-semibold text-slate-500">
                    {card.title}
                  </p>

                  <h3 className="mt-1 text-3xl font-bold text-slate-900">
                    {card.value}
                  </h3>

                </div>

              </div>

              {/* Mini Chart */}

              <svg
                width="55"
                height="35"
                viewBox="0 0 55 35"
                className={`${card.color.chart}`}
              >
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  points="2,30 12,22 22,25 32,10 42,16 53,4"
                />
              </svg>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <div className="flex items-center gap-1">

                <span className={`text-sm font-bold ${card.color.text}`}>
                  ↑ 12.5%
                </span>

                <span className="text-xs text-slate-400">
                  vs last month
                </span>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* ─── Row 2: Admission Status Donut + Monthly Applications Bar ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">

        {/* Admission Status */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

          <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Admission Status
                </h3>

                <p className="text-xs text-slate-500">
                  Current overview
                </p>
              </div>

            </div>

            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
              Live
            </span>

          </div>

          <div className="p-6">

            <div className="flex items-center justify-center gap-8">

              <div className="relative">

                <DonutChart
                  size={150}
                  segments={[
                    { value: pendingAdm, color: "#F59E0B", label: "Pending" },
                    { value: approvedAdm, color: "#10B981", label: "Approved" },
                    { value: rejectedAdm, color: "#EF4444", label: "Rejected" },
                  ]}
                />

                <div className="absolute inset-0 flex items-center justify-center">

                  <div className="text-center">

                    <h2 className="text-3xl font-bold text-slate-800">
                      {totalAdmissions}
                    </h2>

                    <p className="text-xs text-slate-500">
                      Applications
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="mt-8 space-y-4">

              <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">

                <div className="flex items-center gap-3">

                  <div className="h-3 w-3 rounded-full bg-amber-500" />

                  <span className="font-medium text-slate-700">
                    Pending
                  </span>

                </div>

                <span className="font-bold text-amber-600">
                  {pendingAdm}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-4 py-3">

                <div className="flex items-center gap-3">

                  <div className="h-3 w-3 rounded-full bg-green-500" />

                  <span className="font-medium text-slate-700">
                    Approved
                  </span>

                </div>

                <span className="font-bold text-green-600">
                  {approvedAdm}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3">

                <div className="flex items-center gap-3">

                  <div className="h-3 w-3 rounded-full bg-red-500" />

                  <span className="font-medium text-slate-700">
                    Rejected
                  </span>

                </div>

                <span className="font-bold text-red-600">
                  {rejectedAdm}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Monthly Applications */}

        <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

          <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Monthly Applications
                </h3>

                <p className="text-xs text-slate-500">
                  January - December
                </p>

              </div>

            </div>

            <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
              2026
            </span>

          </div>

          <div className="p-6">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Applications
                </p>

                <h2 className="text-3xl font-bold text-slate-800">
                  {totalAdmissions}
                </h2>

              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-3">

                <p className="text-xs text-slate-500">
                  Growth
                </p>

                <p className="font-bold text-green-600">
                  +12.4%
                </p>

              </div>

            </div>

            <div className="rounded-2xl bg-slate-50 p-4">

              <div className="h-[180px]">

                <BarChart
                  data={monthlyData}
                  maxHeight={150}
                />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ─── Row 3: Service Requests + Distribution Donut + Recent Activity ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full py-2">
        {/* Service Requests (Last 30 Days) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-3xl p-7 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>📋</span> Service Requests
            </h3>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Last 30D</span>
          </div>
          <div className="space-y-4">
            {[
              { label: "Admissions", count: last30Data.admissions, color: "bg-gradient-to-r from-orange-400 to-orange-500" },
              { label: "PUC", count: last30Data.pucs, color: "bg-gradient-to-r from-blue-400 to-blue-500" },
              { label: "Insurance", count: last30Data.insurances, color: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
              { label: "Licence", count: last30Data.licences, color: "bg-gradient-to-r from-violet-400 to-violet-500" },
            ].map((s, i) => {
              const totalLast30 = last30Data.admissions + last30Data.pucs + last30Data.insurances + last30Data.licences;
              const pct = totalLast30 ? Math.round((s.count / totalLast30) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-700 font-semibold">{s.label}</span>
                    <span className="text-slate-600 font-bold">{s.count}</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full ${s.color} transition-all duration-500 shadow-md`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Distribution Donut */}
        <div className="lg:col-span-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-3xl p-7 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>🎯</span> Services Distribution
          </h3>
          <div className="flex items-center gap-8">
            <div className="relative flex-shrink-0">
              <DonutChart
                size={120}
                segments={[
                  { value: totalAdmissions, color: "#f59e0b", label: "Admissions" },
                  { value: totalPucs, color: "#3b82f6", label: "PUC" },
                  { value: totalInsurances, color: "#22c55e", label: "Insurance" },
                  { value: totalLicences, color: "#8b5cf6", label: "Licence" },
                ]}
              />
            </div>
            <div className="space-y-2.5 text-xs flex-1">
              {[
                { label: "Driving Admissions", pct: pctAdm, color: "bg-amber-400", icon: "🚗" },
                { label: "PUC", pct: pctPuc, color: "bg-blue-400", icon: "📄" },
                { label: "Insurance", pct: pctIns, color: "bg-emerald-400", icon: "🛡️" },
                { label: "Driving Licence", pct: pctLic, color: "bg-violet-400", icon: "🪪" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color} shadow-sm`} />
                  <span className="text-slate-600 flex-1">{s.label}</span>
                  <span className="font-bold text-slate-900">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-3xl p-7 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>⚡</span> Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6 font-medium">No recent activity</p>
            ) : (
              recentActivity.map((item, i) => {
                const sc = statusColor(item.status);
                const icons: Record<string, string> = {
                  Admission: "✅",
                  "Driving Licence": "🪪",
                  Insurance: "🛡️",
                  PUC: "📄",
                };
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className={`w-9 h-9 rounded-full ${sc.bg} flex items-center justify-center text-sm flex-shrink-0 border ${sc.border}`}>
                      {icons[item.service] || "📋"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {item.service} <span className={`${sc.text} font-bold`}>{sc.label}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 truncate font-medium">{item.fullName} — {item.refNo}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap font-semibold">
                      {formatTime(item.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ─── Row 4: Recent Applications Table + Quick Actions ─── */}
      <div className="w-full py-2">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden">

          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                📝 Recent Applications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage and track the latest candidate applications.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search candidate..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 pl-10 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />

                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div className="flex items-center rounded-xl bg-orange-50 px-2 py-2">
                <span className="text-sm font-semibold uppercase text-slate-500">
                  Total Applications
                </span>

                <span className="ml-2 rounded-lg bg-orange-500 px-2.5 py-1 text-sm font-bold text-white">
                  {recentApps.length}
                </span>
              </div>
            </div>

          </div>

          {/* Table */}

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead>

                <tr className="bg-slate-100">

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Ref No
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Candidate
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Mobile
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Service
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {recentApps.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="py-16 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center">

                        <div className="mb-4 text-6xl">
                          📂
                        </div>

                        <h3 className="text-lg font-semibold text-slate-600">
                          No Applications Found
                        </h3>

                        <p className="mt-2 text-sm">
                          New applications will appear here.
                        </p>

                      </div>
                    </td>

                  </tr>

                ) : (

                  recentApps.map((item, index) => {

                    const sc = statusColor(item.status);

                    return (

                      <tr
                        key={index}
                        className="transition hover:bg-orange-50 text-[14px]"
                      >

                        <td className="px-6 py-4 font-bold text-black-200 text-[11px]">
                          {item.refNo}
                        </td>

                        <td className="px-6 py-4">

                          <div>

                            <p className="font-semibold text-slate-800 text-[11px]">
                              {item.fullName}
                            </p>

                          </div>

                        </td>

                        <td className="px-6 py-4 text-slate-700 text-[11px]">
                          {item.mobileNo}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600 text-[11px]">
                          {item.email}
                        </td>

                        <td className="px-6 py-4 text-[11px]">

                          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                            {item.service}
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-bold ${sc.bg} ${sc.border} ${sc.text}`}
                          >
                            {sc.label}
                          </span>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-[11px] text-slate-500">
                          {formatDate(item.createdAt)}
                        </td>

                      </tr>

                    );

                  })

                )}

              </tbody>

            </table>

          </div>

          {/* Footer */}

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

            <p className="text-sm text-slate-500">
              Showing latest{" "}
              <span className="font-semibold">
                {recentApps.length}
              </span>{" "}
              applications
            </p>

            <button className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
              View All
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
