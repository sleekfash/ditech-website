import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  FileText,
  Search,
  Mic,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import SectionScrollSpy from "@/components/SectionScrollSpy";
import legalTechImg from "@/assets/legal-tech.jpg";

const solutions = [
  {
    icon: FileText,
    title: "Case Management System",
    description:
      "Comprehensive digital platform for managing cases, clients, and documents with intelligent organization and search capabilities.",
    features: [
      "Centralized case database",
      "Client portal access",
      "Document management",
      "Deadline tracking",
      "Billing integration",
    ],
  },
  {
    icon: Mic,
    title: "AI Transcription",
    description:
      "Automatic transcription of court proceedings, depositions, and meetings with high accuracy and speaker identification.",
    features: [
      "Real-time transcription",
      "Speaker identification",
      "Legal terminology support",
      "Searchable archives",
      "Export to multiple formats",
    ],
  },
  {
    icon: Search,
    title: "Legal Research Assistant",
    description:
      "AI-powered research tool that analyzes case law, statutes, and legal documents to find relevant precedents quickly.",
    features: [
      "Natural language queries",
      "Case law analysis",
      "Citation tracking",
      "Relevance ranking",
      "Brief generation",
    ],
  },
  {
    icon: FileText,
    title: "Document Automation",
    description:
      "Generate legal documents, contracts, and forms automatically with customizable templates and intelligent field population.",
    features: [
      "Template library",
      "Smart field population",
      "Version control",
      "E-signature integration",
      "Compliance checking",
    ],
  },
  {
    icon: Calendar,
    title: "Court Calendar Management",
    description:
      "Integrated calendar system for tracking court dates, deadlines, and appointments with automatic reminders.",
    features: [
      "Court date syncing",
      "Deadline calculations",
      "Team scheduling",
      "Conflict detection",
      "Mobile access",
    ],
  },
  {
    icon: Users,
    title: "Client Communication Hub",
    description:
      "Secure portal for client communications, document sharing, and case updates with audit trails.",
    features: [
      "Secure messaging",
      "Document sharing",
      "Case status updates",
      "Billing transparency",
      "Mobile app access",
    ],
  },
];

const benefits = [
  { title: "Increase Efficiency", description: "Reduce time spent on administrative tasks by up to 60% with automated workflows.", stat: "60%" },
  { title: "Improve Accuracy", description: "Minimize errors in document preparation and deadline tracking with AI assistance.", stat: "99%" },
  { title: "Better Client Service", description: "Provide clients with real-time updates and secure access to their case information.", stat: "24/7" },
  { title: "Cost Savings", description: "Reduce operational costs through automation and improved resource allocation.", stat: "40%" },
];

const projects = [
  {
    id: 1,
    title: "LegalFirst Case Management Platform",
    category: "Legal Tech",
    description: "Built a comprehensive AI-powered case management system for a mid-sized law firm, resulting in 40% efficiency improvement.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop",
    technologies: ["React", "Node.js", "PostgreSQL", "OpenAI"],
    results: ["40% efficiency increase", "60% faster document processing", "99% client satisfaction"],
    year: "2025",
  },
  {
    id: 2,
    title: "RetailPro E-commerce Platform",
    category: "E-commerce",
    description: "Developed a scalable e-commerce platform with AI-powered recommendations and automated inventory management.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    technologies: ["Next.js", "Stripe", "Supabase", "TensorFlow"],
    results: ["60% sales increase", "30% cart abandonment reduction", "24/7 automated support"],
    year: "2024",
  },
  {
    id: 3,
    title: "HealthConnect Patient Portal",
    category: "Healthcare",
    description: "Created a secure patient portal with appointment scheduling, telemedicine integration, and medical records access.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    technologies: ["React", "Python", "AWS", "HIPAA Compliant"],
    results: ["50% fewer no-shows", "Improved patient engagement", "Streamlined communications"],
    year: "2024",
  },
  {
    id: 4,
    title: "FinanceFlow Automation Suite",
    category: "Finance",
    description: "Implemented workflow automation for a financial services company, automating reporting and compliance tasks.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    technologies: ["Python", "Power Automate", "SQL Server", "Azure"],
    results: ["80% time saved on reports", "Zero compliance issues", "Real-time analytics"],
    year: "2024",
  },
  {
    id: 5,
    title: "EduLearn Virtual Classroom",
    category: "Education",
    description: "Built an interactive virtual classroom platform with AI tutoring, progress tracking, and collaborative tools.",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
    technologies: ["React", "WebRTC", "Node.js", "MongoDB"],
    results: ["10,000+ active students", "95% completion rate", "AI-personalized learning"],
    year: "2023",
  },
  {
    id: 6,
    title: "LogiTrack Supply Chain System",
    category: "Logistics",
    description: "Developed a real-time supply chain tracking system with predictive analytics and automated alerts.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
    technologies: ["React", "Python", "IoT", "Machine Learning"],
    results: ["25% cost reduction", "Real-time visibility", "Predictive maintenance"],
    year: "2023",
  },
];

const categories = ["All", "Legal Tech", "E-commerce", "Healthcare", "Finance", "Education", "Logistics"];

const portfolioStats = [
  { value: "150+", label: "Projects Completed" },
  { value: "50+", label: "Happy Clients" },
  { value: "10+", label: "Industries Served" },
  { value: "99%", label: "Client Satisfaction" },
];

const scrollToProjects = () => {
  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
};

const Solutions = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const spySections = [
    { id: "overview", label: "Overview" },
    { id: "benefits", label: "Benefits" },
    { id: "solutions", label: "Solutions" },
    { id: "projects", label: "Case Studies" },
    { id: "integrations", label: "Integrations" },
  ];

  return (
    <Layout>
      <SectionScrollSpy sections={spySections} />
      {/* Hero Section */}
      <section id="overview" className="relative py-24 md:py-32 overflow-hidden scroll-mt-32">
        <div className="absolute inset-0 gradient-bg-subtle" />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Scale className="h-4 w-4" />
                Solutions & Projects
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                AI-Powered Solutions &{" "}
                <span className="gradient-text">Proven Results</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explore the legal-tech solutions we build and the real-world projects we've delivered across industries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gradient-bg rounded-xl">
                  <Link to="/contact">
                    Schedule Demo <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button onClick={scrollToProjects} variant="outline" size="lg" className="rounded-xl">
                  View Case Studies
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative">
              <img src={legalTechImg} alt="Legal Technology Solutions" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">AI-Powered</div>
                    <div className="text-sm text-muted-foreground">Smart Automation</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="section-padding bg-secondary text-secondary-foreground scroll-mt-32">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{benefit.stat}</div>
                <div className="font-semibold text-white mb-2">{benefit.title}</div>
                <div className="text-sm text-secondary-foreground/80">{benefit.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section id="solutions" className="section-padding scroll-mt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Legal Tech Solutions</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools designed to modernize every aspect of your legal practice
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover bg-card border-border">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                      <solution.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{solution.title}</h3>
                    <p className="text-muted-foreground mb-4">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
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

      {/* Featured Projects */}
      <section id="projects" className="section-padding gradient-bg-subtle scroll-mt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Projects That <span className="gradient-text">Drive Results</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              A selection of successful projects across various industries.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 justify-center mb-12"
          >
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </motion.div>

          {/* Projects */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const isOpen = expandedId === project.id;
              const panelId = `case-study-${project.id}`;
              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full card-hover overflow-hidden bg-card border-border group flex flex-col">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={project.image}
                        alt={`${project.title} — ${project.category} case study`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        width={600}
                        height={400}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground">{project.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        <span>{project.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                      <p className="text-muted-foreground mb-4">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            key="panel"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 pb-4 space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">Key Results</h4>
                                <ul className="space-y-2">
                                  {project.results.map((result, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                                      <span className="text-foreground">{result}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">Full Tech Stack</h4>
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <Button asChild size="sm" className="gradient-bg rounded-xl w-full">
                                <Link to="/contact" aria-label={`Discuss a project like ${project.title}`}>
                                  Discuss a similar project
                                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                </Link>
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!isOpen && (
                        <div className="space-y-2 mb-4">
                          {project.results.slice(0, 2).map((result, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                              <span className="text-muted-foreground">{result}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        className="w-full justify-center mt-auto min-h-11"
                        onClick={() => setExpandedId(isOpen ? null : project.id)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} case study for ${project.title}`}
                      >
                        {isOpen ? "Show less" : "View case study"}
                        <ChevronDown
                          className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Stats */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {portfolioStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{s.value}</div>
                <div className="text-secondary-foreground/80">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="section-padding gradient-bg-subtle">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Seamless Integration with Your Existing Tools
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our solutions integrate with popular legal software, document management systems, and accounting platforms you already use.
              </p>
              <ul className="space-y-4">
                {[
                  "Microsoft Office 365 & Google Workspace",
                  "Popular legal practice management systems",
                  "Document management platforms",
                  "Accounting and billing software",
                  "E-signature providers",
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
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">Ready to Modernize Your Practice?</h3>
              <p className="text-muted-foreground mb-6">
                Schedule a personalized demo to see how our solutions can transform your firm's operations.
              </p>
              <Button asChild className="w-full gradient-bg rounded-xl">
                <Link to="/contact">
                  Request a Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
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
            className="gradient-bg rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can bring your vision to life with our expertise.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-xl text-lg bg-white text-primary hover:bg-white/90"
            >
              <Link to="/contact">
                Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Solutions;
