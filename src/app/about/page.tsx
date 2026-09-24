import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "About, FAQ & Privacy",
  description: "Learn about NetKit, find answers to common questions, and read how its browser-based tools handle inputs.",
};

const FAQ = [
  { question: "Is NetKit free to use?", answer: "Yes. The current tools and learning content are free to use." },
  { question: "Do I need an account?", answer: "No. NetKit has no user accounts or sign-in flow." },
  { question: "Does NetKit store my IP addresses?", answer: "No. Address and subnet inputs stay in the current browser page state. NetKit does not save them to an account or database." },
  { question: "Are subnet calculations performed locally?", answer: "Yes. The calculation runs in your browser using local TypeScript code; it does not submit the entered address to a calculation API." },
  { question: "Can I use NetKit for learning?", answer: "Absolutely. Each tool includes short explanations, and the Learn section covers the underlying concepts. Verify important production changes with your network's actual configuration." },
  { question: "Why can real download speeds differ from the estimate?", answer: "The calculator uses file bits divided by connection bits per second. Protocol overhead, congestion, Wi-Fi, the server, your device, and your ISP can all change the real result." },
  { question: "Does Port Reference scan my network?", answer: "No. It is a curated, local list of common port associations. It never connects to a host or checks whether a service is running." },
];

export default function AboutPage() {
  return (
    <main className="site-container main-content">
      <PageHeading icon="info" eyebrow="About NetKit" title="Built to make networking clearer" description="A focused collection of tools and explanations for practical learning." />
      <section className="panel about-intro" aria-labelledby="about-title"><div><p className="eyebrow">The idea</p><h2 id="about-title">Simple tools, useful answers.</h2><p>NetKit helps networking and IT students, developers, and curious technical users calculate subnets, understand IPv4 addresses, look up common ports, and estimate download time. The tools emphasize clear results and context so the numbers make sense.</p><Link href="/" className="button button-primary">Explore tools <Icon name="arrow" size={17} /></Link></div><div className="about-points"><div><Icon name="check" size={18} /> Free to use</div><div><Icon name="check" size={18} /> No account required</div><div><Icon name="check" size={18} /> Calculations run in your browser</div><div><Icon name="check" size={18} /> No network scanning</div></div></section>

      <section id="faq" className="about-section" aria-labelledby="faq-title"><div className="section-heading"><div><p className="eyebrow">Good to know</p><h2 id="faq-title">Frequently asked questions</h2></div></div><div className="faq-list">{FAQ.map((item) => <details className="faq-item" key={item.question}><summary>{item.question}<Icon name="chevron" size={18} /></summary><p>{item.answer}</p></details>)}</div></section>

      <section id="privacy" className="panel privacy-panel" aria-labelledby="privacy-title"><span className="heading-icon"><Icon name="shield" size={24} /></span><div><p className="eyebrow">Privacy</p><h2 id="privacy-title">How NetKit handles input</h2><p>Subnet, IP checker, and bandwidth inputs are processed in your browser. NetKit does not intentionally send those values to a backend for calculation or store them in a database. Port searching uses a local list and makes no host connections.</p><p>The only preference NetKit saves in your browser is your chosen light or dark theme. There are no app analytics, advertising scripts, accounts, or tracking services. Normal website hosting still receives page requests and associated connection information, so this is not a claim that every kind of data remains on your device.</p></div></section>
    </main>
  );
}
