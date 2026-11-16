import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { COUNTRIES, BOOKING_FEE_PERCENTAGE, waLink } from "../data/brand";
import Seo from "../components/Seo";

function formatNaira(n: number) {
  return `₦${Math.round(n).toLocaleString()}`;
}

interface Rate {
  carrierName: string | null;
  carrierSlug: string | null;
  amount: number | null;
  currency: string;
  deliveryTime: string | null;
  dropoffRequired: boolean;
  rateId: string | null;
}

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS = ["Details", "Recipient", "Courier", "Review"];

export default function Booking() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 — customer's own details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Step 2 — recipient + package
  const [recipientFirstName, setRecipientFirstName] = useState("");
  const [recipientLastName, setRecipientLastName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [country, setCountry] = useState("US");
  const [customCountry, setCustomCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [weight, setWeight] = useState(2);
  const [value, setValue] = useState(500);
  const [description, setDescription] = useState("");

  // Step 3 — rates
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);
  const [shipmentId, setShipmentId] = useState<string | null>(null);
  const [rates, setRates] = useState<Rate[]>([]);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);

  // Step 5 — confirm
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [booked, setBooked] = useState<{
    trackingNumber: string | null;
    carrierName: string | null;
  } | null>(null);

  const resolvedCountry = country || customCountry.trim().toUpperCase();

  function canContinueStep1() {
    return customerName.trim() && customerPhone.trim() && customerEmail.trim();
  }

  function canContinueStep2() {
    return (
      recipientFirstName.trim() &&
      recipientLastName.trim() &&
      recipientEmail.trim() &&
      recipientPhone.trim() &&
      line1.trim() &&
      resolvedCountry &&
      state.trim() &&
      city.trim() &&
      weight > 0
    );
  }

  async function fetchRates() {
    setRateLoading(true);
    setRateError(null);
    try {
      const res = await fetch("/.netlify/functions/book-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: customerName.trim(), phone: customerPhone.trim() },
          recipient: {
            firstName: recipientFirstName.trim(),
            lastName: recipientLastName.trim(),
            email: recipientEmail.trim(),
            phone: recipientPhone.trim(),
            line1: line1.trim(),
            line2: line2.trim(),
            city: city.trim(),
            state: state.trim(),
            country: resolvedCountry,
            zip: zip.trim(),
          },
          parcel: { description: description.trim(), weight, value },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setRateError(
          body?.error || "Something went wrong getting shipping options."
        );
        setRateLoading(false);
        return;
      }

      const data = await res.json();
      if (!data.rates || data.rates.length === 0) {
        setRateError(
          "No couriers currently serve that destination for this shipment."
        );
        setRateLoading(false);
        return;
      }

      setShipmentId(data.shipmentId);
      setRates(data.rates);
      setStep(3);
    } catch (err) {
      console.error("Get quote failed:", err);
      setRateError(
        "Couldn't reach our booking service. Please try again shortly."
      );
    } finally {
      setRateLoading(false);
    }
  }

  async function handleConfirm() {
    if (!shipmentId || !selectedRate) return;
    setConfirming(true);
    setConfirmError(null);

    try {
      const subtotal = selectedRate.amount ?? 0;
      const total = subtotal + subtotal * BOOKING_FEE_PERCENTAGE;

      // NOTE: payment gateway integration (Paystack or Flutterwave) is
      // still pending Fsi's choice. This confirms the booking directly for
      // now — once a gateway is chosen, this should only run after a real
      // successful payment callback, not immediately on click.
      const res = await fetch("/.netlify/functions/book-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipmentId,
          rateId: selectedRate.rateId,
          carrierSlug: selectedRate.carrierSlug,
          dropoffRequired: selectedRate.dropoffRequired,
          customer: {
            name: customerName.trim(),
            phone: customerPhone.trim(),
            email: customerEmail.trim(),
          },
          recipient: {
            firstName: recipientFirstName.trim(),
            lastName: recipientLastName.trim(),
            city: city.trim(),
            country: resolvedCountry,
          },
          totalCharged: Math.round(total),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setConfirmError(
          body?.error || "Something went wrong confirming your booking."
        );
        setConfirming(false);
        return;
      }

      const data = await res.json();
      setBooked({
        trackingNumber: data.trackingNumber,
        carrierName: data.carrierName,
      });
      setStep(5);
    } catch (err) {
      console.error("Confirm booking failed:", err);
      setConfirmError(
        "Couldn't reach our booking service. Please try again shortly."
      );
    } finally {
      setConfirming(false);
    }
  }

  const subtotal = selectedRate?.amount ?? 0;
  const bookingFee = subtotal * BOOKING_FEE_PERCENTAGE;
  const total = subtotal + bookingFee;

  return (
    <div className="pt-32 pb-24">
      <Seo
        title="Book a Shipment"
        description="Book your international shipment directly with FSI Logistics — choose your courier, see the real price, and get a tracking number instantly."
        path="/booking"
        keywords={["Book Courier Nigeria", "International Shipping Booking"]}
      />
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta">
            Booking
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Book your shipment
          </h1>
          <p className="mt-5 text-lg text-ink/60">
            International shipments only — we collect from our Ogba hub and ship
            with your chosen courier.
          </p>
        </div>

        {step < 5 && (
          <div className="mx-auto mt-10 max-w-md">
            <div className="relative flex items-center justify-between">
              {/* Background track */}
              <div className="absolute left-0 right-0 top-4 h-0.5 -translate-y-1/2 bg-black/10" />
              {/* Filled progress */}
              <motion.div
                className="absolute left-0 top-4 h-0.5 -translate-y-1/2 bg-magenta"
                initial={false}
                animate={{ width: `${((step - 1) / 3) * 100}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
              {STEP_LABELS.map((label, i) => {
                const s = i + 1;
                const done = step > s;
                const current = step === s;
                return (
                  <div
                    key={s}
                    className="relative z-10 flex flex-col items-center gap-2"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        done
                          ? "bg-magenta text-white"
                          : current
                          ? "bg-white text-magenta ring-2 ring-magenta"
                          : "bg-white text-ink/30 ring-1 ring-black/10"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : s}
                    </div>
                    <span
                      className={`text-[11px] font-medium ${
                        current ? "text-magenta" : "text-ink/40"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-10 rounded-2xl border border-black/10 bg-white p-7 sm:p-8"
            >
              <h2 className="font-display text-lg font-semibold">
                Your details
              </h2>
              <p className="mt-1 text-sm text-ink/55">
                So we know who's booking, and can reach you about pickup.
              </p>
              <div className="mt-6 grid gap-5">
                <Field label="Your Full Name">
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Your Phone Number">
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+234..."
                    className="input"
                  />
                </Field>
                <Field label="Your Email">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="input"
                  />
                </Field>
              </div>
              <button
                onClick={() => canContinueStep1() && setStep(2)}
                disabled={!canContinueStep1()}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-magenta px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-40 sm:w-auto"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-10 rounded-2xl border border-black/10 bg-white p-7 sm:p-8"
            >
              <h2 className="font-display text-lg font-semibold">
                Recipient & package
              </h2>
              <p className="mt-1 text-sm text-ink/55">
                Who is this going to, and what are you sending?
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Recipient First Name">
                  <input
                    value={recipientFirstName}
                    onChange={(e) => setRecipientFirstName(e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Recipient Last Name">
                  <input
                    value={recipientLastName}
                    onChange={(e) => setRecipientLastName(e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Recipient Email">
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Recipient Phone">
                  <input
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="input"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Street Address">
                    <input
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      placeholder="Line 1"
                      className="input"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Address Line 2 (optional)">
                    <input
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      className="input"
                    />
                  </Field>
                </div>

                <Field label="Country">
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
                  <Field label="Country Code (2-letter)">
                    <input
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
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
                      country === "US" ? "Full name, e.g. New York" : ""
                    }
                    className="input"
                  />
                </Field>
                <Field label="City">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Zip / Postal Code">
                  <input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
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
                  <Field label="What are you sending?">
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Laptop and accessories"
                      className="input"
                    />
                  </Field>
                </div>
              </div>

              {rateError && (
                <p className="mt-4 flex items-center gap-2 text-sm text-magenta">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {rateError}
                </p>
              )}

              <div className="mt-7 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm font-semibold text-ink/60"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => canContinueStep2() && fetchRates()}
                  disabled={!canContinueStep2() || rateLoading}
                  className="flex items-center justify-center gap-2 rounded-full bg-magenta px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-40"
                >
                  {rateLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {rateLoading ? "Getting options…" : "See Courier Options"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-10"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink/40">
                Choose your courier
              </p>
              <div className="space-y-3">
                {rates.map((rate, i) => {
                  const rSubtotal = rate.amount ?? 0;
                  const rTotal = rSubtotal + rSubtotal * BOOKING_FEE_PERCENTAGE;
                  const isSelected = selectedRate?.rateId === rate.rateId;
                  return (
                    <button
                      key={rate.rateId || i}
                      onClick={() => setSelectedRate(rate)}
                      className={`w-full rounded-2xl border p-5 text-left transition-colors ${
                        isSelected
                          ? "border-magenta bg-magenta/5"
                          : "border-black/10 bg-white hover:border-black/20"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-display font-semibold">
                            {rate.carrierName || "Courier"}
                          </p>
                          <p className="mt-0.5 text-xs text-ink/55">
                            {rate.deliveryTime || "Delivery time varies"}
                          </p>
                        </div>
                        <p className="font-display text-xl font-bold text-magenta">
                          {formatNaira(rTotal)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-sm font-semibold text-ink/60"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => selectedRate && setStep(4)}
                  disabled={!selectedRate}
                  className="flex items-center justify-center gap-2 rounded-full bg-magenta px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-40"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && selectedRate && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-10 rounded-2xl border border-black/10 bg-white p-7 sm:p-8"
            >
              <h2 className="font-display text-lg font-semibold">
                Review & confirm
              </h2>

              <div className="mt-5 space-y-3 border-t border-black/10 pt-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink/55">Courier</span>
                  <span className="font-medium">
                    {selectedRate.carrierName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/55">Delivery time</span>
                  <span className="font-medium">
                    {selectedRate.deliveryTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/55">Recipient</span>
                  <span className="font-medium">
                    {recipientFirstName} {recipientLastName}, {city},{" "}
                    {resolvedCountry}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/55">Package</span>
                  <span className="font-medium">
                    {weight}kg{description ? ` — ${description}` : ""}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-black/10 pt-5 text-sm">
                <div className="flex justify-between text-ink/55">
                  <span>Subtotal</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink/55">
                  <span>Booking fee</span>
                  <span>{formatNaira(bookingFee)}</span>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-2 font-display text-lg font-bold text-ink">
                  <span>Total</span>
                  <span className="text-magenta">{formatNaira(total)}</span>
                </div>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-ink/40">
                Duties, if applicable, are billed separately by the courier via
                a text message once your package reaches its destination — not
                included above. Your weight is treated as an estimate; if it's
                incorrect when your package reaches us, we'll refund you and ask
                you to rebook with the correct weight.
              </p>

              {confirmError && (
                <p className="mt-4 flex items-center gap-2 text-sm text-magenta">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {confirmError}
                </p>
              )}

              <div className="mt-7 flex items-center justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 text-sm font-semibold text-ink/60"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="flex items-center justify-center gap-2 rounded-full bg-magenta px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {confirming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {confirming
                    ? "Booking…"
                    : `Confirm & Book — ${formatNaira(total)}`}
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && booked && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex flex-col items-center rounded-2xl border border-black/10 bg-white p-9 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-green" />
              <h2 className="mt-4 font-display text-2xl font-bold">
                Booking confirmed!
              </h2>
              <p className="mt-2 text-ink/60">
                Shipping with {booked.carrierName || "your chosen courier"}.
              </p>
              {booked.trackingNumber && (
                <p className="mt-4 rounded-full bg-black/[0.04] px-5 py-2 font-mono text-sm">
                  {booked.trackingNumber}
                </p>
              )}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/tracking"
                  className="rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white"
                >
                  Track This Shipment
                </a>
                <a
                  href={waLink(
                    `Hello FSI Logistics, I just booked a shipment (${
                      booked.trackingNumber || "no tracking number yet"
                    }) — just confirming you have it.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold text-ink"
                >
                  Message Us
                </a>
              </div>
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
        .input:focus { border-color: #E5006D; }
        select.input option { background: #FFFFFF; color: #1B1B1B; }
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
