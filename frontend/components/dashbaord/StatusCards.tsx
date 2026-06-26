export default function StatusCards({
  pending,
  approved,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white border rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-lg">
              ⏳
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Pending Review
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#f59e0b]">
            {pending}
          </h2>
        </div>
      </div>

      <div className="bg-white border rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-lg">
              ✓
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Approved Today
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-green-600">
            {approved}
          </h2>
        </div>
      </div>
    </div>
  );
}