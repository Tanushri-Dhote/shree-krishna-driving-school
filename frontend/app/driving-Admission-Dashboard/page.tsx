"use client";

import { useMemo, useState } from "react";

function StatusBadge({ status }: { status: string }) {
  const cfg = useMemo(() => {
    const s = String(status || "").toLowerCase();
    if (s === "approved") {
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        label: "Approved",
      };
    }
    if (s === "rejected") {
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        label: "Rejected",
      };
    }
    return {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
      label: "Pending",
    };
  }, [status]);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

export default function DrivingAdmissionDashboardPage() {
  const backendBaseUrl = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:3001";
  }, []);

  const [admissionNo, setAdmissionNo] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [admission, setAdmission] = useState<any>(null);

  // Ensure these values are used exactly as entered by the user.


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAdmission(null);

    if (!admissionNo.trim()) return setError("Admission No is required.");
    if (!emailId.trim()) return setError("Email ID is required.");

    setLoading(true);
    try {
      const url = new URL(`${backendBaseUrl}/api/admissions/lookup`);
      url.searchParams.set("admissionNo", admissionNo.trim());
      url.searchParams.set("email", emailId.trim());

      const res = await fetch(url.toString(), { method: "GET" });
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        return setError(payload?.message || "Admission not found.");
      }

      setAdmission(payload?.data ?? null);
     console.log(admission);
    } catch (err: any) {
      setError(err?.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }

  function renderImage(dataUrl: string | null | undefined) {
    if (!dataUrl) {
      return (
        <div className="flex h-20 w-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-500">
          No image
        </div>
      );
    }

    // Backend stores base64 data URL strings.
    return (
      <img
        src={dataUrl}
        alt="Uploaded"
        className="h-20 w-full rounded-xl border border-neutral-200 object-cover"
      />
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-2 py-4 sm:px-4 lg:px-2 bg-gray-50">
      <div className="text-center mb-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">Admission Dashboard</h2>
        <p className="text-neutral-600 mt-2">Check your admission status and details.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
        <div className="grid lg:grid-cols-12">
          {/* Left panel */}
          <div className="lg:col-span-5 bg-gradient-to-b from-orange-50 to-amber-50 p-6 sm:p-8 flex flex-col">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow-sm w-fit">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-neutral-700">RTO Approved</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight mt-4">
              Track Your <span className="text-[#f59e0b]">Application</span>
            </h3>

            <div className="mt-6 space-y-4 text-sm text-neutral-700">
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">🧾</div>
                <div>
                  <p className="font-semibold text-neutral-900">Admission No</p>
                  <p className="text-neutral-600">Use your unique reference</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">✉️</div>
                <div>
                  <p className="font-semibold text-neutral-900">Email ID</p>
                  <p className="text-neutral-600">For secure verification</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="rounded-2xl border border-neutral-100 bg-white/60 p-4">
                <p className="text-xs text-neutral-600">Tip</p>
                <p className="text-sm font-medium text-neutral-900 mt-1">
                  Enter the same email you used in the admission form.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 p-6 sm:p-10">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Admission No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    placeholder="e.g., SKDS-2026-0001"
                    className="w-full pl-4 pr-4 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500 text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="e.g., name@example.com"
                    className="w-full pl-4 pr-4 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500 text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-[#f59e0b] text-white py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.985] disabled:opacity-60"
              >
                {loading ? "Searching..." : "View My Admission"}
                <span className="text-2xl">→</span>
              </button>
            </form>

            {admission ? (
              <div className="mt-8">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900">Your Details</h3>
                  <StatusBadge status={admission.status} />
                </div>

                <div className="mt-5 grid md:grid-cols-12 gap-5">
                  <div className="md:col-span-5">
                    <div className="rounded-3xl border border-neutral-100 bg-gradient-to-b from-neutral-50 to-white p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center text-xl">👤</div>
                        <div>
                          <p className="text-sm text-neutral-600">Full Name</p>
                          <p className="font-semibold text-neutral-900">{admission.fullName}</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <div className="text-neutral-400">📱</div>
                          <div>
                            <p className="text-neutral-600">Mobile</p>
                            <p className="font-medium text-neutral-900">{admission.mobileNo}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="text-neutral-400">✉️</div>
                          <div>
                            <p className="text-neutral-600">Email</p>
                            <p className="font-medium text-neutral-900 break-all">{admission.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="text-neutral-400">🧾</div>
                          <div>
                            <p className="text-neutral-600">Admission No</p>
                            <p className="font-medium text-neutral-900">{admission.admissionNo}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 p-4 rounded-2xl border border-neutral-100 bg-white">
                        <p className="text-sm font-semibold text-neutral-900">Driving License</p>
                        <p className="text-sm text-neutral-600 mt-1">
                          {admission.hasDrivingLicence
                            ? `Yes • ${admission.drivingLicenceNo || ""}`
                            : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7">
                    <div className="rounded-3xl border border-neutral-100 bg-white p-5">
                      <h4 className="text-sm font-semibold text-neutral-900">Uploaded Documents</h4>

                      <div className="mt-4 grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-neutral-600 mb-2">Aadhaar Card</p>
                          {renderImage(admission.aadhaarPhoto)}
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 mb-2">Passport Photo</p>
                          {renderImage(admission.passportPhoto)}
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                          <p className="text-sm font-semibold text-amber-900">Next Steps</p>
                          <p className="text-sm text-amber-900/80 mt-1">
                            Our team will review your details. You will be updated once your status changes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-center gap-2 mt-8 text-xs text-neutral-500">
              <span>🔒</span>
              <span>Your information is 100% secure and will not be shared with anyone.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

