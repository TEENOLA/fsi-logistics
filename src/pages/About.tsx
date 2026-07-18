import { motion } from "framer-motion";
import { Target, Eye, Sparkles } from "lucide-react";
import { ABOUT } from "../data/brand";
import Seo from "../components/Seo";

export default function About() {
  return (
    <div className="pb-24 pt-32">
      <Seo
        title="About Us"
        description="Learn about FSI Logistics — a Lagos-based freight forwarding and courier company serving Nigeria and 24+ countries with local delivery, air and sea freight."
        path="/about"
        keywords={["Freight Forwarding Nigeria", "Logistics Company Nigeria"]}
      />
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta">
            About FSI Logistics
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Built in Lagos. Moving cargo everywhere.
          </h1>
          <p className="mt-5 text-lg text-ink/55">{ABOUT.story}</p>
        </div>

        {/* Mission & Vision */}
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-magenta/10 text-magenta">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold">
              Our Mission
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              {ABOUT.mission}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold">
              Our Vision
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              {ABOUT.vision}
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="mt-24">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-widest text-green">
              What guides us
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Core values
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {ABOUT.values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
              >
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-magenta" />
                <div>
                  <h3 className="font-display text-base font-semibold">
                    {v.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink/55">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-24">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">
              Our growth
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Company timeline
            </h2>
          </div>

          <div className="relative mt-12 space-y-10">
            <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-black/10" />
            {ABOUT.timeline.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col gap-1.5 pl-8"
              >
                <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-magenta bg-white" />
                <p className="font-mono text-xs uppercase tracking-wide text-magenta">
                  {t.year}
                </p>
                <h3 className="font-display text-lg font-semibold">
                  {t.title}
                </h3>
                <p className="text-sm text-ink/55">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
