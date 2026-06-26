"use client";

import Image from "next/image";

const instructors = [
  {
    name: "Rahul Sharma",
    role: "Chief Instructor",
    exp: "15+ Years Exp.",
  },
  {
    name: "Suresh Patil",
    role: "Senior Instructor",
    exp: "10+ Years Exp.",
  },
  {
    name: "Neha Deshmukh",
    role: "Instructor",
    exp: "7+ Years Exp.",
  },
  {
    name: "Vikram Singh",
    role: "Instructor",
    exp: "8+ Years Exp.",
  },
];

export default function AboutInstructors() {
  return (
    <section className="pb-20">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <span className="text-[#f59e0b] font-semibold uppercase">
            Meet Our Instructors
          </span>

          <h2 className="mt-4 text-5xl font-bold">
            Expert Instructors,
            Better Learning
          </h2>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {instructors.map((item) => (
            <div
              key={item.name}
              className="bg-white border rounded-3xl overflow-hidden shadow-sm"
            >
              <Image
                src="/instructor.jpg"
                alt={item.name}
                width={500}
                height={500}
                className="w-full h-72 object-cover"
              />

              <div className="p-6 text-center">

                <h3 className="font-bold text-xl">
                  {item.name}
                </h3>

                <p className="text-gray-500 mt-2">
                  {item.role}
                </p>

                <div className="inline-flex mt-4 px-4 py-2 rounded-full bg-[#f59e0b] text-white text-sm font-medium">
                  {item.exp}
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}