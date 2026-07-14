"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function UploadBox({
  title,
  subtitle,
  icon,
  inputId,
  valuePresent,
  onPick,
  loading,
}: {
  title: string;
  subtitle: string;
  icon: string;
  inputId: string;
  valuePresent: boolean;
  onPick: (file: File | null) => void;
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-sm">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-neutral-600">{title}</p>
          <p className="text-[11px] text-neutral-400">{subtitle}</p>
          {valuePresent ? (
            <p className="text-[11px] text-green-600 mt-1">Selected ✅</p>
          ) : null}
        </div>

        <input
          id={inputId}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          disabled={loading}
        />

        <button
          type="button"
          onClick={() => document.getElementById(inputId)?.click()}
          className="rounded-md border border-orange-500 px-3 py-1 text-xs font-medium text-orange-500 hover:bg-orange-50"
          disabled={loading}
        >
          Choose File
        </button>
      </div>
    </div>
  );
}

export default function DrivingInsurancePage() {
  const router = useRouter();

  const backendBaseUrl = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:5000";
  }, []);

  const [fullName, setFullName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");

  const [panPhoto, setPanPhoto] = useState<string>("");
  const [aadhaarPhoto, setAadhaarPhoto] = useState<string>("");
  const [rcFrontPhoto, setRcFrontPhoto] = useState<string>("");
  const [rcBackPhoto, setRcBackPhoto] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  async function onFilePicked(file: File | null, setter: (v: string) => void) {
    setError("");
    setSuccess("");
    if (!file) return;

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError("File too large. Please upload up to 5MB.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setter(dataUrl);
    } catch (e) {
      setError("Failed to read file.");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      const msg = "Name is required.";
      toast.error(msg);
      return setError(msg);
    }
    if (!emailId.trim()) {
      const msg = "Email ID is required.";
      toast.error(msg);
      return setError(msg);
    }
    if (!mobileNo.trim()) {
      const msg = "Mobile Number is required.";
      toast.error(msg);
      return setError(msg);
    }
    if (!vehicleNo.trim()) {
      const msg = "Vehicle Number is required.";
      toast.error(msg);
      return setError(msg);
    }

    if (!panPhoto) {
      const msg = "PAN card photo is required.";
      toast.error(msg);
      return setError(msg);
    }
    if (!aadhaarPhoto) {
      const msg = "Aadhaar card photo is required.";
      toast.error(msg);
      return setError(msg);
    }
    if (!rcFrontPhoto) {
      const msg = "RC Book Front photo is required.";
      toast.error(msg);
      return setError(msg);
    }
    if (!rcBackPhoto) {
      const msg = "RC Book Back photo is required.";
      toast.error(msg);
      return setError(msg);
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendBaseUrl}/api/insurances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: emailId.trim(),
          mobileNo: mobileNo.trim(),
          vehicleNo: vehicleNo.trim(),
          panPhoto,
          aadhaarPhoto,
          rcFrontPhoto,
          rcBackPhoto,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to submit insurance details.");
      }

      const msg = `✅ Insurance form submitted successfully! Insurance No: ${result.data?.insuranceNo || ""}`;
      toast.success(msg);
      setSuccess(msg);
      setFullName("");

      setEmailId("");
      setMobileNo("");
      setVehicleNo("");
      setPanPhoto("");
      setAadhaarPhoto("");
      setRcFrontPhoto("");
      setRcBackPhoto("");
    } catch (err: any) {
      const msg = err?.message || "Network error. Please try again.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-2 py-2 sm:px-2 lg:px-2 bg-gray-50">
      <div className="text-center mb-2">
        <h2 className="text-4xl font-bold text-neutral-900">Insurance Form</h2>
        <p className="text-neutral-600 mt-2">Enter your details to start your insurance request.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
        <div className="grid lg:grid-cols-12">
          {/* Left Sidebar */}
          <div className="lg:col-span-5 bg-gradient-to-b from-orange-50 to-amber-50 p-8 flex flex-col">
            <div className="mb-2">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-neutral-700">Trusted Process</span>
              </div>
            </div>

            <h3 className="text-4xl font-bold text-neutral-900 leading-tight">
              Fast & Secure <br />
              <span className="text-[#f97316]">Insurance</span>
              <br />
              Submission
            </h3>

            <div className="mt-8 space-y-5 text-sm">
              <div className="flex gap-4">
                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">
                  🛡️
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Verified Details</p>
                  <p className="text-neutral-600">We review your application</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">
                  📄
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Document Upload</p>
                  <p className="text-neutral-600">PAN, Aadhaar & RC (both sides) photos</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">
                  ✅
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Simple Form</p>
                  <p className="text-neutral-600">Responsive & user-friendly</p>
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
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xl">🛡️</div>
                <h3 className="text-2xl font-semibold text-neutral-900">Insurance Details</h3>
              </div>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                {success}
              </div>
            ) : null}

            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500 text-neutral-900 placeholder:text-neutral-400"
                    disabled={loading}
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
                    placeholder="Enter your email"
                    className="w-full px-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500 text-neutral-900 placeholder:text-neutral-400"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full px-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500 text-neutral-900 placeholder:text-neutral-400"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Vehicle Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="Enter vehicle number"
                    className="w-full px-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500 text-neutral-900 placeholder:text-neutral-400"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Upload sections */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700">
                    PAN Photo <span className="text-red-500">*</span>
                  </label>
                  <p className="mb-2 text-xs text-neutral-500">Upload PAN card photo</p>
                  <UploadBox
                    title="Upload PAN"
                    subtitle="JPG, PNG, PDF (Max 5MB)"
                    icon="🪪"
                    inputId="panFile"
                    valuePresent={!!panPhoto}
                    onPick={(file) => onFilePicked(file, setPanPhoto)}
                    loading={loading}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700">
                    Aadhaar Photo <span className="text-red-500">*</span>
                  </label>
                  <p className="mb-2 text-xs text-neutral-500">Upload Aadhaar card photo</p>
                  <UploadBox
                    title="Upload Aadhaar"
                    subtitle="JPG, PNG, PDF (Max 5MB)"
                    icon="🪪"
                    inputId="aadhaarFile"
                    valuePresent={!!aadhaarPhoto}
                    onPick={(file) => onFilePicked(file, setAadhaarPhoto)}
                    loading={loading}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700">
                    RC Front Photo <span className="text-red-500">*</span>
                  </label>
                  <p className="mb-2 text-xs text-neutral-500">Upload RC Book front photo</p>
                  <UploadBox
                    title="Upload RC Front"
                    subtitle="JPG, PNG, PDF (Max 5MB)"
                    icon="📄"
                    inputId="rcFrontFile"
                    valuePresent={!!rcFrontPhoto}
                    onPick={(file) => onFilePicked(file, setRcFrontPhoto)}
                    loading={loading}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700">
                    RC Back Photo <span className="text-red-500">*</span>
                  </label>
                  <p className="mb-2 text-xs text-neutral-500">Upload RC Book back photo</p>
                  <UploadBox
                    title="Upload RC Back"
                    subtitle="JPG, PNG, PDF (Max 5MB)"
                    icon="📄"
                    inputId="rcBackFile"
                    valuePresent={!!rcBackPhoto}
                    onPick={(file) => onFilePicked(file, setRcBackPhoto)}
                    loading={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-[#f97316] text-white py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.985] mt-4 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Insurance"}
                <span className="text-2xl">→</span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-neutral-500">
              <span>🔒</span>
              <span>Your information is 100% secure and will not be shared with anyone.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
