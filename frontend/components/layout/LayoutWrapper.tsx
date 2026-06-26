"use client";

import { usePathname } from "next/navigation";

import { DrivingNavbar } from "@/components/nav/driving-navbar";
import { DrivingFooter } from "@/components/footer/driving-footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  return (
    <>
      {!isAdminRoute && <DrivingNavbar />}

      {children}

      {!isAdminRoute && <DrivingFooter />}
    </>
  );
}