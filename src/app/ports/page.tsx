import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { PortExplorer } from "@/components/tools/port-explorer";

export const metadata: Metadata = {
  title: "Port Reference",
  description: "Search a curated local reference of common TCP and UDP network ports and services.",
};

export default function PortsPage() {
  return (
    <main className="site-container main-content">
      <PageHeading icon="server" title="Port Reference" description="Search common ports, services, and their typical uses." />
      <PortExplorer />
    </main>
  );
}
