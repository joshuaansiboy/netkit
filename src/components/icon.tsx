import type { SVGProps } from "react";

export type IconName =
  | "globe" | "calculator" | "search" | "server" | "bolt" | "book"
  | "info" | "arrow" | "chevron" | "sun" | "moon" | "copy"
  | "check" | "menu" | "reset" | "clock" | "shield";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  const content = {
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
    calculator: <><rect x="5" y="2.5" width="14" height="19" rx="2" /><path d="M8 6.5h8M8 11h2m4 0h2m-8 4h2m4 0h2m-8 4h2m4 0h2" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.5 15.5 5 5" /></>,
    server: <><rect x="4" y="3" width="16" height="5" rx="1.4" /><rect x="4" y="10" width="16" height="5" rx="1.4" /><rect x="4" y="17" width="16" height="4" rx="1.4" /><path d="M7.5 5.5h.01M7.5 12.5h.01M7.5 19h.01" strokeLinecap="round" strokeWidth="2.5" /></>,
    bolt: <path d="m13 2-9 11h7l-1 9 10-12h-7l.5-8Z" />,
    book: <><path d="M12 5.5c-2.5-2-5.6-2.5-9-2v15c3.4-.5 6.5 0 9 2 2.5-2 5.6-2.5 9-2v-15c-3.4-.5-6.5 0-9 2Z" /><path d="M12 5.5v15" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 10.5v5M12 7.5h.01" strokeLinecap="round" strokeWidth="2.5" /></>,
    arrow: <><path d="M4 12h16m-6-6 6 6-6 6" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    moon: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />,
    copy: <><rect x="8" y="8" width="11" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    check: <path d="m4 12 5 5L20 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    reset: <><path d="M4 11a8 8 0 1 1 2.2 6.4M4 17v-6h6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    shield: <><path d="M12 2 4 5v6c0 5.2 3.3 8.6 8 11 4.7-2.4 8-5.8 8-11V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  }[name];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {content}
    </svg>
  );
}
