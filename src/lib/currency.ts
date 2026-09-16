import { site } from "@/config/site";

/**
 * Single place that turns a numeric amount into a displayed price.
 * Change currency/locale in src/config/site.ts to rebrand a deployment.
 */
export function formatPrice(amount: number | null | undefined): string {
  const value = Number(amount ?? 0);
  try {
    return new Intl.NumberFormat(site.commerce.locale, {
      style: "currency",
      currency: site.commerce.currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  } catch {
    return `${site.commerce.currencySymbol}${value.toLocaleString()}`;
  }
}
