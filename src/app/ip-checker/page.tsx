import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { IpChecker } from "@/components/tools/ip-checker";

export const metadata: Metadata = {
  title: "IP Address Checker",
  description: "Validate an IPv4 address and learn whether it is private, public, or in a common special-purpose range.",
};

export default function IpCheckerPage() {
  return (
    <main className="site-container main-content">
      <PageHeading icon="search" title="IP Address Checker" description="Validate an IPv4 address and see what kind of address it is." />
      <IpChecker />
    </main>
  );
}
