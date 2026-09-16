import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/currency";
import { ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import type { OrderStatus } from "@/types/checkout";

type OrderRow = {
  id: string;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string | null;
  total: number;
  status: string;
  created_at: string;
};

type ItemRow = {
  id: string;
  order_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
};

const statuses: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusStyle: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700",
  paid: "bg-emerald-500/10 text-emerald-700",
  processing: "bg-blue-500/10 text-blue-700",
  shipped: "bg-indigo-500/10 text-indigo-700",
  delivered: "bg-green-500/10 text-green-700",
  cancelled: "bg-red-500/10 text-red-700",
};

const OrdersAdmin = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: orderData, error }, { data: itemData }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("order_items").select("id,order_id,product_name,unit_price,quantity"),
    ]);
    setLoading(false);
    if (error) {
      toast({ title: "Could not load orders", description: error.message, variant: "destructive" });
      return;
    }
    setOrders((orderData ?? []) as OrderRow[]);
    setItems((itemData ?? []) as ItemRow[]);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (order: OrderRow, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
  };

  const revenue = orders
    .filter((o) => !["cancelled", "pending"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Orders</h2>
        <p className="text-sm text-muted-foreground">
          Every order placed from the shop, newest first.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Orders", value: String(orders.length) },
          { label: "Awaiting action", value: String(orders.filter((o) => o.status === "pending").length) },
          { label: "Delivered", value: String(orders.filter((o) => o.status === "delivered").length) },
          { label: "Confirmed value", value: formatPrice(revenue) },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-display font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <ClipboardList className="h-8 w-8 mx-auto mb-3 opacity-40" aria-hidden="true" />
              No orders yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Placed</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const orderItems = items.filter((i) => i.order_id === order.id);
                  const open = expanded === order.id;
                  return (
                    <>
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.reference}</TableCell>
                        <TableCell className="font-medium">{order.customer_name}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          <div>{order.customer_email}</div>
                          <div className="text-muted-foreground">{order.customer_phone}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          <select
                            aria-label={`Status for order ${order.reference}`}
                            value={order.status}
                            onChange={(e) => setStatus(order, e.target.value)}
                            className={`rounded-full px-3 py-1 text-xs border border-input bg-background ${
                              statusStyle[order.status] ?? ""
                            }`}
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell whitespace-nowrap text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpanded(open ? null : order.id)}
                            aria-expanded={open}
                          >
                            {orderItems.length}
                            {open ? (
                              <ChevronUp className="h-4 w-4 ml-1" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" aria-hidden="true" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {open && (
                        <TableRow key={`${order.id}-details`}>
                          <TableCell colSpan={7} className="bg-muted/40">
                            <ul className="space-y-1 text-sm">
                              {orderItems.map((i) => (
                                <li key={i.id} className="flex justify-between gap-4">
                                  <span>
                                    {i.quantity} × {i.product_name}
                                  </span>
                                  <span>{formatPrice(i.unit_price * i.quantity)}</span>
                                </li>
                              ))}
                            </ul>
                            {order.notes && (
                              <p className="mt-3 text-sm">
                                <Badge variant="outline" className="mr-2">
                                  Note
                                </Badge>
                                {order.notes}
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersAdmin;
