"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import Shuffle from "../../components/Shuffle";
import Image from "next/image";
import { motion, useReducedMotion, useInView } from "framer-motion";
import HoverImageReveal from "../../components/HoverImageReveal";
import Footer from "../../components/Footer";
import aboutData from "../../content/about.json";

interface GalleryItem {
  image: string;
  text: string;
}

interface ProgrammeItem {
  title: string;
  subtitle: string;
}

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

// High-performance count-up stat counter
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      if (start === end) return;

      const duration = 2; // seconds
      const totalMiliseconds = duration * 1000;
      const stepTime = Math.abs(Math.floor(totalMiliseconds / end));

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, Math.max(stepTime, 16));

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-black text-5xl sm:text-7xl text-white tracking-tighter block">
      {count}
      {suffix}
    </span>
  );
}

// 3D Parallax/Tilt Image Frame
function TiltImage({ src, alt }: { src: string; alt: string }) {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;

    // Tilt angle up to 10 degrees
    const rotateY = xc * 12;
    const rotateX = -yc * 12;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-out",
    });
  };

  return (
    <div className="relative w-full group">
      {/* Dynamic ambient backglow */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 opacity-20 blur-xl group-hover:opacity-30 transition duration-500 pointer-events-none" />

      <div
        className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 aspect-[4/3] w-full cursor-grab active:cursor-grabbing select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle grid pattern overlay for racing vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

// 3D floating animation wrapper for hero scene
function FloatingDecorations() {
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {mounted && !shouldReduceMotion && (
        <>
          {/* Parallax ambient red glow */}
          <div
            className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]"
            style={{ transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)` }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/5 rounded-full blur-[120px]"
            style={{ transform: `translate3d(${-mousePos.x * 0.8}px, ${-mousePos.y * 0.8}px, 0)` }}
          />

          {/* Floating 3D-like carbon rings */}
          <div
            className="absolute top-[15%] right-[10%] w-72 h-72 rounded-full border border-red-500/10 border-t-red-500/30 animate-[spin_40s_linear_infinite]"
            style={{ transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0) rotateX(45deg)` }}
          />
          <div
            className="absolute bottom-[20%] left-[5%] w-60 h-60 rounded-full border border-zinc-800 border-b-zinc-700/50 animate-[spin_25s_linear_infinite]"
            style={{ transform: `translate3d(${-mousePos.x * 0.4}px, ${-mousePos.y * 0.4}px, 0) rotateY(30deg)` }}
          />
        </>
      )}
    </div>
  );
}

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();

  // Scroll animations variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 80, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Header />

      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-zinc-950 via-zinc-950 to-black py-20 lg:py-28 overflow-hidden border-b border-zinc-900">
        <FloatingDecorations />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Interactive Helmet Image */}
          <motion.div
            className="lg:col-span-5 relative flex justify-center items-center order-2 lg:order-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] aspect-square flex items-center justify-center">
                {/* Neon Red Target Circle backdrop */}
                <div className="absolute inset-0 rounded-full border border-red-500/10 scale-95" />
                <div className="absolute inset-4 rounded-full border border-dashed border-red-500/5 scale-90 animate-[spin_50s_linear_infinite]" />

                {/* 3D Floating/Swinging Helmet Image */}
                <motion.div
                  className="relative w-full h-full z-10 cursor-grab active:cursor-grabbing"
                  animate={shouldReduceMotion ? {} : {
                    y: [0, -12, 0],
                    rotateY: [-5, 5, -5]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src="/joh.png"
                    alt="Johann Emmanuel 3D Helmet"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain drop-shadow-[0_20px_50px_rgba(220,38,38,0.25)] select-none pointer-events-none"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Right Content Column */}
            <motion.div
              className="lg:col-span-7 space-y-4 sm:space-y-6 md:space-y-8 order-1 lg:order-2"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              suppressHydrationWarning
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {aboutData.hero.badge}
              </div>

              <div className="space-y-3">
                <span className="text-zinc-500 font-extrabold text-sm sm:text-base tracking-[0.25em] uppercase block">{aboutData.hero.eyebrow}</span>
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-none">
                  {aboutData.hero.title.line1} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                    {aboutData.hero.title.line2}
                  </span>
                </h1>
              </div>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
                {aboutData.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
                <a
                  href={aboutData.hero.ctaPrimary.href}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-red-600/25 text-center text-[10px] sm:text-xs tracking-widest uppercase cursor-pointer"
                >
                  {aboutData.hero.ctaPrimary.text}
                </a>
                <a
                  href={aboutData.hero.ctaSecondary.href}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-extrabold rounded-xl transition duration-300 transform hover:scale-105 active:scale-95 border border-zinc-800 text-center text-[10px] sm:text-xs tracking-widest uppercase cursor-pointer"
                >
                  {aboutData.hero.ctaSecondary.text}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Profile Section */}
      <section id="profile" className="py-20 sm:py-28 bg-zinc-950 border-b border-zinc-900 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="space-y-3">
                <span className="text-red-500 text-xs sm:text-sm tracking-[0.3em] font-extrabold uppercase block">{aboutData.profile.sectionLabel}</span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                  <Shuffle text={aboutData.profile.sectionTitle.line1} tag="span" className="block text-white" textAlign="left" duration={0.4} />
                  <Shuffle text={aboutData.profile.sectionTitle.line2} tag="span" className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400" textAlign="left" duration={0.4} />
                </h2>
              </div>

              <div className="space-y-4 text-zinc-400 leading-relaxed text-sm sm:text-base">
                {aboutData.profile.paragraphs.map((paragraph: string, idx: number) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>

              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-6">
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-black block">{aboutData.profile.quickDetails.hometown.label}</span>
                  <span className="text-white font-extrabold text-sm sm:text-base uppercase mt-1 block">{aboutData.profile.quickDetails.hometown.value}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-black block">{aboutData.profile.quickDetails.age.label}</span>
                  <span className="text-white font-extrabold text-sm sm:text-base uppercase mt-1 block">{aboutData.profile.quickDetails.age.value}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <TiltImage src="/save.jpg" alt="Johann Emmanuel Portrait" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Career Overview Section */}
      <section className="py-20 sm:py-28 bg-black border-b border-zinc-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column - Image */}
            <div className="lg:col-span-5 order-1">
              <TiltImage src="/IMG_8541.JPG" alt="Johann Emmanuel Action Racetrack" />
            </div>

            {/* Right Column - Text */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 order-2">
              <div className="space-y-3">
                <span className="text-red-500 text-xs sm:text-sm tracking-[0.3em] font-extrabold uppercase block">{aboutData.careerOverview.sectionLabel}</span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                  <Shuffle text={aboutData.careerOverview.sectionTitle.line1} tag="span" className="block text-white" textAlign="left" duration={0.4} />
                  <Shuffle text={aboutData.careerOverview.sectionTitle.line2} tag="span" className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400" textAlign="left" duration={0.4} />
                </h2>
              </div>

              <div className="space-y-4 text-zinc-400 leading-relaxed text-sm sm:text-base">
                {aboutData.careerOverview.paragraphs.map((paragraph: string, idx: number) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* 4. Achievements Section */}
      {/* 4. Achievements Section */}
      <section className="py-20 sm:py-28 bg-zinc-950 border-b border-zinc-900 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 space-y-2">
            <span className="text-red-500 text-xs tracking-[0.3em] font-bold uppercase">
              {aboutData.achievements.sectionLabel}
            </span>

            <Shuffle
              text={aboutData.achievements.sectionTitle}
              tag="h2"
              className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight"
              textAlign="center"
              duration={0.4}
            />
          </div>

          <HoverImageReveal items={aboutData.achievements.galleryItems} />
        </div>
      </section>

      {/* 6. 2026 Racing Programme */}
      <section className="py-20 sm:py-28 bg-zinc-950 border-b border-zinc-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left text column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-red-500 text-xs sm:text-sm tracking-[0.3em] font-extrabold uppercase block">{aboutData.programme2026.sectionLabel}</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                <Shuffle text={aboutData.programme2026.sectionTitle.line1} tag="span" className="block text-white" textAlign="left" duration={0.4} />
                <Shuffle text={aboutData.programme2026.sectionTitle.line2} tag="span" className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400" textAlign="left" duration={0.4} />
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {aboutData.programme2026.paragraph}
              </p>
              <div className="border-t border-zinc-900 pt-6">
                <span className="text-xs text-zinc-500 tracking-wider font-extrabold uppercase">{aboutData.programme2026.longTermTarget.label}</span>
                <span className="text-white font-black text-lg block mt-1 uppercase">{aboutData.programme2026.longTermTarget.value}</span>
              </div>
            </div>

            {/* Right lists column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aboutData.programme2026.programs.map((prog: ProgrammeItem, idx: number) => (
                <div key={idx} className="border border-zinc-900 bg-zinc-900/10 p-6 rounded-2xl flex flex-col justify-center">
                  <h3 className="text-lg font-black text-white tracking-tight uppercase">{prog.title}</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1">{prog.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Media Coverage & Viewership */}
      <section className="py-24 sm:py-32 bg-black border-b border-zinc-900 relative overflow-hidden">
        {/* Decorative Grid Lines backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-red-500 text-xs sm:text-sm tracking-[0.3em] font-extrabold uppercase block">{aboutData.mediaCoverage.sectionLabel}</span>
            <Shuffle
              text={aboutData.mediaCoverage.sectionTitle}
              tag="h2"
              className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight"
              textAlign="center"
              duration={0.4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutData.mediaCoverage.stats.map((stat: StatItem, idx: number) => (
              <div key={idx} className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-8 hover:border-zinc-800 transition-colors">
                <Counter value={stat.value} suffix={stat.suffix} />
                <span className="text-zinc-500 text-xs sm:text-sm font-extrabold uppercase tracking-widest block mt-3">{stat.label}</span>
              </div>
            ))}
          </div>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed pt-4">
            {aboutData.mediaCoverage.paragraph}
          </p>
        </div>
      </section>



      {/* 12. Get In Touch */}
      <section id="contact" className="py-24 sm:py-32 bg-zinc-950 relative overflow-hidden">
        {/* Glow corner backgrounds */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center mb-12 space-y-2">
            <span className="text-red-500 text-xs sm:text-sm tracking-[0.3em] font-extrabold uppercase block">{aboutData.contact.sectionLabel}</span>
            <Shuffle
              text={aboutData.contact.sectionTitle}
              tag="h2"
              className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none"
              textAlign="center"
              duration={0.4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Contact Details Column */}
            <div className="md:col-span-5 space-y-4 sm:space-y-6">
              <div className="p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
                <span className="text-zinc-500 text-[10px] tracking-widest font-black uppercase block">{aboutData.contact.details.email.label}</span>
                <a href={aboutData.contact.details.email.href} className="text-white hover:text-red-500 font-extrabold text-sm sm:text-base mt-1 block break-all">
                  {aboutData.contact.details.email.value}
                </a>
              </div>

              <div className="p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
                <span className="text-zinc-500 text-[10px] tracking-widest font-black uppercase block">{aboutData.contact.details.phone.label}</span>
                <a href={aboutData.contact.details.phone.href} className="text-white hover:text-red-500 font-extrabold text-sm sm:text-base mt-1 block">
                  {aboutData.contact.details.phone.value}
                </a>
              </div>

              <div className="p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
                <span className="text-zinc-500 text-[10px] tracking-widest font-black uppercase block">{aboutData.contact.details.instagram.label}</span>
                <a href={aboutData.contact.details.instagram.href} target="_blank" rel="noreferrer" className="text-white hover:text-red-500 font-extrabold text-sm sm:text-base mt-1 block">
                  {aboutData.contact.details.instagram.value}
                </a>
              </div>
            </div>

            {/* Simple Contact Form Column */}
            <div className="md:col-span-7 bg-zinc-900/20 border border-zinc-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
              <div>
                <label className="text-[10px] text-zinc-500 font-extrabold tracking-wider uppercase block mb-1">{aboutData.contact.form.companyLabel}</label>
                <input
                  type="text"
                  placeholder={aboutData.contact.form.companyPlaceholder}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-red-500 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder-zinc-700 outline-none transition"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-extrabold tracking-wider uppercase block mb-1">{aboutData.contact.form.contactLabel}</label>
                <input
                  type="text"
                  placeholder={aboutData.contact.form.contactPlaceholder}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-red-500 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder-zinc-700 outline-none transition"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-extrabold tracking-wider uppercase block mb-1">{aboutData.contact.form.messageLabel}</label>
                <textarea
                  rows={4}
                  placeholder={aboutData.contact.form.messagePlaceholder}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-red-500 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder-zinc-700 outline-none transition resize-none"
                  suppressHydrationWarning
                />
              </div>

              <button
                type="button"
                onClick={() => alert(aboutData.contact.form.successMessage)}
                className="w-full py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition duration-300 text-[10px] sm:text-xs tracking-widest uppercase cursor-pointer"
              >
                {aboutData.contact.form.submitText}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}