"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { filterPorts, PORT_CATEGORIES } from "@/data/ports";

export function PortExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof PORT_CATEGORIES)[number]>("All");
  const [selectedPort, setSelectedPort] = useState(443);
  const matches = filterPorts(query, category);
  const selected = matches.find((entry) => entry.port === selectedPort) ?? matches[0] ?? null;
  const hasFilters = Boolean(query.trim()) || category !== "All";

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setSelectedPort(443);
  }

  return (
    <div className="tool-stack">
      <section className="panel port-search-panel" aria-labelledby="port-search-title">
        <div className="panel-heading"><div><p className="eyebrow">Curated reference</p><h2 id="port-search-title">Find a port</h2></div><span className="count-badge">{matches.length} {matches.length === 1 ? "entry" : "entries"}</span></div>
        <div className="search-field"><Icon name="search" size={19} /><label className="sr-only" htmlFor="port-search">Search by port, service, or keyword</label><input id="port-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search port, service, or keyword (e.g. 443 or HTTPS)" autoComplete="off" /></div>
        <div className="port-filters" role="group" aria-label="Filter port category">
          {PORT_CATEGORIES.map((item) => <button type="button" key={item} className={`filter-chip ${category === item ? "is-selected" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        {hasFilters && <button type="button" className="text-button clear-filters" onClick={clearFilters}><Icon name="reset" size={15} /> Clear search and filters</button>}
      </section>

      <div className="ports-workspace">
        <section className="panel port-list-panel" aria-labelledby="port-list-title">
          <div className="panel-heading"><div><p className="eyebrow">Browse the list</p><h2 id="port-list-title">Common ports</h2></div></div>
          {matches.length === 0 ? <div className="empty-state"><span className="empty-icon"><Icon name="search" size={24} /></span><h3>No matching ports found.</h3><p>Try another number or service, or clear your filters.</p><button type="button" className="button button-secondary" onClick={clearFilters}>Clear filters</button></div> : <>
            <div className="port-table-wrap"><table className="port-table"><caption className="sr-only">Curated common network ports</caption><thead><tr><th scope="col">Port</th><th scope="col">Service</th><th scope="col">Transport</th><th scope="col">Category</th></tr></thead><tbody>{matches.map((entry) => <tr key={entry.port} className={selected?.port === entry.port ? "selected-row" : ""}><td className="port-number">{entry.port}</td><td><button type="button" className="port-select" onClick={() => setSelectedPort(entry.port)} aria-pressed={selected?.port === entry.port}>{entry.service}</button></td><td>{entry.transports.join(" / ")}</td><td>{entry.category}</td></tr>)}</tbody></table></div>
            <div className="port-mobile-list">{matches.map((entry) => <button type="button" key={entry.port} className={`port-mobile-card ${selected?.port === entry.port ? "is-selected" : ""}`} onClick={() => setSelectedPort(entry.port)} aria-pressed={selected?.port === entry.port}><span className="port-mobile-top"><strong>{entry.service}</strong><span>Port {entry.port}</span></span><span>{entry.transports.join(" / ")} · {entry.category}</span>{selected?.port === entry.port && <span className="port-mobile-expanded"><span>{entry.description}</span><span><strong>Common use:</strong> {entry.commonUse}</span></span>}</button>)}</div>
          </>}
        </section>

        <aside className="panel port-detail-panel" aria-labelledby="port-detail-title">
          <div className="panel-heading"><div><p className="eyebrow">Selected service</p><h2 id="port-detail-title">Port details</h2></div></div>
          {selected ? <><div className="port-detail-hero"><span>Port {selected.port}</span><strong>{selected.service}</strong><span className="transport-badge">{selected.transports.join(" / ")}</span></div><dl className="detail-list"><div><dt>Service</dt><dd>{selected.service}</dd></div><div><dt>Transport</dt><dd>{selected.transports.join(" / ")}</dd></div><div><dt>Category</dt><dd>{selected.category}</dd></div><div><dt>Description</dt><dd>{selected.description}</dd></div><div><dt>Common use</dt><dd>{selected.commonUse}</dd></div></dl></> : <p className="muted">Select a matching port to see details.</p>}
          <div className="inline-note"><Icon name="info" size={18} /><span>A port association does not prove a service is running. Apps can also use non-standard ports. NetKit does not scan hosts.</span></div>
        </aside>
      </div>
    </div>
  );
}
