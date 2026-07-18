import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Globe2,
  Truck,
  Zap,
  Plane,
  Ship,
  ArrowLeftRight,
  Building2,
  ArrowRight,
} from "lucide-react";
import { SERVICES } from "../../data/brand";

const ICONS: Record<string, any> = {
  "international-cargo": Globe2,
  "local-delivery": Truck,
  "express-parcel": Zap,
  "air-freight": Plane,
  "sea-freight": Ship,
  "import-export": ArrowLeftRight,
  "commercial-logistics": Building2,
};

export default function ServicesPreview() {
  return (
    <section className="relative bg-mist py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-widest text-magenta">What we move</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Services built around how your cargo actually travels
            </h2>
          </div>
          <Link
            to="/services"
            className="flex items-center gap-1.5 text-sm font-semibold text-ink/70 hover:text-ink"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.slug] ?? Globe2;
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-magenta/5 blur-2xl" />
                <Icon className="h-7 w-7 text-magenta" />
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{s.short}</p>
                <Link
                  to="/services"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-magenta"
                >
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
