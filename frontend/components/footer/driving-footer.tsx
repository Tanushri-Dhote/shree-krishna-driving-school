"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Users,
  Car,
  FileCheck2,
  Clock3,
  ChevronRight,
  Heart,
  Percent,
  ThumbsUp,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";

/* ── data ─────────────────────────────────────────────── */
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/#services" },
  { label: "Why Choose Us", href: "/#why" },
  { label: "Testimonials", href: "/#testimonials" },

  { label: "Contact Us", href: "/contact" },
];

const services = [
  {
    label: "Driving Admission",
    href: "/driving-Addmission",
    icon: Car,
  },
  {
    label: "Driving Licence",
    href: "/driving-licence",
    icon: FileCheck2,
  },
  {
    label: "Insurance",
    href: "/driving-Insurance",
    icon: ShieldCheck,
  },
  {
    label: "PUC Certificate",
    href: "/driving-PUC",
    icon: FileCheck2,
  },
];

const badges = [
  { icon: Clock3, title: "Flexible Timings", desc: "Batch available for weekday & weekend" },
  { icon: Car, title: "Pick & Drop", desc: "Pick & drop facility available" },
  { icon: Percent, title: "Affordable Fees", desc: "Best training at reasonable fees" },
  { icon: ThumbsUp, title: "100% Support", desc: "Complete assistance till licence" },
];

const highlights = [
  { icon: ShieldCheck, label: "Safe &\nSecure" },
  { icon: Users, label: "Expert\nInstructors" },
  { icon: Car, label: "Modern\nVehicles" },
  { icon: FileCheck2, label: "Licence\nAssistance" },
];

const socials = [
  { icon: FaFacebookF, href: "#", color: "bg-[#1877F2]" },
  { icon: FaInstagram, href: "#", color: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]" },
  { icon: FaYoutube, href: "#", color: "bg-[#FF0000]" },
  { icon: FaWhatsapp, href: "#", color: "bg-[#25D366]" },
];

/* ── component ────────────────────────────────────────── */
export function DrivingFooter() {
  return (
    <footer className="bg-[#0d0d0d] text-white">

      {/* ── Main grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-6 lg:py-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1 – Brand */}
          <div>
            <Image
              src="/new-logo.png"
              alt="Shree Krishna Driving School"
              width={240}
              height={240}
              className="h-40 w-auto object-contain"
            />
            <p className="mt-4 text-sm leading-7 text-neutral-400">
              We provide professional driving training with experienced instructors,
              modern vehicles and complete assistance to help you become a safe and
              confident driver for life.
            </p>

            {/* amber underline */}
            <div className="mt-4 h-[2px] w-10 bg-[#f97316]" />
          </div>

          {/* Col 2 – Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <div className="mt-2 h-[2px] w-8 bg-[#f97316]" />
            <ul className="mt-5 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-[#f97316]"
                  >
                    <ChevronRight size={14} className="text-[#f97316]" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 – Our Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Our Services
            </h3>
            <div className="mt-2 h-[2px] w-8 bg-[#f97316]" />
            <ul className="mt-5 space-y-4">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      className="group flex items-center gap-3 transition-colors hover:text-[#f97316]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f97316] transition-transform group-hover:scale-110">
                        <Icon size={18} className="text-white" />
                      </div>

                      <span className="text-sm text-neutral-300 group-hover:text-[#f97316]">
                        {s.label}
                      </span>
                    </Link>

                    {i < services.length - 1 && (
                      <div className="mt-4 h-px bg-[#222]" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 4 – Contact Us */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <div className="mt-2 h-[2px] w-8 bg-[#f97316]" />
            <ul className="mt-5 space-y-5">
              {/* Email */}
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f97316]/40 bg-[#f97316]/10">
                  <Mail size={15} className="text-[#f97316]" />
                </div>
                <a
                  href="mailto:shreekrishnadrivingschool03@gmail.com"
                  className="text-sm leading-6 text-neutral-400 hover:text-[#f97316] break-all whitespace-nowrap"
                >
                  shreekrishnadrivingschool03@gmail.com
                </a>
              </li>

              {/* Phone */}
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f97316]/40 bg-[#f97316]/10">
                  <Phone size={15} className="text-[#f97316]" />
                </div>
                <div className="text-sm leading-7 text-neutral-400">
                  <a href="tel:7499279503" className="block hover:text-[#f97316]">+91 7499279503</a>
                  <a href="tel:7558457485" className="block hover:text-[#f97316]">+91 7558457485</a>
                  <a href="tel:9850787810" className="block hover:text-[#f97316]">+91 9850787810</a>
                </div>
              </li>

              {/* Address */}
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f97316]/40 bg-[#f97316]/10">
                  <MapPin size={15} className="text-[#f97316]" />
                </div>
                <p className="text-sm leading-6 text-neutral-400">
                  9WH9+64F, Katol Rd,
                  near Gadkari College,
                  Saoner, Maharashtra 441107
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar: socials + feature badges ── */}
      <div className="border-t border-[#1c1c1c]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Socials */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">Follow Us</p>
              <div className="mt-2 h-[2px] w-8 bg-[#f97316]" />
              <div className="mt-3 flex gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.color}
                      href={s.href}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80 ${s.color}`}
                    >
                      <Icon size={16} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Feature badges */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#f97316]/60 bg-[#f97316]/10">
                      <Icon size={18} className="text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{b.title}</p>
                      <p className="mt-0.5 text-[10px] leading-tight text-neutral-500">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-[#1c1c1c] bg-[#080808]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:flex-row lg:px-8">
          <p className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Heart size={12} className="fill-[#f97316] text-[#f97316]" />
            © {new Date().getFullYear()} Shree Krishna Driving School. All Rights Reserved.
          </p>
          <p className="text-xs text-neutral-500">
            Developed By{" "}
            <a
              href="https://www.instagram.com/tanushri_dhote/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#f97316] hover:text-orange-600 hover:underline transition-colors"
            >
              Tanushri Dhote
            </a>
          </p>
        </div>
      </div>

    </footer>
  );
}
