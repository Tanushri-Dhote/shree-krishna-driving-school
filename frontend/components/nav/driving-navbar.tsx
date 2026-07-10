"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Clock3,
  Menu,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { X } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";


import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about" },
  { label: "SERVICES", href: "/#services" },
  { label: "WHY US", href: "/#why" },
  { label: "CONTACT US", href: "/contact" },
] as const;

export function DrivingNavbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="hidden bg-[#111111] text-white lg:block">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4 text-[#f97316]" />
              <span>Saoner, Nagpur, Maharashtra, India</span>
            </div>

            <div className="flex items-center gap-2 text-white/90">
              <Clock3 className="h-4 w-4 text-[#f97316]" />
              <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-white/80 transition hover:text-[#f97316]"
            >
              <FaFacebookF className="h-4 w-4" />
            </Link>

            <Link
              href="#"
              className="text-white/80 transition hover:text-[#f97316]"
            >
              <FaInstagram className="h-4 w-4" />
            </Link>

            <Link
              href="#"
              className="text-white/80 transition hover:text-[#f97316]"
            >
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>


      {/* Main Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/40 rounded-b-xl transition-all duration-300">
        <div className="relative mx-auto flex h-16 lg:h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Desktop Floating Logo */}
          <Link
            href="/"
            className="absolute left-6 -bottom-5 z-30 hidden xl:block"
          >
            <Image
              src="/new-logo.png"
              alt="Driving School Logo"
              width={140}
              height={140}
              priority
              className="h-24 w-auto object-contain drop-shadow-xl"
            />
          </Link>

          {/* Mobile Floating Logo */}
          <Link
            href="/"
            className="absolute left-3 -bottom-3 z-30 xl:hidden"
          >
            <Image
              src="/new-logo.png"
              alt="Driving School Logo"
              width={90}
              height={90}
              priority
              className="h-20 w-auto object-contain drop-shadow-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative font-heading text-[15px] font-semibold tracking-wide transition ${isActive
                      ? "text-[#f97316]"
                      : "text-[#111827] hover:text-[#f97316]"
                    }`}
                >
                  {item.label}

                  {isActive && (
                    <span className="absolute -bottom-3 left-0 h-[2px] w-10 bg-[#f97316]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Desktop */}
          <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2">
            <Link
              href="/driving-Addmission"
              className="group flex h-14 items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7  font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <GraduationCap className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />

              <span className="text-[15px] font-bold whitespace-nowrap">
                Admission Open
              </span>

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
          {/* Mobile Right Section */}
          <div className="ml-auto flex items-center gap-3 xl:hidden">
            <Link
              href="/driving-Addmission"
              className="group flex h-12 items-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 text-sm font-semibold ] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <GraduationCap className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />

              <span className="whitespace-nowrap">
                Admission Open
              </span>

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-orange-200 bg-white text-[#f97316] shadow-md hover:bg-[#f97316] hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[85vw] max-w-[340px] p-0 overflow-y-auto backdrop-blur-lg bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
              >
                <div className="sticky top-0 z-20 border-b bg-white px-6 py-5">
                  <div className="flex items-start justify-between">
                    <Image
                      src="/new-logo.png"
                      alt="Driving School Logo"
                      width={110}
                      height={110}
                      className="mx-auto h-20 w-auto"
                    />

                    <SheetClose asChild>
                      <button
                        className="rounded-full p-2 text-neutral-500 transition hover:bg-orange-50 hover:text-[#f97316]"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </SheetClose>
                  </div>
                </div>

                <div className="px-5 py-6 space-y-2">
                  {navItems.map((item, index) => (
                    <SheetClose key={item.label} asChild>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center rounded-xl px-5 py-3 text-[15px] font-semibold transition
${pathname === item.href
                            ? "bg-[#f97316] text-white shadow"
                            : "hover:bg-orange-50 text-neutral-700"
                          }`}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                <div className="border-t px-5 py-6 space-y-5 bg-neutral-50">
                  <div className="flex items-center gap-3 text-sm text-neutral-700">
                    <MapPin className="h-4 w-4 text-[#f97316]" />
                    <span>Saone Nagpur, Maharashtra, India</span>
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-sm text-neutral-700">
                    <Clock3 className="h-4 w-4 text-[#f97316]" />
                    <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
                  </div>
                </div>

                <div className="px-5">
                  <SheetClose asChild>
                    <Link
                      href="/driving-Addmission"
                      className="group flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#f97316] to-[#e89100] px-6 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <GraduationCap className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />

                      <span>Admission Open</span>

                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </SheetClose>
                </div>

                <div className="mt-8 flex justify-center gap-5 border-t border-neutral-200 pt-8">
                  <Link
                    href="#"
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#f97316] shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#f97316] hover:text-white hover:shadow-xl"
                  >
                    <FaFacebookF className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </Link>

                  <Link
                    href="#"
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#f97316] shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#f97316] hover:text-white hover:shadow-xl"
                  >
                    <FaInstagram className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </Link>

                  <Link
                    href="#"
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#f97316] shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#f97316] hover:text-white hover:shadow-xl"
                  >
                    <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Orange Accent Line */}
        <div className="h-[3px] bg-[#f97316]" />
      </div>
    </header>
  );
}