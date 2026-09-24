import assert from "node:assert/strict";
import test from "node:test";
import {
  convertSpeed,
  estimateDownloadTime,
  formatDuration,
  formatQuantity,
  parsePositiveDecimal,
} from "../src/lib/bandwidth/calculations";

test("10 GB at 100 Mbps is 800 seconds using decimal units", () => {
  const result = estimateDownloadTime(10, "GB", 100, "Mbps");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.fileBits, 80_000_000_000);
  assert.equal(result.value.bitsPerSecond, 100_000_000);
  assert.equal(result.value.seconds, 800);
  assert.equal(formatDuration(result.value.seconds), "13 minutes 20 seconds");
});

test("download time works across file and speed units", () => {
  const cases = [
    [1, "MB", 8, "Mbps", 1],
    [1, "GB", 1, "Gbps", 8],
    [1, "TB", 100, "Mbps", 80_000],
    [1, "KB", 8, "Kbps", 1],
  ] as const;
  for (const [size, fileUnit, speed, speedUnit, seconds] of cases) {
    const result = estimateDownloadTime(size, fileUnit, speed, speedUnit);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.seconds, seconds);
  }
});

test("speed conversion uses 1000-based units", () => {
  const result = convertSpeed(1, "Gbps");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.value, { Kbps: 1_000_000, Mbps: 1_000, Gbps: 1 });
  const small = convertSpeed(300, "Kbps");
  assert.equal(small.ok, true);
  if (small.ok) assert.equal(formatQuantity(small.value.Gbps), "0.0003");
});

test("numeric input rejects empty, malformed, zero, negative and oversized values", () => {
  for (const input of ["", "0", "-1", "Infinity", "NaN", "1e3", "12abc", "1000000000001"]) {
    assert.equal(parsePositiveDecimal(input, "File size").ok, false, input);
  }
  assert.equal(parsePositiveDecimal(" 0.5 ", "File size").ok, true);
  assert.equal(estimateDownloadTime(0, "GB", 100, "Mbps").ok, false);
  assert.equal(convertSpeed(-10, "Mbps").ok, false);
});

test("duration and quantity formatting remain readable", () => {
  assert.equal(formatDuration(0.5), "Less than 1 second");
  assert.equal(formatDuration(3_661), "1 hour 1 minute");
  assert.equal(formatQuantity(0.30000000000000004), "0.3");
});

test("very small and large supported values do not expose zero or non-finite results", () => {
  const small = estimateDownloadTime(0.001, "KB", 1, "Mbps");
  assert.equal(small.ok, true);
  if (small.ok) assert.equal(small.value.seconds, 0.000008);

  const large = estimateDownloadTime(1_000_000_000_000, "TB", 1_000_000_000_000, "Gbps");
  assert.equal(large.ok, true);
  if (large.ok) {
    assert.equal(large.value.seconds, 8000);
    assert.ok(Number.isFinite(large.value.fileBits));
  }

  assert.equal(estimateDownloadTime(Number.MIN_VALUE, "KB", 1, "Gbps").ok, false);
  assert.equal(convertSpeed(Number.MIN_VALUE, "Kbps").ok, false);
  assert.equal(estimateDownloadTime(1e308, "TB", 1e308, "Gbps").ok, false);
});
