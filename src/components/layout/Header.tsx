import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { primaryNav } from "@/config/nav";
import { site } from "@/config/site";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // D2: Lock body scroll while mobile menu is open.
  useEffect(() => {
    if (isMobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "glass-strong shadow-[0_10px_40px_-25px_hsl(var(--ink)/0.35)]" : "bg-transparent"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] transition-transform group-hover:rotate-[8deg]">
                <Anchor className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="serif font-medium text-xl text-foreground tracking-tight">
                {site.brand.name}
                <span className="text-[hsl(var(--brass))]">.</span>
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
              {primaryNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute left-4 right-4 -bottom-0.5 h-[1px] bg-[hsl(var(--brass))]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <Button
                asChild
                className="rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(var(--sea))] transition-colors ring-1 ring-transparent hover:ring-[hsl(var(--brass))]"
              >
                <Link to="/contact">Start a project</Link>
              </Button>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-50 min-h-11 min-w-11"
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-16 md:top-20 bottom-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/85 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile primary"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="absolute top-4 left-4 right-4 glass rounded-3xl p-6 shadow-xl"
            >
              <div className="flex flex-col gap-1">
                {primaryNav.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <Link
                        to={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`serif block px-4 py-3 rounded-xl text-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isActive ? "text-[hsl(var(--sea))]" : "text-foreground hover:text-[hsl(var(--sea))]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="pt-4 mt-2 border-t border-border">
                  <Button
                    asChild
                    className="w-full rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(var(--sea))]"
                  >
                    <Link to="/contact">Start a project</Link>
                  </Button>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
