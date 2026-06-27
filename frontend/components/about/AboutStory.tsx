"use client";

import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  ThumbsUp,
  ArrowRight,
} from "lucide-react";

interface AboutStoryProps {
  showReadMore?: boolean;
}

export default function AboutStory({
  showReadMore = false,
}: AboutStoryProps) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-2">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left Image */}
          <div className="relative mx-auto max-w-[520px]">
            <div className="absolute -left-4 top-4 h-full w-full rounded-[30px] bg-[#f59e0b]" />

            <div className="relative overflow-hidden rounded-[30px] shadow-xl">
              <Image
                src="/owner1.jpeg"
                alt="Owner"
                width={520}
                height={650}
                className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[500px]"
              />
            </div>
          </div>

          {/* Right Content */}
          <div>
            <span className="text-xl font-medium text-[#f59e0b]">
              Our Story
            </span>

            <div className="mt-2 h-1 w-20 bg-[#f59e0b]" />

            <h2 className="mt-3 text-2xl font-black uppercase leading-tight text-[#111827] lg:text-3xl">
              A Journey Towards
              <br />
              <span className="text-[#f59e0b]">
                Road Safety & Excellence
              </span>
            </h2>

            <p className="mt-2 text-lg leading-8 text-gray-600">
              Founded with a vision to create skilled and responsible drivers,
              Shree Krishna Driving School has become a trusted name in driving
              education. Our mission is to provide expert driving training,
              build road confidence, and create responsible drivers for a safer
              tomorrow. With experienced instructors, modern vehicles, and a
              student-first approach, we ensure every learner gains the skills
              needed for lifelong safe driving.
            </p>

            <div className="mt-2">
              <h3 className="text-3xl text-[#f59e0b] font-signature">
                Omnath Bhoyar
              </h3>

              <p className="mt-1 font-semibold">
                Owner of Shree Krishna Driving School
              </p>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-3">
              <div className="flex items-center rounded-2xl border border-[#f59e0b]/20 bg-[#fff7e6] px-4 py-3">
                <GraduationCap className="h-9 w-9 text-[#f59e0b]" />

                <div className="ml-3">
                  <div className="text-xl font-bold text-[#111827]">
                    15+
                  </div>
                  <div className="text-xs text-neutral-600">
                    Years Experience
                  </div>
                </div>
              </div>

              <div className="flex items-center rounded-2xl border border-[#f59e0b]/20 bg-[#fff7e6] px-4 py-3">
                <ThumbsUp className="h-9 w-9 text-[#f59e0b]" />

                <div className="ml-3">
                  <div className="text-xl font-bold text-[#111827]">
                    5000+
                  </div>
                  <div className="text-xs text-neutral-600">
                    Happy Students
                  </div>
                </div>
              </div>

              {/* Read More Button (Only on Home Page) */}
           {showReadMore && (
  <Link
    href="/about"
    className="flex items-center justify-center rounded-2xl border border-[#f59e0b] bg-[#f59e0b] px-4 py-3 text-white transition-all duration-300 hover:bg-[#e68a00] hover:shadow-lg"
  >
    <div className="flex items-center gap-3">
      <ArrowRight className="h-9 w-9 rounded-full bg-white/20 p-2" />

      <div>
        <div className="text-lg font-bold">
          Read More
        </div>
        <div className="text-xs text-white/90">
          About Us
        </div>
      </div>
    </div>
  </Link>
)}
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
}