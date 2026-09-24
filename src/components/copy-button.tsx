"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";

interface CopyButtonProps {
  value: string;
  label: string;
  className?: string;
}

export function CopyButton({ value, label, className = "" }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }

  const text = status === "copied" ? "Copied" : status === "error" ? "Copy failed" : "Copy";
  return (
    <button
      type="button"
      className={`copy-button ${className}`}
      onClick={copy}
      aria-label={status === "error" ? `Could not copy ${label}. Select the value to copy.` : `${text} ${label}`}
      title={status === "error" ? "Clipboard unavailable. Select the value to copy." : `Copy ${label}`}
    >
      <Icon name={status === "copied" ? "check" : "copy"} size={14} />
      <span aria-live="polite">{text}</span>
    </button>
  );
}
