import About from "@/components/About";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import JourneySection from "@/components/JourneySection";
import { LocaleProvider } from "@/components/LocaleProvider";
import Navbar from "@/components/Navbar";
import PageViewTracker from "@/components/PageViewTracker";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import SpaceBackground from "@/components/SpaceBackground";

export const runtime = "nodejs";

export default function Home() {
  return (
    <>
      <SpaceBackground />
      <div className="grain-overlay" aria-hidden="true" />
      <PageViewTracker />
      <LocaleProvider>
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <About />
          <JourneySection />
          <Skills />
          <Projects />
          <Certifications />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </LocaleProvider>
    </>
  );
}
