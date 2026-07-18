import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Send } from "lucide-react";
import { BRAND, CONTACT_SHIPMENT_TYPES, waLink } from "../data/brand";
import Seo from "../components/Seo";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    shipmentType: CONTACT_SHIPMENT_TYPES[0],
    message: "",
  });

  const waMessage = `Hello FSI Logistics, my name is ${form.name || "-"}.
Email: ${form.email || "-"}
Phone: ${form.phone || "-"}
Shipment type: ${form.shipmentType}
Message: ${form.message || "-"}`;

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="pb-24 pt-32">
      <Seo
        title="Contact Us"
        description="Get in touch with FSI Logistics in Ogba, Lagos — call, WhatsApp, or send a message about your next shipment."
        path="/contact"
        keywords={["Logistics Company Nigeria", "Courier Services Nigeria"]}
      />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Let's get your shipment moving
          </h1>
          <p className="mt-5 text-lg text-ink/55">
            Send us a message or reach out directly — we usually reply fastest
            on WhatsApp.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            onSubmit={(e) => e.preventDefault()}
            className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name">
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                  className="input"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@email.com"
                  className="input"
                />
              </Field>
              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+234..."
                  className="input"
                />
              </Field>
              <Field label="Shipment Type">
                <select
                  value={form.shipmentType}
                  onChange={(e) => update("shipmentType", e.target.value)}
                  className="input"
                >
                  {CONTACT_SHIPMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Message">
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us about your shipment..."
                    rows={4}
                    className="input resize-none"
                  />
                </Field>
              </div>
            </div>

            <a
              href={waLink(waMessage)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-magenta px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <Send className="h-4 w-4" />
              Send via WhatsApp
            </a>
          </motion.form>

          {/* Business info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div className="rounded-2xl border border-black/10 bg-mist p-7">
              <h2 className="font-display text-lg font-semibold">
                Call or WhatsApp us
              </h2>
              <div className="mt-4 space-y-3">
                {BRAND.phones.map((p) => (
                  <div
                    key={p}
                    className="flex items-center justify-between gap-3"
                  >
                    <a
                      href={`tel:${p.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 font-mono text-sm text-ink/70 hover:text-ink"
                    >
                      <Phone className="h-4 w-4 text-magenta" /> {p}
                    </a>
                    <a
                      href={waLink(
                        `Hello FSI Logistics, I'd like to inquire about your logistics services.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-green text-white"
                      aria-label={`WhatsApp ${p}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm">
              <h2 className="font-display text-lg font-semibold">Follow us</h2>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center gap-2 text-sm text-ink/70 hover:text-ink"
              >
                <InstagramIcon /> {BRAND.instagram}
              </a>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm">
              <h2 className="font-display text-lg font-semibold">Visit us</h2>
              <div className="mt-4 flex items-start gap-2 text-sm text-ink/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-magenta" />
                <span>
                  Shop A114, Ogba Shopping Mall, beside Sunday Market, Ogba,
                  Lagos.
                </span>
              </div>
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
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink/45">
        {label}
      </span>
      {children}
    </label>
  );
}
