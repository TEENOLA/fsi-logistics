import { Link } from "react-router-dom";
import { BRAND } from "../data/brand";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const linkGroups = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Services", to: "/services" },
      { label: "International Shipping", to: "/international" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Tracking", to: "/tracking" },
      { label: "Pricing", to: "/pricing" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-mist">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-display text-xl font-bold text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-magenta text-sm text-white">FSI</span>
              Logistics
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink/55">{BRAND.tagline}</p>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
            >
              <InstagramIcon /> {BRAND.instagram}
            </a>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink/40">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-ink/60 hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink/40">
              Talk to us
            </h4>
            <ul className="mt-4 space-y-3 font-mono text-sm text-ink/60">
              {BRAND.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-ink">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 text-xs text-ink/40 md:flex-row">
          <p>© {new Date().getFullYear()} FSI Logistics. All rights reserved.</p>
          <p>Fast. Safe. Reliable.</p>
        </div>
      </div>
    </footer>
  );
}
