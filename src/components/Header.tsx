"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import GooeyNav from "./GooeyNav";
import navigationData from "../content/navigation.json";
const navItems = navigationData.items;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Find index of item where item.href matches current pathname
  const activeIndex = navItems.findIndex((item) => item.href === pathname);
  const initialActiveIndex = activeIndex;

  // Convert navItems to match the format expected by GooeyNav
  const gooeyItems = navItems.map((item) => ({
    label: item.label,
    href: item.href,
  }));

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50 border-b border-zinc-900">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl py-2 sm:py-3 flex items-center justify-between">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center flex-shrink-0 transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/johi-logo.png"
            alt="JOHI Racing Logo"
            width={126}
            height={90}
            priority
            className=" max-h-[40px] sm:max-h-[50px] md:max-h-[60px]"
          />
        </Link>

        <nav className="hidden md:flex items-center ml-auto">
          <GooeyNav
            items={gooeyItems}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            initialActiveIndex={initialActiveIndex}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="md:hidden p-3 sm:p-4 text-white hover:text-red-500 transition-colors duration-200 hover:scale-110 transform rounded-lg"
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ transform: mobileMenuOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className={`md:hidden bg-zinc-900 transition-all duration-300 overflow-hidden ${mobileMenuOpen ? "max-h-screen" : "max-h-0"}`}>
        <nav className="flex flex-col px-4 sm:px-6 py-4 sm:py-6 space-y-2 sm:space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleMobileNavClick(e, item.href)}
                className={`block py-4 px-5 text-base sm:text-lg font-bold text-left hover:text-red-500 hover:bg-zinc-800 transition-all duration-200 transform hover:scale-105 cursor-pointer rounded-lg min-h-[52px] sm:min-h-[56px] ${isActive ? "text-red-500 bg-zinc-800/80" : "text-white"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}