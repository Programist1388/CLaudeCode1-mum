"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

// A plain <Link> can't guarantee its .catalog-press-active animation (see
// globals.css) is actually seen: a real click's mousedown-to-navigation
// window is often shorter than the animation itself, and the very thing
// that ends the animation early — navigating to /catalog — is what this
// button does. So this holds the route change for one animation cycle
// instead of letting Next.js navigate on click immediately.
export function CatalogLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (pressed) return;
    setPressed(true);
    window.setTimeout(() => router.push(href), 320);
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`catalog-press ${pressed ? "catalog-press-active" : ""} ${className}`}
    >
      {children}
    </a>
  );
}
