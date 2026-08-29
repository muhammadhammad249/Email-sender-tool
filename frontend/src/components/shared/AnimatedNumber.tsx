'use client';
import React, { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
}

export function AnimatedNumber({ value, duration = 1500, format = (v) => v.toString() }: AnimatedNumberProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCurrentValue(value);
      return;
    }

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const progress = Math.min((time - startTimeRef.current) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCurrentValue(Math.floor(easeProgress * value));

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(value);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [value, duration]);

  return <span>{format(currentValue)}</span>;
}
