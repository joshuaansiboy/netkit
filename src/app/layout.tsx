import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme-bootstrap";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NetKit",
    template: "%s | NetKit",
  },
  description:
    "Free, beginner-friendly tools for IPv4 subnets, addresses, ports, and bandwidth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body>
        <div className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
