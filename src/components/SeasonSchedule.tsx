"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Shuffle from "./Shuffle";

export interface RaceRound {
  round: string;
  date: string;
  circuit: string;
  location: string;
  country: string;
  countryFlag: string;
  image: string;
  alt?: string;
  status: string;
}

interface SeasonScheduleProps {
  rounds?: RaceRound[];
  title?: string;
  subtitle?: string;
  subTitle?: string;
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
    },
  }),
};

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  if (lower === "completed") {
    return (
      <span className="bg-emerald-600/90 text-white font-extrabold text-[10px] sm:text-xs tracking-wider uppercase px-3 py-1 rounded-full shadow-md border border-emerald-400/30">
        Completed
      </span>
    );
  }
  if (lower === "finale") {
    return (
      <span className="bg-gradient-to-r from-amber-500 to-red-600 text-white font-black text-[10px] sm:text-xs tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
        🏆 Finale
      </span>
    );
  }
  return (
    <span className="bg-[#0b1f47]/90 text-white font-bold text-[10px] sm:text-xs tracking-wider uppercase px-3 py-1 rounded-full shadow-md border border-blue-400/30">
      {status}
    </span>
  );
}

export default function SeasonSchedule({
  rounds = [],
  title = "2026 ESBK Race Calendar",
  subtitle = "SEASON SCHEDULE",
  subTitle = "Follow Johann's 2026 ESBK championship journey across Spain and Portugal.",
  className = "",
}: SeasonScheduleProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className={`relative w-full py-16 sm:py-24 md:py-28 bg-black border-t border-zinc-900 overflow-hidden ${className}`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mx-auto max-w-[850px] mb-10 sm:mb-14 lg:mb-16 space-y-3">
          <motion.div
            initial={isInView ? {} : { opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-red-500 font-bold text-[12px] sm:text-[13px] lg:text-[14px] uppercase tracking-[0.45em] text-center block"
          >
            {subtitle}
          </motion.div>

          <Shuffle
            text={title}
            tag="h2"
            className="text-[34px] sm:text-[48px] md:text-[62px] lg:text-[76px] font-black text-white uppercase tracking-tight leading-none text-center"
            textAlign="center"
            duration={0.4}
          />

          <div className="flex justify-center items-center py-2 sm:py-3">
            <Image
              src="/ESBK.png"
              alt="ESBK Campeonato de España de Superbike"
              width={180}
              height={60}
              className="object-contain object-center w-auto h-[40px] sm:h-[50px] md:h-[60px]"
              priority={false}
            />
          </div>

          {subTitle && (
            <p className="text-zinc-400 text-[15px] sm:text-[17px] lg:text-[20px] max-w-[700px] mx-auto leading-relaxed text-center pt-1">
              {subTitle}
            </p>
          )}
        </div>

        {/* Vertical Stack of Large Horizontal Racing Cards (1 Card Per Row) */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          {rounds.map((roundItem, index) => (
            <motion.div
              key={roundItem.round}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ y: -6, scale: 1.005 }}
              className="group relative w-full h-[280px] sm:h-[340px] md:h-[380px] lg:h-[420px] rounded-[24px] overflow-hidden bg-zinc-950 border border-zinc-900 shadow-2xl hover:border-red-500/60 hover:shadow-red-950/40 transition-all duration-400 flex flex-col justify-between p-5 sm:p-7 md:p-8 cursor-pointer select-none outline-none"
            >
              {/* Full Card Background Image with Dark Overlay */}
              <div className="absolute inset-0 z-0 bg-zinc-950 overflow-hidden">
                <Image
                  src={roundItem.image}
                  alt={roundItem.alt || roundItem.circuit}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Dark Vignette & Gradient Overlays */}
                <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
              </div>

              {/* Top-Left: Round Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                <span className="bg-red-600 text-white font-black text-xs sm:text-sm tracking-wider uppercase px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-red-500/30">
                  {roundItem.round}
                </span>
              </div>

              {/* Top-Right: Status Badge */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                <StatusBadge status={roundItem.status} />
              </div>

              {/* Centered Main Card Content */}
              <div className="relative z-10 my-auto text-center px-4 space-y-2 sm:space-y-3 flex flex-col items-center justify-center max-w-4xl mx-auto">
                {/* 1. Country Flag Emblem */}
                <div className="text-2xl sm:text-3xl lg:text-4xl leading-none drop-shadow-md">
                  {roundItem.countryFlag}
                </div>

                {/* 2. Circuit Name: Desktop 52px, Laptop 44px, Tablet 34px, Mobile 24px, Font Weight 900 */}
                <h3 className="text-[24px] sm:text-[34px] md:text-[44px] lg:text-[52px] font-black text-white uppercase tracking-tight leading-[1.08] line-clamp-2 group-hover:text-red-500 transition-colors drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] text-center">
                  {roundItem.circuit}
                </h3>

                {/* 3. Location: Desktop 22px, Mobile 15px, Italic */}
                <p className="text-zinc-300 font-serif italic text-[15px] sm:text-[18px] lg:text-[22px] tracking-wide drop-shadow text-center">
                  {roundItem.location}
                </p>

                {/* 4. Date Badge: Desktop 20px, Mobile 14px, Dark background pill */}
                <div className="pt-1">
                  <div className="inline-flex items-center gap-2 bg-[#0b1f47]/80 backdrop-blur-md border border-blue-900/60 text-white font-black text-[14px] sm:text-[17px] lg:text-[20px] px-5 py-1.5 sm:px-6 sm:py-2 rounded-full uppercase tracking-wider shadow-xl">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{roundItem.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
