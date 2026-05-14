"use client";

import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, Download, Send, Sparkles } from "lucide-react";
import amineImage from "@/assets/Amine.png";
import { cvDownload } from "@/lib/content";
import { useLocale } from "./LocaleProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.18,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: EASE },
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
    const typeDelay = 62;
    const deleteDelay = 32;
    const pauseDelay = 3400;

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
      <span className="inline-grid max-w-full align-baseline">
        <span aria-hidden="true" className="invisible col-start-1 row-start-1 break-words">
          {longestRole}
        </span>
        <span className="sheen-text col-start-1 row-start-1 break-words font-semibold">
          {visibleText}
          <span
            aria-hidden="true"
            className="caret-pulse ml-1 inline-block h-[0.78em] w-[2px] translate-y-[0.06em] rounded-[1px] bg-[#e6c98b] align-baseline"
            style={{ boxShadow: "0 0 14px rgba(230, 201, 139, 0.65)" }}
          />
        </span>
      </span>
    </>
  );
}

export default function Hero() {
  const { content } = useLocale();
  const hero = content.hero;
  const portraitRef = useRef<HTMLDivElement>(null);

  // Magnetic 3D tilt on portrait — premium micro-interaction
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 120, damping: 18 });
  const springRotY = useSpring(rotY, { stiffness: 120, damping: 18 });
  const transform = useTransform(
    [springRotX, springRotY],
    ([x, y]) => `perspective(1200px) rotateX(${x}deg) rotateY(${y}deg)`,
  );

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = portraitRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * 8);
    rotX.set(-py * 8);
  }

  function handlePointerLeave() {
    rotX.set(0);
    rotY.set(0);
  }

  return (
    <section
      id="home"
      className="relative mx-auto grid min-h-[94svh] max-w-7xl items-center gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10"
    >
      <motion.div variants={container} initial="hidden" animate="visible" className="relative z-10">
        <motion.div
          variants={item}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-xl"
        >
          <Sparkles size={12} aria-hidden="true" className="text-[#e6c98b]" />
          {hero.eyebrow}
        </motion.div>

        <motion.h1
          variants={item}
          className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[5.25rem]"
        >
          <span className="text-zinc-50">{hero.headingIntro}</span>
          <TypewriterRole roles={hero.headingRoles} articles={hero.headingArticles} />
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-col gap-3.5 sm:flex-row">
          <motion.a
            href="#projects"
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-zinc-50 px-7 py-3.5 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
          >
            <span className="relative z-10">{hero.viewProjects}</span>
            <span
              aria-hidden="true"
              className="relative z-10 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            >
              →
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
            />
          </motion.a>
          <motion.a
            href={cvDownload.href}
            download={cvDownload.filename}
            className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold tracking-wide text-zinc-100 backdrop-blur-xl transition-colors hover:border-[#e6c98b]/40 hover:bg-white/[0.06]"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
          >
            <Download size={16} aria-hidden="true" className="transition-colors group-hover:text-[#e6c98b]" />
            {hero.downloadCv}
          </motion.a>
          <motion.a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-transparent px-7 py-3.5 text-sm font-semibold tracking-wide text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
          >
            <Send size={16} aria-hidden="true" />
            {hero.contactMe}
          </motion.a>
        </motion.div>

        <motion.div variants={item} className="mt-14 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-3">
          {hero.stats.map(([label, value], idx) => (
            <div
              key={label}
              className="relative bg-[#070708]/80 p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.03]"
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#e6c98b]">
                {label}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
              {idx === 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-0 h-px w-12 bg-gradient-to-r from-[#e6c98b]/60 to-transparent"
                />
              ) : null}
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        ref={portraitRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative mx-auto aspect-square w-full max-w-[520px] [transform-style:preserve-3d]"
        style={{ transform }}
        initial={{ opacity: 0, scale: 0.94, filter: "blur(18px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {/* Outer ambient frame */}
          <motion.div
            className="absolute -inset-4 rounded-3xl border border-white/[0.06] bg-white/[0.015]"
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: "translateZ(-40px)" }}
          />
          {/* Mid amber accent frame */}
          <div
            className="absolute inset-4 rounded-2xl border border-[#e6c98b]/15"
            style={{ transform: "translateZ(-20px)" }}
          />
          {/* Inner portrait card */}
          <div
            className="absolute inset-10 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
            style={{ transform: "translateZ(20px)" }}
          >
            <Image
              src={amineImage}
              alt={hero.portraitAlt}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 440px, 80vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(5,5,5,0.55)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_8%,rgba(230,201,139,0.18),transparent_40%)]" />
          </div>
          {/* Corner hairlines */}
          <div className="absolute left-10 top-10 h-px w-20 bg-gradient-to-r from-[#e6c98b]/80 to-transparent" style={{ transform: "translateZ(30px)" }} />
          <div className="absolute right-10 bottom-10 h-px w-20 bg-gradient-to-l from-zinc-100/80 to-transparent" style={{ transform: "translateZ(30px)" }} />
          <div className="absolute left-10 top-10 h-20 w-px bg-gradient-to-b from-[#e6c98b]/80 to-transparent" style={{ transform: "translateZ(30px)" }} />
          <div className="absolute right-10 bottom-10 h-20 w-px bg-gradient-to-t from-zinc-100/80 to-transparent" style={{ transform: "translateZ(30px)" }} />
        </div>
      </motion.div>

      <motion.a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-[#e6c98b] lg:inline-flex"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={14} aria-hidden="true" />
        {hero.explore}
      </motion.a>
    </section>
  );
}
