"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Shuffle from "../components/Shuffle";
import SeasonSchedule from "../components/SeasonSchedule";
import RippleDisplacementSlider from "../components/RippleDisplacementSlider";
import TiltedCover from "../components/TiltedCover";
import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import homeData from "../content/home.json";

interface Champion {
  year: string;
  title: string;
  image: string;
}

interface AchievementStat {
  value: string;
  label: string;
}

interface AchievementsStats {
  sectionLabel: string;
  sectionTitle: string;
  sectionSubtitle: string;
  backgroundImage?: string;
  stats: AchievementStat[];
}

const champions = homeData.champions.items as Champion[];
const scheduleRounds = homeData.seasonSchedule.rounds;
const achievementsStats = homeData.achievementsStats as AchievementsStats;

type Particle = {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  opacity: number;
  randomX: number;
};

export default function Home() {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const preferredMotion = useReducedMotion();
  const shouldReduceMotion = preferredMotion ?? false;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = champions.length - visibleCards;

  const handlePrev = () => {
    setSliderIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setSliderIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  useEffect(() => {
    particlesRef.current = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      duration: Math.random() * 10 + 8,
      opacity: Math.random() * 0.35 + 0.1,
      randomX: Math.random() * 60 - 30,
    }));
    setParticles(particlesRef.current);
  }, []);

  const handlePageMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / (typeof window !== "undefined" ? window.innerWidth : 1920)) - 0.5;
    const y = (e.clientY / (typeof window !== "undefined" ? window.innerHeight : 1080)) - 0.5;
    setMousePos({ x, y });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 14,
      },
    },
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;
    const rotateY = xc * 16;
    const rotateX = -yc * 16;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease-out",
    });

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 80%)`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
    });
    setGlareStyle({
      opacity: 0,
      transition: "opacity 0.5s ease",
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden relative"
      onMouseMove={handlePageMouseMove}
    >
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-zinc-950 to-black flex items-center pt-24 pb-16 overflow-hidden">
        {/* Radial ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none z-0" />

        {/* Ambient moving glow lights */}
        <div
          className="absolute top-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none z-0"
          style={{
            transform: `translate3d(${mousePos.x * 60}px, ${mousePos.y * 60}px, 0)`,
            transition: "transform 0.2s ease-out",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none z-0"
          style={{
            transform: `translate3d(${mousePos.x * -60}px, ${mousePos.y * -60}px, 0)`,
            transition: "transform 0.2s ease-out",
          }}
        />


        {/* Particle System */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white/30"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
              }}
              animate={shouldReduceMotion ? {} : {
                y: [0, -180],
                x: [0, p.randomX],
                opacity: [0, p.opacity, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* 3D Floating Glass Shapes */}
        {/* Spinning 3D Cube */}
        <div className="absolute top-1/4 right-[12%] w-32 h-32 pointer-events-none z-0 hidden lg:block" style={{ perspective: 1000 }}>
          <motion.div
            className="w-full h-full relative"
            style={{
              transformStyle: "preserve-3d",
              rotateX: shouldReduceMotion ? 0 : mousePos.y * -45,
              rotateY: shouldReduceMotion ? 0 : mousePos.x * 45,
            }}
            animate={shouldReduceMotion ? {} : {
              rotateX: [0, 360],
              rotateY: [360, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Cube Faces */}
            <div className="absolute w-32 h-32 border border-red-500/10 bg-red-950/5 backdrop-blur-[2px] rounded-lg" style={{ transform: "rotateY(0deg) translateZ(64px)" }} />
            <div className="absolute w-32 h-32 border border-red-500/10 bg-red-950/5 backdrop-blur-[2px] rounded-lg" style={{ transform: "rotateY(180deg) translateZ(64px)" }} />
            <div className="absolute w-32 h-32 border border-red-500/10 bg-red-950/5 backdrop-blur-[2px] rounded-lg" style={{ transform: "rotateY(90deg) translateZ(64px)" }} />
            <div className="absolute w-32 h-32 border border-red-500/10 bg-red-950/5 backdrop-blur-[2px] rounded-lg" style={{ transform: "rotateY(-90deg) translateZ(64px)" }} />
            <div className="absolute w-32 h-32 border border-red-500/10 bg-red-950/5 backdrop-blur-[2px] rounded-lg" style={{ transform: "rotateX(90deg) translateZ(64px)" }} />
            <div className="absolute w-32 h-32 border border-red-500/10 bg-red-950/5 backdrop-blur-[2px] rounded-lg" style={{ transform: "rotateX(-90deg) translateZ(64px)" }} />
          </motion.div>
        </div>

        {/* Floating Glass Ring */}
        <motion.div
          className="absolute top-[20%] left-[8%] w-48 h-48 rounded-full border border-orange-500/10 bg-gradient-to-br from-orange-500/5 to-transparent backdrop-blur-[2px] pointer-events-none z-0 hidden md:block"
          style={{
            x: shouldReduceMotion ? 0 : mousePos.x * -40,
            y: shouldReduceMotion ? 0 : mousePos.y * -40,
          }}
          animate={shouldReduceMotion ? {} : {
            y: [0, -15, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 32, repeat: Infinity, ease: "linear" }
          }}
        />

        {/* Floating Glass Plate */}
        <motion.div
          className="absolute bottom-[18%] left-[4%] w-40 h-56 rounded-2xl border border-zinc-800/40 bg-zinc-950/10 backdrop-blur-md pointer-events-none z-0 hidden lg:block"
          style={{
            rotateX: shouldReduceMotion ? 0 : mousePos.y * 25,
            rotateY: shouldReduceMotion ? 0 : mousePos.x * -25,
            x: shouldReduceMotion ? 0 : mousePos.x * -25,
            y: shouldReduceMotion ? 0 : mousePos.y * -25,
          }}
          animate={shouldReduceMotion ? {} : {
            y: [0, 12, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left Content Column */}
            <motion.div
              className="lg:col-span-7 space-y-4 sm:space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.p
                variants={itemVariants}
                className="text-red-500 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold"
              >
                {homeData.hero.eyebrow}
              </motion.p>

              <motion.h2
                variants={itemVariants}
                className="font-gasdrifo text-[44px] sm:text-[56px] md:text-[70px] lg:text-[85px] leading-[0.85] tracking-[-0.02em] font-black text-white uppercase"
                style={{ fontFamily: "'RicoPalm', var(--font-geist-sans), sans-serif" }}
              >
                <span className="block">{homeData.hero.title.line1}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                  {homeData.hero.title.line2}
                </span>
               </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-lg text-zinc-400 max-w-2xl leading-relaxed"
              >
                {homeData.hero.subtitle}
              </motion.p>

              {/* Highlight strip */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-3 sm:gap-4 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-red-500 border-t border-zinc-900 pt-4 sm:pt-6"
              >
                
              </motion.div>

              {/* Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4"
              >
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link href={homeData.hero.ctaPrimary.href} className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition transform hover:scale-105 text-center shadow-lg shadow-red-600/25 cursor-pointer block text-[10px] sm:text-xs tracking-widest uppercase">
                    {homeData.hero.ctaPrimary.text}
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link href={homeData.hero.ctaSecondary.href} className="px-6 sm:px-8 py-3 sm:py-4 border border-zinc-800 hover:border-white text-white font-bold rounded-xl bg-zinc-950/50 hover:bg-white hover:text-black transition transform hover:scale-105 text-center cursor-pointer block text-[10px] sm:text-xs tracking-widest uppercase">
                    {homeData.hero.ctaSecondary.text}
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Image Column */}
            <div
              className="lg:col-span-5 relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={tiltStyle}
            >
              {/* Outer glow overlay */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 opacity-25 blur-lg transition duration-500" />

              <div className="relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 aspect-square sm:aspect-[4/3] shadow-2xl select-none">
                <Image
                  src="/hero-racer.jpg"
                  alt="Asia Road Racing Championship Winner celebrating victory"
                  width={600}
                  height={450}
                  priority
                  className="w-full h-full object-cover"
                />

                {/* 3D Glare effect overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-20 mix-blend-screen transition-opacity duration-300"
                  style={glareStyle}
                />

                {/* Subtle border shine effect */}
                <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Champions Section - Ripple Displacement Slider */}
      <RippleDisplacementSlider
        sectionLabel={homeData.champions.sectionLabel}
        sectionTitle={homeData.champions.sectionTitle}
        subTitle={homeData.champions.subTitle}
        items={homeData.champions.items}
      />



      {/* Section 3: Bottom Navigation Hero Section (Experience the Racing Legacy) */}
      <section
        className="relative py-12 sm:py-16 lg:py-20 bg-cover bg-center border-t border-zinc-900 overflow-hidden m-0"
        style={{ backgroundImage: `url('${homeData.bottomHero.backgroundImage || "/IMG_8541.JPG"}')` }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80 z-0" />

        {/* Ambient colored glows */}
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center">
          <span className="text-red-500 text-[10px] sm:text-xs md:text-sm tracking-[0.3em] font-extrabold uppercase drop-shadow-md">
            {homeData.bottomHero.sectionLabel}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mt-3 sm:mt-4 tracking-tighter uppercase drop-shadow-lg leading-none">
            <Shuffle text={homeData.bottomHero.sectionTitle.line1} tag="span" className="block text-white" textAlign="center" duration={0.4} />
            <Shuffle text={homeData.bottomHero.sectionTitle.line2} tag="span" className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400" textAlign="center" duration={0.4} />
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base mt-4 sm:mt-6 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {homeData.bottomHero.paragraph}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <a
                href={homeData.bottomHero.ctaPrimary.href}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20 text-center block text-[10px] sm:text-xs tracking-widest uppercase"
              >
                {homeData.bottomHero.ctaPrimary.text}
              </a>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <a
                href={homeData.bottomHero.ctaSecondary.href}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold rounded-xl transition duration-300 transform hover:scale-105 active:scale-95 border border-zinc-800 text-center block text-[10px] sm:text-xs tracking-widest uppercase"
              >
                {homeData.bottomHero.ctaSecondary.text}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 sm:py-24 bg-black border-t border-zinc-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16 space-y-2">
            <p className="text-red-500 text-[10px] sm:text-xs tracking-[0.3em] font-bold uppercase">THE CATEGORIES</p>
            <Shuffle
              text={homeData.categories.sectionTitle}
              tag="h2"
              className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight"
              textAlign="center"
              duration={0.4}
            />
          </div>
          <TiltedCover items={homeData.categories.items} className="max-w-6xl mx-auto" />
        </div>
      </section>

      {/* Season Schedule Section */}
      <section id="schedule">
        <SeasonSchedule
          title={homeData.seasonSchedule.title}
          subtitle={homeData.seasonSchedule.sectionLabel || "SEASON SCHEDULE"}
          subTitle={homeData.seasonSchedule.subtitle}
          rounds={scheduleRounds}
        />
      </section>

      {/* KEY NUMBERS – Achievements & Targets Section (Immediately above the Footer) */}
      <section
        className="relative py-20 sm:py-28 lg:py-36 bg-cover bg-center border-t border-zinc-900 overflow-hidden"
        style={{ backgroundImage: `url('${achievementsStats.backgroundImage || "/images/backgrounds/achievements-bg.jpg"}')` }}
      >
        {/* Dark black gradient overlay for readability (70-80%) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95 z-0" />

        {/* Ambient colored glows & cinematic depth */}
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)] pointer-events-none z-0" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="mb-12 sm:mb-16 text-center space-y-3">
            <span className="text-red-500 text-[10px] sm:text-xs md:text-sm tracking-[0.3em] font-extrabold uppercase drop-shadow-md block">
              {achievementsStats.sectionLabel}
            </span>
            <Shuffle
              text={achievementsStats.sectionTitle}
              tag="h2"
              className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg leading-none"
              textAlign="center"
              duration={0.4}
            />
            <p className="text-zinc-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed mt-4 drop-shadow text-center">
              {achievementsStats.sectionSubtitle}
            </p>
          </div>

          {/* Statistics Cards - Responsive Grid (Desktop: 4, Laptop: 4, Tablet: 2, Mobile: 1) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {achievementsStats.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-md p-6 sm:p-8 text-center shadow-2xl hover:border-red-500/60 transition-all duration-300"
              >
                {/* Subtle gradient overlay & red hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/15 via-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Card border glow edge */}
                <div className="absolute -inset-px rounded-2xl border border-red-500/0 group-hover:border-red-500/30 transition-colors duration-300 pointer-events-none" />

                <p className="relative z-10 text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-md">
                  {stat.value}
                </p>
                <p className="relative z-10 text-[11px] sm:text-xs md:text-sm text-zinc-400 font-extrabold uppercase tracking-widest mt-3 leading-snug">
                  {stat.label}
                </p>

                {/* Animated accent line */}
                <div className="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full mx-auto mt-4 group-hover:w-20 transition-all duration-300 opacity-80 group-hover:opacity-100" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}