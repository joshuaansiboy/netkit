import type { Validation } from "@/lib/validation";

export type IPv4Octets = [number, number, number, number];

export interface IPv4Address {
  octets: IPv4Octets;
  text: string;
  value: number;
}

const DECIMAL_OCTET = /^(0|[1-9]\d{0,2})$/;
const DECIMAL_PREFIX = /^(0|[1-9]\d?)$/;

export function ipv4ToNumber(octets: IPv4Octets): number {
  return octets.reduce((value, octet) => value * 256 + octet, 0);
}

export function numberToOctets(value: number): IPv4Octets {
  return [
    value >>> 24,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ];
}

export function numberToIpv4(value: number): string {
  return numberToOctets(value).join(".");
}

export function numberToBinary(value: number): string {
  return numberToOctets(value)
    .map((octet) => octet.toString(2).padStart(8, "0"))
    .join(".");
}

export function parseIpv4(raw: string): Validation<IPv4Address> {
  const input = raw.trim();
  if (!input) return { ok: false, error: "Enter an IPv4 address." };

  const parts = input.split(".");
  if (parts.length !== 4) {
    return {
      ok: false,
      error: "An IPv4 address needs exactly four decimal octets, such as 192.168.1.50.",
    };
  }
  if (parts.some((part) => /^0\d+$/.test(part))) {
    return {
      ok: false,
      error: "Leading zeros are not allowed in IPv4 octets. Write 1 instead of 01.",
    };
  }
  if (parts.some((part) => !/^\d+$/.test(part))) {
    return {
      ok: false,
      error: "Each IPv4 octet must contain decimal digits from 0 to 255.",
    };
  }
  if (parts.some((part) => !DECIMAL_OCTET.test(part) || Number(part) > 255)) {
    return {
      ok: false,
      error: `${input} is not a valid IPv4 address. Each octet must be between 0 and 255.`,
    };
  }

  const octets: IPv4Octets = [
    Number(parts[0]),
    Number(parts[1]),
    Number(parts[2]),
    Number(parts[3]),
  ];
  return {
    ok: true,
    value: { octets, text: octets.join("."), value: ipv4ToNumber(octets) },
  };
}

export function parseCidrPrefix(raw: string): Validation<number> {
  const input = raw.trim();
  const digits = input.startsWith("/") ? input.slice(1) : input;
  if (!DECIMAL_PREFIX.test(digits) || Number(digits) > 32) {
    return {
      ok: false,
      error: "Enter a CIDR prefix from /0 to /32, such as /24.",
    };
  }
  return { ok: true, value: Number(digits) };
}

export function prefixToMask(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

export function isInCidr(
  addressValue: number,
  rangeStart: number,
  prefix: number,
): boolean {
  const mask = prefixToMask(prefix);
  return (addressValue & mask) === (rangeStart & mask);
}
