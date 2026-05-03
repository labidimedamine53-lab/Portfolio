"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Code2, Cpu } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

const icons = [Code2, BrainCircuit, Cpu];

export default function About() {
  const { content } = useLocale();
  const about = content.about;

  return (
    <section id="about" className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={about.eyebrow}
          title={about.title}
          description={about.description}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-300/15 blur-3xl" />
            <div className="relative">
              <h3 className="text-2xl font-semibold text-white">Amine</h3>
              <p className="mt-2 text-cyan-100">{about.role}</p>
              <p className="mt-6 text-base leading-8 text-slate-300">
                {about.profileText}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
                {about.tags.map((tag) => (
                  <span key={tag} className="rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3 lg:grid-cols-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-90px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {about.highlights.map((highlight, index) => {
              const Icon = icons[index];

              return (
                <motion.article
                  key={highlight.title}
                  className="rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:border-cyan-200/35 hover:bg-white/[0.075] hover:shadow-[0_0_44px_rgba(34,211,238,0.12)]"
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.56, ease: "easeOut" },
                    },
                  }}
                >
                  <Icon className="text-cyan-200" size={24} aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-semibold text-white">{highlight.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{highlight.body}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
