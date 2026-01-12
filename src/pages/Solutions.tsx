import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Scale, 
  FileText, 
  Search, 
  Mic, 
  Calendar, 
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import legalTechImg from "@/assets/legal-tech.jpg";

const solutions = [
  {
    icon: FileText,
    title: "Case Management System",
    description: "Comprehensive digital platform for managing cases, clients, and documents with intelligent organization and search capabilities.",
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
    description: "Automatic transcription of court proceedings, depositions, and meetings with high accuracy and speaker identification.",
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
    description: "AI-powered research tool that analyzes case law, statutes, and legal documents to find relevant precedents quickly.",
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
    description: "Generate legal documents, contracts, and forms automatically with customizable templates and intelligent field population.",
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
    description: "Integrated calendar system for tracking court dates, deadlines, and appointments with automatic reminders.",
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
    description: "Secure portal for client communications, document sharing, and case updates with audit trails.",
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
  {
    title: "Increase Efficiency",
    description: "Reduce time spent on administrative tasks by up to 60% with automated workflows.",
    stat: "60%",
  },
  {
    title: "Improve Accuracy",
    description: "Minimize errors in document preparation and deadline tracking with AI assistance.",
    stat: "99%",
  },
  {
    title: "Better Client Service",
    description: "Provide clients with real-time updates and secure access to their case information.",
    stat: "24/7",
  },
  {
    title: "Cost Savings",
    description: "Reduce operational costs through automation and improved resource allocation.",
    stat: "40%",
  },
];

const Solutions = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Scale className="h-4 w-4" />
                Legal Technology
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Transform Your Law Firm with{" "}
                <span className="gradient-text">AI-Powered Solutions</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Streamline your legal practice with cutting-edge technology designed specifically for law firms and legal professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gradient-bg rounded-xl">
                  <Link to="/contact">
                    Schedule Demo <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl">
                  <Link to="/projects">View Case Studies</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img
                src={legalTechImg}
                alt="Legal Technology Solutions"
                className="rounded-2xl shadow-2xl"
              />
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
      <section className="section-padding bg-secondary text-secondary-foreground">
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
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {benefit.stat}
                </div>
                <div className="font-semibold text-white mb-2">{benefit.title}</div>
                <div className="text-sm text-secondary-foreground/80">
                  {benefit.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Legal Tech Solutions
            </h2>
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
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {solution.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {solution.description}
                    </p>
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

      {/* Integration Section */}
      <section className="section-padding gradient-bg-subtle">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
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
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Ready to Modernize Your Practice?
              </h3>
              <p className="text-muted-foreground mb-6">
                Schedule a personalized demo to see how our legal tech solutions can transform your firm's operations.
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
              Join the Future of Legal Technology
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              See why leading law firms trust DiTech for their technology needs.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-xl text-lg bg-white text-primary hover:bg-white/90"
            >
              <Link to="/contact">
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Solutions;
