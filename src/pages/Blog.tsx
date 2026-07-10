import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ditechai.lovable.app/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://ditechai.lovable.app/blog" },
  ],
};

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  featured_image: string;
  read_time: number;
  created_at: string;
}

const fallbackPosts = [
  {
    id: "1",
    title: "The Future of AI in Legal Practice",
    excerpt: "Explore how artificial intelligence is transforming the legal industry, from document review to case prediction.",
    slug: "future-of-ai-legal-practice",
    category: "Legal Tech",
    featured_image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop",
    read_time: 8,
    created_at: "2025-01-10",
  },
  {
    id: "2",
    title: "Building Scalable E-commerce Platforms",
    excerpt: "Key considerations and best practices for developing e-commerce solutions that grow with your business.",
    slug: "building-scalable-ecommerce",
    category: "Development",
    featured_image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    read_time: 6,
    created_at: "2025-01-08",
  },
  {
    id: "3",
    title: "Workflow Automation: A Complete Guide",
    excerpt: "Learn how to identify automation opportunities and implement efficient workflows in your organization.",
    slug: "workflow-automation-guide",
    category: "Automation",
    featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    read_time: 10,
    created_at: "2025-01-05",
  },
  {
    id: "4",
    title: "Cybersecurity Best Practices for 2025",
    excerpt: "Essential security measures every business should implement to protect their digital assets.",
    slug: "cybersecurity-best-practices-2025",
    category: "Security",
    featured_image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
    read_time: 7,
    created_at: "2025-01-03",
  },
  {
    id: "5",
    title: "Cloud Migration Strategies",
    excerpt: "A comprehensive look at different approaches to migrating your infrastructure to the cloud.",
    slug: "cloud-migration-strategies",
    category: "Cloud",
    featured_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    read_time: 9,
    created_at: "2025-01-01",
  },
  {
    id: "6",
    title: "AI-Powered Customer Service",
    excerpt: "How chatbots and AI assistants are revolutionizing customer support and improving satisfaction.",
    slug: "ai-powered-customer-service",
    category: "AI",
    featured_image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop",
    read_time: 5,
    created_at: "2024-12-28",
  },
];

const categories = ["All", "Legal Tech", "Development", "Automation", "Security", "Cloud", "AI"];

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, excerpt, slug, category, featured_image, read_time, created_at")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setPosts(data);
        }
      } catch (error) {
        console.log("Using fallback posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Insights &{" "}
              <span className="gradient-text">Updates</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay informed with the latest trends, tips, and insights in technology and business automation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {filteredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <Card className="overflow-hidden bg-card border-border">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto overflow-hidden">
                    <img
                      src={filteredPosts[0].featured_image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"}
                      alt={filteredPosts[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-4">{filteredPosts[0].category}</Badge>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {filteredPosts[0].title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {filteredPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(filteredPosts[0].created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {filteredPosts[0].read_time} min read
                      </span>
                    </div>
                    <Button className="w-fit gradient-bg rounded-xl">
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.slice(1).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover overflow-hidden bg-card border-border">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featured_image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                    <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.read_time} min
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredPosts.length > 6 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="rounded-xl">
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-muted-foreground mb-6">
              Get the latest articles, tips, and insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button className="gradient-bg rounded-xl">Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
