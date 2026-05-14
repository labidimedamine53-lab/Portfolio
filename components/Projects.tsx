"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Projects() {
  const { content } = useLocale();
  const projects = content.projects;

  return (
    <section id="projects" className="px-5 py-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={projects.eyebrow}
          title={projects.title}
          description={projects.description}
        />

        <motion.div
          className="mt-16 grid gap-5 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14 } },
          }}
        >
          {projects.items.map((project, index) => (
            <motion.article
              key={project.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.045]"
              variants={{
                hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.85, ease: EASE },
                },
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-2xl bg-[linear-gradient(135deg,transparent_30%,rgba(230,201,139,0.18)_50%,transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
              <div className="relative h-56 overflow-hidden border-b border-white/[0.06] bg-[#070708]">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover saturate-[0.85] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:saturate-100"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(5,5,5,0.85)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(230,201,139,0.14),transparent_45%)]" />
                <div className="absolute bottom-7 left-7 right-7">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[#e6c98b]">
                    {projects.projectLabel} · 0{index + 1}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    {project.title}
                  </h3>
                </div>
                <div className="absolute right-7 top-7 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition-all duration-500 group-hover:border-[#e6c98b]/50 group-hover:text-[#e6c98b]">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </div>
              </div>

              <div className="relative p-7">
                <p className="text-sm leading-7 text-zinc-400">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                  <motion.a
                    href={project.liveUrl ?? "#contact"}
                    target={project.liveUrl ? "_blank" : undefined}
                    rel={project.liveUrl ? "noreferrer" : undefined}
                    className="group/btn inline-flex items-center justify-center gap-2 rounded-full bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                    {projects.preview}
                  </motion.a>
                  <motion.a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-[#e6c98b]/40 hover:text-white"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  >
                    {projects.details}
                  </motion.a>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
