# NetKit

NetKit is a free, beginner-friendly collection of networking utilities and short learning guides. V1 focuses on IPv4 subnet calculations, address classification, a curated port reference, and bandwidth math.

## Run locally

Node.js 20.9 or later and npm are required.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — home and tool navigation
- `/subnet` — subnet calculator with a 32-bit CIDR visualizer
- `/ip-checker` — IPv4 validation and common special-purpose classifications
- `/ports` — searchable, filterable local port reference
- `/bandwidth` — theoretical download time and speed conversion
- `/learn` — concise networking explanations
- `/about` — about, FAQ, and privacy information

## Calculation conventions

- IPv4 octets must be decimal values from 0 to 255. Leading-zero octets are rejected.
- Conventional subnets `/0` through `/30` reserve the network and broadcast addresses. A `/31` has two usable point-to-point endpoints under [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021.html), with no separate broadcast address. A `/32` is one address, not a conventional host range.
- The IP checker covers a curated subset of the [IANA IPv4 special-purpose registry](https://www.iana.org/assignments/iana-ipv4-special-registry). It does not test live routing or claim complete registry coverage.
- The port list is a curated learning reference informed by the [IANA service name and port registry](https://www.iana.org/assignments/service-names-port-numbers); it does not scan hosts.
- Bandwidth uses decimal units: 1 KB = 1,000 bytes; 1 Mbps = 1,000,000 bits per second; 1 byte = 8 bits. Download times are theoretical estimates.

## Project layout

- `src/app/` — App Router routes, metadata, and global theme styles
- `src/components/` — reusable layout, controls, and interactive tool interfaces
- `src/lib/network/` — pure IPv4 parsing, subnet math, and classification
- `src/lib/bandwidth/` — pure unit conversion and download-time math
- `src/data/` — local curated port and navigation data
- `tests/` — focused Node tests for calculation logic and port data
- `docs/netkit-ui-reference.png` — approved design reference, kept outside public assets

Tool inputs are processed in the browser. NetKit does not use accounts, a database, analytics, or a network lookup API. An explicit color-theme preference is saved locally in the browser.

## Checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
```
