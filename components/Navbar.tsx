"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Download, Menu, X } from "lucide-react";
import { useState } from "react";
import siteIcon from "@/assets/icon.png";
import { cvDownload } from "@/lib/content";
import { useLocale } from "./LocaleProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { content, locale, toggleLocale } = useLocale();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#030712]/55 backdrop-blur-2xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#home" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,0.22)]">
            <Image
              src={siteIcon}
              alt="Amine icon"
              fill
              sizes="40px"
              className="object-cover"
              placeholder="blur"
            />
          </span>
          <span className="text-base font-semibold text-white">Amine.dev</span>
        </a>

        <div className="hidden items-center gap-2 md:flex">
          {content.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            aria-label={content.language.ariaLabel}
            onClick={toggleLocale}
            className="inline-flex h-10 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.06] p-1 text-xs font-semibold text-slate-300 transition hover:border-cyan-200/45 hover:bg-white/10"
          >
            <span
              className={`rounded-md px-2.5 py-1.5 transition ${
                locale === "en" ? "bg-cyan-200 text-slate-950" : "hover:text-white"
              }`}
            >
              EN
            </span>
            <span
              className={`rounded-md px-2.5 py-1.5 transition ${
                locale === "it" ? "bg-cyan-200 text-slate-950" : "hover:text-white"
              }`}
            >
              IT
            </span>
          </button>
          <a
            href={cvDownload.href}
            download={cvDownload.filename}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-200/45 hover:bg-white/10"
          >
            <Download size={16} aria-hidden="true" />
            {content.navbar.cv}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.16)] transition hover:border-cyan-200/60 hover:bg-cyan-300/15"
          >
            {content.navbar.contact}
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="border-t border-white/10 bg-[#030712]/95 px-5 py-5 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {content.navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-base font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                aria-label={content.language.ariaLabel}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                onClick={toggleLocale}
              >
                <span>{content.language.ariaLabel}</span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.06] p-1 text-xs font-semibold">
                  <span
                    className={`rounded-md px-2.5 py-1.5 transition ${
                      locale === "en" ? "bg-cyan-200 text-slate-950" : "text-slate-300"
                    }`}
                  >
                    EN
                  </span>
                  <span
                    className={`rounded-md px-2.5 py-1.5 transition ${
                      locale === "it" ? "bg-cyan-200 text-slate-950" : "text-slate-300"
                    }`}
                  >
                    IT
                  </span>
                </span>
              </button>
              <a
                href={cvDownload.href}
                download={cvDownload.filename}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-cyan-100 transition hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <Download size={18} aria-hidden="true" />
                {content.navbar.downloadCv}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
