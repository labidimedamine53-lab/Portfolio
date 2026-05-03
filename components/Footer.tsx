"use client";

import { useLocale } from "./LocaleProvider";

export default function Footer() {
  const { content } = useLocale();

  return (
    <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-slate-400 sm:px-8 lg:px-10">
      <p>
        &copy; {new Date().getFullYear()} Amine. {content.footer.builtWith}
      </p>
    </footer>
  );
}
