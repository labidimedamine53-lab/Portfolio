"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  type LucideIcon,
  Palette,
  Terminal,
} from "lucide-react";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

const iconMap: Record<string, LucideIcon> = {
  HTML: FileCode2,
  CSS: Palette,
  JavaScript: Code2,
  TypeScript: Code2,
  React: Code2,
  "Next.js": Terminal,
  PHP: FileCode2,
  MySQL: Database,
  Python: Terminal,
  AI: BrainCircuit,
  "Machine Learning": BrainCircuit,
  IoT: Cpu,
  Git: GitBranch,
  GitHub: GitBranch,
};

export default function Skills() {
  const { content } = useLocale();
  const skills = content.skills;

  return (
    <section id="skills" className="px-5 py-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={skills.eyebrow}
          title={skills.title}
          description={skills.description}
        />

        <motion.div
          className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {skills.items.map((skill) => {
            const Icon = iconMap[skill] ?? Code2;

            return (
              <motion.div
                key={skill}
                className="group relative min-h-32 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.06]"
                variants={{
                  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.7, ease: EASE },
                  },
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#e6c98b]/[0.08] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors group-hover:border-[#e6c98b]/35 group-hover:bg-white/[0.06] group-hover:text-[#e6c98b]">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <p className="relative mt-5 text-sm font-semibold tracking-tight text-white">
                  {skill}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
