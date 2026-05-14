"use client";

import { useLocale } from "./LocaleProvider";

export default function Footer() {
  const { content } = useLocale();

  return (
    <footer className="relative border-t border-white/[0.06] px-5 py-10 sm:px-8 lg:px-10">
      <div className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#e6c98b]/50 to-transparent" />
      <p className="text-center font-mono text-[0.7rem] uppercase tracking-[0.22em] text-zinc-500">
        © {new Date().getFullYear()} · Amine · {content.footer.builtWith}
      </p>
    </footer>
  );
}
