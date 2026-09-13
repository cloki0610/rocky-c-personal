"use client";

import { useRef, type ReactNode } from "react";
import { TransitionRouter } from "next-transition-router";
import SiteMenu from "./SiteMenu";

export default function PageTransition({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);

  const fade = (next: () => void, entering: boolean) => {
    const element = content.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      next();
      return;
    }

    const animation = element.animate(
      { opacity: entering ? [0, 1] : [1, 0] },
      { duration: entering ? 240 : 160, easing: "ease-out", fill: "forwards" },
    );
    animation.onfinish = next;
    return () => animation.cancel();
  };

  return (
    <TransitionRouter
      leave={(next) => fade(next, false)}
      enter={(next) => fade(next, true)}
    >
      <SiteMenu />
      <div ref={content}>{children}</div>
    </TransitionRouter>
  );
}
