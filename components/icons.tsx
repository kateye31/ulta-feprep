/** A small hand-drawn-feeling icon set: one 2.2px round stroke, 24px grid, currentColor. */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function I({ size = 22, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...rest}>
      {children}
    </svg>
  );
}

export const IconMenu = (p: P) => (
  <I {...p}>
    <path d="M4 7h16M4 12h16M4 17h11" />
  </I>
);
export const IconClose = (p: P) => (
  <I {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </I>
);
export const IconChevron = (p: P) => (
  <I {...p}>
    <path d="M6 9l6 6 6-6" />
  </I>
);
export const IconPlay = (p: P) => (
  <I {...p}>
    <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
  </I>
);
export const IconPause = (p: P) => (
  <I {...p}>
    <path d="M8 5v14M16 5v14" />
  </I>
);
export const IconReset = (p: P) => (
  <I {...p}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" />
  </I>
);
export const IconBulb = (p: P) => (
  <I {...p}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
  </I>
);
export const IconCheck = (p: P) => (
  <I {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </I>
);
export const IconArrow = (p: P) => (
  <I {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </I>
);
export const IconShuffle = (p: P) => (
  <I {...p}>
    <path d="M4 7h3.5c4 0 5 10 9 10H20M4 17h3.5c1.6 0 2.7-1.5 3.6-3.3M14.3 9c.8-1.2 1.7-2 2.7-2H20M17.5 4.5L20 7l-2.5 2.5M17.5 14.5L20 17l-2.5 2.5" />
  </I>
);
export const IconStar = (p: P) => (
  <I {...p}>
    <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="currentColor" strokeWidth={1.4} />
  </I>
);
export const IconTimer = (p: P) => (
  <I {...p}>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 9.5v4l2.5 2M10 2.5h4M18.5 6l1.5-1.5" />
  </I>
);
export const IconRain = (p: P) => (
  <I {...p}>
    <path d="M7 15.5a4.5 4.5 0 1 1 1.6-8.7A5.5 5.5 0 0 1 19 9.5a3 3 0 0 1-.5 6H7z" />
    <path d="M8.5 18.5l-1 2M12.5 18.5l-1 2M16.5 18.5l-1 2" />
  </I>
);
export const IconTarget = (p: P) => (
  <I {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </I>
);
