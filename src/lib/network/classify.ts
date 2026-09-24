import { ipv4ToNumber, isInCidr, type IPv4Address, type IPv4Octets } from "@/lib/network/ipv4";

export type AddressCategory = "private" | "special" | "public";

interface AddressRule {
  start: IPv4Octets;
  prefix: number;
  code: string;
  category: AddressCategory;
  label: string;
  description: string;
}

// Ordered from specific to broad. This is a curated educational subset of the
// IANA IPv4 Special-Purpose Address Registry, not a live or exhaustive registry.
const ADDRESS_RULES: AddressRule[] = [
  { start: [0, 0, 0, 0], prefix: 32, code: "unspecified", category: "special", label: "Unspecified address", description: "0.0.0.0 means no specific IPv4 address has been selected." },
  { start: [255, 255, 255, 255], prefix: 32, code: "limited-broadcast", category: "special", label: "Limited broadcast", description: "255.255.255.255 addresses the local network segment; routers do not forward it as an ordinary destination." },
  { start: [10, 0, 0, 0], prefix: 8, code: "private", category: "private", label: "Private IPv4", description: "Used inside private networks. It is not directly routed across the public Internet." },
  { start: [172, 16, 0, 0], prefix: 12, code: "private", category: "private", label: "Private IPv4", description: "Used inside private networks. It is not directly routed across the public Internet." },
  { start: [192, 168, 0, 0], prefix: 16, code: "private", category: "private", label: "Private IPv4", description: "Used inside private networks. It is not directly routed across the public Internet." },
  { start: [127, 0, 0, 0], prefix: 8, code: "loopback", category: "special", label: "Loopback", description: "Refers back to the same device. 127.0.0.1 is the familiar localhost address." },
  { start: [169, 254, 0, 0], prefix: 16, code: "link-local", category: "special", label: "Link-local", description: "Used on the local link, often when a device cannot obtain an address through DHCP." },
  { start: [100, 64, 0, 0], prefix: 10, code: "shared", category: "special", label: "Shared address space (CGNAT)", description: "Reserved for use between an ISP and its customers in carrier-grade NAT networks." },
  { start: [192, 0, 2, 0], prefix: 24, code: "documentation", category: "special", label: "Documentation range", description: "TEST-NET-1 is reserved for examples and documentation." },
  { start: [198, 51, 100, 0], prefix: 24, code: "documentation", category: "special", label: "Documentation range", description: "TEST-NET-2 is reserved for examples and documentation." },
  { start: [203, 0, 113, 0], prefix: 24, code: "documentation", category: "special", label: "Documentation range", description: "TEST-NET-3 is reserved for examples and documentation." },
  { start: [198, 18, 0, 0], prefix: 15, code: "benchmarking", category: "special", label: "Benchmarking range", description: "Reserved for benchmarking network devices and isolated testing." },
  { start: [192, 0, 0, 0], prefix: 24, code: "protocol", category: "special", label: "IETF protocol assignments", description: "This block contains protocol assignments with different rules for individual addresses." },
  { start: [192, 88, 99, 0], prefix: 24, code: "deprecated", category: "special", label: "Deprecated 6to4 relay range", description: "Historically used by 6to4 relays; it is not ordinary general-purpose host space." },
  { start: [224, 0, 0, 0], prefix: 4, code: "multicast", category: "special", label: "Multicast", description: "Used to address a group of receivers, rather than one ordinary host." },
  { start: [240, 0, 0, 0], prefix: 4, code: "reserved", category: "special", label: "Reserved address space", description: "Reserved for future or special use, rather than ordinary public hosts." },
  { start: [0, 0, 0, 0], prefix: 8, code: "this-network", category: "special", label: "This-network range", description: "Part of the special-purpose 0.0.0.0/8 block." },
];

export interface AddressClassification {
  category: AddressCategory;
  label: string;
  description: string;
  matchedRange: string | null;
  historicalClass: string;
  flags: {
    private: boolean;
    loopback: boolean;
    linkLocal: boolean;
    multicast: boolean;
    unspecified: boolean;
    limitedBroadcast: boolean;
    documentation: boolean;
    shared: boolean;
    benchmarking: boolean;
  };
}

function historicalClass(firstOctet: number): string {
  if (firstOctet === 0) return "Special 0/8 block";
  if (firstOctet < 127) return "Class A";
  if (firstOctet === 127) return "Loopback block (historically Class A)";
  if (firstOctet < 192) return "Class B";
  if (firstOctet < 224) return "Class C";
  if (firstOctet < 240) return "Class D (multicast)";
  return "Class E / reserved";
}

export function classifyIpv4(address: IPv4Address): AddressClassification {
  const rule = ADDRESS_RULES.find((candidate) =>
    isInCidr(address.value, ipv4ToNumber(candidate.start), candidate.prefix),
  );
  const code = rule?.code;

  return {
    category: rule?.category ?? "public",
    label: rule?.label ?? "Likely public IPv4 space",
    description:
      rule?.description ??
      "This address is outside NetKit's curated special-purpose list. This offline check cannot confirm routing, ownership, or reachability.",
    matchedRange: rule ? `${rule.start.join(".")}/${rule.prefix}` : null,
    historicalClass: historicalClass(address.octets[0]),
    flags: {
      private: code === "private",
      loopback: code === "loopback",
      linkLocal: code === "link-local",
      multicast: code === "multicast",
      unspecified: code === "unspecified",
      limitedBroadcast: code === "limited-broadcast",
      documentation: code === "documentation",
      shared: code === "shared",
      benchmarking: code === "benchmarking",
    },
  };
}
