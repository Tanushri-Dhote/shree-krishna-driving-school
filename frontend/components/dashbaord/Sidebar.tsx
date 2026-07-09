"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  IdCard,
  ShieldCheck,
  FileText,
  Wrench,
 LogOut
} from "lucide-react";
import { CgWebsite } from "react-icons/cg";
import { RiFileExcel2Line } from "react-icons/ri";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";



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
    id: "licence_excel",
    title: "Driving Licence Excel",
    icon: RiFileExcel2Line,
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
    title: "Insurance Excel",
    icon: PiMicrosoftExcelLogoFill ,
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
    <aside className="w-72 bg-slate-950 text-white lg:flex flex-col">
      <div className="flex flex-col items-center justify-center p-4 border-b border-slate-800">
        <Image
          src="/new-logo.png"
          alt="Driving School Logo"
          width={140}
          height={140}
          className="h-24 w-auto"
        />

      </div>

      <div className="flex-1 p-2 space-y-2">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all ${
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

        <div className="p-4 border-t border-slate-800">
  <button
    onClick={() => {
      // Clear auth data if needed
      localStorage.removeItem("token");
      sessionStorage.clear();

      router.push("/admin");
    }}
    className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
  >
    <LogOut size={20} />
    Logout
  </button>
</div>
      </div>
    </aside>
  );
}