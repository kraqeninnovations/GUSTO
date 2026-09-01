"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Shuffle from "../../components/Shuffle";
import contactData from "../../content/contact.json";

// Dynamically import 3D Scene to ensure 60 FPS performance and SSR safety
const Contact3DScene = dynamic(() => import("../../components/Contact3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-zinc-950/40 rounded-3xl border border-zinc-900">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function ContactPage() {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  // Mouse Parallax for Desktop
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 1024) {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 30;
        const y = (e.clientY / innerHeight - 0.5) * 30;
        setMousePos({ x, y });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP Entrance Animation
  useEffect(() => {
    if (heroRef.current && !shouldReduceMotion) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [shouldReduceMotion]);

  // Form Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black border-b border-zinc-900 overflow-hidden">
        {/* Ambient Red Glow Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div ref={heroRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-red-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {contactData.hero.badge}
          </div>

          <span className="text-zinc-500 font-bold text-xs sm:text-sm tracking-[0.3em] uppercase block">
            {contactData.hero.sectionLabel}
          </span>

          <Shuffle
            text={contactData.hero.title}
            tag="h1"
            className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white"
            textAlign="center"
            duration={0.4}
          />

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed pt-2">
            {contactData.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Main Interactive Contact Section */}
      <section className="py-12 sm:py-20 bg-black relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: 3D Experience & Direct Contact Cards */}
            <motion.div
              style={{
                x: mousePos.x * 0.5,
                y: mousePos.y * 0.5,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* 3D Render Panel */}
              <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[460px] rounded-3xl overflow-hidden bg-neutral-100 border border-zinc-700/60 shadow-2xl shadow-red-950/20">
                <Contact3DScene />
                <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
                      OFFICIAL HQ • CHENNAI
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">3D REALTIME</span>
                </div>
              </div>

              {/* Direct Contact Cards */}
              <div className="space-y-4">
                <h3
                  className="text-white text-base sm:text-lg font-medium uppercase tracking-[0.2em]"
                  style={{ fontFamily: "'Royal Tomato', sans-serif" }}
                >
                  {contactData.info.sectionTitle}
                </h3>

                {/* Email */}
                <div className="p-5 sm:p-6 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-red-500/50 transition-all duration-300 group">
                  <span className="text-zinc-500 text-[10px] sm:text-xs tracking-widest font-black uppercase block">
                    {contactData.info.email.label}
                  </span>
                  <a
                    href={contactData.info.email.href}
                    className="text-white group-hover:text-red-500 font-extrabold text-sm sm:text-base mt-1 block break-all transition-colors"
                  >
                    {contactData.info.email.value}
                  </a>
                </div>

                {/* Phone */}
                <div className="p-5 sm:p-6 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-red-500/50 transition-all duration-300 group">
                  <span className="text-zinc-500 text-[10px] sm:text-xs tracking-widest font-black uppercase block">
                    {contactData.info.phone.label}
                  </span>
                  <a
                    href={contactData.info.phone.href}
                    className="text-white group-hover:text-red-500 font-extrabold text-sm sm:text-base mt-1 block transition-colors"
                  >
                    {contactData.info.phone.value}
                  </a>
                </div>

                {/* Base Location */}
                <div className="p-5 sm:p-6 bg-zinc-950 border border-zinc-900 rounded-2xl">
                  <span className="text-zinc-500 text-[10px] sm:text-xs tracking-widest font-black uppercase block">
                    {contactData.info.location.label}
                  </span>
                  <p className="text-zinc-300 font-extrabold text-sm sm:text-base mt-1">
                    {contactData.info.location.value}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Premium Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-7 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6 shadow-2xl relative"
            >
              <div className="space-y-2">
                <h2
                  className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight"
                  style={{ fontFamily: "'Royal Tomato', sans-serif" }}
                >
                  {contactData.form.title}
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm">
                  {contactData.form.subtitle}
                </p>
              </div>

              {/* Success Banner */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/40 rounded-2xl p-4 text-red-400 text-xs sm:text-sm font-medium flex items-center justify-between"
                  >
                    <span>{contactData.form.successMessage}</span>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-red-400 hover:text-white font-bold ml-2"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="relative">
                  <label
                    htmlFor="contact-name"
                    className={`block text-[10px] font-mono tracking-widest uppercase mb-1.5 transition-colors ${
                      activeField === "name" ? "text-red-500" : "text-zinc-400"
                    }`}
                  >
                    {contactData.form.fields.name} *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onFocus={() => setActiveField("name")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    placeholder="Enter your full name"
                    className={`w-full min-h-[48px] bg-zinc-900/60 border ${
                      errors.name ? "border-red-500" : activeField === "name" ? "border-red-500 ring-1 ring-red-500/50" : "border-zinc-800"
                    } rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition duration-200`}
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div className="relative">
                  <label
                    htmlFor="contact-email"
                    className={`block text-[10px] font-mono tracking-widest uppercase mb-1.5 transition-colors ${
                      activeField === "email" ? "text-red-500" : "text-zinc-400"
                    }`}
                  >
                    {contactData.form.fields.email} *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onFocus={() => setActiveField("email")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="name@example.com"
                    className={`w-full min-h-[48px] bg-zinc-900/60 border ${
                      errors.email ? "border-red-500" : activeField === "email" ? "border-red-500 ring-1 ring-red-500/50" : "border-zinc-800"
                    } rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition duration-200`}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                </div>

                {/* Subject */}
                <div className="relative">
                  <label
                    htmlFor="contact-subject"
                    className={`block text-[10px] font-mono tracking-widest uppercase mb-1.5 transition-colors ${
                      activeField === "subject" ? "text-red-500" : "text-zinc-400"
                    }`}
                  >
                    {contactData.form.fields.subject} *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onFocus={() => setActiveField("subject")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      if (errors.subject) setErrors({ ...errors, subject: "" });
                    }}
                    placeholder="Sponsorship, Media, General Inquiry"
                    className={`w-full min-h-[48px] bg-zinc-900/60 border ${
                      errors.subject ? "border-red-500" : activeField === "subject" ? "border-red-500 ring-1 ring-red-500/50" : "border-zinc-800"
                    } rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition duration-200`}
                  />
                  {errors.subject && <p className="text-red-500 text-[10px] mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div className="relative">
                  <label
                    htmlFor="contact-message"
                    className={`block text-[10px] font-mono tracking-widest uppercase mb-1.5 transition-colors ${
                      activeField === "message" ? "text-red-500" : "text-zinc-400"
                    }`}
                  >
                    {contactData.form.fields.message} *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formData.message}
                    onFocus={() => setActiveField("message")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: "" });
                    }}
                    placeholder="Tell us about your brand goals, partnership details, or press inquiry..."
                    className={`w-full bg-zinc-900/60 border ${
                      errors.message ? "border-red-500" : activeField === "message" ? "border-red-500 ring-1 ring-red-500/50" : "border-zinc-800"
                    } rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition duration-200 resize-none`}
                  />
                  {errors.message && <p className="text-red-500 text-[10px] mt-1">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[52px] py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl transition duration-300 text-xs sm:text-sm tracking-widest uppercase cursor-pointer shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      TRANSMITTING...
                    </>
                  ) : (
                    contactData.form.submitText
                  )}
                </motion.button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
