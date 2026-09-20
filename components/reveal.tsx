"use client";

import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = MotionProps & {
  as?: keyof typeof motion;
  className?: string;
  children: React.ReactNode;
};

export function Reveal({ as = "div", className, children, ...props }: RevealProps) {
  const Component = motion[as] as typeof motion.div;
  const reduceMotion = useReducedMotion();

  // With reduced motion requested, render content in its final state so nothing
  // is hidden behind an animation that never plays.
  if (reduceMotion) {
    return (
      <Component className={cn(className)} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}
