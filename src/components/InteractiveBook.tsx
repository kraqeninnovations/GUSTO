"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, BookOpen } from "lucide-react";

export interface BookPage {
    title?: string;
    content: React.ReactNode;
    backContent?: React.ReactNode;
    pageNumber: number;
}

export interface InteractiveBookProps {
    coverImage: string;
    bookTitle?: string;
    bookAuthor?: string;
    pages: BookPage[];
    className?: string;
    width?: number | string;
    height?: number | string;
    onPageChange?: (pageIndex: number) => void;
}

export default function InteractiveBook({
    coverImage,
    bookTitle = "JOHANN EMMANUEL",
    bookAuthor = "Racing Gallery",
    pages,
    className,
    width = 350,
    height = 500,
    onPageChange,
}: InteractiveBookProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState(-1);
    const [isHovering, setIsHovering] = useState(false);

    const widthNum = typeof width === "number" ? width : 350;
    const BOOK_OPEN_DURATION = 1.5;
    const EASING: [number, number, number, number] = [0.25, 0, 0, 1];

    const handleOpenBook = () => setIsOpen(true);
    const handleCloseBook = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsOpen(false);
        setCurrentPageIndex(-1);
        onPageChange?.(0);
    };

    const nextPage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentPageIndex < pages.length - 1) {
            const next = currentPageIndex + 1;
            setCurrentPageIndex(next);
            onPageChange?.(next);
        }
    };

    const prevPage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentPageIndex >= 0) {
            const prev = currentPageIndex - 1;
            setCurrentPageIndex(prev);
            onPageChange?.(prev);
        }
    };

    const restartBook = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentPageIndex(-1);
        onPageChange?.(0);
    };

    return (
        <div
            className={cn("relative flex items-center justify-center perspective-[2000px]", className)}
            style={{
                width: typeof width === "number" ? width * 3.5 : "100%",
                height: typeof height === "number" ? height + 100 : "auto",
            }}
        >
            <motion.div
                className="relative preserve-3d"
                style={{ width, height }}
                initial={{ x: 0 }}
                animate={{ x: isOpen ? widthNum / 2 : 0 }}
                transition={{ duration: BOOK_OPEN_DURATION, ease: EASING }}
            >
                {/* Front Cover */}
                <motion.div
                    className="absolute inset-0 w-full h-full origin-left"
                    initial={{ rotateY: 0, zIndex: 100 }}
                    animate={{
                        rotateY: isOpen ? -180 : (isHovering ? -15 : 0),
                        zIndex: isOpen ? 0 : 100,
                    }}
                    transition={{
                        rotateY: { duration: BOOK_OPEN_DURATION, ease: EASING },
                        zIndex: { delay: isOpen ? BOOK_OPEN_DURATION * 0.6 : BOOK_OPEN_DURATION * 0.4 },
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    onClick={!isOpen ? handleOpenBook : undefined}
                    onHoverStart={() => !isOpen && setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                >
                    {/* Front Face */}
                    <div
                        className="absolute inset-0 w-full h-full backface-hidden rounded-r-md rounded-l-sm shadow-2xl cursor-pointer overflow-hidden group border border-zinc-800"
                        style={{ transform: "translateZ(0.5px)" }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${coverImage})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="absolute bottom-4 left-3 right-3 text-white text-left">
                            <h1 className="text-sm font-black tracking-wide mb-1 drop-shadow-md leading-tight uppercase">
                                {bookTitle}
                            </h1>
                            <p className="text-[8px] font-bold tracking-widest opacity-90 uppercase border-t border-white/30 pt-1 inline-block">
                                {bookAuthor}
                            </p>
                        </div>

                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/20 to-transparent opacity-40" />
                        <div className="absolute left-[12px] top-0 bottom-0 w-[1px] bg-black/30" />
                    </div>

                    {/* Back Face (Inner Cover) */}
                    <div
                        className="absolute inset-0 w-full h-full backface-hidden rounded-l-md rounded-r-sm bg-zinc-950 rotate-y-180 flex flex-col items-center justify-center border-r border-zinc-800 shadow-xl cursor-pointer hover:bg-zinc-900 transition-colors"
                        style={{ transform: "rotateY(180deg) translateZ(0.5px)" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            prevPage();
                        }}
                    >
                        <div className="text-center opacity-80">
                            <h2 className="text-2xl font-black text-white mb-2 tracking-wide uppercase">{bookTitle}</h2>
                            <div className="w-8 h-[1px] bg-red-600 mb-3 mx-auto" />
                            <p className="text-xs text-zinc-400 uppercase tracking-widest">Interactive Edition</p>
                        </div>
                    </div>
                </motion.div>

                {/* Pages Stack */}
                <div className="absolute inset-0 w-full h-full z-0" style={{ transformStyle: "preserve-3d" }}>
                    {pages.map((page, index) => {
                        const isFlipped = index <= currentPageIndex;

                        return (
                            <motion.div
                                key={index}
                                className="absolute inset-0 w-full h-full origin-left bg-zinc-950 rounded-r-md rounded-l-sm shadow-sm border border-zinc-800"
                                style={{ transformStyle: "preserve-3d" }}
                                initial={{ rotateY: 0, zIndex: pages.length - index }}
                                animate={{
                                    rotateY: isFlipped ? -180 : 0,
                                    zIndex: isFlipped ? index + 1 : pages.length - index,
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.645, 0.045, 0.355, 1],
                                }}
                            >
                                {/* Front Face (Right Side) */}
                                <div
                                    className="absolute inset-0 w-full h-full backface-hidden p-6 flex flex-col bg-zinc-950 cursor-pointer hover:bg-zinc-900 transition-colors border-r border-zinc-800"
                                    style={{ transform: "translateZ(0.5px)" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextPage();
                                    }}
                                >
                                    <div className="flex-1 flex items-center justify-center">
                                        {page.content}
                                    </div>
                                </div>

                                {/* Back Face (Left Side) */}
                                <div
                                    className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-zinc-950 border-r border-zinc-800 overflow-hidden p-6 flex flex-col cursor-pointer hover:bg-zinc-900 transition-colors"
                                    style={{ transform: "rotateY(180deg) translateZ(0.5px)" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevPage();
                                    }}
                                >
                                    <div className="flex-1 flex items-center justify-center">
                                        {page.backContent ? page.backContent : null}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Back Cover (Static) */}
                    <div
                        className="absolute inset-0 w-full h-full bg-zinc-950 rounded-r-md rounded-l-sm shadow-xl border border-zinc-800"
                        style={{ transform: "translateZ(-1px)", zIndex: -1 }}
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-40">
                            <p className="font-serif text-zinc-500 italic text-lg">The End</p>
                            <button
                                onClick={restartBook}
                                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors text-sm text-zinc-400 cursor-pointer border border-zinc-800"
                            >
                                <BookOpen size={14} /> Read Again
                            </button>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleCloseBook}
                            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white flex items-center justify-center transition border border-zinc-700 z-[1000]"
                        >
                            <X size={24} />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Hint */}
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-4 text-zinc-500 text-sm font-medium tracking-widest uppercase cursor-pointer z-50 hover:text-zinc-300 transition-colors"
                        onClick={handleOpenBook}
                    >
                        Click to Open
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
