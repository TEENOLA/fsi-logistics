import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, waLink, WA_DEFAULT_MESSAGE } from "../data/brand";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-paper/90 backdrop-blur-md border-b border-black/10 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-magenta text-sm text-white">
            FSI
          </span>
          <span className="hidden sm:inline">Logistics</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-ink" : "text-ink/55 hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={waLink(WA_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-1.5 rounded-full bg-magenta px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-magenta-dark"
          >
            Ship Now
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-black/10 bg-paper lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-3 text-base font-medium ${
                      isActive ? "bg-mist text-ink" : "text-ink/70"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <a
                href={waLink(WA_DEFAULT_MESSAGE)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-full bg-magenta px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Ship Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
