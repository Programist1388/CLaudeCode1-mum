"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";

export function CartButton({ ariaLabel }: { ariaLabel: string }) {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={ariaLabel}
      className="relative flex items-center text-text-dim transition-colors hover:text-gold-soft"
    >
      <svg
        aria-hidden
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold px-1 text-[10.5px] font-bold text-bg">
          {count}
        </span>
      )}
    </Link>
  );
}
