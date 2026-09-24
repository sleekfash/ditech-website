import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { productsQueryKey } from "@/hooks/useProducts";
import { productImage } from "@/lib/productImage";
import { productCategories } from "@/config/products";
import { formatPrice } from "@/lib/currency";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Package } from "lucide-react";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number;
  original_price: number | null;
  rating: number;
  reviews: number;
  image_url: string;
  badge: string | null;
  in_stock: boolean;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

const emptyForm = {
  name: "",
  slug: "",
  category: "Accessories",
  description: "",
  price: "0",
  original_price: "",
  rating: "5",
  reviews: "0",
  image_url: "",
  badge: "",
  in_stock: true,
  featured: false,
  published: true,
};

type FormState = typeof emptyForm;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

const ProductsAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    setLoading(false);
    if (error) {
      toast({ title: "Could not load products", description: error.message, variant: "destructive" });
      return;
    }
    setRows((data ?? []) as ProductRow[]);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshShop = () => queryClient.invalidateQueries({ queryKey: productsQueryKey });

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row: ProductRow) => {
    setEditing(row);
    setForm({
      name: row.name,
      slug: row.slug,
      category: row.category,
      description: row.description ?? "",
      price: String(row.price),
      original_price: row.original_price == null ? "" : String(row.original_price),
      rating: String(row.rating),
      reviews: String(row.reviews),
      image_url: row.image_url,
      badge: row.badge ?? "",
      in_stock: row.in_stock,
      featured: row.featured,
      published: row.published,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    const payload = {
      name: form.name.trim(),
      slug: (form.slug.trim() || slugify(form.name)) as string,
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price) || 0,
      original_price: form.original_price.trim() === "" ? null : Number(form.original_price),
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      image_url: form.image_url.trim(),
      badge: form.badge.trim() === "" ? null : form.badge.trim(),
      in_stock: form.in_stock,
      featured: form.featured,
      published: form.published,
    };

    setSaving(true);
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase
          .from("products")
          .insert({ ...payload, sort_order: (rows[rows.length - 1]?.sort_order ?? 0) + 1 });
    setSaving(false);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editing ? "Product updated" : "Product added" });
    setOpen(false);
    await load();
    refreshShop();
  };

  const remove = async (row: ProductRow) => {
    if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", row.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product deleted" });
    await load();
    refreshShop();
  };

  const togglePublished = async (row: ProductRow) => {
    const { error } = await supabase
      .from("products")
      .update({ published: !row.published })
      .eq("id", row.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    await load();
    refreshShop();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const a = rows[index];
    const b = rows[target];
    await supabase.from("products").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("products").update({ sort_order: a.sort_order }).eq("id", b.id);
    await load();
    refreshShop();
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold">Products</h2>
          <p className="text-sm text-muted-foreground">
            Edits appear on the shop and homepage immediately.
          </p>
        </div>
        <Button className="gradient-bg" onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          New Product
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: rows.length },
          { label: "Published", value: rows.filter((r) => r.published).length },
          { label: "Featured", value: rows.filter((r) => r.featured).length },
          { label: "Out of stock", value: rows.filter((r) => !r.in_stock).length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-display font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading products…</div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <Package className="h-8 w-8 mx-auto mb-3 opacity-40" aria-hidden="true" />
              No products yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {row.image_url ? (
                        <img
                          src={productImage(row.image_url, 80)}
                          alt=""
                          width={48}
                          height={48}
                          loading="lazy"
                          decoding="async"
                          className="h-12 w-12 rounded object-cover bg-muted"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-[220px]">
                      <span className="block truncate">{row.name}</span>
                      {row.featured && (
                        <Badge variant="secondary" className="mt-1 text-[10px]">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{row.category}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatPrice(row.price)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={row.published ? "default" : "outline"}>
                          {row.published ? "Published" : "Hidden"}
                        </Badge>
                        {!row.in_stock && <Badge variant="secondary">Out of stock</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Move ${row.name} up`}
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                      >
                        <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Move ${row.name} down`}
                        disabled={i === rows.length - 1}
                        onClick={() => move(i, 1)}
                      >
                        <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`${row.published ? "Hide" : "Publish"} ${row.name}`}
                        onClick={() => togglePublished(row)}
                      >
                        <Package className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${row.name}`}
                        onClick={() => openEdit(row)}
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${row.name}`}
                        onClick={() => remove(row)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update this catalogue item." : "Add an item to the shop catalogue."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-name">Name</Label>
                <Input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => {
                    if (!form.slug.trim()) set("slug", slugify(form.name));
                  }}
                  placeholder='MacBook Pro 16" M3 Max'
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-slug">Slug</Label>
                <Input
                  id="p-slug"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="macbook-pro-16-m3-max"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-category">Category</Label>
                <select
                  id="p-category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {productCategories
                    .filter((c) => c !== "All")
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-badge">Badge (optional)</Label>
                <Input
                  id="p-badge"
                  value={form.badge}
                  onChange={(e) => set("badge", e.target.value)}
                  placeholder="Best Seller"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-description">Description</Label>
              <Textarea
                id="p-description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="What it is, standout specs, who it suits. Orcka uses this when recommending products."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-price">Price (₦)</Label>
                <Input
                  id="p-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-original">Was price (optional)</Label>
                <Input
                  id="p-original"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.original_price}
                  onChange={(e) => set("original_price", e.target.value)}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-rating">Rating (0-5)</Label>
                <Input
                  id="p-rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => set("rating", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-reviews">Number of reviews</Label>
                <Input
                  id="p-reviews"
                  type="number"
                  min="0"
                  value={form.reviews}
                  onChange={(e) => set("reviews", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-image">Image URL</Label>
              <Input
                id="p-image"
                value={form.image_url}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder="https://…"
              />
              {form.image_url && (
                <img
                  src={productImage(form.image_url, 320)}
                  alt=""
                  className="mt-2 h-32 w-full max-w-xs rounded-lg object-cover bg-muted"
                />
              )}
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch id="p-stock" checked={form.in_stock} onCheckedChange={(v) => set("in_stock", v)} />
                <Label htmlFor="p-stock">In stock</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="p-featured" checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
                <Label htmlFor="p-featured">Featured on homepage</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="p-published"
                  checked={form.published}
                  onCheckedChange={(v) => set("published", v)}
                />
                <Label htmlFor="p-published">Published</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-bg" onClick={save} disabled={saving}>
                {saving ? "Saving…" : editing ? "Save changes" : "Add product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsAdmin;
