"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type SectionProps = {
  title: string;
  children: ReactNode;
  delay?: number;
};

const Section = ({ title, children, delay = 0.2 }: SectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-10 pointer-events-none"
    >
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-woodsmoke-50 font-normal leading-6">{children}</p>
    </motion.section>
  );
};

export default Section;
