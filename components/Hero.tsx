"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, Download, Rocket, Send } from "lucide-react";
import amineImage from "@/assets/Amine.png";
import { cvDownload } from "@/lib/content";
import { useLocale } from "./LocaleProvider";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: "easeOut" },
  },
};

function TypewriterRole({
  roles,
  articles,
}: {
  roles: string[];
  articles: string[];
}) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const currentArticle = articles[roleIndex] ?? "";

  const longestRole = useMemo(
    () => roles.reduce((longest, role) => (role.length > longest.length ? role : longest), ""),
    [roles],
  );

  useEffect(() => {
    queueMicrotask(() => {
      setRoleIndex(0);
      setVisibleText("");
      setIsDeleting(false);
    });
  }, [roles]);

  useEffect(() => {
    const currentRole = roles[roleIndex] ?? "";
    const typeDelay = 58;
    const deleteDelay = 34;
    const pauseDelay = 3250;

    const timeout = window.setTimeout(
      () => {
        if (!isDeleting && visibleText.length < currentRole.length) {
          setVisibleText(currentRole.slice(0, visibleText.length + 1));
          return;
        }

        if (!isDeleting && visibleText.length === currentRole.length) {
          setIsDeleting(true);
          return;
        }

        if (isDeleting && visibleText.length > 0) {
          setVisibleText(currentRole.slice(0, visibleText.length - 1));
          return;
        }

        setIsDeleting(false);
        setRoleIndex((index) => (index + 1) % roles.length);
      },
      !isDeleting && visibleText.length === currentRole.length
        ? pauseDelay
        : isDeleting
          ? deleteDelay
          : typeDelay,
    );

    return () => window.clearTimeout(timeout);
  }, [isDeleting, roleIndex, roles, visibleText]);

  return (
    <>
      {currentArticle ? <span> {currentArticle} </span> : " "}
      <span className="inline-grid max-w-full bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-300 bg-clip-text align-baseline text-transparent">
        <span aria-hidden="true" className="invisible col-start-1 row-start-1 break-words">
          {longestRole}
        </span>
        <span className="col-start-1 row-start-1 break-words">
          {visibleText}
          <motion.span
            aria-hidden="true"
            className="ml-1 inline-block h-[0.82em] w-[3px] translate-y-[0.08em] rounded-full bg-cyan-200 align-baseline shadow-[0_0_18px_rgba(34,211,238,0.85)]"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 0.95, repeat: Infinity, ease: "linear" }}
          />
        </span>
      </span>
    </>
  );
}

export default function Hero() {
  const { content } = useLocale();
  const hero = content.hero;

  return (
    <section
      id="home"
      className="relative mx-auto grid min-h-[94svh] max-w-7xl items-center gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10"
    >
      <motion.div variants={container} initial="hidden" animate="visible" className="relative z-10">
        <motion.div
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)]"
        >
          <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.9)]" />
          {hero.eyebrow}
        </motion.div>

        <motion.h1
          variants={item}
          className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl"
        >
          {hero.headingIntro}
          <TypewriterRole roles={hero.headingRoles} articles={hero.headingArticles} />
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          {hero.subtitle}
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-col gap-4 sm:flex-row">
          <motion.a
            href="#projects"
            className="inline-flex items-center justify-center gap-3 rounded-lg bg-cyan-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_36px_rgba(34,211,238,0.32)] transition hover:bg-cyan-200"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            <Rocket size={18} aria-hidden="true" />
            {hero.viewProjects}
          </motion.a>
          <motion.a
            href={cvDownload.href}
            download={cvDownload.filename}
            className="inline-flex items-center justify-center gap-3 rounded-lg border border-cyan-200/35 bg-cyan-200/10 px-6 py-3 font-semibold text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.16)] transition hover:border-cyan-100/60 hover:bg-cyan-200/15"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={18} aria-hidden="true" />
            {hero.downloadCv}
          </motion.a>
          <motion.a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.08] px-6 py-3 font-semibold text-white shadow-[0_0_28px_rgba(139,92,246,0.16)] transition hover:border-violet-200/50 hover:bg-white/[0.12]"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send size={18} aria-hidden="true" />
            {hero.contactMe}
          </motion.a>
        </motion.div>

        <motion.div variants={item} className="mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {hero.stats.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl"
            >
              <p className="text-sm font-semibold text-cyan-100">{label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{value}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="relative mx-auto aspect-square w-full max-w-[520px]"
        initial={{ opacity: 0, x: 48, scale: 0.92, filter: "blur(14px)" }}
        animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.95, ease: "easeOut", delay: 0.25 }}
      >
        <div className="absolute inset-0">
          <div className="absolute -inset-3 rounded-lg border border-cyan-200/20 bg-cyan-200/5 shadow-[0_0_90px_rgba(34,211,238,0.18)]" />
          <div className="absolute inset-6 rounded-lg border border-violet-300/20 shadow-[0_0_80px_rgba(139,92,246,0.16)]" />
          <div className="absolute inset-12 overflow-hidden rounded-lg border border-white/15 bg-white/[0.055] shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl">
            <Image
              src={amineImage}
              alt={hero.portraitAlt}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 440px, 80vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.26)),radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_88%_6%,rgba(167,139,250,0.18),transparent_30%)]" />
          </div>
          <div className="absolute bottom-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
          <div className="absolute left-8 top-8 h-px w-28 bg-gradient-to-r from-cyan-200/70 to-transparent" />
          <div className="absolute right-8 top-8 h-px w-28 bg-gradient-to-l from-violet-200/70 to-transparent" />
        </div>
      </motion.div>

      <a
        href="#about"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-100 lg:inline-flex"
      >
        <ArrowDown size={16} aria-hidden="true" />
        {hero.explore}
      </a>
    </section>
  );
}
