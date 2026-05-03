"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Download, GitBranch, Mail, Network, Send } from "lucide-react";
import { cvDownload, socials } from "@/lib/content";
import { useLocale } from "./LocaleProvider";
import SectionHeading from "./SectionHeading";

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
    <section id="contact" className="px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={contact.eyebrow}
          title={contact.title}
          description={contact.description}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            className="rounded-lg border border-white/10 bg-white/[0.055] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.62, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-semibold text-white">{contact.cardTitle}</h3>
            <p className="mt-4 text-base leading-8 text-slate-300">
              {contact.cardBody}
            </p>
            <div className="mt-8 grid gap-3">
              {socials.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons];

                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-slate-200 transition hover:border-cyan-200/40 hover:bg-white/10 hover:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="flex items-center gap-3">
                      {Icon ? <Icon size={18} aria-hidden="true" className="text-cyan-200" /> : null}
                      {social.label}
                    </span>
                    <span aria-hidden="true">/</span>
                  </motion.a>
                );
              })}
              <motion.a
                href={cvDownload.href}
                download={cvDownload.filename}
                className="flex items-center justify-between rounded-lg border border-cyan-200/25 bg-cyan-200/10 px-4 py-3 font-semibold text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.12)] transition hover:border-cyan-100/50 hover:bg-cyan-200/15"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="flex items-center gap-3">
                  <Download size={18} aria-hidden="true" className="text-cyan-200" />
                  {contact.downloadCv}
                </span>
                <span className="text-xs font-medium text-cyan-100/80">{contact.pdf}</span>
              </motion.a>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="rounded-lg border border-white/10 bg-white/[0.055] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.62, ease: "easeOut" }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-200">
                {contact.nameLabel}
                <input
                  required
                  name="name"
                  type="text"
                  placeholder={contact.namePlaceholder}
                  className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60 focus:shadow-[0_0_28px_rgba(34,211,238,0.16)]"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-200">
                {contact.emailLabel}
                <input
                  required
                  name="email"
                  type="email"
                  placeholder={contact.emailPlaceholder}
                  className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60 focus:shadow-[0_0_28px_rgba(34,211,238,0.16)]"
                />
              </label>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-medium text-slate-200">
              {contact.messageLabel}
              <textarea
                required
                name="message"
                rows={6}
                placeholder={contact.messagePlaceholder}
                className="resize-none rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60 focus:shadow-[0_0_28px_rgba(34,211,238,0.16)]"
              />
            </label>
            <motion.button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-lg bg-cyan-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_36px_rgba(34,211,238,0.26)] transition hover:bg-cyan-200 sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send size={18} aria-hidden="true" />
              {contact.send}
            </motion.button>
            {status ? <p className="mt-4 text-sm text-cyan-100">{status}</p> : null}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
