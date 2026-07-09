import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Workflow, Scale, ShoppingCart, Code, Cpu, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import HeroSlider from "@/components/sections/HeroSlider";
import ShopTeaser from "@/components/sections/ShopTeaser";
import homeCollaboration from "@/assets/home-collaboration.jpg";
import homeAiTech from "@/assets/home-ai-tech.jpg";
import { site } from "@/config/site";
import { shopHref } from "@/config/nav";

const services = [
  { icon: Bot, title: "AI Automation", description: "Intelligent systems that quietly do the tedious work.", href: "/services#ai-automation" },
  { icon: Workflow, title: "Workflow Orchestration", description: "Compose 500+ services into one calm operation.", href: "/services#workflow" },
  { icon: Scale, title: "Legal Tech", description: "Case management, transcription, research — engineered for counsel.", href: "/solutions" },
  { icon: ShoppingCart, title: "E-commerce", description: "Storefronts, integrations, retail ops — from Shopify to POS.", href: "/services#ecommerce" },
  { icon: Code, title: "Custom Development", description: "Full-stack builds shaped around your operating model.", href: "/services#development" },
  { icon: Cpu, title: "Hardware & Shop", description: "Curated devices and kiosks — now folded into Services.", href: shopHref },
];

const stats = [
  { value: "150+", label: "Projects delivered" },
  { value: "50+", label: "Clients worldwide" },
  { value: "99%", label: "Client satisfaction" },
  { value: "24/7", label: "White-glove support" },
];

const testimonials = [
  { name: "Sarah Johnson", role: "CEO, LegalFirst", content: "DiTech's case management system quietly saved us 40% of the week. It feels like a private chief of staff." },
  { name: "Michael Chen", role: "CTO, TechStart", content: "Their orchestration work replaced a small ops team. It is the most reliable system we run." },
  { name: "Emily Davis", role: "Director, RetailPro", content: "The storefront they built lifted us 60% on launch. It looks and moves like nothing our competitors ship." },
];

const Home = () => {
  return (
    <Layout>
      {/* Coastal hero slider (2 slides, crossfade + Ken-Burns) */}
      <HeroSlider />

      {/* Services overview */}
      <section className="section-padding gradient-bg-subtle relative overflow-hidden">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="container-custom relative">
          <div className="max-w-2xl mb-16">
            <span className="kicker">What we build</span>
            <h2 className="serif text-4xl md:text-5xl lg:text-6xl mt-4 brass-rule">
              A quiet studio. <span className="italic text-[hsl(var(--sea))]">Ambitious systems.</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-8 max-w-xl">
              Six practices, one senior team. We take on a small number of engagements per year so every build receives the attention of an atelier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-3xl overflow-hidden border border-border/60">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="bg-card p-8 md:p-10 group hover:bg-[hsl(var(--surface))] transition-colors"
              >
                <service.icon className="h-6 w-6 text-[hsl(var(--sea))] mb-8" aria-hidden="true" />
                <h3 className="serif text-2xl mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                <Link
                  to={service.href}
                  aria-label={`Learn more about ${service.title}`}
                  className="inline-flex items-center gap-2 text-sm text-[hsl(var(--sea))] hover:text-[hsl(var(--ink))] transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop teaser (marquee) — briefly exposes the shop */}
      <ShopTeaser />

      {/* Stats — editorial band */}
      <section className="section-padding bg-[hsl(var(--ink))] text-[hsl(var(--background))] relative overflow-hidden">
        <div className="grain absolute inset-0 pointer-events-none opacity-30" />
        <div className="container-custom relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="border-t border-[hsl(var(--brass))]/40 pt-6"
              >
                <div className="serif text-5xl md:text-6xl text-[hsl(var(--background))] mb-3">
                  {stat.value}
                </div>
                <div className="kicker text-[hsl(var(--brass))]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="kicker">Why {site.brand.name}</span>
              <h2 className="serif text-4xl md:text-5xl mt-4 mb-8 brass-rule">
                Senior hands on every deliverable.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We combine deep technical practice with a genuine understanding of how your business actually operates — and we don't hand you off to juniors.
              </p>
              <ul className="space-y-4">
                {[
                  "Principal-led engagements, end to end",
                  "AI, automation and legal tech under one roof",
                  "Bespoke systems shaped to your workflow",
                  "Ongoing stewardship, not just delivery",
                  "Transparent scope, transparent price",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--sea))] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
              <img
                src={homeCollaboration}
                alt="Team collaborating on AI-powered business solutions"
                loading="lazy"
                decoding="async"
                className="rounded-3xl w-full object-cover aspect-[4/5] shadow-[0_40px_100px_-40px_hsl(var(--ink)/0.4)]"
              />
              <div className="absolute -bottom-6 -left-6 hidden md:block glass rounded-2xl p-5 max-w-[220px]">
                <div className="kicker mb-2">Selected clients</div>
                <div className="serif text-base leading-snug">Senior counsel, retailers, SMEs & founders.</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI showcase */}
      <section className="section-padding gradient-bg-subtle relative overflow-hidden">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
              <img
                src={homeAiTech}
                alt="AI technology and intelligent automation interfaces"
                loading="lazy"
                decoding="async"
                className="rounded-3xl w-full object-cover aspect-[4/5]"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <span className="kicker">The stack</span>
              <h2 className="serif text-4xl md:text-5xl mt-4 mb-8 brass-rule">
                Powered by <span className="italic text-[hsl(var(--sea))]">discerning AI</span>.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We ship on the technology that has earned its keep. No gimmicks, no shifting fashion — only what makes your operation quieter, sharper and more precise.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { k: "GPT-5", v: "Language models" },
                  { k: "RAG", v: "Retrieval systems" },
                  { k: "n8n", v: "Workflow engine" },
                  { k: "500+", v: "Integrations" },
                ].map((c) => (
                  <div key={c.k} className="p-5 rounded-2xl border border-border bg-card">
                    <div className="serif text-3xl text-[hsl(var(--sea))] mb-1">{c.k}</div>
                    <div className="kicker">{c.v}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl mb-16">
            <span className="kicker">Kind words</span>
            <h2 className="serif text-4xl md:text-5xl mt-4 brass-rule">
              Read by the people we quietly serve.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-8 md:p-10 rounded-3xl border border-border bg-card card-hover"
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-[hsl(var(--brass))] text-[hsl(var(--brass))]" aria-hidden="true" />
                  ))}
                </div>
                <p className="serif text-xl leading-snug mb-8">"{t.content}"</p>
                <div>
                  <div className="font-medium text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-[hsl(var(--ink))] text-[hsl(var(--background))] rounded-3xl p-10 md:p-16 lg:p-20"
          >
            <div className="grain absolute inset-0 pointer-events-none opacity-40" />
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[hsl(var(--brass))]/15 blur-3xl" />
            <div className="relative max-w-2xl">
              <span className="kicker text-[hsl(var(--brass))]">Ready when you are</span>
              <h2 className="serif text-4xl md:text-5xl lg:text-6xl mt-4 mb-6">
                Let's build something <span className="italic text-[hsl(var(--brass))]">worth building</span>.
              </h2>
              <p className="text-lg text-[hsl(var(--background))]/75 mb-10 leading-relaxed">
                A short call, an honest brief, and a considered proposal within the week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full bg-[hsl(var(--background))] text-[hsl(var(--ink))] hover:bg-[hsl(var(--brass))] hover:text-[hsl(var(--ink))] px-8 py-6 text-base">
                  <Link to="/contact">
                    Start a project <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-[hsl(var(--background))]/25 bg-transparent text-[hsl(var(--background))] hover:bg-[hsl(var(--background))]/10 px-8 py-6 text-base">
                  <Link to="/solutions">See our work</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
