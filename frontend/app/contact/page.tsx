"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, Clock, Sparkles, ArrowRight, CheckCircle, Shield, MessageCircle, Star, Users, Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

    if (!form.name.trim() || !form.mobile.trim() || !form.message.trim()) {
      const msg = "Please fill all required fields (name, mobile, message).";
      toast.error(msg);
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      await new Promise((r) => setTimeout(r, 600));

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

      const whatsappUrl = `https://wa.me/917499279503?text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappUrl, "_blank");

      const msg = "Message sent successfully! We'll contact you soon.";
      toast.success(msg);
      setStatus("success");

      setForm({
        name: "",
        mobile: "",
        email: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send message. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      <section className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 relative">
          <div className="grid items-start gap-12 lg:gap-16 lg:grid-cols-2">
            {/* Left Column - Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-orange-500/25">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold tracking-wide">Get in Touch</span>
                </div>

  <h1 className="mt-2 text-2xl font-black uppercase leading-none md:text-2xl lg:text-3xl">
                  Let's Start Your
                  <span className="block mt-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Driving Journey
                  </span>
                </h1>
 
            <p className="mt-2 max-w-xl text-gray-700 md:text-lg">
                  Reach out to us and take the first step towards becoming a confident driver. 
                  Our expert instructors are here to guide you every mile.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Clock, label: "Flexible Hours", value: "8AM - 6PM" },
                  { icon: Users, label: "Certified", value: "Instructors" },
                  { icon: Award, label: "Success Rate", value: "98%" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 shadow-sm">
                    <stat.icon className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                    <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Contact Cards - Redesigned with better layout */}
              <div className="space-y-4">
                {/* Email Card */}
                <Card className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 shrink-0">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700">Email</p>
                        <a
                          className="text-sm text-slate-600 hover:text-orange-600 transition-colors truncate block"
                          href="mailto:shreekrishnadrivingschool03@gmail.com"
                        >
                          shreekrishnadrivingschool03@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Phone Card */}
                <Card className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 shrink-0">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700">Phone</p>
                        <div className="flex flex-wrap items-center text-sm font-medium text-slate-600">
  {[
    "+91 7499279503",
    "+91 7558457485",
    "+91 9850787810",
  ].map((number, index) => (
    <React.Fragment key={number}>
      <a
        href={`tel:${number.replace(/\D/g, "")}`}
        className="hover:text-orange-600 transition-colors"
      >
        {number}
      </a>

      {index < 2 && (
        <span className="mx-3 text-slate-300">|</span>
      )}
    </React.Fragment>
  ))}
</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Location Card */}
                <Card className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 shrink-0">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700">Location</p>
                        <p className="text-sm text-slate-600">
                          9WH9+64F, Katol Rd, near Gadkari College
                         
                          Saoner, Maharashtra 441107
                        </p>
                        <Link
                          href="https://www.google.com/maps/search/?api=1&query=9WH9%2B64F+Saoner+Maharashtra"
                          target="_blank"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors mt-1"
                        >
                          Get Directions
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* WhatsApp Quick Action */}
              <Button
                variant="outline"
                className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600 rounded-xl h-12"
                onClick={() => window.open("https://wa.me/917499279503", "_blank")}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with us on WhatsApp
              </Button>
            </div>

            {/* Right Column - Form and Map */}
            <div className="space-y-6">
              {/* Form Card */}
              <Card className="relative rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-2xl p-6 sm:p-8 lg:p-10">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Fill in the form below and we'll get back to you within 24 hours
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        Full Name <span className="text-orange-500">*</span>
                      </label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Enter your full name"
                        className="border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl h-11 transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        Mobile Number <span className="text-orange-500">*</span>
                      </label>
                      <Input
                        value={form.mobile}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, mobile: e.target.value }))
                        }
                        placeholder="Enter mobile number"
                        inputMode="tel"
                        className="border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl h-11 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <Input
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="Enter your email"
                      type="email"
                      className="border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl h-11 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                      Message <span className="text-orange-500">*</span>
                    </label>
                    <Textarea
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder="Tell us about your requirements..."
                      rows={4}
                      className="border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl resize-none transition-all"
                      required
                    />
                  </div>

                  {status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-sm font-medium text-red-600">
                        ⚠️ Please fill all required fields (name, mobile, message)
                      </p>
                    </div>
                  )}

                  {status === "success" && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <p className="text-sm font-medium text-emerald-600">
                        ✅ Message sent successfully! We'll contact you soon.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {status === "submitting" ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </span>
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Shield className="h-3 w-3" />
                    <span>Your information is safe with us</span>
                  </div>
                </form>
              </Card>

              {/* Map Card - Properly integrated */}
              <Card className="overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
                <div className="p-4 pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold text-slate-900">Find Us Here</h3>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="rounded-xl overflow-hidden shadow-inner">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3715.3008908563756!2d78.9177988!3d21.378054000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4e41a80c3d725%3A0xe8c16f2982393b76!2sShri%20krushna%20driving%20school!5e0!3m2!1sen!2sin!4v1783432000225!5m2!1sen!2sin"
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="w-full"
                      title="Shree Krishna Driving School Location"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <Link
                      href="https://www.google.com/maps/search/?api=1&query=9WH9%2B64F+Saoner+Maharashtra"
                      target="_blank"
                      className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      <MapPin className="h-4 w-4" />
                      Open in Google Maps
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}