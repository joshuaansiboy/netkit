import assert from "node:assert/strict";
import test from "node:test";
import { filterPorts, PORT_CATEGORIES, PORTS } from "../src/data/ports";

test("curated port records have valid numbers, transports, and categories", () => {
  const seen = new Set<number>();
  for (const entry of PORTS) {
    assert.ok(Number.isInteger(entry.port) && entry.port >= 0 && entry.port <= 65535);
    assert.ok(!seen.has(entry.port), `Duplicate port ${entry.port}`);
    seen.add(entry.port);
    assert.ok(entry.transports.length > 0);
    assert.ok(entry.transports.every((protocol) => protocol === "TCP" || protocol === "UDP"));
    assert.ok(PORT_CATEGORIES.includes(entry.category));
    assert.ok(entry.service && entry.description && entry.commonUse);
  }
  assert.ok(PORTS.length >= 39);
  for (const category of PORT_CATEGORIES.filter((item) => item !== "All")) {
    assert.ok(PORTS.some((entry) => entry.category === category), `${category} has no entries`);
  }
});

test("search matches exact numbers and partial service or description text", () => {
  assert.deepEqual(filterPorts("443", "All").map((entry) => entry.port), [443]);
  assert.ok(filterPorts("http", "All").some((entry) => entry.service === "HTTPS"));
  assert.ok(filterPorts("secure shell", "All").some((entry) => entry.service === "SSH"));
  assert.ok(filterPorts("remote desktop", "All").some((entry) => entry.service === "RDP"));
  assert.deepEqual(filterPorts("99999", "All"), []);
});

test("search and category filters combine", () => {
  assert.deepEqual(filterPorts("http", "Email"), []);
  assert.ok(filterPorts("http", "Web").every((entry) => entry.category === "Web"));
  assert.deepEqual(filterPorts("sYsLoG", "Infrastructure").map((entry) => entry.port), [514]);
  assert.deepEqual(filterPorts("514", "Web"), []);
});

test("port 514 identifies registered UDP syslog rather than TCP shell", () => {
  const syslog = PORTS.find((entry) => entry.port === 514);
  assert.ok(syslog);
  assert.deepEqual(syslog.transports, ["UDP"]);
});
