import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// Static blog posts for now - will be dynamic with CMS later
const blogPosts = [
  {
    id: 1,
    title: "How GPT-5 is Revolutionizing Legal Document Automation",
    excerpt: "Explore how the latest AI models are transforming legal workflows, reducing drafting time by up to 65%, and enabling law firms to handle more cases with greater precision.",
    category: "AI Insights",
    readTime: "5 min read",
    date: "Jan 5, 2024",
    featured: true,
  },
  {
    id: 2,
    title: "n8n vs. Zapier: Choosing the Right Workflow Tool",
    excerpt: "A deep dive into the pros and cons of each platform, and why self-hosted n8n might be the better choice for enterprise automation needs.",
    category: "Automation Tips",
    readTime: "8 min read",
    date: "Dec 28, 2023",
    featured: false,
  },
  {
    id: 3,
    title: "Building AI-First Legal Tech: Lessons from the Field",
    excerpt: "Key insights from deploying AI solutions in law firms, including common pitfalls, success factors, and the importance of change management.",
    category: "Case Studies",
    readTime: "6 min read",
    date: "Dec 15, 2023",
    featured: false,
  },
  {
    id: 4,
    title: "The Future of Legal Transcription: Beyond Speech-to-Text",
    excerpt: "How Whisper and advanced NLP are enabling intelligent transcription that understands legal terminology, speaker intent, and contextual nuances.",
    category: "AI Insights",
    readTime: "4 min read",
    date: "Dec 10, 2023",
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  "AI Insights": "bg-primary/10 text-primary",
  "Automation Tips": "bg-accent/10 text-accent",
  "Case Studies": "bg-secondary text-secondary-foreground",
  "Industry News": "bg-muted text-muted-foreground",
};

const Blog = () => {
  return (
    <section id="blog" className="py-24 bg-surface/50 relative">
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Insights & <span className="gradient-text">Resources</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts on AI, automation, and technology from the DiTech team
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={post.featured ? "md:col-span-2 lg:col-span-2" : ""}
            >
              <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={categoryColors[post.category] || "bg-muted"}>
                      {post.category}
                    </Badge>
                    {post.featured && (
                      <Badge variant="outline" className="border-primary text-primary">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-display text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
