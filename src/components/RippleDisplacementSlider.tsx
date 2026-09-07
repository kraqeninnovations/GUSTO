"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Shuffle from "./Shuffle";

export interface ChampionItem {
  year: string;
  title: string;
  description: string;
  image: string;
}

export interface RippleDisplacementSliderProps {
  sectionLabel: string;
  sectionTitle: string;
  subTitle?: string;
  items: ChampionItem[];
  autoPlayInterval?: number;
  className?: string;
}

const getImagePosition = (imageSrc: string, year?: string): string => {
  if (imageSrc.includes("car") || year === "2019") {
    return "center 22%";
  }
  if (imageSrc.includes("qu") || year === "2024") {
    return "center 15%";
  }
  if (imageSrc.includes("ktm") || year === "2026") {
    return "center 18%";
  }
  return "center 20%";
};

export function RippleDisplacementSlider({
  sectionLabel,
  sectionTitle,
  subTitle,
  items,
  autoPlayInterval = 6000,
  className,
}: RippleDisplacementSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = useCallback(
    (nextIdx: number) => {
      const total = items.length;
      const targetIndex = (nextIdx + total) % total;
      setCurrentIndex(targetIndex);
    },
    [items.length]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Autoplay timer
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, nextSlide]);

  // Touch Swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const activeItem = items[currentIndex] || items[0];

  return (
    <section
      id="champions"
      className={cn(
        "relative w-full h-[580px] sm:h-[680px] lg:h-[760px] bg-black text-white overflow-hidden select-none border-t border-zinc-900",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Background Image for Currently Selected Year (2019: /car.jpeg | 2024: /qu.jpeg | 2026: /ktm.jpeg) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`career-bg-${currentIndex}`}
          initial={{ opacity: 0.4, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.4, scale: 0.99 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full z-0 overflow-hidden"
        >
          <img
            src={activeItem.image}
            alt={`${activeItem.year} - ${activeItem.title}`}
            className="w-full h-full object-cover pointer-events-none"
            style={{
              objectFit: "cover",
              objectPosition: getImagePosition(activeItem.image, activeItem.year),
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Optimized Gradient Overlay - Keeps Rider's Face Vivid and Unshadowed */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent max-lg:bg-gradient-to-t max-lg:from-black/95 max-lg:via-black/60 max-lg:to-transparent pointer-events-none z-10" />

      {/* Floating Motorsport Content Layout */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-12 h-full flex flex-col justify-between py-8 sm:py-12">
        
        {/* Section Header with Year Selection Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 max-w-7xl w-full mx-auto gap-4">
          <div>
            <span className="text-red-500 text-[10px] sm:text-xs tracking-[0.3em] font-extrabold uppercase drop-shadow block">
              {sectionLabel}
            </span>
            <Shuffle
              text={sectionTitle}
              tag="h2"
              className="text-xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight"
              duration={0.4}
            />
          </div>

          {/* Interactive Year Selector Tabs (2019 | 2024 | 2026) */}
          <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-2xl">
            {items.map((item, idx) => (
              <button
                key={item.year}
                type="button"
                onClick={() => goToSlide(idx)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer",
                  idx === currentIndex
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.year}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Story Details Panel (Synchronized with active year & background image) */}
        <div className="w-full max-w-xl my-auto max-lg:mt-auto max-lg:mb-12">
          <div className="space-y-3 sm:space-y-4 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl shadow-black/90">
            {/* Year Badge */}
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 bg-red-600/90 text-white font-black text-xs sm:text-sm rounded-lg uppercase tracking-widest shadow-md shadow-red-600/30">
                {activeItem.year}
              </span>
              <div className="h-0.5 w-12 bg-gradient-to-r from-red-500 to-transparent rounded-full" />
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none drop-shadow-lg">
              {activeItem.title}
            </h3>

            {/* Description */}
            {activeItem.description && (
              <p className="text-xs sm:text-base text-zinc-300 leading-relaxed font-medium drop-shadow">
                {activeItem.description}
              </p>
            )}

            {/* Action Hint */}
            <div className="pt-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-red-500">
              <span>Select year above or use arrows to navigate</span>
              <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Controls & Pagination Footer */}
        <div className="flex items-center justify-between max-w-7xl w-full mx-auto">
          {/* Slide Dots */}
          <div className="flex items-center gap-2">
            {items.map((item, idx) => (
              <button
                key={item.year + idx}
                type="button"
                aria-label={`Go to ${item.year} slide`}
                onClick={() => goToSlide(idx)}
                className={cn(
                  "h-2 rounded-full transition-all duration-500 cursor-pointer",
                  idx === currentIndex
                    ? "w-8 bg-red-600 shadow-md shadow-red-600/50"
                    : "w-2 bg-zinc-700 hover:bg-zinc-500 opacity-60"
                )}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous Slide"
              onClick={() => prevSlide()}
              className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/80 text-white shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next Slide"
              onClick={() => nextSlide()}
              className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/80 text-white shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RippleDisplacementSlider;
