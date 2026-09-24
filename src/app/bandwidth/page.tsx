import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { BandwidthCalculator } from "@/components/tools/bandwidth-calculator";

export const metadata: Metadata = {
  title: "Bandwidth Calculator",
  description: "Estimate theoretical download time and convert Kbps, Mbps, and Gbps with clear decimal units.",
};

export default function BandwidthPage() {
  return (
    <main className="site-container main-content">
      <PageHeading icon="bolt" title="Bandwidth Calculator" description="Estimate a download or convert common network speed units." />
      <BandwidthCalculator />
    </main>
  );
}
