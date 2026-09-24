import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Learn Networking",
  description: "Short, practical explanations of IPv4 addresses, subnets, CIDR, ports, and bandwidth.",
};

const TOPICS = [
  { id: "ip-address", title: "What is an IP address?", body: "An IP address identifies a device or network interface so data can reach it. NetKit focuses on IPv4, the familiar dotted-decimal form used in many networks.", example: "192.168.1.50", tool: "/ip-checker", toolLabel: "Check an address" },
  { id: "ipv4-structure", title: "IPv4 structure", body: "An IPv4 address contains 32 bits in four groups of eight. Each decimal group, called an octet, ranges from 0 to 255.", example: "192.168.1.50 = 11000000.10101000.00000001.00110010", tool: "/ip-checker", toolLabel: "See the binary form" },
  { id: "subnet", title: "What is a subnet?", body: "A subnet is a portion of an IP network. Devices in the same subnet share a network prefix, while the remaining bits distinguish individual addresses.", example: "192.168.1.0/24", tool: "/subnet", toolLabel: "Calculate a subnet" },
  { id: "subnet-mask", title: "What is a subnet mask?", body: "A subnet mask marks the network bits with 1s and the host bits with 0s. It tells you which part of an address describes the subnet.", example: "/24 = 255.255.255.0", tool: "/subnet", toolLabel: "Visualize the mask" },
  { id: "cidr", title: "What is CIDR?", body: "CIDR expresses the number of network bits after a slash. A /24 has 24 network bits and 8 host bits; a /32 identifies just one address.", example: "192.168.1.50/24", tool: "/subnet", toolLabel: "Explore CIDR bits" },
  { id: "network-address", title: "Network address", body: "The network address is the first address in a conventional subnet and identifies that subnet as a whole. For 192.168.1.50/24, it is 192.168.1.0.", example: "192.168.1.0", tool: "/subnet", toolLabel: "Find a network address" },
  { id: "broadcast-address", title: "Broadcast address", body: "The last address in a conventional IPv4 subnet is used to reach all hosts on that subnet. A /31 point-to-point link and a /32 host route do not have a separate broadcast address.", example: "192.168.1.255 for 192.168.1.0/24", tool: "/subnet", toolLabel: "Find a broadcast address" },
  { id: "host-addresses", title: "Host addresses", body: "In a conventional subnet, usable hosts sit between the network and broadcast addresses. /31 is different: both addresses may serve as point-to-point endpoints under RFC 3021. /32 is a single address, not a host range.", example: "192.168.1.1–192.168.1.254 in 192.168.1.0/24", tool: "/subnet", toolLabel: "See host ranges" },
  { id: "address-types", title: "Private, public, and special addresses", body: "Private addresses are used inside local networks. Other blocks have specific roles, such as loopback, link-local, documentation, or multicast. An address outside NetKit's curated special ranges is only likely public; this offline tool cannot verify Internet reachability.", example: "10.0.0.1 is private; 127.0.0.1 is loopback", tool: "/ip-checker", toolLabel: "Explore address types" },
  { id: "ports", title: "Common network ports", body: "A port number helps a device deliver traffic to the right application. Port 443 is commonly associated with HTTPS, but that association alone does not prove a web service is running there.", example: "443 · HTTPS · TCP/UDP", tool: "/ports", toolLabel: "Browse ports" },
  { id: "bandwidth", title: "Bandwidth basics", body: "Network speed is usually measured in bits per second, while file size is often measured in bytes. Eight bits make one byte. Download estimates divide file bits by bits per second and are theoretical, not a speed guarantee.", example: "10 GB at 100 Mbps ≈ 13 minutes 20 seconds", tool: "/bandwidth", toolLabel: "Estimate a download" },
];

export default function LearnPage() {
  return (
    <main className="site-container main-content">
      <PageHeading icon="book" eyebrow="Learn with NetKit" title="Networking basics" description="Clear, short explanations you can put to use right away." />
      <div className="learn-layout">
        <nav className="panel learn-index" aria-label="Learning topics"><h2>On this page</h2>{TOPICS.map((topic) => <a key={topic.id} href={`#${topic.id}`}>{topic.title}</a>)}</nav>
        <div className="learn-content">{TOPICS.map((topic, index) => <section className="panel learn-topic" id={topic.id} key={topic.id} aria-labelledby={`${topic.id}-title`}><span className="topic-number">{String(index + 1).padStart(2, "0")}</span><h2 id={`${topic.id}-title`}>{topic.title}</h2><p>{topic.body}</p><div className="learn-example"><span>Example</span><code>{topic.example}</code></div><Link className="text-button" href={topic.tool}>{topic.toolLabel} <Icon name="arrow" size={16} /></Link></section>)}</div>
      </div>
    </main>
  );
}
