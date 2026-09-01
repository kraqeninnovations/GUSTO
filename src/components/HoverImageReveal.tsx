"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface AchievementItem {
  image: string;
  text: string;
}

interface HoverImageRevealProps {
  items: AchievementItem[];
}

export default function HoverImageReveal({ items }: HoverImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 250, damping: 25, mass: 0.6 };
  const imageX = useSpring(mouseX, springConfig);
  const imageY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full">
      {/* Mobile Layout (< 768px): Responsive Achievement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden p-4 space-y-3 flex flex-col justify-between"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900">
              <Image
                src={item.image}
                alt={item.text}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
            <h3
              className="text-white font-normal uppercase tracking-tight"
              style={{
                fontFamily: "RicoPalm, sans-serif",
                fontSize: "clamp(18px, 4vw, 24px)",
                letterSpacing: "-0.03em",
                lineHeight: "1.1",
              }}
            >
              {item.text}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Desktop / Laptop / Tablet (>= 768px): Hover Image Reveal Vertical List */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden md:block relative w-full select-none max-w-5xl mx-auto"
      >
        {/* Floating Image element following cursor */}
        <motion.div
          className="pointer-events-none absolute top-0 left-0 z-30 overflow-hidden rounded-[16px] border border-zinc-700/50 shadow-2xl shadow-black/90 bg-zinc-950"
          style={{
            x: imageX,
            y: imageY,
            translateX: "-50%",
            translateY: "-50%",
            width: 420,
            height: 520,
          }}
          animate={{
            opacity: hoveredIndex !== null ? 1 : 0,
            scale: hoveredIndex !== null ? 1 : 0.85,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              className="absolute inset-0 w-full h-full"
              initial={false}
              animate={{
                opacity: hoveredIndex === idx ? 1 : 0,
                scale: hoveredIndex === idx ? 1 : 1.08,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.text}
                  fill
                  sizes="420px"
                  className="object-contain"
                  priority={idx < 3}
                  style={{
                    filter: "brightness(1.05) contrast(1.05) saturate(1.1)",
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Full-width vertical list of achievement rows */}
        <div className="flex flex-col border-t border-zinc-900">
          {items.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            const anyActive = hoveredIndex !== null;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                className="group relative flex items-center justify-between py-7 px-4 border-b border-zinc-900 cursor-pointer transition-colors duration-300"
              >
                {/* Subtle ambient red highlight on hover */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-red-600/5 via-zinc-900/30 to-transparent ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Achievement Text with RicoPalm typography */}
                <span
                  className="relative z-10 block transition-colors duration-300"
                  style={{
                    fontFamily: "RicoPalm, sans-serif",
                    fontSize: "clamp(20px, 2vw, 34px)",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: anyActive
                      ? isHovered
                        ? "#ffffff"
                        : "#51565A"
                      : "#ffffff",
                    textShadow: isHovered
                      ? "0 1px 2px rgba(0,0,0,0.5)"
                      : "none",
                  }}
                >
                  {item.text}
                </span>

                {/* Right Index Number & Arrow */}
                <div className="relative z-10 flex items-center gap-3">
                  <span
                    className={`text-xs font-mono tracking-widest transition-colors duration-300 ${
                      isHovered ? "text-red-500" : "text-zinc-600"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isHovered
                        ? "text-red-500 translate-x-1.5"
                        : "text-zinc-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
