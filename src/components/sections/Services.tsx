import { motion } from "framer-motion";
import { 
  Bot, 
  Workflow, 
  Code2, 
  Scale, 
  ShoppingCart, 
  Server,
  GraduationCap,
  Cpu
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Bot,
    title: "AI-Powered Automation",
    description: "GPT-5, RAG pipelines, and intelligent agents that transform complex workflows into automated processes.",
    features: ["Custom AI Agents", "Document Processing", "Smart Data Extraction"],
  },
  {
    icon: Workflow,
    title: "Workflow Orchestration",
    description: "Enterprise-grade n8n deployments connecting 500+ integrations with robust error handling.",
    features: ["n8n Custom Nodes", "API Orchestration", "Event-Driven Architecture"],
  },
  {
    icon: Code2,
    title: "Full-Stack Development",
    description: "Modern web applications built with React, TypeScript, and Node.js for scalability and performance.",
    features: ["React & TypeScript", "Node.js Backend", "Cloud Deployment"],
  },
  {
    icon: Scale,
    title: "Legal Tech Solutions",
    description: "Specialized systems for case management, automated transcription, and AI-powered legal research.",
    features: ["Case Management", "AI Transcription", "Document Automation"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce & Retail",
    description: "Seamless integrations with Shopify, inventory systems, and omnichannel retail solutions.",
    features: ["Shopify Integration", "POS Systems", "Inventory Automation"],
  },
  {
    icon: Server,
    title: "Hardware & Kiosks",
    description: "Custom kiosk deployments, Raspberry Pi solutions, and IoT integrations for physical touchpoints.",
    features: ["Kiosk Development", "Raspberry Pi", "IoT Integration"],
  },
  {
    icon: GraduationCap,
    title: "Training & Consultancy",
    description: "Hands-on workshops and strategic consulting to empower your team with AI and automation skills.",
    features: ["Custom Workshops", "Team Training", "Strategy Sessions"],
  },
  {
    icon: Cpu,
    title: "System Integration",
    description: "Connect disparate systems with robust APIs, webhooks, and data synchronization pipelines.",
    features: ["API Development", "Data Sync", "Legacy Integration"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Services = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive technology solutions tailored to transform your business operations
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={service.title} variants={cardVariants}>
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4 group-hover:glow-sm transition-all">
                    <service.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="font-display text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
