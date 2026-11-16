import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, MessageCircle, Search } from "lucide-react";
import { waLink, BOOKING_FEE_PERCENTAGE, COUNTRIES } from "../data/brand";
import Seo from "../components/Seo";

function formatNaira(n: number) {
  return `₦${Math.round(n).toLocaleString()}`;
}

interface Rate {
  carrierName: string | null;
  carrierLogo: string | null;
  carrierSlug: string | null;
  amount: number | null;
  currency: string;
  deliveryTime: string | null;
  pickupTime: string | null;
  dropoffRequired: boolean;
  rateId: string | null;
}

type LookupState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "found"; rates: Rate[] };

export default function Pricing() {
  const [country, setCountry] = useState("US");
  const [customCountry, setCustomCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [weight, setWeight] = useState(2);
  const [value, setValue] = useState(500);
  const [description, setDescription] = useState("");
  const [lookup, setLookup] = useState<LookupState>({ kind: "idle" });

  const resolvedCountry = country || customCountry.trim().toUpperCase();

  async function handleGetRates(e: React.FormEvent) {
    e.preventDefault();
    if (!resolvedCountry || !state.trim() || !city.trim()) return;

    setLookup({ kind: "loading" });

    try {
      const res = await fetch("/.netlify/functions/get-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: {
            country: resolvedCountry,
            state: state.trim(),
            city: city.trim(),
            zip: zip.trim(),
          },
          parcel: {
            description: description.trim() || undefined,
            weight,
            value,
          },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setLookup({
          kind: "error",
          message: body?.error || "Something went wrong getting rates.",
        });
        return;
      }

      const data = await res.json();
      if (!data.rates || data.rates.length === 0) {
        setLookup({
          kind: "error",
          message:
            "No couriers currently serve that destination for this shipment.",
        });
        return;
      }

      setLookup({ kind: "found", rates: data.rates });
    } catch (err) {
      console.error("Get rates failed:", err);
      setLookup({
        kind: "error",
        message: "Couldn't reach our rates service. Please try again shortly.",
      });
    }
  }

  return (
    <div className="pt-32 pb-24">
      <Seo
        title="Shipping Pricing & Quote Estimator"
        description="Get an instant, real shipping cost estimate for international delivery from Nigeria with FSI Logistics — compare real courier rates before you book."
        path="/pricing"
        keywords={[
          "Package Delivery Nigeria",
          "International Shipping Cost Nigeria",
        ]}
      />
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            Pricing
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Real courier rates, before you book
          </h1>
          <p className="mt-5 text-lg text-ink/60">
            Enter your shipment details to see live rates from every courier
            available for your destination — international shipments only.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          onSubmit={handleGetRates}
          className="mt-14 rounded-2xl border border-black/10 bg-white p-7 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Destination Country">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.label} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            {!country && (
              <Field label="Country Code (2-letter, e.g. DE for Germany)">
                <input
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  placeholder="e.g. DE"
                  maxLength={2}
                  className="input uppercase"
                />
              </Field>
            )}

            <Field label="State / Region">
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder={
                  country === "US"
                    ? "e.g. New York (full name)"
                    : "e.g. Ontario"
                }
                className="input"
              />
            </Field>

            <Field label="City">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New York"
                className="input"
              />
            </Field>

            <Field label="Zip / Postal Code (optional)">
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="e.g. 10118"
                className="input"
              />
            </Field>

            <Field label={`Package Weight — ${weight}kg`}>
              <input
                type="range"
                min={1}
                max={100}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-magenta"
              />
            </Field>

            <Field label="Declared Value (₦)">
              <input
                type="number"
                min={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="input"
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="What are you sending? (optional)">
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Laptop and accessories"
                  className="input"
                />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            disabled={lookup.kind === "loading"}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-magenta px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 sm:w-auto"
          >
            <Search className="h-4 w-4" />
            {lookup.kind === "loading" ? "Getting rates…" : "Get Real Rates"}
          </button>

          <p className="mt-4 text-xs text-ink/40">
            Pickup is always from our Ogba, Lagos hub — this covers
            international shipments only. Duties, if any, are billed separately
            by the courier once your package clears customs abroad.
          </p>
        </motion.form>

        <AnimatePresence mode="wait">
          {lookup.kind === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm"
            >
              <AlertCircle className="h-8 w-8 text-magenta/60" />
              <p className="mt-4 font-semibold text-ink">Couldn't get rates</p>
              <p className="mt-1.5 text-sm text-ink/55">{lookup.message}</p>
            </motion.div>
          )}

          {lookup.kind === "found" && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-10"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink/40">
                {lookup.rates.length} courier
                {lookup.rates.length === 1 ? "" : "s"} available for this route
              </p>
              <div className="space-y-4">
                {lookup.rates.map((rate, i) => {
                  const subtotal = rate.amount ?? 0;
                  const bookingFee = subtotal * BOOKING_FEE_PERCENTAGE;
                  const total = subtotal + bookingFee;

                  return (
                    <motion.div
                      key={rate.rateId || i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-7"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-display text-lg font-semibold">
                            {rate.carrierName || "Courier"}
                          </p>
                          <p className="mt-1 text-sm text-ink/55">
                            {rate.deliveryTime || "Delivery time varies"}
                            {rate.dropoffRequired && " · drop-off required"}
                          </p>
                        </div>
                        <p className="font-display text-2xl font-bold text-magenta">
                          {formatNaira(total)}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-black/10 pt-4 text-xs text-ink/50">
                        <span>Subtotal: {formatNaira(subtotal)}</span>
                        <span>Booking fee: {formatNaira(bookingFee)}</span>
                      </div>

                      <a
                        href={waLink(
                          `Hello FSI Logistics, I'd like to book a shipment with ${
                            rate.carrierName || "a courier"
                          } — estimated total ${formatNaira(
                            total
                          )}. Destination: ${city}, ${resolvedCountry}. Weight: ${weight}kg.`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-green px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] sm:w-auto"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Continue via WhatsApp
                      </a>
                    </motion.div>
                  );
                })}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-ink/40">
                Rates shown are live from our courier network and may change
                slightly by the time you book. Import duties, if applicable, are
                billed separately by the courier once your package reaches its
                destination.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(0,0,0,0.12);
          background: rgba(0,0,0,0.02);
          padding: 0.7rem 1rem;
          font-size: 0.875rem;
          color: #1B1B1B;
          outline: none;
        }
        .input:focus {
          border-color: #E5006D;
        }
        select.input option {
          background: #FFFFFF;
          color: #1B1B1B;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink/50">
        {label}
      </span>
      {children}
    </label>
  );
}
