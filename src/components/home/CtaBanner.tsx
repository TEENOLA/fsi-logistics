import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { waLink, WA_DEFAULT_MESSAGE } from "../../data/brand";

export default function CtaBanner() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-magenta/10 via-mist to-white p-10 text-center sm:p-16"
        >
          <h2 className="mx-auto max-w-xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Ready to ship with FSI Logistics?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink/60">
            Get an instant estimate or talk to a real person on WhatsApp — whichever gets you moving faster.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
              className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold text-ink/70 hover:border-black/30 hover:text-ink"
            >
              Get a Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
