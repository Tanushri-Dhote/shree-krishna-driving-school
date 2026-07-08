"use client";

import { useMemo, useState } from "react";

type Props = {
    backendBaseUrl: string;
    onVerified: () => void;
};

export default function AdminOtpModal({
    backendBaseUrl,
    onVerified,
}: Props) {
    const initialEmail = useMemo(() => "", []);

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState("");

    const [step, setStep] = useState<"email" | "otp">("email");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    async function requestOtp() {
        setError("");
        setLoading(true);

        try {
            const res = await fetch(
                `${backendBaseUrl}/api/admin/auth/request-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const payload = await res.json().catch(() => null);
            if (!res.ok) {
                setError(payload?.message || "Failed to send OTP");
                return;
            }

            setStep("otp");
            setOtp("");
        } catch (e: any) {
            setError(e?.message || "Network error while sending OTP");
        } finally {
            setLoading(false);
        }
    }

    async function verifyOtp() {
        setError("");
        setLoading(true);

        try {
            const res = await fetch(
                `${backendBaseUrl}/api/admin/auth/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, otp }),
                }
            );

            const payload = await res.json().catch(() => null);
            if (!res.ok) {
                setError(payload?.message || "Failed to verify OTP");
                return;
            }

            const token = payload?.data?.token;
            if (!token) {
                setError("Token missing from response");
                return;
            }

            const expiresAt = payload?.data?.expiresAt;
            localStorage.setItem(
                "admin_auth_token",
                String(token)
            );
            if (expiresAt) {
                localStorage.setItem(
                    "admin_auth_expiresAt",
                    String(expiresAt)
                );
            }

            onVerified();
        } catch (e: any) {
            setError(e?.message || "Network error while verifying OTP");
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDownEmail(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!email || !email.includes("@")) {
                setError("Enter a valid email");
                return;
            }
            void requestOtp();
        }
    }

    function handleKeyDownOtp(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (otp.length !== 6) {
                setError("OTP must be 6 digits");
                return;
            }
            void verifyOtp();
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Background */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black" /> */}

            {/* Blur Overlay */}
            {/* <div className="absolute inset-0 backdrop-blur-md bg-black/40" /> */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" />

            <div className="relative flex min-h-screen items-center justify-center p-6">
                <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-white/30 bg-white/90 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#f59e0b] to-[#e89100] px-4 py-4 text-center">

                        <div className="flex items-center justify-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                                <span className="text-3xl">🚗</span>
                            </div>

                            <h2 className="text-3xl font-bold text-white">
                                Hi.. Vikas Bhoyar
                            </h2>

                        </div>
                        <p className="mt-[-8px] text-orange-100">
                            Shri Krishna Driving School
                        </p>
                    </div>

                    <div className="p-4">

                        {/* Progress */}
                        <div className="mb-8 flex items-center justify-center gap-3">

                            <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${step === "email"
                                    ? "bg-[#f59e0b] text-white"
                                    : "bg-green-500 text-white"
                                    }`}
                            >
                                ✓
                            </div>

                            <div className="h-1 w-14 rounded bg-slate-200">
                                <div
                                    className={`h-full rounded bg-[#f59e0b] transition-all ${step === "otp" ? "w-full" : "w-0"
                                        }`}
                                />
                            </div>

                            <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${step === "otp"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-200 text-slate-500"
                                    }`}
                            >
                                2
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {step === "email" ? (
                            <>
                                <label className="mb-2 block font-medium text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKeyDownEmail}
                                    placeholder="admin@example.com"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />

                                <p className="mt-4 text-center text-sm text-slate-500">
                                    Press <span className="font-semibold">Enter</span> to receive
                                    your OTP.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mb-4 text-center">
                                    <h3 className="font-semibold text-slate-800">
                                        Enter Verification Code
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500">
                                        We've sent a 6-digit OTP to
                                    </p>

                                    <div className="mt-1 font-semibold text-blue-600">
                                        {email}
                                    </div>
                                </div>

                                <input
                                    value={otp}
                                    onChange={(e) => {
                                        const next = e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6);

                                        setOtp(next);

                                        if (next.length === 6 && !loading) {
                                            void verifyOtp();
                                        }
                                    }}
                                    onKeyDown={handleKeyDownOtp}
                                    inputMode="numeric"
                                    placeholder="------"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-4 text-center text-3xl tracking-[12px] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />

                                <p className="mt-4 text-center text-sm text-slate-500">
                                    OTP expires in 10 minutes.
                                </p>
                            </>
                        )}

                        {loading && (
                            <div className="mt-8 flex items-center justify-center gap-3 text-blue-600">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                <span>Please wait...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

