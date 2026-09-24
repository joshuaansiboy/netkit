import type { IconName } from "@/components/icon";

export interface ToolLink {
  href: string;
  name: string;
  description: string;
  icon: IconName;
}

export const TOOL_LINKS: ToolLink[] = [
  { href: "/subnet", name: "Subnet Calculator", description: "Find IPv4 ranges, masks, and usable addresses.", icon: "calculator" },
  { href: "/ip-checker", name: "IP Address Checker", description: "Validate and understand an IPv4 address.", icon: "search" },
  { href: "/ports", name: "Port Reference", description: "Explore common ports and their services.", icon: "server" },
  { href: "/bandwidth", name: "Bandwidth Calculator", description: "Estimate downloads and convert speeds.", icon: "bolt" },
];
