"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Award, Download, FileCheck2 } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Certifications() {
  const { content } = useLocale();
  const certifications = content.certifications;

  return (
    <section id="certifications" className="px-5 py-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={certifications.eyebrow}
          title={certifications.title}
          description={certifications.description}
        />

        <motion.div
          className="mt-16 grid items-stretch gap-5 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14 } },
          }}
        >
          {certifications.items.map((certificate, index) => (
            <motion.article
              key={certificate.title}
              className="group relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.045]"
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
              <div className="relative h-48 overflow-hidden border-b border-white/[0.06] bg-[#070708]">
                {certificate.preview ? (
                  <Image
                    src={certificate.preview}
                    alt={certificate.imageAlt ?? certificate.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover saturate-[0.85] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-hover:saturate-100"
                    unoptimized
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_50%,rgba(230,201,139,0.10),transparent_60%),linear-gradient(135deg,#0a0a0c,#050505)]">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-white/[0.04] text-[#e6c98b]">
                      <FileCheck2 size={26} aria-hidden="true" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(5,5,5,0.78)_100%)]" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#e6c98b] backdrop-blur-md">
                  <Award size={12} aria-hidden="true" />
                  0{index + 1}
                </div>
              </div>

              <div className="relative flex flex-1 flex-col p-7">
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#e6c98b]">
                  {certificate.issuer}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                  {certificate.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-zinc-400">
                  {certificate.description}
                </p>

                {certificate.href ? (
                  <motion.a
                    href={certificate.href}
                    download={certificate.filename}
                    className="group/btn mt-7 inline-flex items-center justify-between rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-[#e6c98b]/40 hover:bg-white/[0.07]"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  >
                    <span className="flex items-center gap-3">
                      <Download size={16} aria-hidden="true" className="text-[#e6c98b]" />
                      {certifications.download}
                    </span>
                    <span className="font-mono text-[0.65rem] font-semibold tracking-[0.18em] text-zinc-500">
                      {certifications.pdf}
                    </span>
                  </motion.a>
                ) : (
                  <span
                    className="mt-7 inline-flex items-center justify-between rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-3 text-sm font-semibold text-zinc-500"
                    aria-disabled="true"
                  >
                    <span className="flex items-center gap-3">
                      <FileCheck2 size={16} aria-hidden="true" />
                      {certifications.pending}
                    </span>
                    <span className="font-mono text-[0.65rem] font-semibold tracking-[0.18em] text-zinc-600">
                      {certifications.pdf}
                    </span>
                  </span>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
