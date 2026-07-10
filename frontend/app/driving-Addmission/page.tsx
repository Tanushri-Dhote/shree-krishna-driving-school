"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";


function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function DrivingAdmissionPage() {
    const router = useRouter();

    const backendBaseUrl = useMemo(() => {
        const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : "http://localhost:3001";
    }, []);


    const [fullName, setFullName] = useState<string>("");
    const [emailId, setEmailId] = useState<string>("");
    const [mobileNo, setMobileNo] = useState<string>("");

    const [hasLicense, setHasLicense] = useState<string>(""); // "yes" | "no"
    const [drivingLicenceNo, setDrivingLicenceNo] = useState<string>("");

    const [aadhaarPhoto, setAadhaarPhoto] = useState<string>("");
    const [passportPhoto, setPassportPhoto] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const hasDrivingLicence = hasLicense === "yes";
    const [paymentProof, setPaymentProof] = useState<string>("");
    const ADMISSION_FEE = 5500;


    async function onFilePicked(file: File | null, setter: (v: string) => void) {
        setError("");
        setSuccess("");
        if (!file) return;

        // Basic size guard (backend schema expects strings; we store base64 data URL)
        const maxBytes = 5 * 1024 * 1024;
        if (file.size > maxBytes) {
            setError("File too large. Please upload up to 5MB.");
            return;
        }

        const dataUrl = await readFileAsDataUrl(file);
        setter(dataUrl);
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Minimal client-side validation (backend will also validate)
        if (!fullName.trim()) return setError("Full Name is required.");
        if (!emailId.trim()) return setError("Email ID is required.");
        if (!mobileNo.trim()) return setError("Mobile Number is required.");

        if (hasLicense !== "yes" && hasLicense !== "no") return setError("Please select driving license option.");
        if (hasDrivingLicence && !drivingLicenceNo.trim()) return setError("Driving License Number is required.");
        if (!aadhaarPhoto) return setError("Aadhaar Card Photo is required.");
        if (!passportPhoto) return setError("Passport Photo is required.");
        if (!paymentProof) { return setError("Please upload the payment screenshot."); }

        setLoading(true);
        try {
            const res = await fetch(`${backendBaseUrl}/api/admissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: fullName.trim(),
                    email: emailId.trim(),
                    mobileNo: mobileNo.trim(),

                    hasDrivingLicence: hasDrivingLicence,
                    drivingLicenceNo: hasDrivingLicence ? drivingLicenceNo.trim() : null,
                    aadhaarPhoto,
                    passportPhoto,
                    paymentAmountRs: ADMISSION_FEE,
                    paymentProof, // QR Screenshort

                }),
            });

            const payload = await res.json().catch(() => null);
            if (!res.ok) {
                const msg = payload?.message || "Failed to submit admission.";
                return setError(msg);
            }

            const admissionNo = payload?.data?.admissionNo;

            setSuccess(
                admissionNo
                    ? `Application submitted successfully. Your Admission No: ${admissionNo}`
                    : "Application submitted successfully."
            );

            // Clear the form
            setFullName("");
            setEmailId("");
            setMobileNo("");
            setHasLicense("");
            setDrivingLicenceNo("");
            setAadhaarPhoto("");
            setPassportPhoto("");
            setPaymentProof("");

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push("/");
            }, 2000);

        } catch (err: any) {
            setError(err?.message || "Network error while submitting admission.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-2 py-2 sm:px-2 lg:px-2 bg-gray-50 ">
            {/* Header Logo - Add your logo here if needed */}
            <div className="text-center mb-2">
                <h2 className="text-4xl font-bold text-neutral-900">Admission Form</h2>
                <p className="text-neutral-600 mt-2">Please fill in the details below to start your driving journey with us.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
                <div className="grid lg:grid-cols-12">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-orange-50 to-amber-50 p-8 flex flex-col relative">
                        <div className="mb-2">
                            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-neutral-700">RTO Approved</span>
                            </div>
                        </div>

                        <h3 className="text-4xl font-bold text-neutral-900 leading-tight">
                            Welcome to <br />
                            <span className="text-[#f97316]">Shree Krishna</span> <br />
                            Driving School
                        </h3>

                        <div className="mt-8 space-y-5 text-sm">
                            <div className="flex gap-4">
                                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">🛡️</div>
                                <div>
                                    <p className="font-semibold text-neutral-900">RTO Approved</p>
                                    <p className="text-neutral-600">Government approved driving school</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">👨‍🏫</div>
                                <div>
                                    <p className="font-semibold text-neutral-900">Expert Instructors</p>
                                    <p className="text-neutral-600">Learn from certified and experienced trainers</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">🛞</div>
                                <div>
                                    <p className="font-semibold text-neutral-900">Safe Driving</p>
                                    <p className="text-neutral-600">We prioritize your safety and confidence</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">🏆</div>
                                <div>
                                    <p className="font-semibold text-neutral-900">100% Support</p>
                                    <p className="text-neutral-600">Complete support in every step of your journey</p>
                                </div>
                            </div>
                        </div>

                        {/* Car Image */}
                        <div className="mt-auto pt-10">
                            <div className="relative">
                                <Image src="/car.webp" alt="White Car" width={500} height={280} className="drop-shadow-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Form Section - Tighter Spacing */}
                    <div className="lg:col-span-7 p-8 lg:p-10">
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xl">👤</div>
                                <h3 className="text-2xl font-semibold text-neutral-900">Personal Details</h3>
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
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">👤</div>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full pl-10 pr-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500 text-neutral-900 placeholder:text-neutral-400"
                                    />
                                </div>
                            </div>

                            {/* Email ID */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Email ID <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">✉️</div>
                                    <input
                                        type="email"
                                        value={emailId}
                                        onChange={(e) => setEmailId(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500 text-neutral-900 placeholder:text-neutral-400"
                                    />
                                </div>
                            </div>


                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Mobile Number */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">📱</div>
                                        <input
                                            type="tel"
                                            value={mobileNo}
                                            onChange={(e) => setMobileNo(e.target.value)}
                                            placeholder="Enter mobile number"
                                            className="w-full pl-10 pr-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500 text-neutral-900 placeholder:text-neutral-400"
                                        />
                                    </div>
                                </div>

                                {/* Have Driving License? */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Do you have Driving License? <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-6 pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="license"
                                                value="yes"
                                                checked={hasLicense === "yes"}
                                                onChange={(e) => setHasLicense(e.target.value)}
                                                className="w-5 h-5 accent-[#f97316]"
                                            />
                                            <span className="text-neutral-700">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="license"
                                                value="no"
                                                checked={hasLicense === "no"}
                                                onChange={(e) => setHasLicense(e.target.value)}
                                                className="w-5 h-5 accent-[#f97316]"
                                            />
                                            <span className="text-neutral-700">No</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Driving License Number */}
                            {hasDrivingLicence && (
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Driving License Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">🪪</div>
                                        <input
                                            type="text"
                                            value={drivingLicenceNo}
                                            onChange={(e) => setDrivingLicenceNo(e.target.value)}
                                            placeholder="Enter driving license number"
                                            className="w-full pl-10 pr-5 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:border-orange-500 text-neutral-900 placeholder:text-neutral-400"
                                        />
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1">Please enter your valid driving license number</p>
                                </div>
                            )}

                            {/* Aadhaar Upload */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-neutral-700">
                                    Aadhaar Card Photo <span className="text-red-500">*</span>
                                </label>

                                <p className="mb-2 text-xs text-neutral-500">Upload Aadhaar Card (Front Side)</p>

                                <div className="rounded-xl border border-dashed border-neutral-300 p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-sm">🪪</div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-neutral-600">Upload Aadhaar Card</p>
                                            <p className="text-[11px] text-neutral-400">JPG, PNG, PDF (Max 5MB)</p>
                                            {aadhaarPhoto ? (
                                                <p className="text-[11px] text-green-600 mt-1">Selected ✅</p>
                                            ) : null}
                                        </div>

                                        <input
                                            id="aadhaarFile"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            className="hidden"
                                            onChange={(e) => onFilePicked(e.target.files?.[0] ?? null, setAadhaarPhoto)}
                                            disabled={loading}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => document.getElementById("aadhaarFile")?.click()}
                                            className="rounded-md border border-orange-500 px-3 py-1 text-xs font-medium text-orange-500 hover:bg-orange-50"
                                            disabled={loading}
                                        >
                                            Choose File
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Passport Photo */}
                            <div className="border border-dashed border-neutral-300 rounded-xl p-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-100 text-sm">👤</div>

                                    <span className="text-sm text-neutral-600">Upload Photo</span>

                                    <input
                                        id="passportFile"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => onFilePicked(e.target.files?.[0] ?? null, setPassportPhoto)}
                                        disabled={loading}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => document.getElementById("passportFile")?.click()}
                                        className="ml-auto rounded-md border border-orange-500 px-3 py-1 text-xs font-medium text-orange-500"
                                        disabled={loading}
                                    >
                                        Choose File
                                    </button>
                                </div>
                                {passportPhoto ? <p className="text-[11px] text-green-600 mt-2 ml-11">Selected ✅</p> : null}
                            </div>

                            {/* QR Images */}
                            {/* Payment Section */}
                            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
                                <h3 className="text-xl font-semibold text-neutral-900">
                                    Admission Fee Payment
                                </h3>

                                <p className="mt-2 text-sm text-neutral-600">
                                    Scan the QR Code below and pay the admission fee before submitting the application.
                                </p>

                                <div className="flex justify-center mt-5">
                                    <Image
                                        src="/QR.jpeg"
                                        alt="Payment QR"
                                        width={220}
                                        height={220}
                                        className="rounded-lg border bg-white p-2"
                                    />
                                </div>



                                <div className="mt-5">
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Admission Fee
                                        </label>

                                        <div className="flex items-center justify-between rounded-2xl border border-orange-300 bg-white px-5 py-4">
                                            <span className="text-neutral-600">Amount to Pay</span>

                                            <span className="text-2xl font-bold text-orange-600">
                                                ₹5,500
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs text-neutral-500">
                                            Please pay exactly <strong>₹5,500</strong> using the QR code below.
                                        </p>
                                    </div>

                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Upload Payment Screenshot <span className="text-red-500">*</span>
                                    </label>


                                    <input
                                        id="paymentProof"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            onFilePicked(e.target.files?.[0] ?? null, setPaymentProof)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() => document.getElementById("paymentProof")?.click()}
                                        className="rounded-md border border-orange-500 px-4 py-2 text-sm font-medium text-orange-500 hover:bg-orange-100"
                                    >
                                        Upload Payment Screenshot
                                    </button>

                                    {paymentProof && (
                                        <p className="text-green-600 text-sm mt-2">
                                            Payment screenshot uploaded ✅
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-[#f97316] text-white py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.985] mt-4 disabled:opacity-60"
                            >
                                {loading ? "Submitting..." : "Submit Application"}
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

