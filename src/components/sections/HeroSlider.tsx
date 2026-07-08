import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides, heroSliderConfig } from "@/config/hero";

const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const go = useCallback((next: number) => {
    setIndex(((next % heroSlides.length) + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      heroSliderConfig.intervalMs
    );
    return () => window.clearInterval(id);
  }, [paused, reduce]);

  const slide = heroSlides[index];

  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured propositions"
    >
      {/* Slide backgrounds with crossfade + slow Ken-Burns */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{
            opacity: { duration: heroSliderConfig.transitionMs / 1000, ease: "easeInOut" },
            scale: { duration: 10, ease: "linear" },
          }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.imageAlt}
            width={1920}
            height={1088}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </motion.div>
      </AnimatePresence>

      {/* Editorial linen overlay */}
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* Content */}
      <div className="container-custom relative z-10 pt-28 pb-28 md:pt-36 md:pb-36">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-copy"}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Anchor className="h-4 w-4 text-[hsl(var(--brass))]" aria-hidden="true" />
                <span className="kicker">{slide.kicker}</span>
              </div>

              <h1 className="serif text-[2.4rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-medium text-foreground leading-[1.02] mb-8">
                {slide.headline}{" "}
                <span className="italic text-[hsl(var(--sea))]">
                  {slide.headlineAccent}
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                {slide.subhead}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(var(--sea))] transition-colors px-8 py-6 text-base ring-1 ring-transparent hover:ring-[hsl(var(--brass))]"
                >
                  <Link to={slide.primaryCta.href}>
                    {slide.primaryCta.label}
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[hsl(var(--ink))]/25 bg-background/70 backdrop-blur-md text-foreground hover:bg-background/90 px-8 py-6 text-base"
                >
                  <Link to={slide.secondaryCta.href}>{slide.secondaryCta.label}</Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators — bottom left, thin brass */}
      <div className="absolute bottom-10 left-5 sm:left-6 lg:left-10 z-20 flex items-center gap-5">
        <div className="flex items-center gap-3" role="tablist" aria-label="Choose slide">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => go(i)}
              className="group relative py-3 focus-visible:outline-none"
            >
              <span
                className={`block h-[1px] transition-all duration-500 ${
                  i === index
                    ? "w-16 bg-[hsl(var(--ink))]"
                    : "w-10 bg-[hsl(var(--ink))]/30 group-hover:bg-[hsl(var(--ink))]/60"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="kicker text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
};

export default HeroSlider;
