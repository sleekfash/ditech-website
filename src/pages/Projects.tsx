import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";

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

const Projects = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Projects That{" "}
              <span className="gradient-text">Drive Results</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Explore our portfolio of successful projects across various industries. Each solution is tailored to meet unique business challenges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover overflow-hidden bg-card border-border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{project.year}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    {/* Results */}
                    <div className="space-y-2 mb-4">
                      {project.results.slice(0, 2).map((result, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{result}</span>
                        </div>
                      ))}
                    </div>

                    <Button variant="ghost" className="w-full justify-center group">
                      View Case Study
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">150+</div>
              <div className="text-secondary-foreground/80">Projects Completed</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">50+</div>
              <div className="text-secondary-foreground/80">Happy Clients</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">10+</div>
              <div className="text-secondary-foreground/80">Industries Served</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">99%</div>
              <div className="text-secondary-foreground/80">Client Satisfaction</div>
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
              Let's discuss how we can help bring your vision to life with our expertise.
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

export default Projects;
