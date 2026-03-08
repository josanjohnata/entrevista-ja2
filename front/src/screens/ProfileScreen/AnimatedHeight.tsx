import React, { useRef, useState, useLayoutEffect } from 'react';

interface AnimatedHeightProps {
  children: React.ReactNode;
  duration?: number;
}

export const AnimatedHeight: React.FC<AnimatedHeightProps> = ({ children, duration = 400 }) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const initialized = useRef(false);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        if (h > 0) {
          setHeight(h);
          if (!initialized.current) initialized.current = true;
        }
      }
    });

    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        overflow: 'hidden',
        transition: initialized.current
          ? `height ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`
          : 'none',
        height: height !== undefined ? `${height}px` : 'auto',
      }}
    >
      <div ref={innerRef}>
        {children}
      </div>
    </div>
  );
};
