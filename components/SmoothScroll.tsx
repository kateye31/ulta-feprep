"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Buttery smooth scrolling (Lenis) + scroll-reveal for anything marked data-reveal. */
export default function SmoothScroll() {
  const path = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -90 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          y: 24,
          opacity: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    });
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(refresh);
      ctx.revert();
    };
  }, [path]);

  return null;
}
