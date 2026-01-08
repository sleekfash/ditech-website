import { motion } from "framer-motion";
import { 
  FileText, 
  Mic, 
  Search, 
  Calendar, 
  Users, 
  Shield,
  Clock,
  BarChart3,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const legalFeatures = [
  {
    icon: FileText,
    title: "Intelligent Case Management",
    description: "End-to-end case lifecycle tracking with AI-powered categorization, deadline management, and automated status updates. Built specifically for the complexity of Indian legal proceedings.",
    benefits: ["Automated case tracking", "Smart deadline alerts", "Document versioning", "Matter-wise billing"],
  },
  {
    icon: Mic,
    title: "AI Transcription & Audio Processing",
    description: "Whisper-powered transcription that handles multiple Indian languages and legal terminology. Convert court proceedings, client meetings, and depositions into searchable, tagged documents.",
    benefits: ["Multi-language support", "Legal terminology recognition", "Speaker diarization", "Timestamp linking"],
  },
  {
    icon: Search,
    title: "AI Legal Research Assistant",
    description: "GPT-5 powered research companion that searches through case law, statutes, and legal databases. Get relevant precedents, summaries, and citation suggestions in seconds.",
    benefits: ["Case law search", "Citation extraction", "Precedent matching", "Research summaries"],
  },
  {
    icon: Calendar,
    title: "Court Date & Hearing Management",
    description: "Automated court calendar synchronization with conflict detection, rescheduling workflows, and team notifications. Never miss a critical hearing again.",
    benefits: ["Calendar sync", "Conflict detection", "Team notifications", "Rescheduling automation"],
  },
  {
    icon: Users,
    title: "Client Portal & Communication",
    description: "Secure client-facing portal with document sharing, case updates, and encrypted messaging. Build trust through transparency and accessibility.",
    benefits: ["Secure document sharing", "Real-time case updates", "Encrypted messaging", "Mobile access"],
  },
  {
    icon: Shield,
    title: "Document Automation & Drafting",
    description: "AI-assisted legal document generation using customizable templates. From contracts to petitions, reduce drafting time by 65% while maintaining precision.",
    benefits: ["Smart templates", "Auto-population", "Version control", "Compliance checks"],
  },
];

const metrics = [
  { value: "65%", label: "Drafting Time Reduced", icon: Clock },
  { value: "40%", label: "Faster Case Processing", icon: BarChart3 },
  { value: "99.9%", label: "System Uptime", icon: Shield },
  { value: "90%", label: "Data Entry Errors Eliminated", icon: CheckCircle2 },
];

const LegalSolutions = () => {
  return (
    <section id="legal" className="py-24 bg-surface/50 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      
      <div className="container relative z-10 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Scale className="w-4 h-4 mr-2" />
            Legal Tech Specialization
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Built for <span className="gradient-text">Legal Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Purpose-built solutions for law firms, senior advocates, and legal departments. 
            Our flagship Legal & Case Automation MVP has transformed operations for clients 
            handling 5,000+ active cases.
          </p>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {metrics.map((metric, index) => (
            <Card key={metric.label} className="text-center p-6 glass border-primary/20">
              <metric.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {legalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold mb-2">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.benefits.map((benefit) => (
                      <Badge key={benefit} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Ready to transform your legal practice with AI?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Schedule a Demo
            <span className="text-lg">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// Need to import Scale icon
import { Scale } from "lucide-react";

export default LegalSolutions;
