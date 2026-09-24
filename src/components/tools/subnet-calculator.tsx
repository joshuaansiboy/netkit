"use client";

import { useState, type FormEvent } from "react";
import { BinaryCode } from "@/components/binary-code";
import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/icon";
import { parseCidrPrefix, parseIpv4 } from "@/lib/network/ipv4";
import { calculateSubnet, type SubnetResult } from "@/lib/network/subnet";

interface FormErrors { ip?: string; prefix?: string }

function CopyableRow({ label, value, copy = true }: { label: string; value: string; copy?: boolean }) {
  return (
    <div className="result-row">
      <dt>{label}</dt>
      <dd><span className="result-value">{value}</span>{copy && <CopyButton value={value} label={label.toLowerCase()} />}</dd>
    </div>
  );
}

function BinaryValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="binary-value-row">
      <div><span>{label}</span><BinaryCode value={value} /></div>
      <CopyButton value={value} label={label.toLowerCase()} />
    </div>
  );
}

function meaningFor(result: SubnetResult): string {
  if (result.mode === "point-to-point") {
    return "A /31 has two addresses. On a point-to-point link, RFC 3021 allows both as endpoints; there is no separate broadcast address or conventional host range.";
  }
  if (result.mode === "host-route") {
    return "A /32 identifies one address, often as a host route. It has no separate broadcast address or conventional host range.";
  }
  return "The prefix marks the network bits. Remaining bits identify addresses in that subnet. In a conventional subnet, the first address identifies the network and the last is its broadcast address.";
}

function copyAllText(result: SubnetResult): string {
  return [
    `IP address: ${result.originalIp}`,
    `CIDR prefix: /${result.prefix}`,
    `Subnet mask: ${result.subnetMask}`,
    `Wildcard mask: ${result.wildcardMask}`,
    `Network address: ${result.networkAddress}`,
    `Last address: ${result.lastAddress}`,
    `Broadcast address: ${result.broadcastAddress ?? "Not applicable"}`,
    `First conventional usable host: ${result.firstUsableHost ?? "Not applicable"}`,
    `Last conventional usable host: ${result.lastUsableHost ?? "Not applicable"}`,
    `Total addresses: ${result.totalAddresses}`,
    `Conventional usable hosts: ${result.conventionalUsableHosts}`,
    `Usable addresses in this mode: ${result.usableHosts}`,
    `IP binary: ${result.ipBinary}`,
    `Mask binary: ${result.maskBinary}`,
    meaningFor(result),
  ].join("\n");
}

export function SubnetCalculator() {
  const [ip, setIp] = useState("");
  const [prefix, setPrefix] = useState("/24");
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<SubnetResult | null>(null);

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedIp = parseIpv4(ip);
    const parsedPrefix = parseCidrPrefix(prefix);
    setErrors({
      ip: parsedIp.ok ? undefined : parsedIp.error,
      prefix: parsedPrefix.ok ? undefined : parsedPrefix.error,
    });
    if (!parsedIp.ok || !parsedPrefix.ok) {
      setResult(null);
      return;
    }
    setIp(parsedIp.value.text);
    setPrefix(`/${parsedPrefix.value}`);
    setResult(calculateSubnet(parsedIp.value, parsedPrefix.value));
  }

  function useExample() {
    const example = parseIpv4("192.168.1.50");
    if (!example.ok) return;
    setIp(example.value.text);
    setPrefix("/24");
    setErrors({});
    setResult(calculateSubnet(example.value, 24));
  }

  function reset() {
    setIp("");
    setPrefix("/24");
    setErrors({});
    setResult(null);
  }

  return (
    <div className="tool-stack">
      <div className="subnet-workspace workspace-grid">
        <section className="panel" aria-labelledby="subnet-input-title">
          <div className="panel-heading"><div><p className="eyebrow">Start here</p><h2 id="subnet-input-title">Your network</h2></div><button type="button" className="text-button" onClick={useExample}>Use example <Icon name="arrow" size={15} /></button></div>
          <form onSubmit={calculate} noValidate>
            <div className="field"><label htmlFor="subnet-ip">IPv4 address</label><input id="subnet-ip" value={ip} onChange={(event) => { setIp(event.target.value); setErrors((current) => ({ ...current, ip: undefined })); setResult(null); }} placeholder="192.168.1.50" inputMode="decimal" autoComplete="off" aria-invalid={Boolean(errors.ip)} aria-describedby={errors.ip ? "subnet-ip-error" : "subnet-ip-hint"} /><p id={errors.ip ? "subnet-ip-error" : "subnet-ip-hint"} className={errors.ip ? "field-error" : "field-hint"}>{errors.ip ?? "Four decimal octets, each from 0 to 255."}</p></div>
            <div className="field"><label htmlFor="subnet-prefix">CIDR prefix</label><input id="subnet-prefix" value={prefix} onChange={(event) => { setPrefix(event.target.value); setErrors((current) => ({ ...current, prefix: undefined })); setResult(null); }} placeholder="/24" inputMode="numeric" autoComplete="off" aria-invalid={Boolean(errors.prefix)} aria-describedby={errors.prefix ? "subnet-prefix-error" : "subnet-prefix-hint"} /><p id={errors.prefix ? "subnet-prefix-error" : "subnet-prefix-hint"} className={errors.prefix ? "field-error" : "field-hint"}>{errors.prefix ?? "Use /0 through /32. You can also type 24."}</p></div>
            <div className="form-actions"><button type="submit" className="button button-primary">Calculate subnet <Icon name="arrow" size={17} /></button><button type="button" className="button button-quiet" onClick={reset}><Icon name="reset" size={16} /> Reset</button></div>
          </form>
        </section>

        <section className="panel results-panel" aria-labelledby="subnet-results-title">
          <div className="panel-heading"><div><p className="eyebrow">Network details</p><h2 id="subnet-results-title">Results</h2></div>{result && <CopyButton value={copyAllText(result)} label="all subnet results" className="copy-all" />}</div>
          {!result ? (
            <div className="empty-state"><span className="empty-icon"><Icon name="calculator" size={25} /></span><h3>Ready when you are</h3><p>Enter an IPv4 address and CIDR prefix, or load the example, to see a subnet breakdown.</p></div>
          ) : (
            <div>
              <p className="sr-only" aria-live="polite">Subnet calculated for {result.originalIp}/{result.prefix}.</p>
              <dl className="result-list">
                <CopyableRow label="Original IP" value={result.originalIp} />
                <CopyableRow label="CIDR prefix" value={`/${result.prefix}`} copy={false} />
                <CopyableRow label="Subnet mask" value={result.subnetMask} />
                <CopyableRow label="Wildcard mask" value={result.wildcardMask} />
                <CopyableRow label="Network address" value={result.networkAddress} />
                <CopyableRow label="Broadcast address" value={result.broadcastAddress ?? "Not applicable"} copy={Boolean(result.broadcastAddress)} />
                <CopyableRow label="First conventional host" value={result.firstUsableHost ?? "Not applicable"} copy={Boolean(result.firstUsableHost)} />
                <CopyableRow label="Last conventional host" value={result.lastUsableHost ?? "Not applicable"} copy={Boolean(result.lastUsableHost)} />
                {result.mode === "point-to-point" && <><CopyableRow label="Endpoint A" value={result.networkAddress} /><CopyableRow label="Endpoint B" value={result.lastAddress} /></>}
                {result.mode === "host-route" && <CopyableRow label="Single address" value={result.originalIp} />}
              </dl>
              <div className="metric-grid"><div><span>Total addresses</span><strong>{result.totalAddresses.toLocaleString("en-US")}</strong></div><div><span>Conventional usable hosts</span><strong>{result.conventionalUsableHosts.toLocaleString("en-US")}</strong></div><div><span>Usable in this mode</span><strong>{result.usableHosts.toLocaleString("en-US")}</strong></div></div>
            </div>
          )}
        </section>
      </div>

      {result && (
        <div className="visualizer-grid">
          <section className="panel" aria-labelledby="visualizer-title">
            <div className="panel-heading"><div><p className="eyebrow">See the split</p><h2 id="visualizer-title">CIDR / binary visualizer</h2></div><span className="prefix-badge">/{result.prefix}</span></div>
            <div className="bit-legend"><span><i className="legend-network" /> Network bits <strong>{result.networkBits}</strong></span><span><i className="legend-host" /> Host bits <strong>{result.hostBits}</strong></span></div>
            <div className="bit-groups" role="img" aria-label={`${result.networkBits} network ${result.networkBits === 1 ? "bit" : "bits"} and ${result.hostBits} host ${result.hostBits === 1 ? "bit" : "bits"} in a 32-bit IPv4 mask`}>
              {Array.from({ length: 4 }, (_, group) => (
                <div className="bit-octet" key={group}>{Array.from({ length: 8 }, (_, bit) => {
                  const networkBit = group * 8 + bit < result.prefix;
                  return <span className={networkBit ? "bit network-bit" : "bit host-bit"} key={bit}>{networkBit ? "1" : "0"}</span>;
                })}</div>
              ))}
            </div>
            <div className="binary-values"><BinaryValue label="IP address · binary" value={result.ipBinary} /><BinaryValue label="Subnet mask · binary" value={result.maskBinary} /><div className="binary-value-row"><div><span>IP address · decimal</span><code>{result.originalIp}</code></div></div><div className="binary-value-row"><div><span>Subnet mask · decimal</span><code>{result.subnetMask}</code></div></div></div>
          </section>
          <aside className="panel explainer-panel"><span className="explainer-icon"><Icon name="info" size={22} /></span><h2>What does this mean?</h2><p>{meaningFor(result)}</p><p className="fine-print">Subnet counts describe address arithmetic. Actual deployment also depends on special-use ranges and network policy.</p></aside>
        </div>
      )}
    </div>
  );
}
