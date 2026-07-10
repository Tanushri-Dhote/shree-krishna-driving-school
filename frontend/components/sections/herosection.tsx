import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Car,
  ThumbsUp,

  Users, BadgeCheck, Award
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-[#f8f4ee]">
      {/* Hero */}
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 items-start">
          {/* Left Content */}
          <div className="px-2 sm:px-3 md:px-4 lg:px-4 py-2 lg:py-6">

            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-2 py-2 text-[13px] shadow-sm">
              ⭐ 4.9 Rating • 5000+ Happy Students
            </div>

            <h1 className="mt-2 text-2xl font-black uppercase leading-none md:text-2xl lg:text-3xl">
              Drive Today
            </h1>

            <h2 className="mt-2 text-2xl font-black uppercase leading-none text-[#f97316] md:text-2xl lg:text-3xl">
              Lead Tomorrow
            </h2>

            <p className="mt-2 text-sm font-bold uppercase md:text-lg">
              Learn Safe. Drive Safe. Stay Safe.
            </p>

            <div className="mt-2 h-1 w-20 bg-[#f97316]" />

            <p className="mt-5 max-w-xl text-gray-700 md:text-lg">
              Shree Krishna Driving School is committed to providing
              professional driving training with safety, confidence and
              responsibility since 2008.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="h-14 px-8 rounded-xl bg-[#f97316] text-white text-base font-semibold shadow-lg transition-all duration-300 hover:bg-[#e89100] hover:scale-105 hover:shadow-xl"
              >
                <Link href="/driving-Addmission" className="flex items-center gap-2">
                  Enroll Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-12 px-6 border-2 border-[#f97316] text-[#f97316] hover:bg-[#f97316] hover:text-white rounded-xl"
              >
                <Link
                  href="/contact"
                  className="flex items-center gap-2"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-2 grid grid-cols-3 gap-2 md:max-w-md">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#f97316]" />
                  <h3 className="text-2xl font-bold text-[#f97316]">
                    5000+
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Students
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#f97316]" />
                  <h3 className="text-2xl font-bold text-[#f97316]">
                    98%
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Pass Rate
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-[#f97316]" />
                  <h3 className="text-2xl font-bold text-[#f97316]">
                    15+
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Years
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
  );
}