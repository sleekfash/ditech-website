import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  Workflow,
  Code,
  ShoppingCart,
  Cpu,
  Database,
  Cloud,
  Shield,
  ArrowRight,
  CheckCircle,
  Search,
  Star,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import servicesBg from "@/assets/services-bg.jpg";
import { products, productCategories } from "@/config/products";

const services = [
  {
    id: "ai-automation",
    icon: Bot,
    title: "AI Automation",
    description: "Harness the power of artificial intelligence to automate complex business processes, reduce manual effort, and improve accuracy.",
    features: [
      "Intelligent document processing",
      "Automated data extraction and analysis",
      "Predictive analytics and insights",
      "Natural language processing",
      "Machine learning model development",
      "AI-powered customer support",
    ],
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "Workflow Orchestration",
    description: "Connect your business systems and automate workflows to create seamless, efficient operations across your organization.",
    features: [
      "Process automation design",
      "System integration solutions",
      "Real-time workflow monitoring",
      "Custom trigger and action setup",
      "Error handling and recovery",
      "Performance optimization",
    ],
  },
  {
    id: "development",
    icon: Code,
    title: "Custom Software Development",
    description: "Build tailored software solutions that perfectly fit your business requirements and scale with your growth.",
    features: [
      "Web application development",
      "Mobile app development",
      "API development and integration",
      "Legacy system modernization",
      "Microservices architecture",
      "Agile development methodology",
    ],
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    description: "Create powerful online stores with integrated payment systems, inventory management, and customer analytics.",
    features: [
      "Custom e-commerce platforms",
      "Payment gateway integration",
      "Inventory management systems",
      "Order processing automation",
      "Customer analytics dashboards",
      "Multi-channel selling support",
    ],
  },
  {
    id: "cloud",
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Migrate to the cloud or optimize your existing cloud infrastructure for better performance and cost efficiency.",
    features: [
      "Cloud migration services",
      "Infrastructure optimization",
      "Serverless architecture",
      "Cloud security implementation",
      "Cost optimization strategies",
      "24/7 monitoring and support",
    ],
  },
  {
    id: "data",
    icon: Database,
    title: "Data Analytics & BI",
    description: "Transform your data into actionable insights with advanced analytics and business intelligence solutions.",
    features: [
      "Data warehouse design",
      "Business intelligence dashboards",
      "Predictive analytics",
      "Real-time data processing",
      "Custom reporting solutions",
      "Data visualization",
    ],
  },
];

const additionalServices = [
  {
    icon: Cpu,
    title: "Hardware Solutions",
    description: "Quality laptops, monitors, and accessories for your technology needs.",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Protect your business with comprehensive security solutions and best practices.",
  },
];

const Services = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }, [location.hash]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden gradient-bg-subtle">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.06]" style={{ backgroundImage: `url(${servicesBg})` }} />
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="kicker">Our services</span>
            <h1 className="serif text-5xl md:text-6xl lg:text-7xl mt-4 mb-8 brass-rule">
              Technology, tailored — <span className="italic text-[hsl(var(--sea))]">not templated</span>.
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
              From AI automation to bespoke development and curated hardware — six practices, one atelier.
            </p>
            <Button asChild size="lg" className="rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(var(--sea))] px-8 py-6">
              <Link to="/contact">Book a consultation <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main services */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-24 md:space-y-32">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start scroll-mt-28"
              >
                <div className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <service.icon className="h-8 w-8 text-[hsl(var(--sea))] mb-8" aria-hidden="true" />
                  <span className="kicker">Practice · {String(index + 1).padStart(2, "0")}</span>
                  <h2 className="serif text-3xl md:text-5xl mt-4 mb-6 brass-rule">{service.title}</h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{service.description}</p>
                  <Button asChild className="rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(var(--sea))]">
                    <Link to="/contact">Discuss this <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                  </Button>
                </div>

                <Card className={`lg:col-span-6 bg-card border-border rounded-3xl ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <CardHeader>
                    <CardTitle className="serif text-xl">Key capabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-[hsl(var(--sea))] flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional practices strip */}
      <section className="section-padding bg-[hsl(var(--surface))]">
        <div className="container-custom">
          <div className="max-w-2xl mb-12">
            <span className="kicker">Complementary</span>
            <h2 className="serif text-3xl md:text-4xl mt-4 brass-rule">Also in-house.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {additionalServices.map((service) => (
              <div key={service.title} className="p-8 rounded-3xl border border-border bg-card flex items-start gap-5">
                <span className="inline-flex h-12 w-12 rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] items-center justify-center flex-shrink-0">
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="serif text-xl mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop (merged from /shop) */}
      <section id="shop" className="section-padding scroll-mt-28 border-t border-border/60">
        <div className="container-custom">
          <div className="max-w-2xl mb-12">
            <span className="kicker">The shop</span>
            <h2 className="serif text-4xl md:text-5xl mt-4 brass-rule">
              Considered hardware, <span className="italic text-[hsl(var(--sea))]">delivered by hand</span>.
            </h2>
            <p className="text-lg text-muted-foreground mt-6">
              Laptops, displays, accessories and networking gear — curated for professionals who care about the tools they use.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full"
                aria-label="Search products"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    selectedCategory === c
                      ? "bg-[hsl(var(--ink))] text-[hsl(var(--background))]"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 8) * 0.04 }}
                className="group rounded-2xl overflow-hidden border border-border bg-card card-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/85 backdrop-blur text-[10px] tracking-[0.18em] uppercase font-medium text-foreground">
                      {product.badge}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Add ${product.name} to favorites`}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/85 backdrop-blur opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </button>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/85 flex items-center justify-center">
                      <Badge variant="secondary">Out of stock</Badge>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="kicker mb-2">{product.category}</div>
                  <h3 className="serif text-lg leading-snug mb-3 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <Star className="h-4 w-4 fill-[hsl(var(--brass))] text-[hsl(var(--brass))]" aria-hidden="true" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="serif text-xl text-[hsl(var(--sea))]">${product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Button asChild size="sm" className="rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(var(--sea))]" disabled={!product.inStock}>
                      <Link to="/contact"><ShoppingCart className="h-4 w-4 mr-1.5" aria-hidden="true" />Enquire</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products match your filters.</p>
              <Button
                variant="outline"
                className="mt-4 rounded-full"
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>


      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-[hsl(var(--ink))] text-[hsl(var(--background))] rounded-3xl p-10 md:p-16 text-center"
          >
            <div className="grain absolute inset-0 opacity-40 pointer-events-none" />
            <span className="kicker text-[hsl(var(--brass))] relative">Talk to us</span>
            <h2 className="serif text-3xl md:text-5xl mt-4 mb-6 relative">
              Not sure which practice fits?
            </h2>
            <p className="text-lg text-[hsl(var(--background))]/75 mb-8 max-w-2xl mx-auto relative">
              A short call and an honest brief — we'll point you to the right path, even if that path isn't us.
            </p>
            <Button asChild size="lg" className="relative rounded-full bg-[hsl(var(--background))] text-[hsl(var(--ink))] hover:bg-[hsl(var(--brass))] px-8 py-6">
              <Link to="/contact">Schedule a consultation <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link>
            </Button>
          </motion.div>

        </div>
      </section>
    </Layout>
  );
};

export default Services;
