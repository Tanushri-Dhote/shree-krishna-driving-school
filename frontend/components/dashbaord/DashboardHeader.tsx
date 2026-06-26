export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-black text-slate-900">
          Shree Krishna Driving School
        </h1>

        <p className="text-[#f59e0b] text-xl mt-1">
          Super Admin Dashboard
        </p>
      </div>

      <div className="text-right">
        <p>{new Date().toLocaleDateString()}</p>
        <p>{new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}