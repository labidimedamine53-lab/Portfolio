"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <motion.div
      className={isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-90px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
        }}
        className={`inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-xl ${isCentered ? "" : ""}`}
      >
        <span className="h-1 w-1 rounded-full bg-[#e6c98b] shadow-[0_0_10px_rgba(230,201,139,0.8)]" />
        {eyebrow}
      </motion.div>
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.95, ease: EASE },
          },
        }}
        className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
          }}
          className="mt-5 text-base leading-8 text-zinc-400 sm:text-[1.05rem]"
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
