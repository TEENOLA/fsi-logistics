import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle, Send, PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { waLink, WA_DEFAULT_MESSAGE } from "../data/brand";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop floating stack */}
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 lg:flex">
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-ink/60 shadow-lg hover:text-ink"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
        <a
          href={waLink(WA_DEFAULT_MESSAGE)}
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green text-white shadow-xl shadow-green/30 transition-transform hover:scale-105"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-black/10 bg-white/95 backdrop-blur-md lg:hidden">
        <a
          href={waLink(WA_DEFAULT_MESSAGE)}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium text-ink/60 active:bg-black/[0.03]"
        >
          <Send className="h-5 w-5 text-magenta" />
          Ship Now
        </a>
        <Link
          to="/tracking"
          className="flex flex-1 flex-col items-center gap-1 border-x border-black/10 py-3 text-[11px] font-medium text-ink/60 active:bg-black/[0.03]"
        >
          <PackageSearch className="h-5 w-5 text-gold" />
          Track
        </Link>
        <a
          href={waLink(WA_DEFAULT_MESSAGE)}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium text-ink/60 active:bg-black/[0.03]"
        >
          <MessageCircle className="h-5 w-5 text-green" />
          WhatsApp
        </a>
      </div>
    </>
  );
}
