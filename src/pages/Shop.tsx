import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Filter, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";

const categories = ["All", "Laptops", "Monitors", "Accessories", "Smartphones", "Networking"];

const products = [
  {
    id: 1,
    name: "MacBook Pro 16\" M3 Max",
    category: "Laptops",
    price: 3499,
    originalPrice: 3999,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: 2,
    name: "Dell XPS 15 (2024)",
    category: "Laptops",
    price: 1899,
    originalPrice: 2199,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop",
    badge: "New",
    inStock: true,
  },
  {
    id: 3,
    name: "LG UltraWide 34\" Curved Monitor",
    category: "Monitors",
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
    badge: "Sale",
    inStock: true,
  },
  {
    id: 4,
    name: "Apple Studio Display",
    category: "Monitors",
    price: 1599,
    originalPrice: null,
    rating: 4.6,
    reviews: 72,
    image: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400&h=300&fit=crop",
    badge: null,
    inStock: true,
  },
  {
    id: 5,
    name: "Logitech MX Master 3S",
    category: "Accessories",
    price: 99,
    originalPrice: 129,
    rating: 4.9,
    reviews: 512,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    badge: "Popular",
    inStock: true,
  },
  {
    id: 6,
    name: "Apple Magic Keyboard",
    category: "Accessories",
    price: 199,
    originalPrice: null,
    rating: 4.5,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
    badge: null,
    inStock: true,
  },
  {
    id: 7,
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    price: 1199,
    originalPrice: null,
    rating: 4.8,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    badge: "Hot",
    inStock: true,
  },
  {
    id: 8,
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartphones",
    price: 1299,
    originalPrice: 1399,
    rating: 4.7,
    reviews: 445,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
    badge: "Sale",
    inStock: true,
  },
  {
    id: 9,
    name: "Ubiquiti UniFi Dream Router",
    category: "Networking",
    price: 199,
    originalPrice: null,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop",
    badge: null,
    inStock: false,
  },
  {
    id: 10,
    name: "AirPods Pro (2nd Gen)",
    category: "Accessories",
    price: 249,
    originalPrice: 279,
    rating: 4.8,
    reviews: 1024,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: 11,
    name: "ThinkPad X1 Carbon Gen 11",
    category: "Laptops",
    price: 1649,
    originalPrice: 1899,
    rating: 4.7,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
    badge: "Sale",
    inStock: true,
  },
  {
    id: 12,
    name: "Dell 27\" 4K USB-C Hub Monitor",
    category: "Monitors",
    price: 549,
    originalPrice: 699,
    rating: 4.5,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=400&h=300&fit=crop",
    badge: null,
    inStock: true,
  },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <ShoppingCart className="h-4 w-4" />
              Tech Shop
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Premium Tech{" "}
              <span className="gradient-text">Hardware</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Quality laptops, monitors, accessories, and gadgets for professionals
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full card-hover overflow-hidden bg-card border-border group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <Badge
                          className={`${
                            product.badge === "Sale"
                              ? "bg-destructive"
                              : product.badge === "New"
                              ? "bg-accent text-accent-foreground"
                              : "bg-primary"
                          }`}
                        >
                          {product.badge}
                        </Badge>
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-card/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-card">
                      <Heart className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                    </button>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="secondary" className="text-lg">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4 gradient-bg rounded-lg"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need Bulk Orders or Custom Solutions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contact us for enterprise pricing, bulk discounts, and customized hardware solutions.
            </p>
            <Button asChild className="gradient-bg rounded-xl">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
