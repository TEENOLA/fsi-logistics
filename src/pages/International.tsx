import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PackageCheck,
  ClipboardList,
  Send,
  PartyPopper,
  ArrowUpRight,
} from "lucide-react";
import {
  SERVICES,
  FAQS,
  INTERNATIONAL_DESTINATIONS,
  waLink,
} from "../data/brand";
import Seo from "../components/Seo";
import GlobalReach from "../components/home/GlobalReach";
import CtaBanner from "../components/home/CtaBanner";

const INTERNATIONAL = SERVICES.find((s) => s.slug === "international-cargo")!;

const HOW_IT_WORKS = [
  {
    icon: PackageCheck,
    title: "Book & get a quote",
    desc: "Tell us what you're sending and where — get an instant estimate before you commit.",
  },
  {
    icon: ClipboardList,
    title: "We collect & process",
    desc: "Our team picks up your package and handles documentation and customs prep.",
  },
  {
    icon: Send,
    title: "Handed to our courier partner",
    desc: "Your shipment moves internationally through a trusted global carrier network.",
  },
  {
    icon: PartyPopper,
    title: "Cleared & delivered",
    desc: "Customs clearance handled, then delivered to your recipient's door.",
  },
];

const COURIER_PARTNERS = ["DHL", "FedEx", "UPS", "Aramex"];

const INTERNATIONAL_FAQ_QUESTIONS = [
  "Do you ship internationally?",
  "How long does delivery take?",
  "What items cannot be shipped?",
];

const internationalFaqs = FAQS.filter((f) =>
  INTERNATIONAL_FAQ_QUESTIONS.includes(f.q)
);

export default function International() {
  return (
    <div className="pt-32 pb-24">
      <Seo
        title="International Shipping"
        description="Ship from Nigeria to the USA, UK, Canada, Europe and beyond with FSI Logistics — full customs support, trusted courier partners, and live tracking."
        path="/international"
        keywords={[
          "International Shipping Nigeria",
          "Ship from Nigeria to USA",
          "Ship from Nigeria to UK",
          "Air Freight Nigeria",
        ]}
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta">
            International
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Ship from Nigeria to the world
          </h1>
          <p className="mt-5 text-lg text-ink/55">{INTERNATIONAL.detail}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {INTERNATIONAL_DESTINATIONS.map((c) => (
              <span
                key={c}
                className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-medium text-ink/60"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/pricing"
              className="rounded-full bg-magenta px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-magenta/20 transition-transform hover:scale-[1.02]"
            >
              Get an Instant Quote
            </Link>
            <a
              href={waLink(
                "Hello FSI Logistics, I'd like to ship a package internationally."
              )}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold text-ink/70 hover:border-black/30 hover:text-ink"
            >
              Ask on WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <GlobalReach />
      </div>

      {/* How it works */}
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-green">
            The process
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How international shipping works with us
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-magenta/10 text-magenta">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Courier partners */}
      <div className="border-y border-black/10 bg-mist py-20">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta">
            Our network
          </p>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Backed by trusted global carriers
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink/55">
            We work with established international couriers to get your shipment
            where it needs to go, reliably.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {COURIER_PARTNERS.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-full border border-black/10 bg-white px-6 py-3 font-display text-sm font-semibold text-ink/70 shadow-sm"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* International-specific FAQ */}
      {internationalFaqs.length > 0 && (
        <div className="mx-auto max-w-4xl px-5 py-24 md:px-8">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-green">
              Common questions
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Shipping internationally? Read this first
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {internationalFaqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
              >
                <h3 className="font-display text-base font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <CtaBanner />
    </div>
  );
}
