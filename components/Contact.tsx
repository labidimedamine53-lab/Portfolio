"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Download, GitBranch, Mail, Network, Send } from "lucide-react";
import { cvDownload, socials } from "@/lib/content";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

const socialIcons = {
  GitHub: GitBranch,
  LinkedIn: Network,
  Email: Mail,
};

export default function Contact() {
  const [status, setStatus] = useState("");
  const { content } = useLocale();
  const contact = content.contact;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(contact.status);
    event.currentTarget.reset();
  }

  return (
    <section id="contact" className="px-5 py-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={contact.eyebrow}
          title={contact.title}
          description={contact.description}
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-2xl"
            initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.95, ease: EASE }}
          >
            <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#e6c98b]/[0.06] blur-3xl" />
            <div className="absolute left-0 top-0 h-px w-28 bg-gradient-to-r from-[#e6c98b]/60 to-transparent" />
            <h3 className="relative text-2xl font-semibold tracking-tight text-white">
              {contact.cardTitle}
            </h3>
            <p className="relative mt-4 text-base leading-8 text-zinc-400">{contact.cardBody}</p>
            <div className="relative mt-8 grid gap-2.5">
              {socials.map((social, idx) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons];

                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-3.5 text-zinc-300 transition-colors hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 380, damping: 24 }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ transitionDelay: `${idx * 60}ms` }}
                  >
                    <span className="flex items-center gap-3">
                      {Icon ? (
                        <Icon
                          size={16}
                          aria-hidden="true"
                          className="text-zinc-400 transition-colors group-hover:text-[#e6c98b]"
                        />
                      ) : null}
                      {social.label}
                    </span>
                    <span aria-hidden="true" className="font-mono text-xs text-zinc-600 transition-colors group-hover:text-[#e6c98b]">
                      →
                    </span>
                  </motion.a>
                );
              })}
              <motion.a
                href={cvDownload.href}
                download={cvDownload.filename}
                className="flex items-center justify-between rounded-2xl border border-[#e6c98b]/25 bg-[#e6c98b]/[0.06] px-5 py-3.5 font-semibold text-zinc-100 transition-colors hover:border-[#e6c98b]/45 hover:bg-[#e6c98b]/[0.10]"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
              >
                <span className="flex items-center gap-3">
                  <Download size={16} aria-hidden="true" className="text-[#e6c98b]" />
                  {contact.downloadCv}
                </span>
                <span className="font-mono text-[0.65rem] font-semibold tracking-[0.18em] text-zinc-500">
                  {contact.pdf}
                </span>
              </motion.a>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-2xl"
            initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.95, ease: EASE }}
          >
            <div className="absolute right-0 top-0 h-px w-28 bg-gradient-to-l from-[#e6c98b]/60 to-transparent" />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                {contact.nameLabel}
                <input
                  required
                  name="name"
                  type="text"
                  placeholder={contact.namePlaceholder}
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#e6c98b]/45 focus:bg-black/50"
                />
              </label>
              <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                {contact.emailLabel}
                <input
                  required
                  name="email"
                  type="email"
                  placeholder={contact.emailPlaceholder}
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#e6c98b]/45 focus:bg-black/50"
                />
              </label>
            </div>
            <label className="mt-5 grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              {contact.messageLabel}
              <textarea
                required
                name="message"
                rows={6}
                placeholder={contact.messagePlaceholder}
                className="resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#e6c98b]/45 focus:bg-black/50"
              />
            </label>
            <motion.button
              type="submit"
              className="group relative mt-7 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-zinc-50 px-7 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-white sm:w-auto"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Send size={16} aria-hidden="true" />
                {contact.send}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#e6c98b]/70 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
              />
            </motion.button>
            {status ? (
              <motion.p
                className="mt-4 text-sm text-[#e6c98b]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {status}
              </motion.p>
            ) : null}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
