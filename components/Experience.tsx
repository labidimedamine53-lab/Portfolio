"use client";

import { motion } from "framer-motion";
import { GraduationCap, Orbit, Sparkles } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;
const icons = [GraduationCap, Orbit, Sparkles];

export default function Experience() {
  const { content } = useLocale();
  const experience = content.experience;

  return (
    <section id="experience" className="px-5 py-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={experience.eyebrow}
          title={experience.title}
          description={experience.description}
        />

        <div className="relative mt-20">
          <motion.div
            className="absolute left-5 top-0 w-px origin-top bg-gradient-to-b from-transparent via-white/15 to-transparent sm:left-1/2"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 1.6, ease: EASE }}
            style={{ height: "100%" }}
          />
          <div className="space-y-10">
            {experience.timeline.map((item, index) => {
              const Icon = icons[index];
              const isRight = index % 2 === 1;

              return (
                <motion.article
                  key={item.title}
                  className={`relative grid gap-6 sm:grid-cols-2 ${isRight ? "" : "sm:text-right"}`}
                  initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{ duration: 0.85, ease: EASE, delay: index * 0.1 }}
                >
                  <div className={`${isRight ? "sm:col-start-2" : ""} pl-16 sm:pl-0`}>
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-7 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/20 hover:bg-white/[0.045]">
                      <div
                        aria-hidden="true"
                        className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#e6c98b]/[0.06] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <p className="relative font-mono text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#e6c98b]">
                        {item.period}
                      </p>
                      <h3 className="relative mt-3 text-xl font-semibold tracking-tight text-white">
                        {item.title}
                      </h3>
                      <p className="relative mt-4 text-sm leading-7 text-zinc-400">{item.body}</p>
                    </div>
                  </div>
                  <motion.div
                    className="absolute left-0 top-6 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[#050505] text-zinc-200 sm:left-1/2 sm:-translate-x-1/2"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-90px" }}
                    transition={{ duration: 0.7, ease: EASE, delay: index * 0.1 + 0.2 }}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[#e6c98b]/[0.15] blur-md"
                    />
                    <Icon size={16} aria-hidden="true" className="relative" />
                  </motion.div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
