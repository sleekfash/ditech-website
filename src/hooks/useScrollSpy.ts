import { useEffect, useState } from "react";

/**
 * Observe a list of section IDs and return the ID currently in view.
 * Uses IntersectionObserver with a top-rooted margin so the active
 * section flips when it crosses the top portion of the viewport.
 */
export function useScrollSpy(ids: string[], rootMargin = "-40% 0px -55% 0px"): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join("|"), rootMargin]);

  return active;
}
