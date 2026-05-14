"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Code2, Cpu } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;
const icons = [Code2, BrainCircuit, Cpu];

export default function About() {
  const { content } = useLocale();
  const about = content.about;

  return (
    <section id="about" className="relative px-5 py-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={about.eyebrow}
          title={about.title}
          description={about.description}
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-2xl"
            initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.95, ease: EASE }}
          >
            <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#e6c98b]/[0.06] blur-3xl" />
            <div className="absolute left-0 top-0 h-px w-28 bg-gradient-to-r from-[#e6c98b]/60 to-transparent" />
            <div className="relative">
              <h3 className="text-2xl font-semibold tracking-tight text-white">Amine</h3>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-[#e6c98b]">
                {about.role}
              </p>
              <p className="mt-7 text-base leading-8 text-zinc-400">{about.profileText}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {about.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-5 md:grid-cols-3 lg:grid-cols-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-90px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
            }}
          >
            {about.highlights.map((highlight, index) => {
              const Icon = icons[index];

              return (
                <motion.article
                  key={highlight.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-7 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                  variants={{
                    hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.8, ease: EASE },
                    },
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-[#e6c98b]/[0.06] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200 transition-colors group-hover:border-[#e6c98b]/30 group-hover:text-[#e6c98b]">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-white">
                    {highlight.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-7 text-zinc-400">{highlight.body}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
