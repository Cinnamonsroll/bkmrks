"use client";
import { DraggableItem } from "@/app/components/DraggableItem";
import Image from "next/image";

export function StickyNote({
  item,
  containerRef,
}: {
  item: {
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
  };
  containerRef: HTMLDivElement;
}) {
  return (
    <DraggableItem
      containerRef={containerRef}
      position={item.position}
    >
      <div
        className="p-3 rounded-lg text-sm text-white shadow-lg"
        style={{
          boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
        }}
      >
        {item.content}
      </div>
    </DraggableItem>
  );
}

export function ImageCard({
  item,
  containerRef,
}: {
  item: {
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
  };
  containerRef: HTMLDivElement;
}) {
  return (
    <DraggableItem containerRef={containerRef} position={item.position}>
      <div
        className="rounded-lg overflow-hidden shadow-md"
        style={{
          boxShadow: `0 0 16px 4px ${item.color}66`,
        }}
      >
        <Image src={item.src as string} alt={item.alt as string} className="w-48 h-48 object-cover" />
      </div>
    </DraggableItem>
  );
}

export function ColorCard({
  item,
  containerRef,
}: {
  item: {
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
  };
  containerRef: HTMLDivElement;
}) {
  return (
    <DraggableItem containerRef={containerRef} position={item.position}>
      <div
        className="w-24 h-24 rounded-lg mb-2 mx-auto relative"
        style={{
          backgroundColor: item.color,
          boxShadow: `0 0 12px ${item.color}AA`,
        }}
      ></div>
      <p className="text-sm font-semibold text-white text-center">
        {item.name}
      </p>
      <p className="text-xs text-gray-400 text-center">{item.color}</p>
    </DraggableItem>
  );
}

export function LinkCard({
  item,
  containerRef,
}: {
  item: {
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
  };
  containerRef: HTMLDivElement;
}) {
  return (
    <DraggableItem
      containerRef={containerRef}
      position={item.position}
      bgColor="bg-white/10"
    >
      <div
        className="flex items-center px-3 py-2 rounded-md bg-white/10 backdrop-blur-md shadow-md"
        style={{
          boxShadow: `0 0 6px 2px ${item.color}99`,
        }}
      >
        <Image
          src={item.image as string}
          draggable={false}
          alt={`${item.title} thumbnail`}
          className="w-8 h-8 rounded-sm"
        />

        <div className="ml-3">
          <p className="text-gray-100 text-xs font-medium">{item.title}</p>
          <p className="text-gray-400 text-xs truncate">{item.description}</p>
        </div>
      </div>
    </DraggableItem>
  );
}
