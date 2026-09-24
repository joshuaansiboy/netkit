"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Icon } from "@/components/icon";
import { TOOL_LINKS } from "@/data/tools";

function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const current = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = current ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("netkit-theme", next);
    } catch {
      // Theme remains active for this page when storage is unavailable.
    }
  }

  return (
    <button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label="Switch color theme" title="Switch color theme">
      <span className="theme-icon-sun"><Icon name="sun" size={20} /></span>
      <span className="theme-icon-moon"><Icon name="moon" size={20} /></span>
    </button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const desktopMenu = useRef<HTMLDetailsElement>(null);
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const isToolPage = TOOL_LINKS.some((tool) => tool.href === pathname);

  const closeMenus = () => {
    if (desktopMenu.current) desktopMenu.current.open = false;
    if (mobileMenu.current) mobileMenu.current.open = false;
  };

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link className="brand" href="/" onClick={closeMenus} aria-label="NetKit home">
          <span className="brand-mark"><Icon name="globe" size={23} /></span>
          <span>NetKit</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <details className={`nav-dropdown ${isToolPage ? "is-active" : ""}`} ref={desktopMenu} onKeyDown={(event) => { if (event.key === "Escape") closeMenus(); }}>
            <summary>Tools <Icon name="chevron" size={15} /></summary>
            <div className="nav-dropdown-panel">
              {TOOL_LINKS.map((tool) => (
                <Link key={tool.href} href={tool.href} onClick={closeMenus} aria-current={pathname === tool.href ? "page" : undefined}>
                  <Icon name={tool.icon} size={18} />
                  <span>{tool.name}</span>
                </Link>
              ))}
            </div>
          </details>
          <Link href="/learn" className={pathname === "/learn" ? "is-active" : ""} aria-current={pathname === "/learn" ? "page" : undefined}>Learn</Link>
          <Link href="/about" className={pathname === "/about" ? "is-active" : ""} aria-current={pathname === "/about" ? "page" : undefined}>About</Link>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <details className="mobile-menu" ref={mobileMenu} onKeyDown={(event) => { if (event.key === "Escape") closeMenus(); }}>
            <summary className="icon-button" aria-label="Open navigation menu"><Icon name="menu" size={23} /></summary>
            <nav className="mobile-menu-panel" aria-label="Mobile navigation">
              <span className="mobile-menu-heading">Tools</span>
              {TOOL_LINKS.map((tool) => (
                <Link key={tool.href} href={tool.href} onClick={closeMenus} aria-current={pathname === tool.href ? "page" : undefined}>
                  <Icon name={tool.icon} size={18} />{tool.name}
                </Link>
              ))}
              <span className="mobile-menu-divider" />
              <Link href="/learn" onClick={closeMenus} aria-current={pathname === "/learn" ? "page" : undefined}><Icon name="book" size={18} />Learn</Link>
              <Link href="/about" onClick={closeMenus} aria-current={pathname === "/about" ? "page" : undefined}><Icon name="info" size={18} />About</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
