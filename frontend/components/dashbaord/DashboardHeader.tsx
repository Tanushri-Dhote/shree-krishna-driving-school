export default function DashboardHeader() {
  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
      <div>
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-black text-slate-900">
          Welcome Back, Admin{" "}
          <span className="inline-block">👋</span>
        </h1>

        <p className="mt-2 text-slate-500 font-medium">
          {todayStr}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-sm font-bold text-white">
          VB
        </div>

        <div className="leading-tight">
          <h3 className="text-sm font-semibold text-slate-900">
            Vikas Bhoyar
          </h3>

          <p className="text-[11px] text-slate-500">
            Administrator
          </p>

          <div className="mt-1 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] font-medium text-green-600">
              Online
            </span>
          </div>
        </div>
      </div>
    </div>

  );
}