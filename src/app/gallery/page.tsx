"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import InteractiveBook from "../../components/InteractiveBook";
import galleryData from "../../content/gallery.json";
import { X, Upload } from "lucide-react";

interface GalleryImage {
  id: number;
  image: string;
  title: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(galleryData.images || []);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [bookWidth, setBookWidth] = useState(340);
  const [bookHeight, setBookHeight] = useState(460);

  useEffect(() => {
    const updateBookSize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setBookWidth(170);
        setBookHeight(Math.round((170 * 460) / 340));
      } else if (w < 640) {
        setBookWidth(190);
        setBookHeight(Math.round((190 * 460) / 340));
      } else {
        setBookWidth(340);
        setBookHeight(460);
      }
    };

    updateBookSize();
    window.addEventListener("resize", updateBookSize);
    return () => window.removeEventListener("resize", updateBookSize);
  }, []);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const readers: Promise<GalleryImage>[] = Array.from(files).map((file, idx) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: Date.now() + idx,
            image: reader.result as string,
            title: file.name.replace(/\.[^/.]+$/, ""),
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newImages) => {
      setImages((prev) => [...prev, ...newImages]);
      setUploading(false);
    });

    e.target.value = "";
  }, []);

  const bookPages = images.length > 0
    ? images.map((img, idx) => ({
        title: img.title,
        content: (
          <div className="relative w-full h-full flex items-center justify-center bg-zinc-900 rounded-lg overflow-hidden">
            <Image src={img.image} alt={img.title} fill className="object-contain" />
          </div>
        ),
        backContent: idx + 1 < images.length ? (
          <div className="relative w-full h-full flex items-center justify-center bg-zinc-900 rounded-lg overflow-hidden">
            <Image src={images[idx + 1].image} alt={images[idx + 1].title} fill className="object-contain" />
          </div>
        ) : null,
        pageNumber: idx + 1,
      }))
    : [];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white overflow-x-hidden flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl relative z-10">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              {galleryData.title || "Gallery"}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2">{images.length} photos</p>
          </div>

          {/* Single Interactive Book - Centered */}
          <div className="flex justify-center mb-10 sm:mb-14">
            <InteractiveBook
              coverImage={images[0]?.image || "/hero-racer.jpg"}
              bookTitle={galleryData.title?.toUpperCase() || "GALLERY"}
              bookAuthor="Racing Gallery — 2026 Collection"
              pages={bookPages}
              width={bookWidth}
              height={bookHeight}
            />
          </div>

          {/* Upload Button */}
          <div className="flex justify-center mb-10 sm:mb-14">
            <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-lg transition shadow-lg shadow-red-600/20">
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Images"}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Gallery Grid */}
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {images.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.04, 0.6) }}
                onClick={() => setLightboxIndex(idx)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-950 border border-zinc-900 shadow-lg shadow-black/20 transition-all duration-300 hover:border-red-600/30 hover:shadow-red-600/10 cursor-pointer"
              >
                <Image
                  src={img.image}
                  alt={img.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white flex items-center justify-center transition border border-zinc-700"
              >
                <X size={20} />
              </button>

              {images.length > 1 && (
                <>
                  <div className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
                      }}
                      className="px-3 sm:px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-lg transition border border-zinc-700"
                    >
                      Previous
                    </button>
                  </div>
                  <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
                      }}
                      className="px-3 sm:px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-lg transition border border-zinc-700"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              <motion.div
                key={lightboxIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[lightboxIndex].image}
                  alt={images[lightboxIndex].title}
                  width={1200}
                  height={800}
                  className="object-contain max-h-[85vh] w-auto mx-auto rounded-lg"
                  priority
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/80 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest border border-zinc-700">
                  {lightboxIndex + 1} / {images.length}
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
