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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ExpertiseJourney />
        <Projects />
        <Craft />
        <Experience />
        <Skills />
        <ApiDemo />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
