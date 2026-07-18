import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Clock, Hash, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { waLink, WA_DEFAULT_MESSAGE } from "../../data/brand";

const MANIFEST = [
  { id: "FSI-88291", route: "LAG → LHR", status: "In Transit" },
  { id: "FSI-77120", route: "LAG → JFK", status: "Customs" },
  { id: "FSI-90042", route: "ABV → YYZ", status: "Picked Up" },
  { id: "FSI-65310", route: "PHC → DXB", status: "Delivered" },
  { id: "FSI-51882", route: "LAG → FRA", status: "In Transit" },
  { id: "FSI-33071", route: "LAG → ACC", status: "Out for Delivery" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Layered background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-magenta/10 blur-[120px]" />
        <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-gold/15 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-green/10 blur-[100px]" />
        <RouteLines />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-ink/60 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              Live across 24+ countries
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
            >
              One Place For All Your
              <span className="relative mx-3 inline-block text-magenta">
                Logistics
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 9C40 3 160 3 198 9"
                    stroke="#F6B300"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Needs
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-md text-lg text-ink/60"
            >
              Local & international shipping solutions designed to move your
              packages quickly, safely and affordably.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href={waLink(WA_DEFAULT_MESSAGE)}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full bg-magenta px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-magenta/25 transition-transform hover:scale-[1.03]"
              >
                Ship Now
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link
                to="/pricing"
                className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold text-ink/70 transition-colors hover:border-black/30 hover:text-ink"
              >
                Get a Quote
              </Link>
            </motion.div>
          </div>

          {/* Shipment card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-2xl shadow-black/5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-green/10 px-3 py-1 text-xs font-semibold text-green">
                  In Transit
                </span>
                <span className="font-mono text-xs text-ink/40">FSI-88291</span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-magenta" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-ink/40">Destination</p>
                    <p className="text-sm font-medium text-ink">London, UK</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gold" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-ink/40">Estimated Arrival</p>
                    <p className="text-sm font-medium text-ink">Jul 22, 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-green" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-ink/40">Tracking Number</p>
                    <p className="font-mono text-sm font-medium text-ink">FSI-88291-NG</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "68%" }}
                    transition={{ duration: 1.4, delay: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-magenta to-gold"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-ink/40">
                  <span>Lagos</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green" /> On schedule
                  </span>
                  <span>London</span>
                </div>
              </div>
            </div>

            {/* floating mini badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 -top-4 hidden rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-medium text-ink shadow-xl sm:block"
            >
              98.6% On-Time Rate
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Manifest ticker strip */}
      <div className="relative mt-16 border-y border-black/10 bg-mist py-3">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-mono text-xs text-ink/45">
          {[...MANIFEST, ...MANIFEST].map((m, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="text-ink/70">{m.id}</span>
              <span>{m.route}</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-ink/60 shadow-sm">
                {m.status}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function RouteLines() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-40"
      viewBox="0 0 1200 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M100 500 C 300 300, 500 550, 700 250 S 1000 150, 1150 100"
        stroke="url(#routeGrad)"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E5006D" />
          <stop offset="100%" stopColor="#F6B300" />
        </linearGradient>
      </defs>
    </svg>
  );
}
