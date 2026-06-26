"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock3,
  MessageCircle,
  Menu,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
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
  { label: "CONTACT US", href: "#" },
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
              <MapPin className="h-4 w-4 text-[#f59e0b]" />
              <span>Saoner, Nagpur, Maharashtra, India</span>
            </div>

            <div className="flex items-center gap-2 text-white/90">
              <Clock3 className="h-4 w-4 text-[#f59e0b]" />
              <span>Mon - Sun: 7:00 AM - 8:00 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-white/80 transition hover:text-[#f59e0b]"
            >
              <FaFacebookF className="h-4 w-4" />
            </Link>

            <Link
              href="#"
              className="text-white/80 transition hover:text-[#f59e0b]"
            >
              <FaInstagram className="h-4 w-4" />
            </Link>

            <Link
              href="#"
              className="text-white/80 transition hover:text-[#f59e0b]"
            >
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>


      {/* Main Navbar */}
      <div className="relative border-b border-neutral-200 bg-white shadow-sm">
        <div className="relative mx-auto flex h-16 lg:h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Desktop Floating Logo */}
          <Link
            href="#"
            className="absolute left-6 -bottom-5 z-30 hidden xl:block"
          >
            <Image
              src="/logo-11.png"
              alt="Driving School Logo"
              width={140}
              height={140}
              priority
              className="h-24 w-auto object-contain drop-shadow-xl"
            />
          </Link>

          {/* Mobile Floating Logo */}
          <Link
            href="#"
            className="absolute left-3 -bottom-3 z-30 xl:hidden"
          >
            <Image
              src="/logo-11.png"
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
                className={`relative text-[13px] font-semibold tracking-wide transition ${index === 0
                  ? "text-[#f59e0b]"
                  : "text-[#1f1f1f] hover:text-[#f59e0b]"
                  }`}
              >
                {item.label}

                {index === 0 && (
                  <span className="absolute -bottom-3 left-0 h-[2px] w-10 bg-[#f59e0b]" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Desktop */}
          <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2">
            <Link
              href="/driving-Addmission"
              className="group flex items-center gap-2 rounded-full bg-[#f59e0b] px-5 py-2.5 text-black shadow-md transition hover:bg-[#e68900]"
            >
              <GraduationCap className="h-4 w-4 text-black" />

              <span className="text-[14px] font-bold text-black whitespace-nowrap">
                Admission Open
              </span>

              <ArrowRight className="h-4 w-4 text-black transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Right Section */}
          <div className="ml-auto flex items-center gap-2 xl:hidden">
            <Link
              href="/driving-Addmission"
              className="flex items-center gap-1 rounded-full bg-[#f59e0b] px-4 py-2 text-xs font-semibold text-black shadow-md"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="text-[14px] font-bold text-black whitespace-nowrap">
                Admission Open
              </span>
              <ArrowRight className="h-4 w-4 text-black transition-transform group-hover:translate-x-1" />

            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] hover:bg-[#f59e0b] hover:text-white"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[88vw] sm:w-[360px]">
                <div className="mt-8">
                  <Image
                    src="/logo-11.png"
                    alt="Driving School Logo"
                    width={120}
                    height={120}
                    className="mx-auto h-20 w-auto object-contain"
                  />
                </div>

                <div className="mt-8 flex flex-col gap-1">
                  {navItems.map((item, index) => (
                    <SheetClose key={item.label} asChild>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${index === 0
                          ? "bg-[#f59e0b] text-white"
                          : "text-neutral-800 hover:bg-[#fff7e6] hover:text-[#f59e0b]"
                          }`}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                <div className="mt-8 border-t pt-6">
                  <div className="flex items-center gap-3 text-sm text-neutral-700">
                    <MapPin className="h-4 w-4 text-[#f59e0b]" />
                    <span>Nagpur, Maharashtra, India</span>
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-sm text-neutral-700">
                    <Clock3 className="h-4 w-4 text-[#f59e0b]" />
                    <span>Mon - Sun: 7:00 AM - 8:00 PM</span>
                  </div>
                </div>

                <div className="mt-8">
                  <SheetClose asChild>
                    <Link
                      href="/driving-Addmission"
                      className="flex items-center justify-center gap-2 rounded-full bg-[#f59e0b] px-5 py-3 font-semibold text-white shadow-lg"
                    >
                      <GraduationCap className="h-5 w-5" />
                      Admission Open
                    </Link>
                  </SheetClose>
                </div>

                <div className="mt-6 flex justify-center gap-5">
                  <Link href="#" className="text-neutral-600 hover:text-[#f59e0b]">
                    <FaFacebookF className="h-5 w-5" />
                  </Link>

                  <Link href="#" className="text-neutral-600 hover:text-[#f59e0b]">
                    <FaInstagram className="h-5 w-5" />
                  </Link>

                  <Link href="#" className="text-neutral-600 hover:text-[#f59e0b]">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Orange Accent Line */}
        <div className="h-[3px] bg-[#f59e0b]" />
      </div>
    </header>
  );
}