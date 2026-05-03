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
    <section id="skills" className="px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={skills.eyebrow}
          title={skills.title}
          description={skills.description}
        />

        <motion.div
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.045 } },
          }}
        >
          {skills.items.map((skill) => {
            const Icon = iconMap[skill] ?? Code2;

            return (
              <motion.div
                key={skill}
                className="group min-h-32 rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-white/[0.085] hover:shadow-[0_0_38px_rgba(34,211,238,0.16)]"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.48, ease: "easeOut" },
                  },
                }}
              >
                <div className="grid h-11 w-11 place-items-center rounded-lg border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 transition group-hover:border-cyan-100/45 group-hover:text-white">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <p className="mt-5 text-sm font-semibold leading-6 text-white">{skill}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
