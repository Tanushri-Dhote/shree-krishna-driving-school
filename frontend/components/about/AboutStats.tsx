"use client";

import {
    GraduationCap,
    ThumbsUp,
    Car,
    MapPin,
} from "lucide-react";

export default function AboutStats() {
    const stats = [
        {
            icon: GraduationCap,
            value: "5000+",
            label: "Students Trained",
        },
        {
            icon: ThumbsUp,
            value: "98%",
            label: "Pass Success Rate",
        },
        {
            icon: Car,
            value: "15+",
            label: "Years Experience",
        },
        {
            icon: MapPin,
            value: "1",
            label: "Trusted Location",
        },
    ];

    return (
        <section className="relative -mt-25 z-20 px-2 sm:px-4 lg:px-6">

            <div className="mx-auto max-w-7xl px-2">

                <div className="rounded-3xl bg-[#111111] text-white overflow-hidden">

                    <div className="grid md:grid-cols-4">

                        {stats.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center py-6 px-4 border-r border-white/10 last:border-none"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon
                                        className="text-[#f59e0b]"
                                        size={34}
                                    />

                                    <span className="text-3xl font-bold text-white">
                                        {item.value}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm md:text-base text-white/80 text-center">
                                    {item.label}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </section>
    );
}