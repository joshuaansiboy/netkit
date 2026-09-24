import Link from "next/link";
import { Icon } from "@/components/icon";
import { TOOL_LINKS } from "@/data/tools";

function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      <span className="hero-floating hero-floating-ip">IP</span>
      <span className="hero-floating hero-floating-code">&lt;/&gt;</span>
      <span className="hero-floating hero-floating-server"><Icon name="server" size={22} /></span>
      <span className="hero-floating hero-floating-cidr">192.168.1.0/24</span>
      <div className="hero-laptop">
        <div className="hero-laptop-screen"><Icon name="globe" size={94} /></div>
        <div className="hero-laptop-base" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="site-container main-content">
      <section className="hero-panel" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Networking, made approachable</p>
          <h1 id="home-title">Network tools<br />made <span>simple.</span></h1>
          <p className="hero-description">Calculate, inspect, and understand network information with clear tools built for learning and everyday work.</p>
          <Link className="button button-primary hero-cta" href="#tools">Explore Tools <Icon name="arrow" size={18} /></Link>
          <p className="hero-footnote">Free to use · No account required</p>
        </div>
        <HeroVisual />
      </section>

      <section id="tools" className="home-tools" aria-labelledby="tools-title">
        <div className="section-heading">
          <div><p className="eyebrow">The toolkit</p><h2 id="tools-title">Choose a tool</h2><p>Start with a calculation or look up a networking detail.</p></div>
        </div>
        <div className="tool-grid">
          {TOOL_LINKS.map((tool) => (
            <Link className="tool-card" href={tool.href} key={tool.href}>
              <div className="tool-card-top"><span className="tool-icon"><Icon name={tool.icon} size={25} /></span><Icon name="arrow" size={18} /></div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="learn-callout" aria-labelledby="learn-title">
        <span className="callout-icon"><Icon name="book" size={25} /></span>
        <div><p className="eyebrow">New to networking?</p><h2 id="learn-title">Build confidence as you go.</h2><p>Short, practical explanations make IP addresses, subnets, ports, and bandwidth easier to understand.</p></div>
        <Link className="button button-secondary" href="/learn">Start learning <Icon name="arrow" size={17} /></Link>
      </section>
    </main>
  );
}
