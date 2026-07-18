import { useState } from "react";
import type { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { waLink, SERVICES } from "../data/brand";
import Seo from "../components/Seo";
import {
  IllustrationGlobe,
  IllustrationTruck,
  IllustrationBolt,
  IllustrationPlane,
  IllustrationShip,
  IllustrationExchange,
  IllustrationBuilding,
} from "../components/services/Illustrations";

const ILLUSTRATIONS: Record<string, () => ReactElement> = {
  "international-cargo": IllustrationGlobe,
  "local-delivery": IllustrationTruck,
  "express-parcel": IllustrationBolt,
  "air-freight": IllustrationPlane,
  "sea-freight": IllustrationShip,
  "import-export": IllustrationExchange,
  "commercial-logistics": IllustrationBuilding,
};

export default function Services() {
  const [open, setOpen] = useState<string | null>(SERVICES[0].slug);

  return (
    <div className="pt-32 pb-24">
      <Seo
        title="Our Services"
        description="Local delivery, express parcel, air freight, sea freight, import/export and commercial logistics services from FSI Logistics, Lagos."
        path="/services"
        keywords={[
          "Air Freight Nigeria",
          "Sea Freight Nigeria",
          "Import and Export Logistics",
          "Courier Services Nigeria",
        ]}
      />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta">
            Services
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Every shipment moves differently. We've built for each one.
          </h1>
          <p className="mt-5 text-lg text-ink/60">
            Whether it's a same-day parcel across Lagos or a bulk container
            crossing the Atlantic, FSI Logistics has a dedicated service lane
            for it.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          {SERVICES.map((s, i) => {
            const Illustration = ILLUSTRATIONS[s.slug];
            const isOpen = open === s.slug;
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-5 p-7">
                  <div className="h-20 w-28 shrink-0 opacity-90 transition-transform duration-300 group-hover:scale-105">
                    <Illustration />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">
                      {s.short}
                    </p>

                    {"countries" in s && s.countries && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {s.countries.map((c) => (
                          <span
                            key={c}
                            className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[11px] text-ink/55"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => setOpen(isOpen ? null : s.slug)}
                      className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-gold"
                    >
                      Learn more
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-black/10"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 p-7 pt-5">
                        <p className="max-w-md text-sm text-ink/65">
                          {s.detail}
                        </p>
                        <a
                          href={waLink(
                            `Hello FSI Logistics, I'd like to inquire about your ${s.title} service.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 rounded-full bg-magenta px-5 py-2.5 text-xs font-semibold"
                        >
                          Ask about this
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-ink/45">
          <MapPin className="h-4 w-4" />
          Based in Lagos, shipping nationwide and internationally
        </div>
      </div>
    </div>
  );
}
