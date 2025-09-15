"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

const variants = {
  initial: {
    opacity: 0,
    y: 15, 
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4, 
      ease: 'easeInOut',
    },
  },
  
  exit: {
    opacity: 0,
    y: -15, 
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
