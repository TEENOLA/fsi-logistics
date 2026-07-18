import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, MessageCircle } from "lucide-react";
import { waLink } from "../data/brand";
import Seo from "../components/Seo";

type DeliveryType = "Express" | "Standard" | "Air Freight" | "Sea Freight";

const RATES: Record<
  DeliveryType,
  { perKg: number; base: number; note: string }
> = {
  Standard: { perKg: 800, base: 1500, note: "Nationwide, 2–4 business days" },
  Express: {
    perKg: 1400,
    base: 2000,
    note: "Same-day to next-day, select routes",
  },
  "Air Freight": {
    perKg: 4200,
    base: 8000,
    note: "International, 3–7 business days",
  },
  "Sea Freight": { perKg: 950, base: 15000, note: "International, 3–6 weeks" },
};

function formatNaira(n: number) {
  return `₦${Math.round(n).toLocaleString()}`;
}

export default function Pricing() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState(5);
  const [type, setType] = useState<DeliveryType>("Standard");

  const estimate = useMemo(() => {
    const rate = RATES[type];
    return rate.base + rate.perKg * weight;
  }, [type, weight]);

  const waMessage = `Hello FSI Logistics, I'd like a quote for a shipment.
Pickup: ${pickup || "-"}
Destination: ${destination || "-"}
Weight: ${weight}kg
Delivery type: ${type}
Estimated cost: ${formatNaira(estimate)}`;

  return (
    <div className="pt-32 pb-24">
      <Seo
        title="Shipping Pricing & Quote Estimator"
        description="Get an instant shipping cost estimate for local and international delivery with FSI Logistics, then request a confirmed quote via WhatsApp."
        path="/pricing"
        keywords={["Package Delivery Nigeria", "Cargo Services Lagos"]}
      />
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            Pricing
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Know your cost before you book
          </h1>
          <p className="mt-5 text-lg text-ink/60">
            Get an instant estimate, then confirm the final rate with our team
            on WhatsApp.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-black/10 bg-white p-7 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Pickup Location">
                <input
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="e.g. Ikeja, Lagos"
                  className="input"
                />
              </Field>
              <Field label="Destination">
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. London, UK"
                  className="input"
                />
              </Field>

              <Field label={`Package Weight — ${weight}kg`}>
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-magenta"
                />
              </Field>

              <Field label="Delivery Type">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as DeliveryType)}
                  className="input"
                >
                  {(Object.keys(RATES) as DeliveryType[]).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <p className="mt-5 text-xs text-ink/45">{RATES[type].note}</p>
          </motion.div>

          {/* Estimate card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-between rounded-2xl border border-black/10 bg-gradient-to-br from-magenta/10 via-mist to-white p-7 sm:p-8"
          >
            <div>
              <div className="flex items-center gap-2 text-ink/55">
                <Calculator className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">
                  Estimated cost
                </span>
              </div>
              <p className="mt-3 font-display text-4xl font-bold sm:text-5xl">
                {formatNaira(estimate)}
              </p>
              <p className="mt-2 text-sm text-ink/55">
                {type} · {weight}kg
                {pickup || destination
                  ? ` · ${pickup || "Pickup"} → ${destination || "Destination"}`
                  : ""}
              </p>
            </div>

            <div>
              <p className="mt-8 text-xs leading-relaxed text-ink/45">
                Final shipping cost will be confirmed by an FSI Logistics
                representative.
              </p>
              <a
                href={waLink(waMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-green px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" />
                Request Quote via WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
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
