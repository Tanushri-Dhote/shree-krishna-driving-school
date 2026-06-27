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
    <section className="bg-[#faf8f5] py-6">
      <div className="mx-auto max-w-7xl px-2">
        <div className="mx-auto max-w-3xl text-center">

          <span className="font-semibold uppercase tracking-wider text-[#f59e0b]">
            Our Services
          </span>

          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#f59e0b]" />

          <h2 className="mt-2 text-2xl font-black uppercase leading-tight text-[#111827] md:text-2xl lg:text-3xl">
            Professional Driving{" "}
            <span className="text-[#f59e0b]">Solutions</span>
          </h2>

          <p className="mt-2 text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg">
            We provide complete driving-related services from professional
            driving training to licence assistance, insurance support and
            PUC certification under one roof.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-[#f59e0b]/10 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-[#f59e0b] hover:shadow-2xl"
              >
                {/* Top Accent */}
                <div className="absolute left-0 top-0 h-1 w-full bg-[#f59e0b] scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />


                {/* Icon + Title */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff7e6] transition-all duration-500 group-hover:bg-[#f59e0b]">
                    <Icon
                      size={25}
                      className="text-[#f59e0b] transition-colors duration-500 group-hover:text-white"
                    />
                  </div>

                  <h3 className="text-xl font-bold leading-tight text-[#111827] transition-colors duration-300 group-hover:text-[#f59e0b]">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="mt-2 text-[15px] leading-7 text-neutral-600">
                  {service.description}
                </p>

                {/* Divider */}
                <div className="my-4 h-px bg-neutral-200" />

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
                <div className="mt-2 flex justify-end">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 font-semibold text-[#f59e0b] transition-all duration-300 group-hover:gap-3"
                  >
                    Apply Now
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                {/* Background Circle */}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#f59e0b]/5 transition-all duration-500 group-hover:scale-125" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}

        <div className="mt-6 overflow-hidden rounded-[32px] bg-[#111111]">
          <div className="relative px-4 py-8 lg:px-8 lg:py-7">

            {/* Decorative Circles */}
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#f59e0b]/10" />
            <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-[#f59e0b]/5" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">

              <div className="max-w-3xl">
                <span className="inline-block rounded-full bg-[#f59e0b]/20 px-4 py-2 text-sm font-semibold text-[#f59e0b]">
                  🚗 Admissions Open
                </span>
                <h2 className="mt-4 text-2xl font-black uppercase leading-tight text-white md:text-2xl lg:text-3xl">
                  Start Your Driving{" "}
                  <span className="text-[#f59e0b]">Journey Today</span>
                </h2>


                <p className="mt-2 max-w-xl text-sm text-white/75 md:text-base">
                  Join thousands of successful learners trained by our
                  experienced instructors. Learn safe driving, build
                  confidence, and get complete assistance for your driving
                  licence.
                </p>
              </div>

              <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:justify-center">

                <Link
                  href="/admission"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f59e0b] px-6 py-3 text-sm font-semibold text-[#111111] transition-all duration-300 hover:scale-105 hover:bg-white sm:px-8 sm:py-4 sm:text-base"
                >
                  Apply Now
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#111111] sm:px-8 sm:py-4 sm:text-base"
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