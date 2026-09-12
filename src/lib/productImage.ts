/**
 * Product image sizing helpers.
 *
 * Catalog photos are served from a remote image CDN (Unsplash today) that
 * accepts width/quality/format query params. Cards render at ~300-400 CSS px,
 * so requesting the stored 800x600 original on every device wastes bandwidth,
 * especially on phones. These helpers request a correctly sized variant and
 * expose a srcSet so the browser can pick the cheapest one.
 */

const RESIZABLE_HOSTS = ["images.unsplash.com"];

function isResizable(url: string): boolean {
  try {
    return RESIZABLE_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Request a single variant of `url` at `width` CSS px (dpr-aware via srcSet). */
export function productImage(url: string, width: number): string {
  if (!url || !isResizable(url)) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(width));
    u.searchParams.delete("h"); // keep natural aspect; CSS crops via object-cover
    u.searchParams.set("fit", "crop");
    u.searchParams.set("auto", "format");
    u.searchParams.set("q", "70");
    return u.toString();
  } catch {
    return url;
  }
}

/** Comma-separated srcSet across the widths the grid actually uses. */
export function productSrcSet(url: string, widths: number[] = [240, 320, 480, 640, 800]): string | undefined {
  if (!url || !isResizable(url)) return undefined;
  return widths.map((w) => `${productImage(url, w)} ${w}w`).join(", ");
}

/** Grid card sizes: 1 col on phones, 2 on tablets, 3-4 on desktop. */
export const PRODUCT_GRID_SIZES = "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw";

/** Homepage marquee cards are a fixed 280-320px wide. */
export const PRODUCT_MARQUEE_SIZES = "320px";
