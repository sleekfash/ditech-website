import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import LegalSolutions from "@/components/sections/LegalSolutions";
import Stats from "@/components/sections/Stats";
import Projects from "@/components/sections/Projects";
import TechStack from "@/components/sections/TechStack";
import InteractiveDemo from "@/components/sections/InteractiveDemo";
import Shop from "@/components/sections/Shop";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";


const Index = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onContactClick={scrollToContact} />
      <Hero onContactClick={scrollToContact} />
      <Services />
      <LegalSolutions />
      <Stats />
      <InteractiveDemo />
      <Projects />
      <TechStack />
      <Shop />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
      
    </div>
  );
};

export default Index;
