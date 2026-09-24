import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { SubnetCalculator } from "@/components/tools/subnet-calculator";

export const metadata: Metadata = {
  title: "Subnet Calculator",
  description: "Calculate IPv4 subnet masks, network and broadcast addresses, host ranges, and CIDR bits.",
};

export default function SubnetPage() {
  return (
    <main className="site-container main-content">
      <PageHeading icon="calculator" title="Subnet Calculator" description="Turn an IPv4 address and CIDR prefix into clear network details." />
      <SubnetCalculator />
    </main>
  );
}
