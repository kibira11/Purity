import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const IconMap = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 4 3 6.5v13L9 17l6 3 6-2.5v-13L15 7 9 4Z" />
    <path d="M9 4v13M15 7v13" />
  </svg>
);
export const IconPlay = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m10 8.5 5 3.5-5 3.5v-7Z" />
  </svg>
);
export const IconLamp = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3c2.5 3 4 4.7 4 7a4 4 0 0 1-8 0c0-2.3 1.5-4 4-7Z" />
    <path d="M7 17h10M9 20.5h6" />
  </svg>
);
export const IconTogether = (p: P) => (
  <svg {...base(p)}>
    <circle cx="8.5" cy="8" r="3" />
    <circle cx="16" cy="9" r="2.5" />
    <path d="M3 19c.5-3.2 2.7-5 5.5-5s5 1.8 5.5 5M14.5 14.2c.5-.1 1-.2 1.5-.2 2.3 0 4.2 1.5 4.8 4.5" />
  </svg>
);
export const IconMore = (p: P) => (
  <svg {...base(p)}>
    <circle cx="5" cy="12" r="1.2" />
    <circle cx="12" cy="12" r="1.2" />
    <circle cx="19" cy="12" r="1.2" />
  </svg>
);
export const IconWing = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 17c4.5 0 7-2.5 9-6.5C13.5 7 16 5 21 5c-1 5-3.5 8.5-8 10-2 .7-4.5 1.600-7 2" />
    <path d="M8 19c2-.4 3.600-1.200 5-2.500" />
  </svg>
);
export const IconBook = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 5.500C4 4.700 4.700 4 5.500 4H11v15H5.500A1.500 1.500 0 0 0 4 20.500v-15Z" />
    <path d="M20 5.500c0-.8-.7-1.500-1.500-1.500H13v15h5.500c.8 0 1.500.7 1.500 1.500v-15Z" />
  </svg>
);
export const IconLock = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.500 4.500 4.500L19 7.500" />
  </svg>
);
export const IconStone = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 16c0-4 3-8 8-8s8 4 8 8c0 2-1.500 3-3 3H7c-1.500 0-3-1-3-3Z" />
    <path d="M9 14c1-1 2-1.500 3.500-1.500" />
  </svg>
);
export const IconArrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconBack = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const IconSparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.500 2.500M15.500 15.500 18 18M18 6l-2.500 2.500M8.500 15.500 6 18" />
  </svg>
);
