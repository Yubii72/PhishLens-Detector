import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-line">
        <span className="site-footer-text">PhishLens<span className="footer-tag"> · email threat detection, explained in plain English.</span></span>
        <span className="site-footer-sep">·</span>
        <Link className="site-footer-link" href="/about">About & FAQ</Link>
      </div>
    </footer>
  );
}