"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Shuffle from "../../components/Shuffle";
import resultsData from "../../content/results.json";

interface EventItem {
  id: string;
  round: string;
  title: string;
  circuit: string;
  location: string;
  country: string;
  flag: string;
  date: string;
  image: string;
  position: string;
  points: string;
  type?: string;
}

export default function ResultsPage() {
  const shouldReduceMotion = useReducedMotion();
  const events = resultsData.events as EventItem[];
  const raceEvents = events.filter((e) => e.type !== "placeholder");
  const placeholderEvent = events.find((e) => e.type === "placeholder");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Header />

      <main className="relative z-10 pb-20">
        {/* 1. Hero Header */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black border-b border-zinc-900 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {resultsData.hero.sectionLabel}
            </div>

            <div className="space-y-2">
              <Shuffle
                text={resultsData.hero.title.line1}
                tag="h1"
                className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white"
                textAlign="center"
                duration={0.4}
              />
              <Shuffle
                text={resultsData.hero.title.line2}
                tag="h2"
                className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500"
                textAlign="center"
                duration={0.4}
              />
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed pt-1">
              {resultsData.hero.subtitle}
            </p>
          </div>
        </section>

        {/* 2. Race Results Cards Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-12 sm:pt-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch"
          >
            {raceEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={cardVariants}
                whileHover={shouldReduceMotion ? {} : { y: -6 }}
                className="bg-zinc-950 border border-zinc-900 rounded-[24px] overflow-hidden shadow-2xl hover:border-red-500/50 hover:shadow-red-950/30 transition-all duration-300 flex flex-col group h-full"
              >
                {/* Top Section: Fixed Image with Overlay */}
                <div className="relative w-full overflow-hidden bg-zinc-900 shrink-0" style={{ height: 220 }}>
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                </div>

                {/* Card Content & Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between min-h-0">
                  <div className="space-y-1">
                    <p className="text-white text-xs sm:text-sm font-black uppercase tracking-widest">
                      {event.date}
                    </p>
                    <span className="text-red-500 text-[10px] tracking-[0.25em] font-black uppercase block">
                      {event.round}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-snug">
                      {event.title}
                    </h3>
                  </div>

                  {/* Circuit & Location */}
                  <div className="space-y-2 pt-2 border-t border-zinc-900/80">
                    <div className="flex items-start gap-2 text-zinc-300 text-xs font-medium">
                      <span className="text-red-500 text-sm mt-0.5">📍</span>
                      <span className="line-clamp-2 leading-tight">{event.circuit}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1.5 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                        <span className="text-base">{event.flag}</span>
                        <span>{event.location}, {event.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border border-zinc-800">
                          {event.position}
                        </span>
                        <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                          {event.points}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Placeholder Card */}
            {placeholderEvent && (
              <motion.div
                variants={cardVariants}
                whileHover={shouldReduceMotion ? {} : { y: -6 }}
                className="bg-zinc-950 border border-zinc-900 rounded-[24px] overflow-hidden shadow-2xl hover:border-red-500/50 hover:shadow-red-950/30 transition-all duration-300 flex flex-col items-center justify-center h-full min-h-[320px]"
              >
                <motion.div
                  animate={shouldReduceMotion ? {} : {
                    y: [0, -10, 0],
                    scale: [1, 1.04, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                  className="flex flex-col items-center justify-center gap-4 p-6 text-center relative"
                >
                  <span className="text-6xl sm:text-7xl font-black text-white/90 drop-shadow-[0_0_18px_rgba(239,68,68,0.45)]">
                    ?
                  </span>
                  <div className="space-y-1">
                    <p className="text-red-500 text-xs font-black uppercase tracking-[0.3em]">COMING SOON</p>
                    <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">New Race Update Coming Soon</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* 3. Previous Results Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16 sm:pt-20">
          <div className="text-center p-8 sm:p-12 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4 shadow-xl">
            <h3
              className="text-white text-xl sm:text-2xl font-black uppercase tracking-tight"
              style={{ fontFamily: "'Royal Tomato', sans-serif" }}
            >
              ARCHIVED CHAMPIONSHIP SEASONS
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
              {resultsData.previousResults.paragraph}
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl transition duration-300 text-xs tracking-widest uppercase shadow-lg shadow-red-600/30 active:scale-98"
            >
              {resultsData.previousResults.buttonText}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
