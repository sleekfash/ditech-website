import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";

export type HeroSlide = {
  id: string;
  kicker: string;
  headline: string;
  headlineAccent: string;
  subhead: string;
  image: string;
  imageAlt: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export const heroSlides: HeroSlide[] = [
  {
    id: "engineered-intelligence",
    kicker: "AI · Automation · Legal Tech",
    headline: "Engineered intelligence for firms that",
    headlineAccent: "don't do generic.",
    subhead:
      "A boutique studio for senior counsel, executives and founders — bespoke AI systems, workflow orchestration and legal-tech infrastructure, delivered with the poise of a private atelier.",
    image: heroSlide1,
    imageAlt: "Coastal executive study at dawn overlooking the Atlantic",
    primaryCta: { label: "Start a project", href: "/contact" },
    secondaryCta: { label: "Explore services", href: "/services" },
  },
  {
    id: "boardroom-to-backend",
    kicker: "Full-stack · Integrations · Hardware",
    headline: "From the boardroom to the backend —",
    headlineAccent: "one atelier.",
    subhead:
      "Full-stack builds, kiosk hardware, retail integrations and mission-critical automations. One senior team accountable end-to-end, from strategy to the last commit.",
    image: heroSlide2,
    imageAlt: "Modern coastal executive study with linen curtains and brass fittings",
    primaryCta: { label: "See our work", href: "/solutions" },
    secondaryCta: { label: "Book a consult", href: "/contact" },
  },
];

export const heroSliderConfig = {
  intervalMs: 7000,
  transitionMs: 1200,
} as const;
