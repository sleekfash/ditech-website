import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isNight = resolvedTheme === "dark";
  const label = isNight ? "Switch to day mode" : "Switch to night mode";

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => setTheme(isNight ? "light" : "dark")}
      className="min-h-11 gap-2 rounded-full px-3"
      aria-label={label}
      aria-pressed={isNight}
      title={label}
    >
      {isNight ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
      <span className="text-xs font-medium">{isNight ? "Night" : "Day"}</span>
    </Button>
  );
}
