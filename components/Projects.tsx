"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

export default function Projects() {
  const { content } = useLocale();
  const projects = content.projects;

  return (
    <section id="projects" className="px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={projects.eyebrow}
          title={projects.title}
          description={projects.description}
        />

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {projects.items.map((project, index) => (
            <motion.article
              key={project.title}
              className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-white/[0.075] hover:shadow-[0_0_54px_rgba(34,211,238,0.13)]"
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.58, ease: "easeOut" },
                },
              }}
            >
              <div className="relative h-52 overflow-hidden border-b border-white/10 bg-slate-950">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-25 mix-blend-screen`} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.06),rgba(2,6,23,0.72)),radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.26),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(167,139,250,0.24),transparent_32%)]" />
                <div className="absolute inset-x-6 bottom-6 top-6 rounded-lg border border-white/15 ring-1 ring-cyan-200/10" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-sm text-white/75">
                    {projects.projectLabel} 0{index + 1}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{project.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm leading-7 text-slate-300">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-medium text-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <motion.a
                    href={project.liveUrl ?? "#contact"}
                    target={project.liveUrl ? "_blank" : undefined}
                    rel={project.liveUrl ? "noreferrer" : undefined}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-100 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.18)] transition hover:bg-white"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink size={16} aria-hidden="true" />
                    {projects.preview}
                  </motion.a>
                  <motion.a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.08] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-200/45 hover:bg-white/[0.12]"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowUpRight size={16} aria-hidden="true" />
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
