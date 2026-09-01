"use client";

import Header from "../../components/Header";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Footer from "../../components/Footer";
import updatesData from "../../content/updates.json";

const newsItems = updatesData.newsItems;

export default function UpdatesPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-7xl relative z-10">
        {/* Video Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto mb-16 sm:mb-20"
        >
          <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-900 bg-zinc-950 shadow-2xl">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <video
                className="absolute inset-0 w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster=""
              >
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 text-center">
            <span className="text-[10px] text-zinc-500 tracking-[0.3em] font-black uppercase block">{updatesData.videoSection.label}</span>
          </div>
        </motion.section>

        <motion.div
          className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {newsItems.map((item: any, idx: number) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
              className="group rounded-2xl sm:rounded-3xl border border-zinc-900 bg-zinc-950/80 overflow-hidden shadow-2xl flex flex-col hover:border-red-600/30 transition-all duration-300"
            >
              <div className="relative w-full h-44 sm:h-52 bg-zinc-900 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
              </div>

              <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-between flex-1">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-red-500 tracking-[0.2em] font-extrabold uppercase">{item.tag}</span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-[10px] text-zinc-600 font-black uppercase tracking-wider">{item.date}</span>
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-red-500 transition duration-300">
                    {item.title}
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                  <span className="text-[10px] tracking-widest text-zinc-500 font-extrabold uppercase">{updatesData.championshipName}</span>
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-red-600 group-hover:text-white transition duration-300 text-xs sm:text-sm">→</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-12 sm:mt-16">
          <button
            type="button"
            className="px-3 sm:px-4 py-2 rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-500 font-black text-[10px] sm:text-xs uppercase tracking-widest hover:border-red-600/30 hover:text-white transition duration-300"
          >
            {updatesData.pagination.previous}
          </button>
          <button
            type="button"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center shadow-lg shadow-red-600/20"
          >
            1
          </button>
          <button
            type="button"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-400 font-black text-xs uppercase tracking-wider flex items-center justify-center hover:border-red-600/30 hover:text-white transition duration-300"
          >
            2
          </button>
          <button
            type="button"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-400 font-black text-xs uppercase tracking-wider flex items-center justify-center hover:border-red-600/30 hover:text-white transition duration-300"
          >
            3
          </button>
          <button
            type="button"
            className="px-3 sm:px-4 py-2 rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-500 font-black text-[10px] sm:text-xs uppercase tracking-widest hover:border-red-600/30 hover:text-white transition duration-300"
          >
            {updatesData.pagination.next}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
