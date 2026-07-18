import { motion } from "framer-motion";
import { ShieldCheck, Clock3, BadgeDollarSign, Headset } from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    desc: "Your packages are handled with the utmost care.",
    color: "text-green",
    bg: "bg-green/10",
  },
  {
    icon: Clock3,
    title: "On-Time Delivery",
    desc: "We value your time and deliver as promised.",
    color: "text-gold",
    bg: "bg-gold/10",
  },
  {
    icon: BadgeDollarSign,
    title: "Affordable Rates",
    desc: "Quality logistics services at competitive prices.",
    color: "text-magenta",
    bg: "bg-magenta/10",
  },
  {
    icon: Headset,
    title: "Excellent Support",
    desc: "Our support team is always available to assist.",
    color: "text-green",
    bg: "bg-green/10",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta">Why FSI</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Built for shipments that can't afford to be late
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
