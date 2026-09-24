"use client";

import { useState, type FormEvent } from "react";
import { BinaryCode } from "@/components/binary-code";
import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/icon";
import { classifyIpv4, type AddressClassification } from "@/lib/network/classify";
import { numberToBinary, parseIpv4, type IPv4Address } from "@/lib/network/ipv4";

interface CheckedAddress { address: IPv4Address; classification: AddressClassification }

export function IpChecker() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<CheckedAddress | null>(null);

  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseIpv4(input);
    if (!parsed.ok) {
      setError(parsed.error);
      setResult(null);
      return;
    }
    setInput(parsed.value.text);
    setError("");
    setResult({ address: parsed.value, classification: classifyIpv4(parsed.value) });
  }

  function useExample() {
    const parsed = parseIpv4("192.168.1.20");
    if (!parsed.ok) return;
    setInput(parsed.value.text);
    setError("");
    setResult({ address: parsed.value, classification: classifyIpv4(parsed.value) });
  }

  const flags = result ? [
    ["Private range", result.classification.flags.private],
    ["Loopback", result.classification.flags.loopback],
    ["Link-local", result.classification.flags.linkLocal],
    ["Multicast", result.classification.flags.multicast],
    ["Unspecified", result.classification.flags.unspecified],
    ["Limited broadcast", result.classification.flags.limitedBroadcast],
    ["Documentation", result.classification.flags.documentation],
    ["Shared / CGNAT", result.classification.flags.shared],
    ["Benchmarking", result.classification.flags.benchmarking],
  ] as const : [];

  return (
    <div className="tool-stack">
      <div className="workspace-grid ip-workspace">
        <section className="panel" aria-labelledby="ip-input-title">
          <div className="panel-heading"><div><p className="eyebrow">Check an address</p><h2 id="ip-input-title">IPv4 input</h2></div><button type="button" className="text-button" onClick={useExample}>Use example <Icon name="arrow" size={15} /></button></div>
          <form onSubmit={check} noValidate>
            <div className="field"><label htmlFor="checker-ip">IPv4 address</label><input id="checker-ip" value={input} onChange={(event) => { setInput(event.target.value); setError(""); setResult(null); }} placeholder="192.168.1.20" inputMode="decimal" autoComplete="off" aria-invalid={Boolean(error)} aria-describedby={error ? "checker-ip-error" : "checker-ip-hint"} /><p id={error ? "checker-ip-error" : "checker-ip-hint"} className={error ? "field-error" : "field-hint"}>{error || "Enter four decimal octets. Leading zeros are not accepted."}</p></div>
            <div className="form-actions"><button className="button button-primary" type="submit">Check address <Icon name="arrow" size={17} /></button><button className="button button-quiet" type="button" onClick={() => { setInput(""); setError(""); setResult(null); }}><Icon name="reset" size={16} /> Clear</button></div>
          </form>
          <div className="inline-note"><Icon name="shield" size={18} /><span>This check runs in your browser. It does not query the address or scan a network.</span></div>
        </section>

        <section className="panel results-panel" aria-labelledby="ip-results-title">
          <div className="panel-heading"><div><p className="eyebrow">Address details</p><h2 id="ip-results-title">Results</h2></div></div>
          {!result ? <div className="empty-state"><span className="empty-icon"><Icon name="search" size={25} /></span><h3>Understand an IPv4 address</h3><p>Enter an address or use the example to see its type, binary form, and common special-use flags.</p></div> : (
            <div>
              <div className={`classification-summary classification-${result.classification.category}`}><div><span className="summary-label">Classification</span><strong>{result.classification.label}</strong><p>{result.classification.description}</p></div><span className="classification-badge">{result.classification.category}</span></div>
              <dl className="result-list">
                <div className="result-row"><dt>Valid IPv4</dt><dd><span className="status-yes"><Icon name="check" size={15} /> Yes</span></dd></div>
                <div className="result-row"><dt>Normalized address</dt><dd><span className="result-value">{result.address.text}</span><CopyButton value={result.address.text} label="IP address" /></dd></div>
                {result.classification.matchedRange && <div className="result-row"><dt>Matched range</dt><dd><span className="result-value">{result.classification.matchedRange}</span></dd></div>}
                <div className="result-row"><dt>Historical classful classification</dt><dd><span className="result-value">{result.classification.historicalClass}</span></dd></div>
              </dl>
              <p className="fine-print">Classful labels are historical. Modern routing uses CIDR prefixes, not Class A/B/C boundaries.</p>
            </div>
          )}
        </section>
      </div>

      {result && <div className="workspace-grid ip-details-grid">
        <section className="panel" aria-labelledby="ip-flags-title"><div className="panel-heading"><div><p className="eyebrow">At a glance</p><h2 id="ip-flags-title">Address flags</h2></div></div><dl className="flag-grid">{flags.map(([label, value]) => <div key={label}><dt>{label}</dt><dd className={value ? "status-yes" : "status-no"}>{value ? "Yes" : "No"}</dd></div>)}</dl><p className="fine-print">This is a curated set of common IPv4 special-purpose ranges, not the complete IANA registry or a live reachability check.</p></section>
        <section className="panel" aria-labelledby="ip-binary-title"><div className="panel-heading"><div><p className="eyebrow">Behind the dots</p><h2 id="ip-binary-title">Binary representation</h2></div><CopyButton value={numberToBinary(result.address.value)} label="binary address" /></div><BinaryCode value={numberToBinary(result.address.value)} className="large-binary" /><p className="fine-print">Each group of eight bits is one IPv4 octet. The four groups together make 32 bits.</p></section>
      </div>}

      <section className="education-grid" aria-label="Helpful address concepts">
        <article className="education-card"><span className="education-icon"><Icon name="shield" size={20} /></span><h2>What is a private IP?</h2><p>Private ranges are for local networks, such as homes and offices. Routers generally use translation when those devices access the public Internet.</p></article>
        <article className="education-card"><span className="education-icon"><Icon name="reset" size={20} /></span><h2>What is loopback?</h2><p>Loopback addresses point back to the same device. The most familiar example is 127.0.0.1, often called localhost.</p></article>
        <article className="education-card"><span className="education-icon"><Icon name="globe" size={20} /></span><h2>What is link-local?</h2><p>169.254.0.0/16 is used on a local link and is not intended for normal Internet routing.</p></article>
      </section>
    </div>
  );
}
