"use client";

import Link from "next/link";
import {
  Car,
  FileCheck,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    title: "Driving Admission",
    icon: Car,
    description:
      "Professional driving lessons for beginners and experienced learners with practical road training.",
    features: [
      "LMV Training",
      "Expert Instructors",
      "Flexible Timings",
    ],
  },
  {
    title: "Driving Licence",
    icon: FileCheck,
    description:
      "Complete assistance for learner and permanent driving licence documentation and process.",
    features: [
      "Learner Licence",
      "Permanent Licence",
      "Documentation",
    ],
  },
  {
    title: "Insurance",
    icon: ShieldCheck,
    description:
      "Vehicle insurance renewal and policy assistance with trusted insurance partners.",
    features: [
      "Renewal",
      "New Insurance",
      "Claim Assistance",
    ],
  },
  {
    title: "PUC Certificate",
    icon: BadgeCheck,
    description:
      "Get Pollution Under Control certificates quickly and keep your vehicle road compliant.",
    features: [
      "Instant PUC",
      "Vehicle Check",
      "Affordable Price",
    ],
  },
];

export default function DrivingServicesSection() {
  return (
    <section className="bg-[#faf8f5] py-10">
      <div className="mx-auto max-w-7xl px-2">
        <div className="mx-auto max-w-3xl text-center">

          <span className="font-semibold uppercase tracking-wider text-[#f59e0b]">
            Our Services
          </span>

          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#f59e0b]" />

          <h2 className="mt-5 text-3xl font-black uppercase text-[#111827] lg:text-5xl">
            Professional Driving
            <span className="block text-[#f59e0b]">
              Solutions
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-neutral-600">
            We provide complete driving-related services from professional
            driving training to licence assistance, insurance support and
            PUC certification under one roof.
          </p>

        </div>

        {/* Cards */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => {
  const Icon = service.icon;

  return (
    <div
      key={index}
      className="group relative overflow-hidden rounded-3xl border border-[#f59e0b]/10 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-[#f59e0b] hover:shadow-2xl"
    >
      {/* Top Accent */}
      <div className="absolute left-0 top-0 h-1 w-full bg-[#f59e0b] scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

      {/* Icon */}
      {/* Icon + Title */}
<div className="flex items-center gap-4">
  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#fff7e6] transition-all duration-500 group-hover:bg-[#f59e0b]">
    <Icon
      size={32}
      className="text-[#f59e0b] transition-colors duration-500 group-hover:text-white"
    />
  </div>

  <h3 className="text-xl font-bold leading-tight text-[#111827] transition-colors duration-300 group-hover:text-[#f59e0b]">
    {service.title}
  </h3>
</div>

      {/* Description */}
      <p className="mt-4 text-[15px] leading-7 text-neutral-600">
        {service.description}
      </p>

      {/* Divider */}
      <div className="my-6 h-px bg-neutral-200" />

      {/* Features */}
      <div className="space-y-3">
        {service.features.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-3"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f59e0b]/10">
              <div className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
            </div>

            <span className="text-sm font-medium text-neutral-700">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Learn More */}
      <Link
        href="/services"
        className="mt-8 inline-flex items-center gap-2 font-semibold text-[#f59e0b] transition-all duration-300 group-hover:gap-3"
      >
        Learn More
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>

      {/* Background Circle */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#f59e0b]/5 transition-all duration-500 group-hover:scale-125" />
    </div>
  );
})}
        </div>

        {/* Bottom CTA */}

        <div className="mt-20 overflow-hidden rounded-[32px] bg-[#111111]">
          <div className="relative px-8 py-12 lg:px-16 lg:py-14">

            {/* Decorative Circles */}
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#f59e0b]/10" />
            <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-[#f59e0b]/5" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">

              <div className="max-w-3xl">
                <span className="inline-block rounded-full bg-[#f59e0b]/20 px-4 py-2 text-sm font-semibold text-[#f59e0b]">
                  🚗 Admissions Open 2026
                </span>

                <h3 className="mt-5 text-3xl font-black uppercase leading-tight text-white lg:text-5xl">
                  Start Your Driving
                  <span className="block text-[#f59e0b]">
                    Journey Today
                  </span>
                </h3>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                  Join thousands of successful learners trained by our
                  experienced instructors. Learn safe driving, build
                  confidence, and get complete assistance for your driving
                  licence.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">

                <Link
                  href="/admission"
                  className="inline-flex items-center gap-3 rounded-full bg-[#f59e0b] px-8 py-4 font-semibold text-[#111111] transition-all duration-300 hover:scale-105 hover:bg-white"
                >
                  Enroll Now
                  <ArrowRight size={20} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full border border-white/30 px-8 py-4 font-semibold text-white transition-all duration-300 hover:border-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#111111]"
                >
                  Contact Us
                </Link>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}