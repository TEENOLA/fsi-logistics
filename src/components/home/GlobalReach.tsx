import { motion } from "framer-motion";
import { STATS, ROUTES_MAP } from "../../data/brand";
import AnimatedCounter from "../AnimatedCounter";

export default function GlobalReach() {
  return (
    <section className="relative overflow-hidden border-y border-black/10 bg-mist py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-magenta">Global reach</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Nigeria to the world, on schedule
            </h2>
            <p className="mt-4 max-w-md text-ink/55">
              Active freight lanes connect Lagos to major hubs across North
              America, Europe and the Middle East.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-bold text-ink sm:text-4xl">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-1 text-xs text-ink/45">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Route visualization */}
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <svg viewBox="0 0 400 300" className="h-full w-full" fill="none">
              <circle cx="70" cy="230" r="4" fill="#F6B300" />
              <text x="80" y="234" fill="#1B1B1B" fillOpacity="0.55" fontSize="10" fontFamily="monospace">
                Lagos
              </text>

              {ROUTES_MAP.map((r, i) => {
                const x = parseFloat(r.left) * 4;
                const y = parseFloat(r.top) * 3;
                return (
                  <g key={r.name}>
                    <motion.path
                      d={`M70 230 Q ${(70 + x) / 2} ${Math.min(230, y) - 40}, ${x} ${y}`}
                      stroke="#E5006D"
                      strokeWidth="1.2"
                      strokeOpacity="0.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: i * 0.15, ease: "easeInOut" }}
                    />
                    <circle cx={x} cy={y} r="3.5" fill="#1FA74A" />
                    <text
                      x={x + 8}
                      y={y + 3}
                      fill="#1B1B1B"
                      fillOpacity="0.55"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {r.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
