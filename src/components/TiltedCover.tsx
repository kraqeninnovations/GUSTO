"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CategoryCard {
  year: string;
  title: string;
  motorcycle: string;
  subtitle?: string;
  image: string;
}

interface TiltedCoverProps {
  items: CategoryCard[];
  className?: string;
}

export default function TiltedCover({ items, className = "" }: TiltedCoverProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 ${className}`}>
      {/* Desktop/Tablet helper text */}
      <div className="hidden lg:block col-span-1 md:col-span-2 lg:col-span-3 text-center pt-2">
        <p className="text-zinc-500 text-xs sm:text-sm font-medium">
          💡 Click any card to view more details.
        </p>
      </div>

      {items.map((item, idx) => {
        const isActive = activeIndex === idx;

        return (
          <motion.div
            key={item.year + idx}
            animate={
              isActive
                ? {
                    scale: [1, 1.05, 1],
                    rotateZ: [0, -3, 0],
                    y: [0, -8, 0],
                  }
                : {
                    scale: 1,
                    rotateZ: 0,
                    y: 0,
                  }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setActiveIndex(isActive ? null : idx)}
            className="group relative w-full md:aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950 shadow-xl cursor-pointer"
          >
            {/* Mobile layout: image + stacked content */}
            <div className="md:hidden flex flex-col">
              <div className="relative w-full">
                <img
                  src={item.image}
                  alt={`${item.year} — ${item.title}`}
                  className="w-full h-64 sm:h-72 object-cover"
                />
              </div>
              <div className="p-5 sm:p-6 space-y-3 flex-1">
                <span className="text-red-500 text-3xl sm:text-4xl font-black uppercase tracking-tight block">
                  {item.year}
                </span>
                <p className="text-white font-bold text-lg sm:text-xl leading-tight">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-white font-bold text-lg sm:text-xl leading-tight">
                    {item.subtitle}
                  </p>
                )}
                {item.motorcycle && (
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {item.motorcycle}
                  </p>
                )}
              </div>
            </div>

            {/* Desktop/Tablet: image cover with year overlay */}
            <div className="hidden md:block absolute inset-0">
              <img
                src={item.image}
                alt={`${item.year} — ${item.title}`}
                className="w-full h-full object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <span className="text-white text-3xl sm:text-4xl font-black uppercase tracking-tight block">
                  {item.year}
                </span>
              </div>
            </div>

            {/* Desktop/Tablet back face (visible when active) */}
            <motion.div
              animate={isActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: isActive ? 0.2 : 0 }}
              className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-8 text-center gap-3 hidden md:flex"
            >
              <div className="w-10 h-0.5 bg-red-600 rounded-full mb-2" />
              <span className="text-red-500 text-xs font-black uppercase tracking-[0.4em]">
                {item.year}
              </span>
              <div className="space-y-1">
                <p className="text-white font-black text-2xl uppercase tracking-tight leading-tight">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-zinc-300 text-sm font-semibold tracking-wider">
                    {item.subtitle}
                  </p>
                )}
              </div>
              {item.motorcycle && (
                <p className="text-zinc-400 text-sm font-semibold tracking-wider mt-2 border-t border-zinc-800 pt-3 w-full text-center">
                  {item.motorcycle}
                </p>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
