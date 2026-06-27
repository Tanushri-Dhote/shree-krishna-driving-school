"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Car,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    id: "01",
    title: "Safe & Secure\nTraining",
    description:
      "We follow strict safety standards to ensure a secure learning environment.",
    icon: ShieldCheck,
  },
  {
    id: "02",
    title: "Expert\nInstructors",
    description:
      "Learn from certified, experienced and friendly instructors dedicated to your success.",
    icon: Users,
  },
  {
    id: "03",
    title: "Practical Road\nTraining",
    description:
      "Hands-on driving experience with modern vehicles on real road conditions.",
    icon: Car,
  },
  {
    id: "04",
    title: "Complete Licence\nAssistance",
    description:
      "From documentation to licence, we provide complete support at every step.",
    icon: FileCheck2,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">

      {/* ── Decorative blobs ── */}
      {/* Top-left large circle (yellow, partially visible) */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#f59e0b]/25 md:h-72 md:w-72"
        aria-hidden="true"
      />

      {/* Bottom-right large quarter circle */}
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-[#f59e0b]/30 md:h-72 md:w-72"
        aria-hidden="true"
      />

      {/* Scattered dots (hidden on mobile for cleanliness) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        {/* top-left cluster */}
        <span className="absolute left-[7%] top-[15%] h-1.5 w-1.5 rounded-full bg-[#f59e0b]/50" />
        <span className="absolute left-[9%] top-[22%] h-1 w-1 rounded-full bg-[#f59e0b]/40" />
        <span className="absolute left-[5%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#f59e0b]/30" />
        {/* top-right cluster */}
        <span className="absolute right-[8%] top-[12%] h-1.5 w-1.5 rounded-full bg-[#f59e0b]/40" />
        <span className="absolute right-[6%] top-[20%] h-1 w-1 rounded-full bg-[#f59e0b]/30" />
        <span className="absolute right-[10%] top-[28%] h-2 w-2 rounded-full bg-[#f59e0b]/20" />
        {/* bottom-left cluster */}
        <span className="absolute left-[12%] bottom-[18%] h-1 w-1 rounded-full bg-[#f59e0b]/40" />
        <span className="absolute left-[15%] bottom-[12%] h-1.5 w-1.5 rounded-full bg-[#f59e0b]/30" />
        {/* bottom-right cluster (near the blob) */}
        <span className="absolute right-[20%] bottom-[20%] h-1 w-1 rounded-full bg-[#f59e0b]/50" />
        <span className="absolute right-[24%] bottom-[14%] h-1.5 w-1.5 rounded-full bg-[#f59e0b]/35" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section heading ── */}
        <div className="mx-auto max-w-2xl text-center">

          {/* Label row */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#f59e0b]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#f59e0b]">
              • Why Choose Us? •
            </span>
            <span className="h-px w-8 bg-[#f59e0b]" />
          </div>

          {/* Main title */}
          <h2 className="mt-3 text-3xl font-black leading-snug text-[#111827] sm:text-4xl">
            We Provide The Best{" "}
            <span className="text-[#f59e0b]">Driving Learning</span>{" "}
            Experience
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-sm leading-7 text-neutral-500 sm:text-base">
            We are committed to providing top-quality driving education
            <br className="hidden sm:block" />
            with safety, professionalism and personalized support.
          </p>
        </div>

        {/* ── Feature circles ── */}
        <div className="relative mt-14">

          {/* Dashed horizontal connector — only on large screens */}
          <div
            className="pointer-events-none absolute inset-x-0 top-[calc(50%-1px)] hidden items-center lg:flex"
            aria-hidden="true"
          >
            {/* We render 3 connector segments between 4 cards */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 border-t-2 border-dashed border-[#f59e0b]/60"
                style={{ marginLeft: i === 0 ? "12.5%" : 0, marginRight: i === 2 ? "12.5%" : 0 }}
              />
            ))}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col items-center"
                >
                  {/* ── Outer circle ── */}
                  <div className="relative flex h-44 w-44 flex-col items-center justify-center rounded-full border-[5px] border-[#1a1a1a] bg-white shadow-sm transition-transform duration-300 hover:scale-105 sm:h-48 sm:w-48">

                    {/* Orange top arc highlight */}
                    <div className="absolute -top-[5px] left-1/2 h-3 w-20 -translate-x-1/2 rounded-full bg-[#f59e0b]" />

                    {/* Step number */}
                    <div className="flex flex-col items-center pt-2">
                      <span className="text-sm font-bold tracking-widest text-[#f59e0b]">
                        {item.id}
                      </span>
                      <span className="mt-1 h-px w-8 bg-[#f59e0b]" />
                    </div>

                    {/* Title + description inside circle */}
                    <div className="mt-2 px-4 text-center">
                      <h3 className="whitespace-pre-line text-[13px] font-bold leading-tight text-[#111827]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[10px] leading-[1.6] text-neutral-500">
                        {item.description}
                      </p>
                    </div>

                    {/* ── Icon badge (left side) ── */}
                    <div className="absolute -left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition-colors duration-300 group-hover:border-[#f59e0b]">
                      <Icon size={20} className="text-[#f59e0b]" strokeWidth={1.8} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTA Button ── */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/admission"
            className="inline-flex items-center gap-3 rounded-full bg-[#f59e0b] px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e08e00] hover:shadow-xl"
          >
            Join Us Today
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <ArrowRight size={14} className="text-white" />
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
