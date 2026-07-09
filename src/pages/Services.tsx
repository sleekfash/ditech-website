import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  Workflow,
  Code,
  ShoppingCart,
  Cpu,
  Database,
  Cloud,
  Shield,
  ArrowRight,
  CheckCircle,
  Search,
  Star,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import servicesBg from "@/assets/services-bg.jpg";
import { products, productCategories } from "@/config/products";

const services = [
  {
    id: "ai-automation",
    icon: Bot,
    title: "AI Automation",
    description: "Harness the power of artificial intelligence to automate complex business processes, reduce manual effort, and improve accuracy.",
    features: [
      "Intelligent document processing",
      "Automated data extraction and analysis",
      "Predictive analytics and insights",
      "Natural language processing",
      "Machine learning model development",
      "AI-powered customer support",
    ],
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "Workflow Orchestration",
    description: "Connect your business systems and automate workflows to create seamless, efficient operations across your organization.",
    features: [
      "Process automation design",
      "System integration solutions",
      "Real-time workflow monitoring",
      "Custom trigger and action setup",
      "Error handling and recovery",
      "Performance optimization",
    ],
  },
  {
    id: "development",
    icon: Code,
    title: "Custom Software Development",
    description: "Build tailored software solutions that perfectly fit your business requirements and scale with your growth.",
    features: [
      "Web application development",
      "Mobile app development",
      "API development and integration",
      "Legacy system modernization",
      "Microservices architecture",
      "Agile development methodology",
    ],
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    description: "Create powerful online stores with integrated payment systems, inventory management, and customer analytics.",
    features: [
      "Custom e-commerce platforms",
      "Payment gateway integration",
      "Inventory management systems",
      "Order processing automation",
      "Customer analytics dashboards",
      "Multi-channel selling support",
    ],
  },
  {
    id: "cloud",
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Migrate to the cloud or optimize your existing cloud infrastructure for better performance and cost efficiency.",
    features: [
      "Cloud migration services",
      "Infrastructure optimization",
      "Serverless architecture",
      "Cloud security implementation",
      "Cost optimization strategies",
      "24/7 monitoring and support",
    ],
  },
  {
    id: "data",
    icon: Database,
    title: "Data Analytics & BI",
    description: "Transform your data into actionable insights with advanced analytics and business intelligence solutions.",
    features: [
      "Data warehouse design",
      "Business intelligence dashboards",
      "Predictive analytics",
      "Real-time data processing",
      "Custom reporting solutions",
      "Data visualization",
    ],
  },
];

const additionalServices = [
  {
    icon: Cpu,
    title: "Hardware Solutions",
    description: "Quality laptops, monitors, and accessories for your technology needs.",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Protect your business with comprehensive security solutions and best practices.",
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${servicesBg})` }}
        />
        <div className="absolute inset-0 gradient-bg-subtle" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Technology Solutions for{" "}
              <span className="gradient-text">Modern Businesses</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              From AI automation to custom development, we offer comprehensive technology services tailored to your business needs.
            </p>
            <Button asChild size="lg" className="gradient-bg rounded-xl">
              <Link to="/contact">
                Get a Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6">
                    <service.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    {service.description}
                  </p>
                  <Button asChild className="gradient-bg rounded-xl">
                    <Link to="/contact">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <Card className={`bg-card border-border ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <CardHeader>
                    <CardTitle className="text-xl">Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Additional Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Complementary solutions to support your technology infrastructure
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover bg-card border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
              Not Sure Which Service You Need?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Let's discuss your requirements and find the perfect solution for your business.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-xl text-lg bg-white text-primary hover:bg-white/90"
            >
              <Link to="/contact">
                Schedule a Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
