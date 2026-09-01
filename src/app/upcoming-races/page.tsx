"use client";

import Header from "../../components/Header";
import Shuffle from "../../components/Shuffle";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "../../components/Footer";
import upcomingRacesData from "../../content/upcoming-races.json";

const specData = upcomingRacesData.specData;

export default function UpcomingRacesPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 py-20 max-w-7xl relative z-10">
        {/* Desktop Spec Table */}
        <div className="hidden md:block overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/80 mb-12 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/10 text-red-500 font-extrabold text-[10px] tracking-widest uppercase">
                <th className="p-6">{upcomingRacesData.tableHeaders.category}</th>
                <th className="p-6">{upcomingRacesData.tableHeaders.championship}</th>
                <th className="p-6 text-center">{upcomingRacesData.tableHeaders.years}</th>
              </tr>
            </thead>
            <tbody>
              {specData.map((spec: any, idx: number) => (
                <tr key={idx} className="border-b border-zinc-900 hover:bg-zinc-900/20 transition duration-300">
                  <td className="p-6">
                    <span className="text-white font-black text-lg uppercase block">{spec.category}</span>
                    <span className="text-zinc-500 text-xs mt-1 block">{spec.details}</span>
                  </td>
                  <td className="p-6 text-zinc-300 font-semibold uppercase text-sm">{spec.championship}</td>
                  <td className="p-6 text-center text-red-500 font-black text-sm">{spec.years}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Spec Card Grid */}
        <div className="grid gap-6 grid-cols-1 md:hidden mb-12">
          {specData.map((spec: any, idx: number) => (
            <div key={idx} className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-4">
              <div>
                 <span className="text-[10px] text-red-500 font-black tracking-widest uppercase block">{upcomingRacesData.mobileCards.classLabel}</span>
                 <span className="text-xl font-black text-white uppercase block mt-1">{spec.category}</span>
               </div>

               <div>
                 <span className="text-[10px] text-zinc-600 font-black tracking-widest uppercase block">{upcomingRacesData.mobileCards.championshipLabel}</span>
                 <span className="text-zinc-300 text-sm font-semibold uppercase block mt-1">{spec.championship}</span>
               </div>

               <div>
                 <span className="text-[10px] text-zinc-600 font-black tracking-widest uppercase block">{upcomingRacesData.mobileCards.yearsLabel}</span>
                <span className="text-red-500 text-sm font-black block mt-1">{spec.years}</span>
              </div>

              <div className="pt-4 border-t border-zinc-900">
                <p className="text-zinc-400 text-xs leading-relaxed">{spec.details}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance info section */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Image Column */}
            <div className="md:col-span-4 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-[220px] aspect-[875/1241] rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_30px_rgba(234,179,8,0.05)] hover:shadow-[0_0_40px_rgba(234,179,8,0.15)] transition-all duration-500 group/image"
              >
                <Image
                  src="/arrc-2026-regulations.png"
                  alt="ARRC 2026 Regulations Cover"
                  fill
                  className="object-cover transition-transform duration-500 group-hover/image:scale-105"
                  sizes="(max-width: 768px) 100vw, 220px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </div>

            {/* Text & Button Column */}
            <div className="md:col-span-8 text-center md:text-left space-y-6">
              <div>
                <div className="hidden md:block">
                   <Shuffle
                     text={upcomingRacesData.compliance.title}
                     tag="h2"
                     className="text-2xl font-black text-white uppercase tracking-tight mb-4"
                     textAlign="left"
                     duration={0.4}
                   />
                 </div>
                 <div className="md:hidden">
                   <Shuffle
                     text={upcomingRacesData.compliance.title}
                     tag="h2"
                     className="text-2xl font-black text-white uppercase tracking-tight mb-4"
                     textAlign="center"
                     duration={0.4}
                   />
                 </div>
                 <p className="text-zinc-400 text-sm sm:text-base leading-relaxed text-center md:text-left">
                   {upcomingRacesData.compliance.paragraph}
                 </p>
              </div>
              <div className="flex justify-center md:justify-start">
                <a
                  href={upcomingRacesData.compliance.buttonHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500 hover:bg-red-600 hover:text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest text-zinc-300 transition duration-300"
                >
                  {upcomingRacesData.compliance.buttonText}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
