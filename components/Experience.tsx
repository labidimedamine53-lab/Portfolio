"use client";

import { motion } from "framer-motion";
import { GraduationCap, Orbit, Sparkles } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

const icons = [GraduationCap, Orbit, Sparkles];

export default function Experience() {
  const { content } = useLocale();
  const experience = content.experience;

  return (
    <section id="experience" className="px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={experience.eyebrow}
          title={experience.title}
          description={experience.description}
        />

        <div className="relative mt-16">
          <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-cyan-300/0 via-cyan-300/45 to-violet-400/0 sm:left-1/2" />
          <div className="space-y-8">
            {experience.timeline.map((item, index) => {
              const Icon = icons[index];
              const isRight = index % 2 === 1;

              return (
                <motion.article
                  key={item.title}
                  className={`relative grid gap-6 sm:grid-cols-2 ${isRight ? "" : "sm:text-right"}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{ duration: 0.58, ease: "easeOut" }}
                >
                  <div className={`${isRight ? "sm:col-start-2" : ""} pl-16 sm:pl-0`}>
                    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl transition hover:border-cyan-200/35 hover:bg-white/[0.075]">
                      <p className="text-sm font-semibold text-cyan-100">{item.period}</p>
                      <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-slate-300">{item.body}</p>
                    </div>
                  </div>
                  <div className="absolute left-0 top-6 grid h-10 w-10 place-items-center rounded-lg border border-cyan-200/35 bg-cyan-200/[0.12] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.24)] sm:left-1/2 sm:-translate-x-1/2">
                    <Icon size={18} aria-hidden="true" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
