import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Laptop, Headphones, Mouse, Monitor, Keyboard, Smartphone } from "lucide-react";

const products = [
  {
    id: 1,
    name: "ThinkPad X1 Carbon Gen 11",
    category: "Laptops",
    price: 1899,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    icon: Laptop,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Dell XPS 15 (2024)",
    category: "Laptops",
    price: 1699,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
    icon: Laptop,
    badge: null,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "Accessories",
    price: 349,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    icon: Headphones,
    badge: "Top Rated",
  },
  {
    id: 4,
    name: "Logitech MX Master 3S",
    category: "Accessories",
    price: 99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    icon: Mouse,
    badge: null,
  },
  {
    id: 5,
    name: '27" 4K Monitor - LG UltraFine',
    category: "Monitors",
    price: 699,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
    icon: Monitor,
    badge: null,
  },
  {
    id: 6,
    name: "Keychron Q1 Pro",
    category: "Accessories",
    price: 199,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
    icon: Keyboard,
    badge: "New",
  },
  {
    id: 7,
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    price: 1199,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    icon: Smartphone,
    badge: null,
  },
  {
    id: 8,
    name: "MacBook Pro 14 M3",
    category: "Laptops",
    price: 2499,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    icon: Laptop,
    badge: "Premium",
  },
];

const Shop = () => {
  return (
    <section id="shop" className="py-24 bg-surface/50 relative">
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Tech <span className="gradient-text">Shop</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium laptops, gadgets, and accessories curated for professionals
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {["All", "Laptops", "Monitors", "Smartphones", "Accessories"].map((cat) => (
            <Button
              key={cat}
              variant={cat === "All" ? "default" : "outline"}
              size="sm"
              className={cat === "All" ? "gradient-bg text-primary-foreground" : ""}
            >
              {cat}
            </Button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card overflow-hidden">
                {/* Product Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 gradient-bg text-primary-foreground">
                      {product.badge}
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="font-display text-base mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold">
                      ${product.price.toLocaleString()}
                    </span>
                    <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button size="lg" variant="outline" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            Browse All Products
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Shop;
