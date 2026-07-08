"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  IdCard,
  ShieldCheck,
  FileText,
  Wrench,
} from "lucide-react";
import { CgWebsite } from "react-icons/cg";

import Image from "next/image";

type Props = {
  activeModule: string;
  setActiveModule: (module: string) => void;
};

const menus = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "admission",
    title: "Driving Admissions",
    icon: Car,
  },
  {
    id: "licence",
    title: "Driving Licence",
    icon: IdCard,
  },
  {
    id: "insurance",
    title: "Insurance",
    icon: ShieldCheck,
  },
  {
    id: "puc",
    title: "PUC",
    icon: FileText,
  },
  {
    id: "maintenance",
    title: "Maintenance Excel",
    icon: Wrench,
  },
  {
    id: "website",
    title: "Back to Website",
    icon: CgWebsite,
  },
];

export default function Sidebar({
  activeModule,
  setActiveModule,
}: Props) {
  const router = useRouter();

  const handleMenuClick = (id: string) => {
    if (id === "website") {
      router.push("/"); // Redirect to website home page
      return;
    }

    setActiveModule(id);
  };

  return (
    <aside className="w-72 bg-slate-950 text-white min-h-screen hidden lg:flex flex-col">
      <div className="flex flex-col items-center justify-center p-6 border-b border-slate-800">
        <Image
          src="/new-logo.png"
          alt="Driving School Logo"
          width={140}
          height={140}
          className="h-24 w-auto"
        />

        <h2 className="mt-4 text-lg font-bold">
          Shree Krishna
        </h2>

        <p className="text-xs text-slate-400">
          Driving School
        </p>
      </div>

      <div className="p-4 space-y-2">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
                // activeModule === item.id
                //   ? "bg-[#f59e0b] text-white shadow-lg"
                //   : "hover:bg-slate-800 text-slate-300"
                activeModule === item.id
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon size={20} />
              {item.title}
            </button>
          );
        })}
      </div>
    </aside>
  );
}