"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Star, ArrowRight } from "lucide-react";

/* ─── Real Google Reviews ─────────────────────────────── */
const reviews = [
    {
        id: 1,
        name: "Tushar Khodankar",
        role: "Local Guide",
        location: "Saoner, Nagpur",
        rating: 5,
        text: "Best driving school in Saoner. Good mentor with proper instructions. Worth it to get hands on for driving cars. Highly recommended to everyone!",
        avatar: null,
        initials: "TK",
    },
    {
        id: 2,
        name: "Mohammad Shahjahan",
        role: "Student",
        location: "Nagpur",
        rating: 5,
        text: "I am thankful to be part of Shri Krishna Driving School. The way of teaching and building confidence is awesome. The trainers are good, talented, cool and very patient with individual learners.",
        avatar: null,
        initials: "MS",
    },
    {
        id: 3,
        name: "Shreya Warkari",
        role: "Student",
        location: "Nagpur",
        rating: 5,
        text: "Shri Krishna Driving School — one of the best driving schools. Best Driving Experience Ever! The instructors were professional, friendly, and made me feel safe from start to finish. Highly recommended!",
        avatar: null,
        initials: "SW",
    },
    {
        id: 4,
        name: "Sachin Kalkumbe",
        role: "Student",
        location: "Nagpur",
        rating: 5,
        text: "I would like to express my sincere gratitude to Shree Krishna Driving School for the outstanding training and support throughout my driving lessons. The instructors were patient, professional, and highly knowledgeable.",
        avatar: null,
        initials: "SK",
    },
    {
        id: 5,
        name: "Vaibhav Bhagat",
        role: "Student",
        location: "Saoner",
        rating: 5,
        text: "It was a very nice experience. They give very good advice and cover the entire training in a very short time and in a very nice way. Saoner's best driving school without a doubt.",
        avatar: null,
        initials: "VB",
    },
    {
        id: 6,
        name: "G. H. W.",
        role: "Student",
        location: "Nagpur",
        rating: 5,
        text: "I have had a very good experience in this driving school. The teachers here guide very well and make sure every student gains confidence before going on the road.",
        avatar: null,
        initials: "GH",
    },
];

/* ─── Star renderer ───────────────────────────────────── */
function Stars({ count = 5 }: { count?: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
                <Star key={i} size={14} className="fill-[#f97316] text-[#f97316]" />
            ))}
        </div>
    );
}

/* ─── Google "G" logo SVG ─────────────────────────────── */
function GoogleLogo({ size = 28 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Google">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.2 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.2 6.5 29.4 4 24 4 16.2 4 9.5 8.4 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.3C9.4 35.5 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
        </svg>
    );
}

/* ─── Steering Wheel SVG ──────────────────────────────── */
function SteeringWheelIcon({ size = 36 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="9" x2="12" y2="2" />
            <line x1="9.6" y1="10.4" x2="4.2" y2="6.9" />
            <line x1="14.4" y1="10.4" x2="19.8" y2="6.9" />
        </svg>
    );
}

/* ─── Avatar ──────────────────────────────────────────── */
function Avatar({ initials }: { initials: string }) {
    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#e08e00] text-sm font-bold text-white shadow">
            {initials}
        </div>
    );
}

/* ─── Main Component ──────────────────────────────────── */
export default function TestimonialsSection() {
    const [current, setCurrent] = useState(0);

    // Show 3 cards at a time on desktop, 1 on mobile
    const VISIBLE = 3;
    const total = reviews.length;
    const maxIndex = total - VISIBLE;

    const prev = () => setCurrent((c) => Math.max(0, c - 1));
    const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

    const visibleReviews = reviews.slice(current, current + VISIBLE);
    // For mobile show only the current one
    const mobileReview = reviews[current % total];

    return (
        <section className="relative overflow-hidden bg-[#fffdf8] py-4 md:py-6">
            {/* Scatter dots */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
                <span className="absolute left-[6%] top-[18%] h-1.5 w-1.5 rounded-full bg-[#f97316]/50" />
                <span className="absolute left-[8%] top-[28%] h-1 w-1 rounded-full bg-[#f97316]/40" />
                <span className="absolute left-[4%] top-[38%] h-2 w-2 rounded-full bg-[#f97316]/25" />
                {/* dot grid top-left */}
                {[0, 1, 2, 3].map((row) =>
                    [0, 1, 2, 3].map((col) => (
                        <span
                            key={`${row}-${col}`}
                            className="absolute h-0.5 w-0.5 rounded-full bg-[#f97316]/30"
                            style={{ left: `${5 + col * 0.8}%`, top: `${40 + row * 2}%` }}
                        />
                    ))
                )}
                {/* dot grid top-right */}
                {[0, 1, 2, 3].map((row) =>
                    [0, 1, 2, 3].map((col) => (
                        <span
                            key={`r${row}-${col}`}
                            className="absolute h-0.5 w-0.5 rounded-full bg-[#f97316]/30"
                            style={{ right: `${5 + col * 0.8}%`, top: `${10 + row * 2}%` }}
                        />
                    ))
                )}
                <span className="absolute right-[10%] top-[30%] h-3 w-3 rounded-full border border-[#f97316]/40" />
                <span className="absolute left-[14%] top-[12%] h-4 w-4 rounded-full border border-[#f97316]/30" />
            </div>

            <div className="relative mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">

                {/* ── Section heading ── */}
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="font-semibold uppercase tracking-wider text-[#f97316]">
                            Testimonials
                        </span>
                        <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#f97316]" />
                        <h2 className="mt-2 whitespace-nowrap text-2xl font-black uppercase leading-tight text-[#111827] md:text-2xl lg:text-3xl">
                            What Our{" "}
                            <span className="text-[#f97316]">Students</span>Say
                        </h2>
                        <p className="mt-2 whitespace-nowrap text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg">
                            Trusted by thousands of learners who got confidence,
                            skills and success with Shree Krishna Driving School.
                        </p>
                    </div>
                </div>

                {/* ── Stats bar ── */}
                <div className="mx-auto mt-4 flex max-w-2xl divide-x divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {/* Star rating */}
                    <div className="flex flex-1 items-center gap-3 px-4 py-4 sm:px-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f97316]">
                            <Star size={18} className="fill-white text-white" />
                        </div>
                        <div>
                            <p className="text-base font-black text-[#111827] sm:text-lg">4.9/5</p>
                            <p className="text-[10px] text-neutral-500 sm:text-xs">Average Rating</p>
                        </div>
                    </div>

                    {/* Happy students */}
                    <div className="flex flex-1 items-center gap-3 px-2 py-2 sm:px-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f97316]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <div>
                            <p className="text-base font-black text-[#111827] sm:text-lg">5000+</p>
                            <p className="text-[10px] text-neutral-500 sm:text-xs">Happy Students</p>
                        </div>
                    </div>

                    {/* Google rating */}
                    <div className="flex flex-1 items-center gap-3 px-4 py-4 sm:px-6">
                        <div className="shrink-0">
                            <GoogleLogo size={36} />
                        </div>
                        <div>
                            <p className="text-base font-black text-[#111827] sm:text-lg">4.9/5</p>
                            <p className="text-[10px] text-neutral-500 sm:text-xs">Google Reviews</p>
                        </div>
                    </div>
                </div>

                {/* ── Review Cards ── */}
                <div className="mt-4">
                    {/* Desktop: 3 cards */}
                    <div className="hidden gap-5 lg:grid lg:grid-cols-3">
                        {visibleReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>

                    {/* Mobile/tablet: 1 card */}
                    <div className="lg:hidden">
                        <ReviewCard review={mobileReview} />
                    </div>
                </div>

                {/* ── Carousel Controls ── */}
                <div className="mt-4 flex items-center justify-center gap-4">
                    {/* Prev */}
                    <button
                        onClick={prev}
                        disabled={current === 0}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 shadow-sm transition-all hover:border-[#f97316] hover:text-[#f97316] disabled:opacity-40"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {Array.from({ length: total - VISIBLE + 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${i === current
                                    ? "w-6 bg-[#f97316]"
                                    : "w-2 bg-neutral-300 hover:bg-[#f97316]/50"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Next */}
                    <button
                        onClick={next}
                        disabled={current >= maxIndex}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 shadow-sm transition-all hover:border-[#f97316] hover:text-[#f97316] disabled:opacity-40"
                        aria-label="Next"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* ── CTA Banner ── */}
                <div className="relative mt-4 overflow-hidden rounded-2xl bg-[#f97316] px-6 py-7 sm:px-10">
                    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">

                        {/* Left: icon + text */}
                        <div className="flex items-center gap-4">
                            <div className="shrink-0 text-white">
                                <SteeringWheelIcon size={40} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white sm:text-xl">
                                    Ready to start your driving journey?
                                </p>
                                <p className="mt-0.5 text-sm text-white/80">
                                    Join thousands of successful students and drive with confidence.
                                </p>
                            </div>
                        </div>

                        {/* Right: button */}
                        <Link
                            href="/admission"
                            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-[#f97316] shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Enroll Today
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f97316]">
                                <ArrowRight size={13} className="text-white" />
                            </span>
                        </Link>
                    </div>

                 
                </div>

            </div>
        </section>
    );
}

/* ─── Review Card ─────────────────────────────────────── */
function ReviewCard({ review }: { review: typeof reviews[0] }) {
    return (
        <div className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">

            {/* Top: quote + stars */}
            <div className="flex items-start justify-between">
                <span className="text-4xl font-black leading-none text-[#f97316]">&ldquo;</span>
                <Stars count={review.rating} />
            </div>

            {/* Review text */}
            <p className="mt-3 flex-1 text-sm leading-7 text-neutral-600">
                {review.text}
            </p>

            {/* Divider */}
            <div className="my-4 h-px bg-neutral-100" />

            {/* Footer: avatar + name + google badge */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials={review.initials} />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#111827]">{review.name}</p>
                        <p className="text-xs text-neutral-400">{review.role}</p>
                        <div className="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-400">
                            <MapPin size={10} className="text-[#f97316]" />
                            {review.location}
                        </div>
                    </div>
                </div>

                {/* Google badge */}
                <div className="shrink-0 flex flex-col items-center gap-0.5">
                    <GoogleLogo size={26} />
                    <span className="text-[9px] font-semibold text-neutral-400 leading-tight text-center">
                        Google<br />Review
                    </span>
                </div>
            </div>
        </div>
    );
}
