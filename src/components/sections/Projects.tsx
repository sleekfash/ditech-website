import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Cloud, Bot, ShoppingCart, ArrowUpRight } from "lucide-react";

import projectLegalCase from "@/assets/project-legal-case.jpg";
import projectCloudArchive from "@/assets/project-cloud-archive.jpg";
import projectAutomation from "@/assets/project-automation.jpg";
import projectRetail from "@/assets/project-retail.jpg";

const projects = [
  {
    icon: Scale,
    title: "Legal & Case Automation MVP",
    subtitle: "Flagship Legal Tech Platform",
    description: "End-to-end case management system for a law firm handling 5,000+ active cases. Integrated AI transcription, document automation, and deadline management.",
    problem: "Manual case tracking causing missed deadlines and inefficient resource allocation.",
    solution: "Custom-built platform with Whisper transcription, GPT-powered drafting, and automated workflows.",
    techStack: ["React", "Node.js", "PostgreSQL", "Whisper AI", "GPT-5", "n8n"],
    impact: ["65% faster drafting", "Zero missed deadlines", "40% efficiency gain"],
    featured: true,
    image: projectLegalCase,
  },
  {
    icon: Cloud,
    title: "Cloud Archive & Retrieval System",
    subtitle: "Enterprise Document Management",
    description: "Intelligent document archival system with AI-powered search and retrieval. Handles millions of documents with sub-second search times.",
    problem: "Legacy paper archives inaccessible; critical documents lost in storage.",
    solution: "Vector database with semantic search, OCR processing, and intelligent categorization.",
    techStack: ["AWS Lambda", "Elasticsearch", "Vector DB", "Python", "React"],
    impact: ["10x faster retrieval", "99.9% uptime", "50% storage cost reduction"],
    featured: false,
    image: projectCloudArchive,
  },
  {
    icon: Bot,
    title: "AI + n8n Business Automation",
    subtitle: "Workflow Orchestration Suite",
    description: "Hybrid automation platform combining GPT decisioning with deterministic n8n workflows for complex business processes.",
    problem: "Fragmented tools and manual handoffs slowing operations.",
    solution: "Unified orchestration layer with 200+ integrations and intelligent routing.",
    techStack: ["n8n", "GPT-5", "Webhooks", "REST APIs", "MongoDB"],
    impact: ["80% automation rate", "90% fewer errors", "24/7 operation"],
    featured: false,
    image: projectAutomation,
  },
  {
    icon: ShoppingCart,
    title: "Hybrid Retail & Hardware Rollout",
    subtitle: "Omnichannel Commerce Solution",
    description: "Complete POS and inventory system for international retailer with custom kiosk deployments across multiple locations.",
    problem: "Disconnected online/offline systems causing inventory discrepancies.",
    solution: "Unified commerce platform with real-time sync and custom Raspberry Pi kiosks.",
    techStack: ["Shopify", "React Native", "Raspberry Pi", "Node.js", "PostgreSQL"],
    impact: ["Real-time inventory", "15 locations deployed", "Single source of truth"],
    featured: false,
    image: projectRetail,
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 relative">
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-world implementations delivering measurable results for our clients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={project.featured ? "lg:col-span-2" : ""}
            >
              <Card className={`h-full group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden ${project.featured ? 'gradient-border' : ''}`}>
                {/* Project image */}
                <div className={`relative overflow-hidden ${project.featured ? 'aspect-[3/1]' : 'aspect-[16/9]'}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <project.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-xl flex items-center gap-2">
                          {project.title}
                          {project.featured && (
                            <Badge className="gradient-bg text-primary-foreground">Flagship</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{project.subtitle}</CardDescription>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{project.description}</p>
                  
                  <div className={`grid gap-6 ${project.featured ? 'md:grid-cols-2' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-2">Challenge</h4>
                      <p className="text-sm text-muted-foreground">{project.problem}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-2">Solution</h4>
                      <p className="text-sm text-muted-foreground">{project.solution}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2">Impact</h4>
                    <div className="flex flex-wrap gap-3">
                      {project.impact.map((item) => (
                        <span key={item} className="text-sm font-medium text-foreground bg-primary/10 px-3 py-1 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
