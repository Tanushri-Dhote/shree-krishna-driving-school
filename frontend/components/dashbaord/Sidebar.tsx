"use client";

import {
  LayoutDashboard,
  Car,
  IdCard,
  ShieldCheck,
  FileText,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <aside className="w-72 bg-slate-950 text-white min-h-screen hidden lg:flex flex-col">
      <div className="flex flex-col items-center justify-center p-6 border-b border-slate-800">
        <Image
          src="/logo-11.png"
          alt="Driving School Logo"
          width={140}
          height={140}
          priority
          className="h-24 w-auto object-contain"
        />

        <h2 className="mt-4 text-lg font-bold text-center">
          Shree Krishna
        </h2>

        <p className="text-xs text-slate-400 text-center">
          Driving School
        </p>
      </div>

      <div className="p-4 space-y-2">
        <button
          onClick={() => scrollToSection("dashboard")}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-slate-800"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button
          onClick={() => scrollToSection("driving-admissions")}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-[#f59e0b]"
        >
          <Car size={20} />
          Driving Admissions
        </button>

        <button
          disabled
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl opacity-50 cursor-not-allowed"
        >
          <IdCard size={20} />
          Driving Licence
        </button>

        <button
          disabled
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl opacity-50 cursor-not-allowed"
        >
          <ShieldCheck size={20} />
          Insurance
        </button>

        <button
          disabled
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl opacity-50 cursor-not-allowed"
        >
          <FileText size={20} />
          PUC
        </button>
      </div>
    </aside>
  );
}