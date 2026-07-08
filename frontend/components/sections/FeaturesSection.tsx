"use client";

import {
    ShieldCheck,
    Car,
    ThumbsUp,
    BadgeCheck,
} from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Experienced Instructors",
        description:
            "Learn from certified & experienced instructors.",
    },
    {
        icon: Car,
        title: "Practical Training",
        description:
            "Hands-on driving practice with real road experience.",
    },
    {
        icon: ThumbsUp,
        title: "Safety First",
        description:
            "Safety is our top priority in every lesson.",
    },
    {
        icon: BadgeCheck,
        title: "Govt. Approved",
        description:
            "We provide RTO approved training courses.",
    },
];

export default function FeaturesSection() {
    return (
        <section className="relative z-20 px-2 sm:px-4 lg:-mt-24 lg:px-6">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#0B0B0F] shadow-2xl border border-[#1c1c1c]">

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">

                    {features.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={index}
                                className={`flex items-start gap-4 p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:bg-[#111111]
                                ${index !== features.length - 1
                                        ? "border-b xl:border-b-0 xl:border-r border-[#222]"
                                        : ""
                                    }`}
                            >
                                {/* Icon */}
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#f97316]/30 bg-[#f97316]/10 sm:h-16 sm:w-16">
                                    <Icon className="h-6 w-6 text-[#f97316] sm:h-8 sm:w-8" />
                                </div>
                                {/* Content */}
                                <div>
                                    <p className="mt-0 text-sm font-bold uppercase text-white md:text-base lg:text-lg">{item.title}</p>
                                    <p className="mt-1 text-xs leading-6 text-gray-400 sm:text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}