import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/",         label: "Certify" },
  { to: "/verify",   label: "Verify"  },
  { to: "/realtime", label: "Live Capture" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">Veritas Ledger</span>
      </div>
      <div className="navbar-links">
        {LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`nav-link ${pathname === to ? "active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}