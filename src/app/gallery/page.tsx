"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import galleryData from "../../content/gallery.json";
import { X, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: number;
  image: string;
  title: string;
}

export default function GalleryPage() {
  const [images] = useState<GalleryImage[]>(galleryData.images || []);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Prevent background scrolling when lightbox modal is active
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  // Keyboard navigation for Lightbox (ESC, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, images.length]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white overflow-x-hidden flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl relative z-10">
          
          {/* Gallery Title & Subtitle Header */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              {galleryData.title || "Gallery"}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 sm:mt-2 font-mono tracking-wide">
              {galleryData.subtitle ? `${galleryData.subtitle} — ` : ""}{images.length} photos
            </p>
          </div>

          {/* Responsive Multi-Column Gallery Grid */}
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5"
          >
            {images.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.02, 0.4) }}
                onClick={() => setLightboxIndex(idx)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-950 border border-zinc-900 shadow-md transition-all duration-300 hover:border-red-600/50 hover:shadow-red-600/10 active:scale-[0.98] cursor-pointer touch-manipulation"
              >
                <Image
                  src={img.image}
                  alt={img.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5 sm:p-3">
                  <span className="text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-wider truncate">
                    {img.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Fullscreen Responsive Lightbox / Popup */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 select-none"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Top Bar for Lightbox Controls */}
              <div className="absolute top-3 left-3 right-3 sm:top-6 sm:left-6 sm:right-6 z-50 flex items-center justify-between pointer-events-none">
                {/* BACK Button (Top Left) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(null);
                  }}
                  className="pointer-events-auto px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 active:scale-95 text-white text-[11px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 border border-zinc-700 transition hover:border-red-500/50 shadow-lg"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>BACK</span>
                </button>

                {/* CLOSE (X) Button (Top Right) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(null);
                  }}
                  className="pointer-events-auto w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-zinc-900/90 hover:bg-zinc-800 active:scale-95 text-white flex items-center justify-center transition border border-zinc-700 hover:border-red-500/50 shadow-lg"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
                    }}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 active:scale-95 text-white flex items-center justify-center transition border border-zinc-700/80 hover:border-red-500/50 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
                    }}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 active:scale-95 text-white flex items-center justify-center transition border border-zinc-700/80 hover:border-red-500/50 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {/* Lightbox Main Image Display */}
              <motion.div
                key={lightboxIndex}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative max-w-6xl w-full max-h-[85vh] flex flex-col items-center justify-center pt-10 pb-2 sm:pt-0 sm:pb-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-[65vh] sm:h-[75vh] flex items-center justify-center">
                  <Image
                    src={images[lightboxIndex].image}
                    alt={images[lightboxIndex].title}
                    fill
                    className="object-contain rounded-lg max-w-full max-h-full"
                    priority
                    sizes="100vw"
                  />
                </div>
                <div className="mt-3 sm:mt-4 bg-zinc-900/90 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-zinc-700 flex items-center gap-2 sm:gap-3 max-w-[90vw] truncate shadow-lg">
                  <span className="truncate">{images[lightboxIndex].title}</span>
                  <span className="text-zinc-500 shrink-0">•</span>
                  <span className="text-red-500 font-mono shrink-0">
                    {lightboxIndex + 1} / {images.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
