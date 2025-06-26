'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Bubble = {
  top: string;
  left: string;
  width: string;
  height: string;
  animateX: number;
  animateY: number;
  scale: number;
  duration: number;
};

export function AnimatedBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 15 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 200 + 50}px`,
      height: `${Math.random() * 200 + 50}px`,
      animateX: Math.random() * 100 - 50,
      animateY: Math.random() * 100 - 50,
      scale: 1 + Math.random() * 0.5,
      duration: 20 + Math.random() * 20
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-500/10"
          style={{
            top: b.top,
            left: b.left,
            width: b.width,
            height: b.height,
          }}
          animate={{
            x: [0, b.animateX],
            y: [0, b.animateY],
            scale: [1, b.scale],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
}
