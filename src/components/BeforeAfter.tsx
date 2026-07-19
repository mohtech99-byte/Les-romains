/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface BeforeAfterProps {
  before: string;
  after: string;
  heightClass?: string;
  labelBefore?: string;
  labelAfter?: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  before,
  after,
  heightClass = 'h-[350px] md:h-[500px]',
  labelBefore = 'BEFORE',
  labelAfter = 'AFTER'
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none cursor-ew-resize rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl ${heightClass}`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* After Image (Background) */}
      {after ? (
        <img 
          src={after} 
          alt="After comparison" 
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />
      ) : null}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white text-[10px] tracking-widest font-mono py-1 px-2.5 rounded border border-white/10 z-10">
        {labelAfter}
      </div>

      {/* Before Image (Clipping Overlay) */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        {before ? (
          <img 
            src={before} 
            alt="Before comparison" 
            className="absolute top-0 left-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current?.getBoundingClientRect().width }}
            referrerPolicy="no-referrer"
          />
        ) : null}
      </div>
      <div className="absolute top-4 left-4 bg-accent text-white text-[10px] tracking-widest font-mono py-1 px-2.5 rounded z-10">
        {labelBefore}
      </div>

      {/* Slide Handle/Line */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-accent z-20 cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-accent backdrop-blur-md rounded-full shadow-lg border border-white/20 flex items-center justify-center pointer-events-none">
          <div className="flex gap-1">
            <span className="w-1 h-3 bg-white/70 rounded-full" />
            <span className="w-1 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
