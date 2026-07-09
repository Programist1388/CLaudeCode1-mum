"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// The reference site fades/rises nearly every section into view as you
// scroll to it rather than rendering everything visible up front. This is
// the same idea via IntersectionObserver — a client component that just
// observes and toggles a class; the children themselves stay whatever they
// already were (usually server-rendered markup), so wrapping a section's
// content in this doesn't require turning that section into a Client
// Component.
export function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setVisible(true), delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
