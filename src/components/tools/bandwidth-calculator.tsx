"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import {
  convertSpeed,
  estimateDownloadTime,
  FILE_UNITS,
  formatDuration,
  formatQuantity,
  parsePositiveDecimal,
  SPEED_UNITS,
  type DownloadEstimate,
  type FileUnit,
  type SpeedUnit,
} from "@/lib/bandwidth/calculations";

type Mode = "download" | "convert";

export function BandwidthCalculator() {
  const [mode, setMode] = useState<Mode>("download");
  const [fileSize, setFileSize] = useState("10");
  const [fileUnit, setFileUnit] = useState<FileUnit>("GB");
  const [internetSpeed, setInternetSpeed] = useState("100");
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>("Mbps");
  const [downloadErrors, setDownloadErrors] = useState<{ file?: string; speed?: string; general?: string }>({});
  const [estimate, setEstimate] = useState<DownloadEstimate | null>(null);
  const [convertAmount, setConvertAmount] = useState("100");
  const [convertUnit, setConvertUnit] = useState<SpeedUnit>("Mbps");
  const [convertError, setConvertError] = useState("");
  const [converted, setConverted] = useState<Record<SpeedUnit, number> | null>(null);

  function submitDownload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedFile = parsePositiveDecimal(fileSize, "File size");
    const parsedSpeed = parsePositiveDecimal(internetSpeed, "Internet speed");
    if (!parsedFile.ok || !parsedSpeed.ok) {
      setDownloadErrors({ file: parsedFile.ok ? undefined : parsedFile.error, speed: parsedSpeed.ok ? undefined : parsedSpeed.error });
      setEstimate(null);
      return;
    }
    const calculated = estimateDownloadTime(parsedFile.value, fileUnit, parsedSpeed.value, speedUnit);
    if (!calculated.ok) {
      setDownloadErrors({ general: calculated.error });
      setEstimate(null);
      return;
    }
    setDownloadErrors({});
    setEstimate(calculated.value);
  }

  function submitConversion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parsePositiveDecimal(convertAmount, "Speed");
    if (!parsed.ok) {
      setConvertError(parsed.error);
      setConverted(null);
      return;
    }
    const result = convertSpeed(parsed.value, convertUnit);
    if (!result.ok) {
      setConvertError(result.error);
      setConverted(null);
      return;
    }
    setConvertError("");
    setConverted(result.value);
  }

  return (
    <div className="tool-stack">
      <div className="mode-switch" role="group" aria-label="Bandwidth tool mode"><button type="button" aria-pressed={mode === "download"} className={mode === "download" ? "is-active" : ""} onClick={() => setMode("download")}><Icon name="clock" size={17} /> Download time</button><button type="button" aria-pressed={mode === "convert"} className={mode === "convert" ? "is-active" : ""} onClick={() => setMode("convert")}><Icon name="bolt" size={17} /> Speed converter</button></div>

      {mode === "download" ? <div className="workspace-grid bandwidth-workspace">
        <section className="panel" aria-labelledby="download-input-title"><div className="panel-heading"><div><p className="eyebrow">Estimate</p><h2 id="download-input-title">Download time</h2></div></div><p className="panel-intro">Enter a file size and a connection speed to estimate the theoretical transfer time.</p>
          <form onSubmit={submitDownload} noValidate>
            <div className="field"><label htmlFor="file-size">File size</label><div className="input-with-unit"><input id="file-size" value={fileSize} onChange={(event) => { setFileSize(event.target.value); setDownloadErrors({}); setEstimate(null); }} inputMode="decimal" autoComplete="off" aria-invalid={Boolean(downloadErrors.file)} aria-describedby={downloadErrors.file ? "file-size-error" : undefined} /><label className="sr-only" htmlFor="file-unit">File size unit</label><select id="file-unit" value={fileUnit} onChange={(event) => { setFileUnit(event.target.value as FileUnit); setDownloadErrors({}); setEstimate(null); }}>{FILE_UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></div>{downloadErrors.file && <p id="file-size-error" className="field-error">{downloadErrors.file}</p>}</div>
            <div className="field"><label htmlFor="internet-speed">Internet speed</label><div className="input-with-unit"><input id="internet-speed" value={internetSpeed} onChange={(event) => { setInternetSpeed(event.target.value); setDownloadErrors({}); setEstimate(null); }} inputMode="decimal" autoComplete="off" aria-invalid={Boolean(downloadErrors.speed)} aria-describedby={downloadErrors.speed ? "internet-speed-error" : undefined} /><label className="sr-only" htmlFor="internet-speed-unit">Internet speed unit</label><select id="internet-speed-unit" value={speedUnit} onChange={(event) => { setSpeedUnit(event.target.value as SpeedUnit); setDownloadErrors({}); setEstimate(null); }}>{SPEED_UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></div>{downloadErrors.speed && <p id="internet-speed-error" className="field-error">{downloadErrors.speed}</p>}</div>
            {downloadErrors.general && <p className="field-error" role="alert">{downloadErrors.general}</p>}
            <button className="button button-primary full-width" type="submit">Calculate time <Icon name="arrow" size={17} /></button>
          </form>
          <p className="field-hint unit-hint">Decimal units: 1 GB = 1,000,000,000 bytes; 1 Mbps = 1,000,000 bits/second; 1 byte = 8 bits.</p>
        </section>
        <section className="panel results-panel" aria-labelledby="download-results-title"><div className="panel-heading"><div><p className="eyebrow">Your estimate</p><h2 id="download-results-title">Result</h2></div></div>
          {estimate ? <><div className="success-result"><span className="success-icon"><Icon name="clock" size={25} /></span><div><span>Estimated theoretical download time</span><strong>{formatDuration(estimate.seconds)}</strong><small>{formatQuantity(estimate.seconds)} seconds at the entered speed</small></div></div><dl className="result-list"><div className="result-row"><dt>File size</dt><dd>{formatQuantity(estimate.fileBits)} bits</dd></div><div className="result-row"><dt>Internet speed</dt><dd>{formatQuantity(estimate.bitsPerSecond)} bits/second</dd></div><div className="result-row"><dt>Formula</dt><dd>File bits ÷ bits/second</dd></div></dl></> : <div className="empty-state"><span className="empty-icon"><Icon name="clock" size={25} /></span><h3>How long will it take?</h3><p>Calculate with the sample values or enter your own file size and speed.</p></div>}
        </section>
      </div> : <div className="workspace-grid bandwidth-workspace">
        <section className="panel" aria-labelledby="convert-input-title"><div className="panel-heading"><div><p className="eyebrow">Convert</p><h2 id="convert-input-title">Network speed</h2></div></div><p className="panel-intro">Enter one speed to see its equivalent in Kbps, Mbps, and Gbps.</p><form onSubmit={submitConversion} noValidate><div className="field"><label htmlFor="convert-speed">Speed</label><div className="input-with-unit"><input id="convert-speed" value={convertAmount} onChange={(event) => { setConvertAmount(event.target.value); setConvertError(""); setConverted(null); }} inputMode="decimal" autoComplete="off" aria-invalid={Boolean(convertError)} aria-describedby={convertError ? "convert-speed-error" : undefined} /><label className="sr-only" htmlFor="convert-unit">Speed unit</label><select id="convert-unit" value={convertUnit} onChange={(event) => { setConvertUnit(event.target.value as SpeedUnit); setConvertError(""); setConverted(null); }}>{SPEED_UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></div>{convertError && <p id="convert-speed-error" className="field-error">{convertError}</p>}</div><button className="button button-primary full-width" type="submit">Convert speed <Icon name="arrow" size={17} /></button></form><p className="field-hint unit-hint">Decimal units: 1 Gbps = 1,000 Mbps = 1,000,000 Kbps.</p></section>
        <section className="panel results-panel" aria-labelledby="convert-results-title"><div className="panel-heading"><div><p className="eyebrow">Equivalent speeds</p><h2 id="convert-results-title">Conversions</h2></div></div>{converted ? <dl className="conversion-list">{SPEED_UNITS.map((unit) => <div key={unit}><dt>{unit}</dt><dd>{formatQuantity(converted[unit])}</dd></div>)}</dl> : <div className="empty-state"><span className="empty-icon"><Icon name="bolt" size={25} /></span><h3>Compare speed units</h3><p>Enter a positive speed and choose its unit to see all three conversions.</p></div>}</section>
      </div>}

      {mode === "download" && <aside className="explanation-strip"><Icon name="info" size={19} /><div><strong>Why might a real download take longer?</strong><p>This is a theoretical estimate. Protocol overhead, congestion, Wi-Fi conditions, server and device limits, and ISP behavior can slow actual transfers.</p></div></aside>}
    </div>
  );
}
