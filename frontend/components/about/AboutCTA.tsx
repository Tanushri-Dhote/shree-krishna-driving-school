"use client";

import { ArrowRight } from "lucide-react";

export default function AboutCTA() {
    return (
        <section className="pb-2">
            <div className="max-w-7xl mx-auto px-2">
                <div className="rounded-3xl bg-gradient-to-r from-[#f97316] to-[#ff7b00] p-4 lg:p-6 flex flex-col lg:flex-row items-center justify-between gap-2">

                    <div>
                        <h2 className="mt-2 text-2xl font-black uppercase leading-none text-white/90 md:text-2xl lg:text-3xl">
                            Start Your Driving Journey With Us
                        </h2>

                        <p className="mt-1 max-w-xl text-white/90 md:text-lg">
                            Join thousands of successful students today.
                        </p>
                    </div>

                    <button className="bg-black text-white px-8 py-4 rounded-xl flex items-center gap-2">
                        Admission Open
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}