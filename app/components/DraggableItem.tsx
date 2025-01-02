import { useState, useEffect, useMemo, useCallback } from "react";

export function DraggableItem({
  children,
  containerRef,
  position,
  bgColor = "bg-woodsmoke-700",
}: {
  children: React.ReactNode;
  containerRef: HTMLDivElement | null;
  position: { x: string; y: string };
  bgColor?: string;
}) {
  const randomRotation = useMemo(() => Math.random() * 10 - 5, []);
  const [pos, setPos] = useState({ x: parseInt(position.x, 10), y: parseInt(position.y, 10) });
  const [isDragging, setIsDragging] = useState(false);
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const [bounds, setBounds] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const [dragStart, setDragStart] = useState(false); 

  useEffect(() => {
    if (containerRef) {
      const { width, height } = containerRef.getBoundingClientRect();
      setBounds({ top: 0, left: 0, right: width, bottom: height });
    }
  }, [containerRef]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentTarget = e.currentTarget as HTMLDivElement;
    const shiftX = e.clientX - currentTarget.getBoundingClientRect().left;
    const shiftY = e.clientY - currentTarget.getBoundingClientRect().top;

    setShift({ x: shiftX, y: shiftY });
    setDragStart(true);  
    setIsDragging(true); 
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;  

      let newPosX = e.clientX - shift.x;
      let newPosY = e.clientY - shift.y;

      
      if (newPosX < bounds.left) newPosX = bounds.left;
      if (newPosY < bounds.top) newPosY = bounds.top;
      if (newPosX > bounds.right) newPosX = bounds.right;
      if (newPosY > bounds.bottom) newPosY = bounds.bottom;

      setPos({ x: newPosX, y: newPosY });
    },
    [isDragging, shift, bounds]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(false); 
  };

  
  useEffect(() => {
    const bodyStyle = document.body.style;

    if (isDragging) {
      bodyStyle.cursor = 'grabbing'; 
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      bodyStyle.cursor = dragStart ? 'grab' : ''; 
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, handleMouseMove]);

  return (
    <div
      className={`absolute p-2 rounded-lg shadow-md ${bgColor} *:cursor-grab *:active:cursor-grabbing pointer-events-auto`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${randomRotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}
