"use client";
import { useRef } from "react";
import Header from "@/app/components/Header";
import Section from "@/app/components/Section";
import { InteractiveElements } from "@/app/components/InteractiveElement";
import Link from "next/link";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-woodsmoke-900 text-woodsmoke-100 overflow-hidden items-center"
    >
      <main
        ref={contentRef}
        className="absolute inset-0 m-auto max-w-xl px-5 pt-20 pb-2 text-justify z-10 pointer-events-auto"
      >
        <Header />
        <Section title="Welcome to Bookmarks" delay={0.2}>
          Save anything that matters: hyperlinks, notes, images, videos, or even
          colors you love. Your curated space for everything. Organize, revisit,
          and keep your essentials handy.
        </Section>
        <Section title="Why Use This?" delay={0.3}>
          Crafted with simplicity, style, and speed. This is your quiet corner
          of the internet—no clutter, ads, or distractions. Save links with
          metadata. It&apos;s like magic but{" "}
          <span className="font-bold">boring</span>.
        </Section>
        <Section title="Start Exploring" delay={0.4}>
          <Link
            href="/register"
            className="underline text-woodsmoke-100 hover:text-woodsmoke-200 pointer-events-auto"
          >
            Join now
          </Link>{" "}
          and experience stress-free bookmarking. No promises, no bloat. Just
          you and your saved stuff.
        </Section>
      </main>
      <InteractiveElements
        containerRef={containerRef as React.RefObject<HTMLDivElement>}
        contentRef={contentRef as React.RefObject<HTMLDivElement>}
      />
    </div>
  );
}
