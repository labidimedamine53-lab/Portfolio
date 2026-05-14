"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import siteIcon from "@/assets/gold.png";
import { cvDownload } from "@/lib/content";
import { useLocale } from "./LocaleProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { content, locale, toggleLocale } = useLocale();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#home" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] transition-colors group-hover:border-[#e6c98b]/40">
            <Image
              src={siteIcon}
              alt="Amine icon"
              fill
              sizes="36px"
              className="object-cover"
              placeholder="blur"
            />
          </span>
          <span className="text-sm font-semibold tracking-wide text-white">Amine.dev</span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {content.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              <span className="relative z-10">{link.label}</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#e6c98b]/70 to-transparent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            aria-label={content.language.ariaLabel}
            onClick={toggleLocale}
            className="inline-flex h-9 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-[0.7rem] font-semibold tracking-wider text-zinc-400 transition-colors hover:border-white/20"
          >
            <span
              className={`rounded-full px-3 py-1.5 transition-colors ${
                locale === "en" ? "bg-white text-black" : "hover:text-white"
              }`}
            >
              EN
            </span>
            <span
              className={`rounded-full px-3 py-1.5 transition-colors ${
                locale === "it" ? "bg-white text-black" : "hover:text-white"
              }`}
            >
              IT
            </span>
          </button>
          <a
            href={cvDownload.href}
            download={cvDownload.filename}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-[#e6c98b]/40 hover:text-white"
          >
            <Download size={14} aria-hidden="true" />
            {content.navbar.cv}
          </a>
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-zinc-50 px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white"
          >
            <span className="relative z-10">{content.navbar.contact}</span>
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#e6c98b]/70 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
            />
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white transition-colors hover:bg-white/[0.08] lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="border-t border-white/[0.06] bg-[#050505]/95 px-5 py-5 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {content.navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                aria-label={content.language.ariaLabel}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
                onClick={toggleLocale}
              >
                <span>{content.language.ariaLabel}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-[0.7rem] font-semibold tracking-wider">
                  <span
                    className={`rounded-full px-3 py-1.5 transition-colors ${
                      locale === "en" ? "bg-white text-black" : "text-zinc-400"
                    }`}
                  >
                    EN
                  </span>
                  <span
                    className={`rounded-full px-3 py-1.5 transition-colors ${
                      locale === "it" ? "bg-white text-black" : "text-zinc-400"
                    }`}
                  >
                    IT
                  </span>
                </span>
              </button>
              <a
                href={cvDownload.href}
                download={cvDownload.filename}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-zinc-200 transition-colors hover:bg-white/[0.04] hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <Download size={16} aria-hidden="true" />
                {content.navbar.downloadCv}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
