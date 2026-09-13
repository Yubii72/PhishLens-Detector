import { useState } from "react";
import { Archive, Info, Menu, Search, X } from "lucide-react";
import { Link } from "wouter";

const links = [
  { href: "/", label: "Scan email", icon: <Search size={14} strokeWidth={2} />, active: "scan" as const },
  { href: "/history", label: "History", icon: <Archive size={14} strokeWidth={2} />, active: "history" as const },
  { href: "/about", label: "About", icon: <Info size={14} strokeWidth={2} />, active: "about" as const },
];

export function Header({ active = "scan" }: { active?: "scan" | "history" | "about" }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href="/" aria-label="PhishLens home">
          <img className="brand-logo" src="/logo.png" alt="" />
          <span className="brand-name">PhishLens</span>
          <span className="brand-sub">EMAIL THREAT DETECTION</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} className={`nav-link ${active === link.active ? "active" : ""}`} href={link.href} aria-label={link.label}>{link.icon}<span className="label">{link.label}</span></Link>
          ))}
        </nav>
        <button className="nav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
        </button>
      </div>
      <div className={`nav-panel ${open ? "open" : ""}`}>
        {links.map((link) => (
          <Link key={link.href} className={`nav-item ${active === link.active ? "active" : ""}`} href={link.href} onClick={() => setOpen(false)}>{link.icon}{link.label}</Link>
        ))}
      </div>
    </header>
  );
}