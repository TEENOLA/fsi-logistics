import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  PackageCheck,
  ClipboardList,
  Truck,
  Landmark,
  Bike,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { waLink } from "../data/brand";
import Seo from "../components/Seo";

const STATUSES = [
  { label: "Package Received", icon: PackageCheck },
  { label: "Processing", icon: ClipboardList },
  { label: "In Transit", icon: Truck },
  { label: "Customs Clearance", icon: Landmark },
  { label: "Out for Delivery", icon: Bike },
  { label: "Delivered", icon: CheckCircle2 },
];

const ROUTES = [
  { from: "Lagos, NG", to: "London, UK" },
  { from: "Abuja, NG", to: "Toronto, CA" },
  { from: "Lagos, NG", to: "New York, US" },
  { from: "Port Harcourt, NG", to: "Dubai, AE" },
  { from: "Lagos, NG", to: "Accra, GH" },
];

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function mockResult(trackingNumber: string) {
  const hash = hashCode(trackingNumber.trim().toUpperCase());
  const stepIndex = hash % STATUSES.length;
  const route = ROUTES[hash % ROUTES.length];
  return { stepIndex, route };
}

export default function Tracking() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ReturnType<typeof mockResult> | null>(
    null
  );
  const [submitted, setSubmitted] = useState("");

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setResult(mockResult(value));
    setSubmitted(value.trim().toUpperCase());
  }

  const progressPct = result
    ? (result.stepIndex / (STATUSES.length - 1)) * 100
    : 0;

  return (
    <div className="pt-32 pb-24">
      <Seo
        title="Track Your Shipment"
        description="Track your FSI Logistics shipment status in real time — from package received to out for delivery."
        path="/tracking"
        keywords={["Package Delivery Nigeria", "Courier Services Nigeria"]}
      />
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta">
            Tracking
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Where's my shipment?
          </h1>
          <p className="mt-5 text-lg text-ink/55">
            Enter your tracking number to see the latest status.
          </p>
        </div>

        <form
          onSubmit={handleTrack}
          className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. FSI-88291"
              className="w-full rounded-full border border-black/15 bg-white py-3.5 pl-11 pr-4 text-sm text-ink outline-none focus:border-magenta"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-magenta px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-magenta/20 transition-transform hover:scale-[1.02]"
          >
            Track Shipment
          </button>
        </form>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={submitted}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mt-14 rounded-2xl border border-black/10 bg-white p-7 shadow-sm sm:p-9"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-ink/40">{submitted}</p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {result.route.from} → {result.route.to}
                  </p>
                </div>
                <span className="rounded-full bg-green/10 px-4 py-1.5 text-xs font-semibold text-green">
                  {STATUSES[result.stepIndex].label}
                </span>
              </div>

              {/* progress bar */}
              <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-magenta to-gold"
                />
              </div>

              {/* status timeline */}
              <div className="mt-9 space-y-5">
                {STATUSES.map((status, i) => {
                  const done = i < result.stepIndex;
                  const current = i === result.stepIndex;
                  const Icon = status.icon;
                  return (
                    <motion.div
                      key={status.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}
                      className="flex items-center gap-4"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                          done
                            ? "border-green/30 bg-green/10 text-green"
                            : current
                            ? "border-magenta/30 bg-magenta/10 text-magenta"
                            : "border-black/10 bg-black/[0.02] text-ink/30"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            current
                              ? "text-ink"
                              : done
                              ? "text-ink/70"
                              : "text-ink/35"
                          }`}
                        >
                          {status.label}
                        </p>
                      </div>
                      {current && (
                        <span className="text-[11px] font-medium uppercase tracking-wide text-magenta">
                          Current
                        </span>
                      )}
                      {!done && !current && (
                        <Circle className="h-3 w-3 text-black/10" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6">
                <p className="text-xs text-ink/40">
                  Status shown here is illustrative — for exact live updates
                  contact our team.
                </p>
                <a
                  href={waLink(
                    `Hello FSI Logistics, I'd like an update on my shipment ${submitted}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-full bg-green px-5 py-2.5 text-xs font-semibold text-white"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
