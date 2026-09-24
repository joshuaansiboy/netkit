import Link from "next/link";
import { Icon } from "@/components/icon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <div className="footer-brand"><Icon name="globe" size={18} /><strong>NetKit</strong><span>Practical networking, explained clearly.</span></div>
        <nav aria-label="Footer navigation">
          <Link href="/learn">Learn</Link>
          <Link href="/about">About</Link>
          <Link href="/about#faq">FAQ</Link>
          <Link href="/about#privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
