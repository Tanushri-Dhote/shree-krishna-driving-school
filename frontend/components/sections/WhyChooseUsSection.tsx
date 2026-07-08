"use client";

import {
  ShieldCheck,
  Users,
  Car,
  FileCheck2,
} from "lucide-react";

const features = [
  {
    title: "Safe & Secure Training",
    description:
      "We follow strict safety standards and dual-control vehicles to ensure every learner gains confidence in a safe environment.",
    icon: ShieldCheck,
  },
  {
    title: "Expert Instructors",
    description:
      "Learn from experienced, certified and friendly instructors who guide you through every step of your driving journey.",
    icon: Users,
  },
  {
    title: "Practical Road Training",
    description:
      "Get hands-on driving experience on real roads with modern vehicles and practical driving techniques.",
    icon: Car,
  },
  {
    title: "Complete Licence Assistance",
    description:
      "From learner's licence to permanent licence, we provide complete documentation and process support.",
    icon: FileCheck2,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-orange-50/40 to-white py-2 lg:py-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          
             <span className="font-semibold uppercase tracking-wider text-[#f97316]">
             Why Choose Us
          </span>
           <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#f97316]" />
           <h2 className="mt-2 whitespace-nowrap text-2xl font-black uppercase leading-tight text-[#111827] md:text-2xl lg:text-3xl">
                            Learn Driving With{" "}
                            <span className="text-[#f97316]">Confidence & Safety</span>
                        </h2>
          <p className="mt-2 text-base leading-8 text-slate-600 md:text-lg">
            We provide professional driving lessons with experienced instructors,
            modern vehicles and complete licence assistance to help you become a
            confident driver.
          </p>

        </div>

        {/* Cards */}
        <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#f97316] hover:shadow-2xl"
              >
                {/* Top Right Number */}
                <span className="absolute right-6 top-6 text-5xl font-black text-slate-100 transition-colors duration-300 group-hover:text-[#f97316]/10">
                  0{index + 1}
                </span>

                {/* Icon + Title */}
                <div className="relative z-10 flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f97316]/10 transition-all duration-300 group-hover:bg-[#f97316]">
                    <Icon
                      size={28}
                      className="text-[#f97316] transition-colors duration-300 group-hover:text-white"
                    />
                  </div>

                  <h3 className="text-lg font-bold leading-6 text-slate-900">
                    {item.title}
                  </h3>

                </div>

                {/* Description */}
                <p className="relative z-10 mt-6 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                {/* Bottom Accent */}
                <div className="mt-8 h-1 w-16 rounded-full bg-[#f97316] transition-all duration-300 group-hover:w-full" />

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}