"use client";

export function ComingSoonView({
  title,
}: {
  title: string;
}) {
  return (
    <div className="mt-5">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 mt-2">
          Coming soon.
        </p>
      </div>
    </div>
  );
}

