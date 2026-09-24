import {
  numberToBinary,
  numberToIpv4,
  prefixToMask,
  type IPv4Address,
} from "@/lib/network/ipv4";

export type SubnetMode = "conventional" | "point-to-point" | "host-route";

export interface SubnetResult {
  originalIp: string;
  prefix: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  lastAddress: string;
  broadcastAddress: string | null;
  firstUsableHost: string | null;
  lastUsableHost: string | null;
  totalAddresses: number;
  conventionalUsableHosts: number;
  usableHosts: number;
  mode: SubnetMode;
  networkBits: number;
  hostBits: number;
  ipBinary: string;
  maskBinary: string;
}

export function calculateSubnet(address: IPv4Address, prefix: number): SubnetResult {
  const hostBits = 32 - prefix;
  const mask = prefixToMask(prefix);
  const wildcard = (~mask) >>> 0;
  const network = (address.value & mask) >>> 0;
  const last = (network | wildcard) >>> 0;
  const totalAddresses = 2 ** hostBits;
  const conventionalUsableHosts = prefix <= 30 ? totalAddresses - 2 : 0;
  const mode: SubnetMode =
    prefix === 31 ? "point-to-point" : prefix === 32 ? "host-route" : "conventional";

  return {
    originalIp: address.text,
    prefix,
    subnetMask: numberToIpv4(mask),
    wildcardMask: numberToIpv4(wildcard),
    networkAddress: numberToIpv4(network),
    lastAddress: numberToIpv4(last),
    broadcastAddress: prefix <= 30 ? numberToIpv4(last) : null,
    firstUsableHost: prefix <= 30 ? numberToIpv4(network + 1) : null,
    lastUsableHost: prefix <= 30 ? numberToIpv4(last - 1) : null,
    totalAddresses,
    conventionalUsableHosts,
    usableHosts: prefix === 31 ? 2 : prefix === 32 ? 1 : conventionalUsableHosts,
    mode,
    networkBits: prefix,
    hostBits,
    ipBinary: numberToBinary(address.value),
    maskBinary: numberToBinary(mask),
  };
}
