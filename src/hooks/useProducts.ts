import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products as seedProducts } from "@/config/products";

export type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  image: string;
  badge: string | null;
  inStock: boolean;
  featured: boolean;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number | string;
  original_price: number | string | null;
  rating: number | string;
  reviews: number;
  image_url: string;
  badge: string | null;
  in_stock: boolean;
  featured: boolean;
};

const num = (v: number | string | null | undefined): number => (v == null ? 0 : Number(v));

function mapRow(row: ProductRow): ShopProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    description: row.description ?? "",
    price: num(row.price),
    originalPrice: row.original_price == null ? null : num(row.original_price),
    rating: num(row.rating),
    reviews: row.reviews ?? 0,
    image: row.image_url,
    badge: row.badge,
    inStock: row.in_stock,
    featured: row.featured,
  };
}

/**
 * Offline / error fallback so the shop never renders empty. Mirrors the
 * catalogue that seeded the database.
 */
const fallbackProducts: ShopProduct[] = seedProducts.map((p) => ({
  id: String(p.id),
  name: p.name,
  slug: String(p.id),
  category: p.category,
  description: "",
  price: p.price,
  originalPrice: p.originalPrice ?? null,
  rating: p.rating,
  reviews: p.reviews,
  image: p.image,
  badge: p.badge ?? null,
  inStock: p.inStock,
  featured: Boolean(p.featured),
}));

export const productsQueryKey = ["products", "published"] as const;

export async function fetchPublishedProducts(): Promise<ShopProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,category,description,price,original_price,rating,reviews,image_url,badge,in_stock,featured"
    )
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as ProductRow[]).map(mapRow);
}

/**
 * Published catalogue, fetched once and cached across pages and back-navigation.
 * Filtering/search then happens in memory — no refetch per keystroke.
 */
export function useProducts() {
  const query = useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchPublishedProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    products: query.data ?? (query.isError ? fallbackProducts : []),
  };
}

export function useFeaturedProducts() {
  const { products, ...rest } = useProducts();
  return { ...rest, products: products.filter((p) => p.featured) };
}
