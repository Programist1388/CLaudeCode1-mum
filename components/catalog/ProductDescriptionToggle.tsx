"use client";

import { useState } from "react";

// The "More Info" reveal from the reference site, adapted for catalog
// cards: descriptions stay hidden by default (a deliberate earlier
// decision — see CLAUDE.md), but a tap reveals the real product
// description inline instead of only on the product page.
export function ProductDescriptionToggle({
  description,
  moreLabel,
  lessLabel,
}: {
  description: string;
  moreLabel: string;
  lessLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-line pt-3">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex items-center gap-1.5 text-[12.5px] tracking-[0.03em] text-text-dim transition-colors hover:text-gold-soft"
      >
        {open ? lessLabel : moreLabel}
        <span
          className={`transition-transform duration-300 ${open ? "-rotate-90" : ""}`}
        >
          →
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"
        }`}
      >
        <p className="overflow-hidden text-[13px] leading-relaxed text-text-dim">
          {description}
        </p>
      </div>
    </div>
  );
}
