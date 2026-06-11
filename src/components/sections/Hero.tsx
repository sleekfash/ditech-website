import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onContactClick: () => void;
}

const Hero = ({ onContactClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Animated accent orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      <div className="container relative z-10 px-4 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-border/60 bg-background/60 backdrop-blur-sm text-xs sm:text-sm text-muted-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            AI · Automation · Legal Tech
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-[2.25rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Transform Your Business with{" "}
            <span className="gradient-text">AI-Powered</span>
            {" "}Solutions
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl md:max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            DiTech Solutions & Services empowers law firms, enterprises, and SMEs with
            intelligent automation, workflow orchestration, and bespoke
            full-stack solutions that deliver measurable impact.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="gradient-bg text-primary-foreground text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 glow-sm hover:glow transition-all w-full sm:w-auto"
              onClick={onContactClick}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 bg-background/80 backdrop-blur-sm w-full sm:w-auto"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Services
            </Button>
          </motion.div>

          {/* Client indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 pt-8 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by legal professionals and enterprises
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
              <span className="font-display font-semibold text-lg">Law Firms</span>
              <span className="hidden sm:block">•</span>
              <span className="font-display font-semibold text-lg">Senior Advocates</span>
              <span className="hidden sm:block">•</span>
              <span className="font-display font-semibold text-lg">International Retailers</span>
              <span className="hidden sm:block">•</span>
              <span className="font-display font-semibold text-lg">SMEs</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
