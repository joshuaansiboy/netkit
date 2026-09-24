import type { Validation } from "@/lib/validation";

export const FILE_UNITS = ["KB", "MB", "GB", "TB"] as const;
export const SPEED_UNITS = ["Kbps", "Mbps", "Gbps"] as const;

export type FileUnit = (typeof FILE_UNITS)[number];
export type SpeedUnit = (typeof SPEED_UNITS)[number];

const BYTES_PER_UNIT: Record<FileUnit, number> = {
  KB: 1_000,
  MB: 1_000_000,
  GB: 1_000_000_000,
  TB: 1_000_000_000_000,
};

const BITS_PER_SECOND: Record<SpeedUnit, number> = {
  Kbps: 1_000,
  Mbps: 1_000_000,
  Gbps: 1_000_000_000,
};

const MAX_INPUT = 1_000_000_000_000;
const MAX_SECONDS = 1_000_000_000_000;
const DECIMAL_NUMBER = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

export interface DownloadEstimate {
  fileBits: number;
  bitsPerSecond: number;
  seconds: number;
}

export function parsePositiveDecimal(raw: string, label: string): Validation<number> {
  const input = raw.trim();
  if (!input) return { ok: false, error: `Enter a ${label.toLowerCase()}.` };
  if (!DECIMAL_NUMBER.test(input)) {
    return { ok: false, error: `${label} must be a positive decimal number.` };
  }
  const value = Number(input);
  if (!Number.isFinite(value) || value <= 0) {
    return { ok: false, error: `${label} must be greater than zero.` };
  }
  if (value > MAX_INPUT) {
    return { ok: false, error: `${label} must be at most 1,000,000,000,000.` };
  }
  return { ok: true, value };
}

export function estimateDownloadTime(
  fileSize: number,
  fileUnit: FileUnit,
  speed: number,
  speedUnit: SpeedUnit,
): Validation<DownloadEstimate> {
  if (!Number.isFinite(fileSize) || !Number.isFinite(speed) || fileSize <= 0 || speed <= 0) {
    return { ok: false, error: "File size and internet speed must be greater than zero." };
  }
  const fileBits = fileSize * BYTES_PER_UNIT[fileUnit] * 8;
  const bitsPerSecond = speed * BITS_PER_SECOND[speedUnit];
  if (!Number.isFinite(fileBits) || !Number.isFinite(bitsPerSecond) || fileBits === 0 || bitsPerSecond === 0) {
    return { ok: false, error: "These values are outside the supported numeric range." };
  }
  const seconds = fileBits / bitsPerSecond;
  if (!Number.isFinite(seconds) || seconds === 0 || seconds > MAX_SECONDS) {
    return { ok: false, error: "This estimate is outside the supported range. Adjust the file size or speed." };
  }
  return { ok: true, value: { fileBits, bitsPerSecond, seconds } };
}

export function convertSpeed(
  amount: number,
  from: SpeedUnit,
): Validation<Record<SpeedUnit, number>> {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Speed must be greater than zero." };
  }
  const bitsPerSecond = amount * BITS_PER_SECOND[from];
  if (!Number.isFinite(bitsPerSecond)) {
    return { ok: false, error: "This speed is too large to convert." };
  }
  const converted = {
    Kbps: bitsPerSecond / BITS_PER_SECOND.Kbps,
    Mbps: bitsPerSecond / BITS_PER_SECOND.Mbps,
    Gbps: bitsPerSecond / BITS_PER_SECOND.Gbps,
  };
  if (Object.values(converted).some((value) => !Number.isFinite(value) || value === 0)) {
    return { ok: false, error: "This speed is outside the supported numeric range." };
  }
  return {
    ok: true,
    value: converted,
  };
}

export function formatQuantity(value: number): string {
  if (value !== 0 && (Math.abs(value) < 0.000001 || Math.abs(value) >= 1e15)) {
    return value.toExponential(4);
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(value);
}

export function formatDuration(seconds: number): string {
  if (seconds < 1) return "Less than 1 second";
  let remaining = Math.round(seconds);
  const units: [string, number][] = [
    ["year", 31_536_000],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
    ["second", 1],
  ];
  const parts: string[] = [];
  for (const [name, size] of units) {
    const count = Math.floor(remaining / size);
    remaining %= size;
    if (count > 0) parts.push(`${formatQuantity(count)} ${name}${count === 1 ? "" : "s"}`);
    if (parts.length === 2) break;
  }
  return parts.join(" ");
}
