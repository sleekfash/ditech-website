import { motion } from "framer-motion";
import { 
  Brain, 
  Cpu, 
  Database, 
  Cloud, 
  Code, 
  Layers,
  Zap,
  Shield
} from "lucide-react";

const techCategories = [
  {
    category: "AI & Machine Learning",
    icon: Brain,
    technologies: ["GPT-5 / OpenAI", "Whisper (Transcription)", "RAG Pipelines", "Vector Databases", "LangChain"],
  },
  {
    category: "Workflow Orchestration",
    icon: Zap,
    technologies: ["n8n (Self-hosted)", "Custom Nodes", "Webhooks", "Event-Driven", "Zapier Integration"],
  },
  {
    category: "Frontend",
    icon: Code,
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    icon: Layers,
    technologies: ["Node.js", "Express", "Python", "FastAPI", "GraphQL"],
  },
  {
    category: "Data & Storage",
    icon: Database,
    technologies: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Supabase"],
  },
  {
    category: "Cloud & DevOps",
    icon: Cloud,
    technologies: ["AWS Lambda", "Docker", "Kubernetes", "Vercel", "GitHub Actions"],
  },
  {
    category: "Hardware & IoT",
    icon: Cpu,
    technologies: ["Raspberry Pi", "Custom Kiosks", "POS Systems", "Sensors", "Edge Computing"],
  },
  {
    category: "Security",
    icon: Shield,
    technologies: ["OAuth 2.0", "JWT", "Encryption", "RBAC", "Compliance"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const TechStack = () => {
  return (
    <section id="tech" className="py-24 bg-surface/50 relative">
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Technology <span className="gradient-text">Stack</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade tools and frameworks powering our solutions
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {techCategories.map((category) => (
            <motion.div
              key={category.category}
              variants={itemVariants}
              className="group"
            >
              <div className="h-full p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-sm">
                    {category.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
