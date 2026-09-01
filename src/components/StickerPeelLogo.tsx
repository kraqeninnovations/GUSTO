"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface StickerPeelLogoProps {
  src?: string;
  alt: string;
  fallback?: React.ReactNode;
}

export default function StickerPeelLogo({ src, alt, fallback }: StickerPeelLogoProps) {
  const [isPeeling, setIsPeeling] = useState(false);
  const [isClickPeel, setIsClickPeel] = useState(false);

  const handleInteractionStart = () => {
    setIsPeeling(true);
  };

  const handleInteractionEnd = () => {
    setIsPeeling(false);
  };

  const handleClick = () => {
    setIsClickPeel(true);
    setTimeout(() => {
      setIsClickPeel(false);
    }, 600);
  };

  return (
    <div
      className="relative cursor-pointer group/sticker flex items-center justify-center p-2 [perspective:800px] select-none"
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onClick={handleClick}
    >
      {/* 3D Interactive Sticker Layer */}
      <motion.div
        animate={
          isClickPeel
            ? {
                rotateX: -20,
                rotateY: 24,
                rotateZ: -8,
                scale: 1.14,
                y: -10,
              }
            : isPeeling
            ? {
                rotateX: -14,
                rotateY: 18,
                rotateZ: -5,
                scale: 1.08,
                y: -6,
              }
            : {
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                y: 0,
              }
        }
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 16,
          mass: 0.8,
        }}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "bottom left",
        }}
        className="relative z-10 flex items-center justify-center"
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="max-h-24 max-w-[85%] w-auto h-auto object-contain drop-shadow-lg transition-all duration-200 pointer-events-none"
          />
        ) : (
          fallback
        )}

        {/* Sticker Vinyl Gloss Specular Reflection */}
        <motion.div
          animate={isPeeling || isClickPeel ? { opacity: 0.45, x: "100%" } : { opacity: 0, x: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-lg pointer-events-none z-20"
        />

        {/* Peel Backing Shadow */}
        <motion.div
          animate={isPeeling || isClickPeel ? { opacity: 0.35, scale: 0.92 } : { opacity: 0, scale: 1 }}
          className="absolute -bottom-2 -right-2 w-full h-full bg-black/40 blur-sm rounded-lg pointer-events-none -z-10"
        />
      </motion.div>
    </div>
  );
}
