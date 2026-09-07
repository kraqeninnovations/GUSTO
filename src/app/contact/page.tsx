"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { Mail, Phone, MessageSquare, MapPin, ArrowUpRight } from "lucide-react";
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

  // Mouse Parallax for Desktop
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 1024) {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 20;
        const y = (e.clientY / innerHeight - 0.5) * 20;
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
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [shouldReduceMotion]);

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

      {/* Main Direct Contact Section */}
      <section className="py-12 sm:py-20 bg-black relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT SIDE — 3D VISUAL & DIRECT CONTACTS */}
            <motion.div
              style={{
                x: mousePos.x * 0.5,
                y: mousePos.y * 0.5,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* 3D Render Panel */}
              <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[480px] rounded-3xl overflow-hidden bg-neutral-100 border border-zinc-700/60 shadow-2xl shadow-red-950/20">
                <Contact3DScene />
              </div>

              {/* Direct Contacts Heading */}
              <div className="pt-2">
                <h3
                  className="text-white text-lg sm:text-xl font-bold uppercase tracking-[0.2em]"
                  style={{ fontFamily: "'Royal Tomato', sans-serif" }}
                >
                  DIRECT CONTACTS
                </h3>
                <p className="text-zinc-500 text-xs mt-1 font-mono tracking-wider">
                  Connect with the team via direct communication channels.
                </p>
              </div>
            </motion.div>

            {/* RIGHT SIDE — CONTACT INFORMATION (NO FORM, NO SUBMIT BUTTON) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-7 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6 shadow-2xl relative"
            >
              {/* Category 1: PARTNERSHIP & MEDIA INQUIRIES */}
              <div className="p-6 sm:p-8 bg-zinc-900/50 border border-zinc-800/90 rounded-2xl hover:border-red-500/50 transition-all duration-300 group space-y-3">
                <div className="flex items-center gap-2.5 text-red-500 mb-3">
                  <Mail className="w-5 h-5" />
                  <span className="text-xs sm:text-sm tracking-widest font-black uppercase text-zinc-400">
                    PARTNERSHIP & MEDIA INQUIRIES
                  </span>
                </div>
                <a
                  href="mailto:gustoracingofficial@gmail.com"
                  className="text-white hover:text-red-400 font-extrabold text-base sm:text-lg md:text-xl block break-all transition-colors inline-flex items-center gap-2"
                >
                  gustoracingofficial@gmail.com
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-red-500" />
                </a>
                <a
                  href="mailto:gustoracingindia@yahoo.com"
                  className="text-white hover:text-red-400 font-extrabold text-base sm:text-lg md:text-xl block break-all transition-colors inline-flex items-center gap-2"
                >
                  gustoracingindia@yahoo.com
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-red-500" />
                </a>
              </div>

              {/* Category 2: PHONE & WHATSAPP */}
              <div className="p-6 sm:p-8 bg-zinc-900/50 border border-zinc-800/90 rounded-2xl hover:border-red-500/50 transition-all duration-300 group">
                <div className="flex items-center gap-2.5 text-red-500 mb-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-xs sm:text-sm tracking-widest font-black uppercase text-zinc-400">
                    PHONE & WHATSAPP
                  </span>
                </div>
                
                <a
                  href="tel:+919884618876"
                  className="text-white group-hover:text-red-400 font-extrabold text-xl sm:text-2xl md:text-3xl block transition-colors inline-flex items-center gap-2"
                >
                  +91 98846 18876
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-red-500" />
                </a>

                <div className="mt-4 pt-4 border-t border-zinc-800/80">
                  <a
                    href="https://wa.me/919884618876"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Open WhatsApp Chat
                  </a>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


