"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const Header = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex justify-between items-center mb-16 p-4"
    >
      <svg
        width="24"
        height="22"
        fill="none"
        aria-label="bmrks logo"
        viewBox="0 0 26 24"
      />
      <Link
        href="/login"
        className="underline text-woodsmoke-50 hover:text-woodsmoke-100"
      >
        Login
      </Link>
    </motion.nav>
  );
};

export default Header;
