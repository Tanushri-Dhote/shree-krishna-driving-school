"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
  { label: "HOME", href: "#" },
  { label: "ABOUT US", href: "#" },
  { label: "SERVICES", href: "#" },
  { label: "WHY US", href: "#" },
  { label: "CONTACT US", href: "/contact" },
] as const;

export function DrivingNavbar() {
  const [open, setOpen] = React.useState(false);

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
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
               
                className={`relative font-heading text-[15px] font-semibold tracking-wide transition ${index === 0
                    ? "text-[#f97316]"
                    : "text-[#111827] hover:text-[#f97316]"
                  }`}


              >
                {item.label}

                {index === 0 && (
                  // <span className="absolute -bottom-3 left-0 h-[2px] w-10 bg-[#f97316]" />
                  <span className="absolute -bottom-3 left-0 h-[2px] w-10 bg-[#f97316]" />

                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Desktop */}
          <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2">
            <Link
              href="/driving-Addmission"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f97316] to-[#e58f09] px-5 py-2.5 text-white shadow-md transition-transform hover:-translate-y-[2px]"
            >
              <GraduationCap className="h-4 w-4 text-black" />

              <span className="text-[14px] font-bold text-black whitespace-nowrap">
                Admission Open
              </span>

              <ArrowRight className="h-4 w-4 text-black transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Right Section */}
          <div className="ml-auto flex items-center gap-3 xl:hidden">
            <Link
              href="/driving-Addmission"
              className="flex h-10 items-center gap-2 rounded-full bg-[#f97316] px-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#e58f09]"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="xs:inline">Admission</span>
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
${index === 0
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
                    <span>Nagpur, Maharashtra, India</span>
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-sm text-neutral-700">
                    <Clock3 className="h-4 w-4 text-[#f97316]" />
                    <span>Mon - Sun: 7:00 AM - 8:00 PM</span>
                  </div>
                </div>

                <div className="px-5">
                  <SheetClose asChild>
                    <Link
                      href="/driving-Addmission"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f97316] text-white font-semibold shadow-lg hover:bg-[#e58f09]"
                    >
                      <GraduationCap className="h-5 w-5" />
                      Admission Open
                    </Link>
                  </SheetClose>
                </div>

                <div className="py-8 flex justify-center gap-6 border-t mt-8">
                  <Link href="#" className="text-neutral-600 hover:text-[#f97316]">
                    <FaFacebookF className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-[#f97316] transition hover:bg-[#f97316] hover:text-white" />
                  </Link>

                  <Link href="#" className="text-neutral-600 hover:text-[#f97316]">
                    <FaInstagram className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-[#f97316] transition hover:bg-[#f97316] hover:text-white" />
                  </Link>

                  <Link href="#" className="text-neutral-600 hover:text-[#f97316]">
                    <MessageCircle className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-[#f97316] transition hover:bg-[#f97316] hover:text-white" />
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