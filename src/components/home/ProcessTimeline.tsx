import { motion } from "framer-motion";
import { PROCESS_STEPS } from "../../data/brand";

export default function ProcessTimeline() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-16 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-green">The manifest</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            From booking to your doorstep
          </h2>
        </div>

        <div className="relative">
          {/* connecting line */}
          <div className="absolute left-[19px] top-2 hidden h-[calc(100%-40px)] w-px bg-black/10 md:block lg:left-0 lg:top-6 lg:h-px lg:w-full" />

          <div className="grid gap-8 md:grid-cols-5">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex gap-4 md:flex-col md:gap-0"
              >
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white font-mono text-sm font-semibold text-ink/60 shadow-sm md:mb-5">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-ink/50">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
