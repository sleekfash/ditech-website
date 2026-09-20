import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { productImage, productSrcSet, PRODUCT_MARQUEE_SIZES } from "@/lib/productImage";
import { shopHref } from "@/config/nav";

const ShopTeaser = () => {
  const { products: featuredProducts } = useFeaturedProducts();

  // Duplicate list for seamless marquee loop
  const items = [...featuredProducts, ...featuredProducts];

  if (featuredProducts.length === 0) return null;

  return (
    <section
      aria-label="Featured hardware"
      className="relative py-20 md:py-24 overflow-hidden border-y border-border/60 bg-[hsl(var(--surface))]"
    >
      <div className="container-custom mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-xl">
          <span className="kicker">The Shop</span>
          <h2 className="serif text-3xl md:text-4xl lg:text-5xl mt-3 mb-4 brass-rule">
            Hand-picked hardware for considered work.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            A curated selection of laptops, displays and studio accessories — now folded into our Services experience.
          </p>
        </div>
        <Link
          to={shopHref}
          className="inline-flex items-center gap-2 text-[hsl(var(--sea))] hover:text-[hsl(var(--ink))] transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Browse the shop
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>

      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)",
        }}
      >
        <div className="flex w-max marquee gap-6">
          {items.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              to={shopHref}
              className="w-[280px] sm:w-[320px] shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card border border-border">
                <img
                  src={productImage(p.image, 320)}
                  srcSet={productSrcSet(p.image, [240, 320, 480, 640])}
                  sizes={PRODUCT_MARQUEE_SIZES}
                  alt={p.name}
                  width={320}
                  height={240}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {p.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/85 backdrop-blur text-[10px] tracking-[0.18em] uppercase font-medium text-foreground">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between gap-3 mt-4">
                <div>
                  <div className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-1">
                    {p.category}
                  </div>
                  <div className="serif text-lg text-foreground leading-tight">
                    {p.name}
                  </div>
                </div>
                <div className="serif text-lg text-[hsl(var(--sea))] whitespace-nowrap">
                  {formatPrice(p.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopTeaser;
