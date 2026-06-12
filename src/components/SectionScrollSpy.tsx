import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

interface SectionScrollSpyProps {
  sections: Section[];
  className?: string;
}

const SectionScrollSpy = ({ sections, className }: SectionScrollSpyProps) => {
  const active = useScrollSpy(sections.map((s) => s.id));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        "sticky top-16 md:top-20 z-30 -mx-4 px-4 py-2 bg-background/85 backdrop-blur-md border-b border-border/60",
        className
      )}
    >
      <ul className="container-custom flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="flex-shrink-0">
              <a
                href={`#${s.id}`}
                onClick={(e) => handleClick(e, s.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SectionScrollSpy;
