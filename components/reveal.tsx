"use client";

import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = MotionProps & {
  as?: keyof typeof motion;
  className?: string;
  children: React.ReactNode;
};

export function Reveal({ as = "div", className, children, ...props }: RevealProps) {
  const Component = motion[as] as typeof motion.div;

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
