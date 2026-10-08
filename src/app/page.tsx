import ApiDemo from "@/components/ApiDemo";
import Contact from "@/components/Contact";
import Craft from "@/components/Craft";
import Experience from "@/components/Experience";
import ExpertiseJourney from "@/components/ExpertiseJourney";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import { projectTour, skillTour } from "@/data/content";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ExpertiseJourney id="skills" index="02" title="Skills in 3D" entries={skillTour} />
        <Skills />
        <ExpertiseJourney id="projects" index="04" title="Projects in 3D" entries={projectTour} />
        <Projects />
        <Craft />
        <Experience />
        <ApiDemo />
        <Faq />
        <Contact />
        {/* Signature sign-off hidden for now — re-enable by restoring <Signature /> here. */}
      </main>
      <Footer />
    </>
  );
}
