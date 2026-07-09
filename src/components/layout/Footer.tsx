import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, Facebook, Anchor } from "lucide-react";
import { site } from "@/config/site";
import { primaryNav, shopHref } from "@/config/nav";

const socialIcons = [
  { Icon: Linkedin, label: "LinkedIn", href: site.socials.linkedin },
  { Icon: Twitter, label: "Twitter", href: site.socials.twitter },
  { Icon: Github, label: "GitHub", href: site.socials.github },
  { Icon: Facebook, label: "Facebook", href: site.socials.facebook },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[hsl(var(--ink))] text-[hsl(var(--background))] relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-40 pointer-events-none" />
      <div className="container-custom section-padding relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-[hsl(var(--background))] text-[hsl(var(--ink))]">
                <Anchor className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="serif text-2xl">
                {site.brand.name}
                <span className="text-[hsl(var(--brass))]">.</span>
              </span>
            </Link>
            <p className="serif text-2xl md:text-3xl leading-[1.2] max-w-md text-[hsl(var(--background))]/90">
              {site.brand.tagline}
            </p>
            <p className="text-[hsl(var(--background))]/60 max-w-md leading-relaxed">
              {site.brand.description}
            </p>
            <div className="flex gap-3 pt-2">
              {socialIcons.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2.5 rounded-full border border-[hsl(var(--background))]/15 hover:border-[hsl(var(--brass))] hover:text-[hsl(var(--brass))] transition-colors"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div className="lg:col-span-3">
            <h3 className="kicker text-[hsl(var(--brass))] mb-6">Navigate</h3>
            <ul className="space-y-3">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-[hsl(var(--background))]/75 hover:text-[hsl(var(--background))] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={shopHref} className="text-[hsl(var(--background))]/75 hover:text-[hsl(var(--background))] transition-colors">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="kicker text-[hsl(var(--brass))] mb-6">Contact</h3>
            <ul className="space-y-4 text-[hsl(var(--background))]/75">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[hsl(var(--brass))] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${site.contact.email}`} className="hover:text-[hsl(var(--background))] transition-colors break-all">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[hsl(var(--brass))] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="hover:text-[hsl(var(--background))] transition-colors">
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[hsl(var(--brass))] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>
                  {site.contact.address.line1}
                  <br />
                  {site.contact.address.line2}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[hsl(var(--background))]/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-[hsl(var(--background))]/60 text-sm">
              {site.legal.copyright(year)}
            </p>
            <div className="flex gap-6 text-sm text-[hsl(var(--background))]/60">
              <Link to={site.legal.privacyHref} className="hover:text-[hsl(var(--background))] transition-colors">Privacy</Link>
              <Link to={site.legal.termsHref} className="hover:text-[hsl(var(--background))] transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
