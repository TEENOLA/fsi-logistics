import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "../../data/brand";

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Customer stories</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Trusted by shippers across Nigeria and beyond
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm"
            >
              <Quote className="h-5 w-5 text-magenta" />
              <p className="mt-4 text-ink/80">"{t.quote}"</p>
              <div className="mt-6 border-t border-black/10 pt-4">
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                <p className="text-xs text-ink/45">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
