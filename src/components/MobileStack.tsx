"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface StackCard {
  id: number | string;
  children: React.ReactNode;
}

interface MobileStackProps {
  cards: StackCard[];
  randomRotation?: boolean;
}

const ROTATIONS = [-6, -3, 2, 5, -4, 3, -2, 6];

export default function MobileStack({ cards, randomRotation = true }: MobileStackProps) {
  const [order, setOrder] = useState<number[]>(cards.map((_, i) => i));
  const dragStartX = useRef<number>(0);

  const sendToBack = () => {
    setOrder((prev) => {
      const next = [...prev];
      const top = next.shift()!;
      next.push(top);
      return next;
    });
  };

  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: "68vw", maxHeight: 360 }}>
      {order
        .slice()
        .reverse()
        .map((cardIndex, stackPos) => {
          const isTop = stackPos === order.length - 1;
          const depth = order.length - 1 - stackPos; // 0 = top
          const rotation =
            randomRotation && depth > 0
              ? (ROTATIONS[cardIndex % ROTATIONS.length] || 0) * (depth * 0.5)
              : 0;
          const scale = 1 - depth * 0.04;
          const yOffset = depth * -8;

          return (
            <motion.div
              key={cards[cardIndex].id}
              className="absolute w-[88vw] cursor-grab active:cursor-grabbing select-none touch-none"
              style={{
                height: "62vw",
                maxWidth: 360,
                maxHeight: 310,
                zIndex: stackPos,
                borderRadius: "20px",
                overflow: "hidden",
              }}
              animate={{ scale, y: yOffset, rotate: rotation }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragStart={(_, info) => {
                dragStartX.current = info.point.x;
              }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 300) {
                  sendToBack();
                }
              }}
              onTap={() => {
                if (isTop) sendToBack();
              }}
            >
              {cards[cardIndex].children}
            </motion.div>
          );
        })}
    </div>
  );
}
