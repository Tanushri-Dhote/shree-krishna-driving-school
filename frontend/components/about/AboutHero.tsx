"use client";

import Image from "next/image";
import {
  ShieldCheck, Users, Trophy, ArrowRight,
  Car,
  ThumbsUp,
  BadgeCheck, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutHero() {
  return (
    <>
      <section className="bg-[#f8f4ee]">
        {/* Hero */}
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 items-start">
            {/* Left Content */}
            <div className="px-2 sm:px-3 md:px-4 lg:px-4 py-2 lg:py-6">

              <span className="text-[#f59e0b] font-semibold uppercase tracking-wider">
                About Us
              </span>
              <div className="mt-2 h-1 w-20 bg-[#f59e0b]" />

              <h1 className="mt-2 text-2xl font-black uppercase leading-none md:text-2xl lg:text-3xl">
                Driving Excellence
              </h1>
              <h2 className="mt-2 text-2xl font-black uppercase leading-none text-[#f59e0b] md:text-2xl lg:text-3xl">
                Building Responsible Drivers
              </h2>
              <p className="mt-2 max-w-xl text-gray-700 md:text-lg">
At Shree Krishna Driving School, our mission is to provide expert driving training, build road confidence, and create responsible drivers for a safer tomorrow. With experienced instructors, modern training vehicles, and a student-focused approach, we help learners gain the skills and confidence needed to drive safely on today's roads. From beginner lessons to driving licence assistance, we are committed to delivering high-quality training that prepares every student for lifelong safe driving.    </p>

              <div className="mt-2 flex flex-wrap gap-4">

                <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-3 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b] text-white">
                    <ShieldCheck size={22} />
                  </div>
                  <p className="font-semibold text-[#111827]">
                    Safe Driving
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-3 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b] text-white">
                    <Users size={22} />
                  </div>
                  <p className="font-semibold text-[#111827]">
                    Experienced Instructors
                  </p>
                </div>
              </div>

            </div>

            {/* Right Image */}
            <div className="relative h-[280px] md:h-[450px] lg:h-[580px]">
              <Image
                src="/car.webp"
                alt="Driving School Car"
                fill
                priority
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

    </>
  );
}