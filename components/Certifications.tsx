"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Award, Download, FileCheck2 } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

export default function Certifications() {
  const { content } = useLocale();
  const certifications = content.certifications;

  return (
    <section id="certifications" className="px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={certifications.eyebrow}
          title={certifications.title}
          description={certifications.description}
        />

        <motion.div
          className="mt-14 grid items-stretch gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {certifications.items.map((certificate, index) => (
            <motion.article
              key={certificate.title}
              className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-white/[0.075]"
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.58, ease: "easeOut" },
                },
              }}
            >
              <div className="relative h-44 overflow-hidden border-b border-white/10 bg-slate-950">
                {certificate.preview ? (
                  <Image
                    src={certificate.preview}
                    alt={certificate.imageAlt ?? certificate.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_28%_18%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(167,139,250,0.22),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.94))]">
                    <div className="grid h-16 w-16 place-items-center rounded-lg border border-cyan-200/25 bg-cyan-200/10 text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.2)]">
                      <FileCheck2 size={28} aria-hidden="true" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.68))]" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs font-semibold text-cyan-50 backdrop-blur-xl">
                  <Award size={15} aria-hidden="true" />
                  0{index + 1}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm font-semibold text-cyan-100">{certificate.issuer}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{certificate.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">
                  {certificate.description}
                </p>

                {certificate.href ? (
                  <motion.a
                    href={certificate.href}
                    download={certificate.filename}
                    className="mt-7 inline-flex items-center justify-between rounded-lg border border-cyan-200/25 bg-cyan-200/10 px-4 py-3 font-semibold text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.12)] transition hover:border-cyan-100/50 hover:bg-cyan-200/15"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="flex items-center gap-3">
                      <Download size={18} aria-hidden="true" className="text-cyan-200" />
                      {certifications.download}
                    </span>
                    <span className="text-xs font-medium text-cyan-100/80">
                      {certifications.pdf}
                    </span>
                  </motion.a>
                ) : (
                  <span
                    className="mt-7 inline-flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 font-semibold text-slate-300"
                    aria-disabled="true"
                  >
                    <span className="flex items-center gap-3">
                      <FileCheck2 size={18} aria-hidden="true" className="text-slate-400" />
                      {certifications.pending}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
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
