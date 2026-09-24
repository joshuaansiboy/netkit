import assert from "node:assert/strict";
import test from "node:test";
import {
  numberToBinary,
  numberToIpv4,
  parseCidrPrefix,
  parseIpv4,
} from "../src/lib/network/ipv4";
import { calculateSubnet } from "../src/lib/network/subnet";
import { classifyIpv4 } from "../src/lib/network/classify";

function address(input: string) {
  const parsed = parseIpv4(input);
  if (!parsed.ok) throw new Error(`${input}: ${parsed.error}`);
  return parsed.value;
}

test("IPv4 parser accepts decimal addresses and trims surrounding whitespace", () => {
  for (const input of ["192.168.1.1", "10.0.0.1", "172.16.0.1", "8.8.8.8", "0.0.0.0", "255.255.255.255"]) {
    assert.equal(parseIpv4(input).ok, true, input);
  }
  assert.equal(address(" 192.168.1.1 ").text, "192.168.1.1");
  assert.equal(numberToIpv4(address("255.255.255.255").value), "255.255.255.255");
});

test("IPv4 parser rejects malformed addresses and leading zeros", () => {
  for (const input of ["256.1.1.1", "300.168.1.1", "192.168.1", "192.168.1.1.1", "192..1.1", "abc.def.ghi.jkl", "-1.0.0.0", "192.168.01.1", "1.2.3.000", "1e2.2.3.4"]) {
    assert.equal(parseIpv4(input).ok, false, input);
  }
  const invalid = parseIpv4("300.168.1.1");
  if (!invalid.ok) assert.match(invalid.error, /0 and 255/);
});

test("CIDR parser accepts /0 through /32 only", () => {
  for (const prefix of [0, 1, 8, 16, 24, 25, 30, 31, 32]) {
    const parsed = parseCidrPrefix(`/${prefix}`);
    assert.equal(parsed.ok, true);
    if (parsed.ok) assert.equal(parsed.value, prefix);
  }
  for (const input of ["", "/33", "-1", "//24", "/024", "24.0", "abc"]) {
    assert.equal(parseCidrPrefix(input).ok, false, input);
  }
});

test("binary IPv4 and subnet mask formatting are exact", () => {
  assert.equal(numberToBinary(address("192.168.1.1").value), "11000000.10101000.00000001.00000001");
  const result = calculateSubnet(address("192.168.1.50"), 24);
  assert.equal(result.maskBinary, "11111111.11111111.11111111.00000000");
  assert.equal(result.networkBits, 24);
  assert.equal(result.hostBits, 8);
});

test("192.168.1.50/24 returns the conventional expected subnet", () => {
  const result = calculateSubnet(address("192.168.1.50"), 24);
  assert.equal(result.subnetMask, "255.255.255.0");
  assert.equal(result.wildcardMask, "0.0.0.255");
  assert.equal(result.networkAddress, "192.168.1.0");
  assert.equal(result.broadcastAddress, "192.168.1.255");
  assert.equal(result.firstUsableHost, "192.168.1.1");
  assert.equal(result.lastUsableHost, "192.168.1.254");
  assert.equal(result.totalAddresses, 256);
  assert.equal(result.conventionalUsableHosts, 254);
  assert.equal(result.usableHosts, 254);
});

test("subnet arithmetic handles /0, /8, /16, /25, and /30", () => {
  const zero = calculateSubnet(address("203.0.113.50"), 0);
  assert.equal(zero.networkAddress, "0.0.0.0");
  assert.equal(zero.broadcastAddress, "255.255.255.255");
  assert.equal(zero.totalAddresses, 4_294_967_296);
  assert.equal(zero.usableHosts, 4_294_967_294);
  assert.equal(calculateSubnet(address("10.2.3.4"), 8).networkAddress, "10.0.0.0");
  assert.equal(calculateSubnet(address("172.16.7.8"), 16).networkAddress, "172.16.0.0");
  const twentyFive = calculateSubnet(address("192.168.1.130"), 25);
  assert.equal(twentyFive.networkAddress, "192.168.1.128");
  assert.equal(twentyFive.broadcastAddress, "192.168.1.255");
  assert.equal(twentyFive.usableHosts, 126);
  const thirty = calculateSubnet(address("192.168.1.5"), 30);
  assert.equal(thirty.networkAddress, "192.168.1.4");
  assert.equal(thirty.broadcastAddress, "192.168.1.7");
  assert.equal(thirty.firstUsableHost, "192.168.1.5");
  assert.equal(thirty.lastUsableHost, "192.168.1.6");
});

test("high IPv4 values and signed 32-bit boundaries keep unsigned subnet results", () => {
  const lowHalf = calculateSubnet(address("127.255.255.255"), 1);
  assert.equal(lowHalf.subnetMask, "128.0.0.0");
  assert.equal(lowHalf.wildcardMask, "127.255.255.255");
  assert.equal(lowHalf.networkAddress, "0.0.0.0");
  assert.equal(lowHalf.broadcastAddress, "127.255.255.255");
  assert.equal(lowHalf.totalAddresses, 2_147_483_648);
  assert.equal(lowHalf.usableHosts, 2_147_483_646);

  const highHalf = calculateSubnet(address("128.0.0.0"), 1);
  assert.equal(highHalf.networkAddress, "128.0.0.0");
  assert.equal(highHalf.broadcastAddress, "255.255.255.255");
  assert.equal(highHalf.firstUsableHost, "128.0.0.1");
  assert.equal(highHalf.lastUsableHost, "255.255.255.254");
  assert.equal(highHalf.networkBits, 1);
  assert.equal(highHalf.hostBits, 31);

  const upperClassC = calculateSubnet(address("223.255.255.255"), 30);
  assert.equal(upperClassC.networkAddress, "223.255.255.252");
  assert.equal(upperClassC.broadcastAddress, "223.255.255.255");
  assert.equal(upperClassC.firstUsableHost, "223.255.255.253");
  assert.equal(upperClassC.lastUsableHost, "223.255.255.254");
  assert.equal(upperClassC.totalAddresses, 4);

  const upperPair = calculateSubnet(address("255.255.255.255"), 31);
  assert.equal(upperPair.networkAddress, "255.255.255.254");
  assert.equal(upperPair.lastAddress, "255.255.255.255");
  assert.equal(upperPair.broadcastAddress, null);
  assert.equal(upperPair.usableHosts, 2);
  assert.equal(upperPair.ipBinary, "11111111.11111111.11111111.11111111");
});

test("/31 exposes two point-to-point endpoints without a broadcast host range", () => {
  const result = calculateSubnet(address("192.168.1.51"), 31);
  assert.equal(result.mode, "point-to-point");
  assert.equal(result.networkAddress, "192.168.1.50");
  assert.equal(result.lastAddress, "192.168.1.51");
  assert.equal(result.broadcastAddress, null);
  assert.equal(result.firstUsableHost, null);
  assert.equal(result.conventionalUsableHosts, 0);
  assert.equal(result.usableHosts, 2);
});

test("/32 is one host route with no conventional host range", () => {
  const result = calculateSubnet(address("255.255.255.255"), 32);
  assert.equal(result.mode, "host-route");
  assert.equal(result.networkAddress, "255.255.255.255");
  assert.equal(result.lastAddress, "255.255.255.255");
  assert.equal(result.broadcastAddress, null);
  assert.equal(result.firstUsableHost, null);
  assert.equal(result.usableHosts, 1);
  assert.equal(result.conventionalUsableHosts, 0);
});

test("classification recognizes private boundaries and ordinary public space", () => {
  for (const input of ["10.0.0.1", "172.16.0.1", "172.31.255.255", "192.168.1.1"]) {
    assert.equal(classifyIpv4(address(input)).category, "private", input);
  }
  assert.equal(classifyIpv4(address("172.32.0.1")).category, "public");
  assert.equal(classifyIpv4(address("8.8.8.8")).category, "public");
});

test("classification preserves common special-purpose ranges", () => {
  const examples: [string, keyof ReturnType<typeof classifyIpv4>["flags"]][] = [
    ["127.0.0.1", "loopback"],
    ["169.254.1.1", "linkLocal"],
    ["100.64.0.1", "shared"],
    ["192.0.2.1", "documentation"],
    ["198.51.100.1", "documentation"],
    ["203.0.113.1", "documentation"],
    ["198.18.0.1", "benchmarking"],
    ["224.0.0.1", "multicast"],
    ["255.255.255.255", "limitedBroadcast"],
    ["0.0.0.0", "unspecified"],
  ];
  for (const [input, flag] of examples) {
    const classification = classifyIpv4(address(input));
    assert.equal(classification.category, "special", input);
    assert.equal(classification.flags[flag], true, input);
  }
});

test("historical class label does not mislabel multicast as A, B, or C", () => {
  assert.equal(classifyIpv4(address("192.168.1.1")).historicalClass, "Class C");
  assert.match(classifyIpv4(address("224.0.0.1")).historicalClass, /Class D/);
  assert.match(classifyIpv4(address("127.0.0.1")).historicalClass, /Loopback/);
});

test("classification changes correctly at Class A/B/C and multicast boundaries", () => {
  assert.equal(classifyIpv4(address("127.255.255.255")).flags.loopback, true);
  assert.equal(classifyIpv4(address("128.0.0.0")).historicalClass, "Class B");
  assert.equal(classifyIpv4(address("223.255.255.255")).historicalClass, "Class C");
  assert.equal(classifyIpv4(address("224.0.0.0")).flags.multicast, true);
  assert.equal(classifyIpv4(address("255.255.255.255")).flags.limitedBroadcast, true);
});
