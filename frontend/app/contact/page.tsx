"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  const [form, setForm] = React.useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

 async function onSubmit(e: React.FormEvent) {
  e.preventDefault();

  // Basic front-end validation
  if (!form.name.trim() || !form.mobile.trim() || !form.message.trim()) {
    setStatus("error");
    return;
  }

  setStatus("submitting");

  try {
    await new Promise((r) => setTimeout(r, 600));

    // WhatsApp Message
    const message = `
*🚗 SHREE KRISHNA DRIVING SCHOOL*

*NEW CONTACT ENQUIRY*

👤 Name:
${form.name}

📞 Mobile:
${form.mobile}

📧 Email:
${form.email || "Not Provided"}

💬 Message:
${form.message}

------------------------------
Submitted from the website.
`;

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/917499279503?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");

    setStatus("success");

    // Clear Form
    setForm({
      name: "",
      mobile: "",
      email: "",
      message: "",
    });
  } catch {
    setStatus("error");
  }
}

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-[#b45309]">
                <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                Contact Us
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                Get in touch with Shree Krishna Driving School
              </h1>

              <p className="mt-4 text-base leading-7 text-neutral-600">
                Share your details and we’ll get back to you as soon as
                possible. You can also reach us directly via phone or email.
              </p>

              <div className="mt-8 grid gap-4">
                <Card className="rounded-2xl border border-neutral-200 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f97316]/15">
                      <Mail className="h-5 w-5 text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0f172a]">Email</p>
                      <a
                        className="mt-1 block text-sm text-neutral-600 hover:text-[#f97316]"
                        href="mailto:shreekrishnadrivingschool03@gmail.com"
                      >
                        shreekrishnadrivingschool03@gmail.com
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-2xl border border-neutral-200 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f97316]/15">
                      <Phone className="h-5 w-5 text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0f172a]">Phone</p>
                      <div className="mt-1 space-y-1 text-sm text-neutral-600">
                        <a
                          href="tel:7499279503"
                          className="block hover:text-[#f97316]"
                        >
                          +91 7499279503
                        </a>
                        <a
                          href="tel:7558457485"
                          className="block hover:text-[#f97316]"
                        >
                          +91 7558457485
                        </a>
                        <a
                          href="tel:9850787810"
                          className="block hover:text-[#f97316]"
                        >
                          +91 9850787810
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-2xl border border-neutral-200 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f97316]/15">
                      <MapPin className="h-5 w-5 text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0f172a]">Address</p>
                      <p className="mt-1 text-sm leading-6 text-neutral-600">
                        9WH9+64F, Katol Rd, near Gadkari College,
                        <br />
                        Saoner, Maharashtra 441107
                      </p>

                      <div className="mt-3">
                        <Link
                          href="https://www.google.com/maps/search/?api=1&query=Saoner%2C%20Maharashtra%20441107"
                          target="_blank"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#f97316] hover:text-[#e68900]"
                        >
                          Open in Google Maps
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <Card className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-[#0f172a]">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  We’ll respond quickly. Fill in the form below.
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-700">
                        Full Name
                      </label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-700">
                        Mobile Number
                      </label>
                      <Input
                        value={form.mobile}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, mobile: e.target.value }))
                        }
                        placeholder="e.g. 9876543210"
                        inputMode="tel"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">
                      Email (optional)
                    </label>
                    <Input
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">
                      Message
                    </label>
                    <Textarea
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder="Tell us about your requirement..."
                      rows={5}
                      required
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm font-semibold text-red-600">
                      Please fill required fields (name, mobile, message).
                    </p>
                  )}

                  {status === "success" && (
                    <p className="text-sm font-semibold text-emerald-600">
                      Message sent successfully. We’ll contact you soon.
                    </p>
                  )}

                  <Button
  type="submit"
  disabled={status === "submitting"}
  className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-base font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
>
  <span className="flex items-center justify-center gap-2">
    <Send className="h-5 w-5" />
    {status === "submitting" ? "Sending..." : "Submit"}
  </span>
</Button>

                  <p className="text-xs leading-5 text-neutral-500">
                    By submitting, you agree to be contacted by our team.
                  </p>
                </form>
              </Card>

              <div className="mt-6 hidden lg:block">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3715.3008908563756!2d78.9177988!3d21.378054000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4e41a80c3d725%3A0xe8c16f2982393b76!2sShri%20krushna%20driving%20school!5e0!3m2!1sen!2sin!4v1783432000225!5m2!1sen!2sin"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

