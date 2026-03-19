import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Linkedin,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

import aboutTeamWorkspace from "@/assets/about-team-workspace.jpg";
import aboutStrategy from "@/assets/about-strategy.jpg";
import teamCeo from "@/assets/team-ceo.jpg";
import teamLeadDev from "@/assets/team-lead-dev.jpg";
import teamAiLead from "@/assets/team-ai-lead.jpg";
import teamDesignLead from "@/assets/team-design-lead.jpg";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We constantly push boundaries to deliver cutting-edge solutions that give our clients a competitive edge.",
  },
  {
    icon: Heart,
    title: "Client Focus",
    description: "Your success is our success. We're dedicated to understanding your needs and exceeding expectations.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in everything we do, from code quality to customer service.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe in the power of teamwork, both within our team and in partnership with our clients.",
  },
];

const teamMembers = [
  {
    name: "Arjun Mehta",
    role: "Founder & CEO",
    bio: "Visionary technologist with 12+ years in enterprise software and AI. Passionate about making cutting-edge tech accessible to businesses of all sizes.",
    image: teamCeo,
  },
  {
    name: "Priya Sharma",
    role: "Lead Developer",
    bio: "Full-stack engineer specializing in React, Node.js, and cloud architecture. Leads our development team with a focus on scalable, maintainable code.",
    image: teamLeadDev,
  },
  {
    name: "Rahul Krishnan",
    role: "AI & Data Lead",
    bio: "Machine learning specialist with expertise in NLP, RAG pipelines, and GPT integrations. Architects our AI-powered automation solutions.",
    image: teamAiLead,
  },
  {
    name: "Ananya Reddy",
    role: "UX & Project Lead",
    bio: "Design-driven project manager ensuring every solution is user-centric. Bridges the gap between technical capability and business needs.",
    image: teamDesignLead,
  },
];

const milestones = [
  { year: "2020", title: "Company Founded", description: "DiTech was established with a vision to transform businesses through technology." },
  { year: "2021", title: "First Major Project", description: "Delivered our first enterprise-level legal tech solution to a leading law firm." },
  { year: "2022", title: "Team Expansion", description: "Grew our team to include specialists in AI, automation, and cloud technologies." },
  { year: "2023", title: "100+ Projects", description: "Celebrated the milestone of completing over 100 successful projects." },
  { year: "2024", title: "AI Innovation", description: "Launched our proprietary AI automation platform for legal and business workflows." },
  { year: "2025", title: "Global Reach", description: "Expanded services to clients across multiple countries and industries." },
];

const About = () => {
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
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Empowering Businesses Through{" "}
                <span className="gradient-text">Technology</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                DiTech Solutions & Services is a technology company dedicated to helping businesses thrive in the digital age. We combine expertise in AI, automation, and software development to deliver solutions that drive real results.
              </p>
              <Button asChild size="lg" className="gradient-bg rounded-xl">
                <Link to="/contact">
                  Work With Us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img
                src={aboutTeamWorkspace}
                alt="DiTech team collaborating in modern office"
                className="rounded-2xl shadow-2xl w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story with image */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={aboutStrategy}
                alt="DiTech strategy and planning session"
                className="rounded-2xl shadow-lg w-full object-cover"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our <span className="gradient-text">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, DiTech Solutions & Services began with a simple belief: that every business, 
                  regardless of size, deserves access to powerful, intelligent technology solutions.
                </p>
                <p>
                  What started as a small consultancy serving local law firms quickly evolved into a full-service 
                  technology partner. Our breakthrough came when we built a comprehensive case management system 
                  that transformed how a major law firm handled over 5,000 active cases—reducing drafting time 
                  by 65% and eliminating missed deadlines entirely.
                </p>
                <p>
                  Today, we serve clients across legal, retail, and enterprise sectors, combining AI, workflow 
                  automation, and custom development to create solutions that deliver measurable impact. Our 
                  government-registered company is built on transparency, expertise, and a relentless focus 
                  on client success.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card border-border">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-6">
                    <Target className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To empower businesses of all sizes with innovative technology solutions that streamline operations, enhance productivity, and drive sustainable growth. We believe that the right technology, implemented thoughtfully, can transform any organization.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full bg-card border-border">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-6">
                    <Eye className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the trusted technology partner for businesses seeking to leverage AI and automation for competitive advantage. We envision a future where every organization has access to powerful, intelligent tools that make work more efficient and impactful.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              The talented people behind DiTech's innovative solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30 bg-card overflow-hidden">
                  {/* Photo */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                  </div>

                  <CardContent className="p-5 -mt-8 relative z-10">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-primary mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover bg-card border-border text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Key milestones in our growth and evolution
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />

            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center gap-8 mb-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full gradient-bg md:-translate-x-1.5 z-10" />

                {/* Content */}
                <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                      <h3 className="text-xl font-semibold text-foreground mt-1 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why Work With Us?
              </h2>
              <p className="text-secondary-foreground/80 mb-8 text-lg">
                We're more than just a technology provider – we're your partners in digital transformation.
              </p>
              <ul className="space-y-4">
                {[
                  "Deep expertise across multiple industries",
                  "Proven track record of successful projects",
                  "Dedicated support and ongoing maintenance",
                  "Transparent communication and pricing",
                  "Cutting-edge AI and automation solutions",
                  "Agile methodology for faster delivery",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-white">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <Card className="p-6 bg-white/10 border-white/20 text-center">
                <div className="text-4xl font-bold text-accent mb-2">5+</div>
                <div className="text-white/80">Years Experience</div>
              </Card>
              <Card className="p-6 bg-white/10 border-white/20 text-center">
                <div className="text-4xl font-bold text-accent mb-2">150+</div>
                <div className="text-white/80">Projects Completed</div>
              </Card>
              <Card className="p-6 bg-white/10 border-white/20 text-center">
                <div className="text-4xl font-bold text-accent mb-2">50+</div>
                <div className="text-white/80">Happy Clients</div>
              </Card>
              <Card className="p-6 bg-white/10 border-white/20 text-center">
                <div className="text-4xl font-bold text-accent mb-2">99%</div>
                <div className="text-white/80">Client Satisfaction</div>
              </Card>
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
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help transform your business with our technology solutions.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-xl text-lg bg-white text-primary hover:bg-white/90"
            >
              <Link to="/contact">
                Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
