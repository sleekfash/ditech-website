import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Workflow, Scale, ShoppingCart, Code, Cpu, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import heroBg from "@/assets/hero-bg.jpg";
import homeCollaboration from "@/assets/home-collaboration.jpg";
import homeAiTech from "@/assets/home-ai-tech.jpg";

const services = [
  {
    icon: Bot,
    title: "AI Automation",
    description: "Intelligent automation solutions that streamline your business processes and boost productivity.",
    href: "/services#ai-automation",
  },
  {
    icon: Workflow,
    title: "Workflow Orchestration",
    description: "Seamlessly connect and automate your business workflows with smart orchestration tools.",
    href: "/services#workflow",
  },
  {
    icon: Scale,
    title: "Legal Tech Solutions",
    description: "Cutting-edge technology solutions designed specifically for law firms and legal professionals.",
    href: "/solutions",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Development",
    description: "Build powerful online stores with integrated payment systems and inventory management.",
    href: "/services#ecommerce",
  },
  {
    icon: Code,
    title: "Custom Development",
    description: "Tailored software solutions built to meet your unique business requirements.",
    href: "/services#development",
  },
  {
    icon: Cpu,
    title: "Hardware Solutions",
    description: "Quality laptops, gadgets, and accessories for your technology needs.",
    href: "/shop",
  },
];

const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "99%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support Available" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, LegalFirst",
    content: "DiTech transformed our legal practice with their AI-powered case management system. We've seen a 40% increase in efficiency.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "CTO, TechStart",
    content: "The workflow automation solutions provided by DiTech have been game-changing for our operations. Highly recommended!",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Director, RetailPro",
    content: "Our e-commerce platform built by DiTech has exceeded all expectations. Sales are up 60% since launch.",
    rating: 5,
  },
];

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Bot className="h-4 w-4" />
                AI-Powered Solutions
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
            >
              Transform Your Business with{" "}
              <span className="gradient-text">Intelligent Technology</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
            >
              We deliver cutting-edge AI automation, workflow orchestration, and custom software solutions that drive real business results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="gradient-bg rounded-xl text-lg">
                <Link to="/contact">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl text-lg">
                <Link to="/services">Explore Services</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding gradient-bg-subtle">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive technology solutions tailored to your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover bg-card border-border">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <Link
                      to={service.href}
                      className="inline-flex items-center text-primary font-medium hover:underline"
                    >
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-foreground/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - with image */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose DiTech?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We combine technical expertise with a deep understanding of business needs to deliver solutions that make a real impact.
              </p>
              <ul className="space-y-4">
                {[
                  "Expert team with diverse industry experience",
                  "Cutting-edge AI and automation technologies",
                  "Tailored solutions for your unique needs",
                  "Ongoing support and maintenance",
                  "Transparent pricing and communication",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={homeCollaboration}
                alt="Team collaborating on AI-powered business solutions"
                className="rounded-2xl shadow-2xl w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Technology Showcase */}
      <section className="section-padding gradient-bg-subtle">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <img
                src={homeAiTech}
                alt="AI technology and intelligent automation interfaces"
                className="rounded-2xl shadow-2xl w-full object-cover"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Powered by <span className="gradient-text">Cutting-Edge AI</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our solutions leverage the latest in artificial intelligence, from natural language processing to computer vision, delivering automation that truly understands your business context.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-card border-border">
                  <div className="text-2xl font-bold text-primary mb-1">GPT-5</div>
                  <div className="text-sm text-muted-foreground">Language Models</div>
                </Card>
                <Card className="p-4 bg-card border-border">
                  <div className="text-2xl font-bold text-primary mb-1">RAG</div>
                  <div className="text-sm text-muted-foreground">Knowledge Retrieval</div>
                </Card>
                <Card className="p-4 bg-card border-border">
                  <div className="text-2xl font-bold text-primary mb-1">n8n</div>
                  <div className="text-sm text-muted-foreground">Workflow Engine</div>
                </Card>
                <Card className="p-4 bg-card border-border">
                  <div className="text-2xl font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Integrations</div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Trusted by businesses across industries
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-bg rounded-3xl p-8 md:p-12 lg:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Let's discuss how our technology solutions can help you achieve your business goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-xl text-lg bg-white text-primary hover:bg-white/90"
              >
                <Link to="/contact">
                  Contact Us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl text-lg border-white text-white hover:bg-white/10"
              >
                <Link to="/projects">View Our Work</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
