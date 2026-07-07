"use client";

import Image from "next/image";
import { useMemo, useState } from "react";


function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DrivingPucPage() {
 

  const backendBaseUrl = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:3001";
  }, []);

  const [fullName, setFullName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");

  const [rcNumber, setRcNumber] = useState<string>("");
  // const [vehicleNo, setVehicleNo] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) return setError("Full Name is required.");
    if (!emailId.trim()) return setError("Email ID is required.");
    if (!mobileNo.trim()) return setError("Mobile Number is required.");
    if (!rcNumber.trim()) return setError("RC Number is required.");
    // if (!vehicleNo.trim()) return setError("Vehicle Number is required.");

    setLoading(true);
    try {
      const res = await fetch(`${backendBaseUrl}/api/pucs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: emailId.trim(),
          mobileNo: mobileNo.trim(),
          rcNumber: rcNumber.trim(),
     
        }),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        return setError(payload?.message || "Failed to submit PUC.");
      }

    const pucNo = payload?.data?.pucNo;

setSuccess(
  pucNo
    ? `✅ PUC submitted successfully. Your PUC Number: ${pucNo}`
    : "✅ PUC submitted successfully."
);

// Clear form
setFullName("");
setEmailId("");
setMobileNo("");
setRcNumber("");

// Scroll to the success message
window.scrollTo({
  top: 0,
  behavior: "smooth",
});
    } catch (err: any) {
      setError(err?.message || "Network error while submitting PUC.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-2 py-2 sm:px-2 lg:px-2 bg-gray-50">
      <div className="text-center mb-2">
        <h2 className="text-4xl font-bold text-neutral-900">PUC Form</h2>
        <p className="text-neutral-600 mt-2">Enter vehicle and owner details for Pollution Under Control.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
        <div className="grid lg:grid-cols-12">
          {/* Left Sidebar */}
          <div className="lg:col-span-5 bg-gradient-to-b from-orange-50 to-amber-50 p-8 flex flex-col relative">
            <div className="mb-2">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-neutral-700">Trusted Process</span>
              </div>
            </div>

            <h3 className="text-4xl font-bold text-neutral-900 leading-tight">
              Pollution <br />
              <span className="text-[#f59e0b]">Under Control</span>
            </h3>

            <div className="mt-8 space-y-5 text-sm">
              <div className="flex gap-4">
                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">🛡️</div>
                <div>
                  <p className="font-semibold text-neutral-900">Verified Details</p>
                  <p className="text-neutral-600">We review your application</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">✅</div>
                <div>
                  <p className="font-semibold text-neutral-900">Fast Status Updates</p>
                  <p className="text-neutral-600">Pending → Approved / Rejected</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-10">
              <div className="relative">
                <Image src="/car.webp" alt="Car" width={500} height={280} className="drop-shadow-2xl" />
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-7 p-8 lg:p-10">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xl">🚗</div>
                <h3 className="text-2xl font-semibold text-neutral-900">Owner & Vehicle Details</h3>
              </div>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
            ) : null}
            {success ? (
              <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                {success}
              </div>
            ) : null}

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Vehicle Owner Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500"
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
                  placeholder="Enter email"
                  className="w-full px-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500"
                />
              </div>

            

              <div className="grid md:grid-cols-2 gap-6">
                  <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Mobile No <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full px-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500"
                />
              </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Registation Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={rcNumber}
                    onChange={(e) => setRcNumber(e.target.value)}
                    placeholder="Enter RC number"
                    className="w-full px-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500"
                  />
                </div>

                
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-[#f59e0b] text-white py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.985] mt-4 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit PUC"}
                <span className="text-2xl">→</span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-neutral-500">
              <span>🔒</span>
              <span>Your information is secure and will be used for PUC processing.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

