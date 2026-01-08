import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FileText, 
  Bot, 
  Workflow, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DemoType = "document" | "workflow" | "ai";

const demos = {
  document: {
    title: "Document Automation",
    description: "Watch AI transform a simple form into a complete legal document",
    steps: [
      { label: "Input Form", content: "Client Name: ABC Corp\nCase Type: Contract Dispute\nDate: 2024-01-15" },
      { label: "AI Processing", content: "Analyzing template... Extracting entities... Generating clauses..." },
      { label: "Draft Output", content: "LEGAL NOTICE\n\nTo: ABC Corp\nRe: Contract Dispute\n\nPursuant to the agreement dated January 15, 2024, we hereby provide notice..." },
      { label: "Final Review", content: "✓ All fields populated\n✓ Compliance check passed\n✓ Ready for signature" },
    ],
  },
  workflow: {
    title: "Workflow Orchestration",
    description: "See how n8n automates complex multi-step processes",
    steps: [
      { label: "Trigger", content: "📥 New email received\n→ From: client@example.com\n→ Subject: Urgent - Case Update" },
      { label: "Extract", content: "🔍 AI extracts:\n→ Case ID: #12345\n→ Priority: High\n→ Action: Review needed" },
      { label: "Route", content: "🔀 Routing to:\n→ Assigned attorney\n→ Calendar updated\n→ Slack notification sent" },
      { label: "Complete", content: "✅ Workflow complete:\n→ 3 systems updated\n→ 0 manual steps\n→ 12 seconds elapsed" },
    ],
  },
  ai: {
    title: "AI Research Assistant",
    description: "Experience how our AI finds relevant case law instantly",
    steps: [
      { label: "Query", content: "🔎 Searching for:\n\"breach of contract damages calculation precedents\"" },
      { label: "Search", content: "⚡ Scanning 50,000+ cases...\n→ Filtering by jurisdiction\n→ Ranking by relevance" },
      { label: "Results", content: "📋 Top matches:\n1. Smith v. Jones (2023) - 95% match\n2. ABC Corp v. XYZ Ltd (2022) - 89% match\n3. Industrial Holdings (2021) - 85% match" },
      { label: "Summary", content: "📝 AI Summary:\nDamages typically calculated using expectation basis. Key factors include:\n• Direct losses\n• Consequential damages\n• Mitigation duty" },
    ],
  },
};

const InteractiveDemo = () => {
  const [activeDemo, setActiveDemo] = useState<DemoType>("document");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demo = demos[activeDemo];

  const handlePlay = () => {
    if (currentStep >= demo.steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  // Auto-advance when playing
  useState(() => {
    if (isPlaying && currentStep < demo.steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (currentStep >= demo.steps.length - 1) {
      setIsPlaying(false);
    }
  });

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Interactive Preview
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            See It <span className="gradient-text">In Action</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience live previews of our automation capabilities
          </p>
        </motion.div>

        {/* Demo Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { key: "document" as const, label: "Document Automation", icon: FileText },
            { key: "workflow" as const, label: "Workflow Orchestration", icon: Workflow },
            { key: "ai" as const, label: "AI Research", icon: Bot },
          ].map((item) => (
            <Button
              key={item.key}
              variant={activeDemo === item.key ? "default" : "outline"}
              className={activeDemo === item.key ? "gradient-bg" : ""}
              onClick={() => {
                setActiveDemo(item.key);
                setCurrentStep(0);
                setIsPlaying(false);
              }}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Demo Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden border-primary/20 glass">
            {/* Header */}
            <div className="bg-muted/50 px-6 py-4 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold">{demo.title}</h3>
                <p className="text-sm text-muted-foreground">{demo.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  className="gradient-bg"
                  onClick={isPlaying ? handlePause : handlePlay}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {demo.steps.map((step, index) => (
                  <div key={step.label} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        index <= currentStep
                          ? "gradient-bg text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < demo.steps.length - 1 && (
                      <div
                        className={`w-12 sm:w-20 h-0.5 mx-2 transition-all ${
                          index < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Labels */}
              <div className="flex justify-between mb-6 text-xs sm:text-sm">
                {demo.steps.map((step, index) => (
                  <span
                    key={step.label}
                    className={`font-medium ${
                      index === currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                ))}
              </div>

              {/* Content Display */}
              <div className="relative min-h-[200px] bg-muted/30 rounded-lg p-4 font-mono text-sm overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="whitespace-pre-wrap text-foreground"
                  >
                    {demo.steps[currentStep].content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Manual Navigation */}
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentStep >= demo.steps.length - 1}
                  onClick={() => setCurrentStep(prev => Math.min(demo.steps.length - 1, prev + 1))}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Want to see a full demo customized for your use case?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Request a Personalized Demo
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
