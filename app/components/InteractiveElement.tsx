"use client";
import { useState, useEffect } from "react";
import { getRandomColor } from "@/app/utils/lib";
import {
  ColorCard,
  ImageCard,
  LinkCard,
  StickyNote,
} from "@/app/components/Elements";

export function InteractiveElements({
  containerRef,
  contentRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
}) {
  const [items, setItems] = useState<
    {
      type: string;
      position: { x: string; y: string };
      content?: string;
      title?: string;
      description?: string;
      image?: string;
      color?: string;
      src?: string;
      name?: string;
      alt?: string;
    }[]
  >([]);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const containerBounds = containerRef.current.getBoundingClientRect();
    const contentBounds = contentRef.current.getBoundingClientRect();

    function getValidPosition() {
      const padding = 20;
      let x: number, y: number;
      do {
        x = Math.random() * (containerBounds.width - 200) + padding;
        y = Math.random() * (containerBounds.height - 200) + padding;
      } while (
        x + 100 > contentBounds.left &&
        x - 100 < contentBounds.right &&
        y + 100 > contentBounds.top &&
        y - 100 < contentBounds.bottom
      );
      return { x: `${x}px`, y: `${y}px` };
    }

    setItems([
      {
        type: "sticky",
        content: "💡 Tip: Drag me anywhere!",
        position: getValidPosition(),
      },
      {
        type: "sticky",
        content: "📝 Organize your thoughts.",
        position: getValidPosition(),
      },
      {
        type: "image",
        src: "https://picsum.photos/300",
        alt: "Inspiration Image",
        position: getValidPosition(),
        color: getRandomColor(),
      },
      {
        type: "color",
        color: "#F87171",
        name: "Red Sunset",
        position: getValidPosition(),
      },
      {
        type: "link",
        title: "Learn Next.js",
        description: "Build fast, modern web apps with Next.js.",
        image: "https://favicone.com/nextjs.org?s=256",
        position: getValidPosition(),
        color: "#161616",
      },
    ]);
  }, [containerRef, contentRef]);

  return (
    <>
      {items.map((item, index) => {
        switch (item.type) {
          case "sticky":
            return (
              <StickyNote
                key={index}
                item={item}
                containerRef={containerRef.current}
              />
            );
          case "image":
            return (
              <ImageCard
                key={index}
                item={item}
                containerRef={containerRef.current}
              />
            );
          case "color":
            return (
              <ColorCard
                key={index}
                item={item}
                containerRef={containerRef.current}
              />
            );
          case "link":
            return (
              <LinkCard
                key={index}
                item={item}
                containerRef={containerRef.current}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
