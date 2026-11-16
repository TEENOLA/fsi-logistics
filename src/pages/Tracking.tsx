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
  AlertCircle,
  ExternalLink,
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

// Maps Terminal Africa's own top-level shipment status to a stage index in
// the STATUSES timeline above. Confirmed against a real populated response:
// this top-level status is coarser than our six stages (it doesn't
// distinguish "in transit" from "customs clearance" or "out for delivery"),
// so those two extra stages will only ever show as reached once the
// shipment is fully delivered — there isn't a distinct signal for them at
// this level. The individual `events` below have their own status codes,
// but those are carrier-specific (not a shared enum), so they're shown as
// a supplementary detail list rather than used to pick a more granular
// stage.
const STATUS_TO_STAGE: Record<string, number> = {
  draft: 0,
  pending: 0,
  confirmed: 1,
  "in-transit": 2,
  delivered: 5,
};

interface TrackingEvent {
  description: string | null;
  location: string | null;
  createdAt: string | null;
}

interface TrackingApiResponse {
  status: string | null;
  carrierName: string | null;
  pickupDate: string | null;
  deliveryDate: string | null;
  carrierTrackingNumber: string | null;
  carrierTrackingUrl: string | null;
  events: TrackingEvent[];
}

type LookupState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "error"; message: string }
  | { kind: "cancelled" }
  | { kind: "found"; data: TrackingApiResponse };

export default function Tracking() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [state, setState] = useState<LookupState>({ kind: "idle" });

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    setSubmitted(trimmed.toUpperCase());
    setState({ kind: "loading" });

    try {
      const res = await fetch(
        `/.netlify/functions/track-shipment?number=${encodeURIComponent(
          trimmed
        )}`
      );

      if (res.status === 404) {
        setState({ kind: "not-found" });
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setState({
          kind: "error",
          message: body?.error || "Something went wrong looking that up.",
        });
        return;
      }

      const data: TrackingApiResponse = await res.json();

      if (data.status === "cancelled") {
        setState({ kind: "cancelled" });
        return;
      }

      setState({ kind: "found", data });
    } catch (err) {
      console.error("Tracking lookup failed:", err);
      setState({
        kind: "error",
        message:
          "Couldn't reach our tracking service. Please try again shortly.",
      });
    }
  }

  const stageIndex =
    state.kind === "found" ? STATUS_TO_STAGE[state.data.status ?? ""] ?? 0 : 0;
  const progressPct = (stageIndex / (STATUSES.length - 1)) * 100;

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
            disabled={state.kind === "loading"}
            className="shrink-0 rounded-full bg-magenta px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-magenta/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {state.kind === "loading" ? "Searching…" : "Track Shipment"}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {state.kind === "not-found" && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-14 flex max-w-md flex-col items-center rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm"
            >
              <AlertCircle className="h-8 w-8 text-magenta/60" />
              <p className="mt-4 font-semibold text-ink">
                We couldn't find that tracking number
              </p>
              <p className="mt-1.5 text-sm text-ink/55">
                Double check the number we gave you, or ask us directly below.
              </p>
              <a
                href={waLink(
                  `Hello FSI Logistics, I couldn't find a status for tracking number ${submitted}.`
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-5 rounded-full bg-green px-5 py-2.5 text-xs font-semibold text-white"
              >
                Ask on WhatsApp
              </a>
            </motion.div>
          )}

          {state.kind === "cancelled" && (
            <motion.div
              key="cancelled"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-14 flex max-w-md flex-col items-center rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm"
            >
              <AlertCircle className="h-8 w-8 text-magenta/60" />
              <p className="mt-4 font-semibold text-ink">
                This shipment was cancelled
              </p>
              <p className="mt-1.5 text-sm text-ink/55">
                If this doesn't look right, reach out and we'll look into it.
              </p>
              <a
                href={waLink(
                  `Hello FSI Logistics, tracking number ${submitted} shows as cancelled — can you confirm what happened?`
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-5 rounded-full bg-green px-5 py-2.5 text-xs font-semibold text-white"
              >
                Ask on WhatsApp
              </a>
            </motion.div>
          )}

          {state.kind === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-14 flex max-w-md flex-col items-center rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm"
            >
              <AlertCircle className="h-8 w-8 text-magenta/60" />
              <p className="mt-4 font-semibold text-ink">
                Something went wrong looking that up
              </p>
              <p className="mt-1.5 text-sm text-ink/55">{state.message}</p>
            </motion.div>
          )}

          {state.kind === "found" && (
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
                  {state.data.carrierName && (
                    <p className="mt-1 text-lg font-semibold text-ink">
                      Shipping via {state.data.carrierName}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-green/10 px-4 py-1.5 text-xs font-semibold text-green">
                  {STATUSES[stageIndex].label}
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
                  const done = i < stageIndex;
                  const current = i === stageIndex;
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

              {/* Carrier-provided event history — confirmed real shape:
                  each event has a description, location, and timestamp. */}
              {state.data.events.length > 0 && (
                <div className="mt-8 border-t border-black/10 pt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/40">
                    Recent updates
                  </p>
                  <ul className="space-y-3">
                    {state.data.events.map((evt, i) => (
                      <li
                        key={i}
                        className="flex items-start justify-between gap-3 text-xs text-ink/60"
                      >
                        <span>
                          {evt.description || "Status update"}
                          {evt.location ? ` — ${evt.location}` : ""}
                        </span>
                        {evt.createdAt && (
                          <span className="shrink-0 text-ink/35">
                            {new Date(evt.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6">
                <div className="text-xs text-ink/40">
                  <p>Status provided by our shipping partner network.</p>
                  {state.data.carrierTrackingNumber && (
                    <p className="mt-1 font-mono text-ink/50">
                      Carrier tracking #: {state.data.carrierTrackingNumber}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {state.data.carrierTrackingUrl && (
                    <a
                      href={state.data.carrierTrackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/15 px-5 py-2.5 text-xs font-semibold text-ink hover:border-black/30"
                    >
                      Track with {state.data.carrierName || "carrier"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
