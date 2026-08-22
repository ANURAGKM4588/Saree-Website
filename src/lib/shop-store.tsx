import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { sarees as defaultSarees, type Saree } from "@/data/sarees";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type ProductStatus = "in_stock" | "out_of_stock" | "coming_soon";

export type ExtendedSaree = Saree & {
  status: ProductStatus;
  cartAddsCount: number;
  stockQty: number;
  publishedAt?: string;
};

export type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

export type OrderItem = {
  slug: string;
  name: string;
  qty: number;
  price: number;
  image: string;
  blouseOption?: "with" | "without";
};


export type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: OrderStatus;
  paymentId?: string;
  paymentStatus?: "Paid" | "Pending" | "Failed";
};

export type NotifyRequestType = "out_of_stock" | "coming_soon";
export type NotifyRequestStatus = "Pending" | "Notified";

export type NotifyRequest = {
  id: string;
  sareeSlug: string;
  sareeName: string;
  customerEmail: string;
  customerPhone?: string;
  type: NotifyRequestType;
  date: string;
  status: NotifyRequestStatus;
};

type ShopStoreContextType = {
  products: ExtendedSaree[];
  orders: Order[];
  notifyRequests: NotifyRequest[];
  updateProductStatus: (slug: string, status: ProductStatus) => void;
  addProduct: (product: Omit<ExtendedSaree, "cartAddsCount"> & { cartAddsCount?: number }) => void;
  updateProduct: (slug: string, fields: Partial<ExtendedSaree>) => void;
  deleteProduct: (slug: string) => void;
  incrementCartAdds: (slug: string, qty?: number) => void;
  createOrder: (orderData: Omit<Order, "id" | "date" | "status">) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createNotifyRequest: (reqData: Omit<NotifyRequest, "id" | "date" | "status">) => NotifyRequest;
  updateNotifyStatus: (reqId: string, status: NotifyRequestStatus) => void;
  deleteNotifyRequest: (reqId: string) => void;
  resetStore: () => void;
};

const PRODUCTS_KEY = "kadha_admin_products_v10";
const ORDERS_KEY = "kadha_admin_orders_v2";
const NOTIFY_KEY = "kadha_admin_notify_v2";

const initialProducts: ExtendedSaree[] = defaultSarees.map((s) => ({
  ...s,
  status: "in_stock",
  cartAddsCount: 0,
  stockQty: 1,
}));

const initialOrders: Order[] = [];

const initialNotifyRequests: NotifyRequest[] = [];

const ShopStoreContext = createContext<ShopStoreContextType | null>(null);

function sanitizeProducts(prods: ExtendedSaree[]): ExtendedSaree[] {
  if (!Array.isArray(prods)) return initialProducts;
  return prods.map((p) => {
    const cleanImage = p.image || "/logo/Favicon.png";
    const updatedViews =
      Array.isArray(p.views) && p.views.length > 0
        ? p.views
        : [{ url: cleanImage, label: "Cover Page Image" }];

    return {
      ...p,
      image: cleanImage,
      views: updatedViews,
    };
  });
}




function sanitizeOrders(dbOrders: any[]): Order[] {
  if (!Array.isArray(dbOrders) || dbOrders.length === 0) return initialOrders;
  return dbOrders.map((o) => {
    let itemsParsed = [];
    if (Array.isArray(o.items)) {
      itemsParsed = o.items;
    } else if (typeof o.items === "string") {
      try {
        itemsParsed = JSON.parse(o.items);
      } catch {
        itemsParsed = [];
      }
    }
    return {
      id: o.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: o.customer_name || o.customerName || "Customer",
      email: o.email || "",
      phone: o.phone || "",
      address: o.address || "",
      notes: o.notes || undefined,
      items: itemsParsed,
      total: Number(o.total) || 0,
      date: o.date ? String(o.date) : new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      status: (o.status as OrderStatus) || "Pending",
      paymentId: o.payment_id || o.paymentId || undefined,
      paymentStatus: o.payment_status || o.paymentStatus || undefined,
    };
  });
}

export function ShopStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ExtendedSaree[]>(() => {
    if (typeof window === "undefined") return initialProducts;
    try {
      for (let i = 25; i >= 1; i--) {
        const raw = localStorage.getItem(`kadha_admin_products_v${i}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return sanitizeProducts(parsed);
          }
        }
      }
    } catch {}
    return initialProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === "undefined") return initialOrders;
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const parsed = raw ? JSON.parse(raw) : initialOrders;
      return sanitizeOrders(parsed);
    } catch {
      return initialOrders;
    }
  });

  const [notifyRequests, setNotifyRequests] = useState<NotifyRequest[]>(() => {
    if (typeof window === "undefined") return initialNotifyRequests;
    try {
      const raw = localStorage.getItem(NOTIFY_KEY);
      return raw ? JSON.parse(raw) : initialNotifyRequests;
    } catch {
      return initialNotifyRequests;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFY_KEY, JSON.stringify(notifyRequests));
    } catch {}
  }, [notifyRequests]);

  // Sync from Supabase on mount if keys are configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function syncSupabaseData() {
      try {
        const { data: dbProducts } = await supabase.from("products").select("*");
        if (dbProducts && dbProducts.length > 0) {
          setProducts(sanitizeProducts(dbProducts));
        }
        const { data: dbOrders } = await supabase.from("orders").select("*");
        if (dbOrders && dbOrders.length > 0) {
          setOrders(sanitizeOrders(dbOrders));
        }
        const { data: dbNotify } = await supabase.from("notify_requests").select("*");
        if (dbNotify && dbNotify.length > 0) {
          setNotifyRequests(dbNotify);
        }
      } catch (err) {
        console.warn("Supabase sync warning:", err);
      }
    }

    syncSupabaseData();
  }, []);

  const updateProductStatus = useCallback((slug: string, status: ProductStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, status, stockQty: status === "in_stock" ? Math.max(1, p.stockQty) : 0 } : p))
    );
    if (isSupabaseConfigured) {
      supabase.from("products").update({ status, stock_qty: status === "in_stock" ? 1 : 0 }).eq("slug", slug).then();
    }
  }, []);

  const addProduct = useCallback((newProduct: Omit<ExtendedSaree, "cartAddsCount"> & { cartAddsCount?: number }) => {
    const item: ExtendedSaree = {
      ...newProduct,
      cartAddsCount: newProduct.cartAddsCount ?? 0,
      publishedAt: newProduct.publishedAt || new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [item, ...prev]);
    if (isSupabaseConfigured) {
      supabase.from("products").upsert({
        slug: item.slug,
        name: item.name,
        weave: item.weave,
        colour: item.colour,
        price: item.price,
        status: item.status,
        stock_qty: item.stockQty,
        image: item.image,
        views: item.views,
        blurb: item.blurb,
        fabric: item.fabric,
        blouse: item.blouse,
        care: item.care,
        cart_adds_count: item.cartAddsCount,
        published_at: item.publishedAt,
      }).then();
    }
  }, []);

  const updateProduct = useCallback((slug: string, fields: Partial<ExtendedSaree>) => {
    setProducts((prev) => prev.map((p) => (p.slug === slug ? { ...p, ...fields } : p)));
    if (isSupabaseConfigured) {
      supabase.from("products").update(fields).eq("slug", slug).then();
    }
  }, []);

  const deleteProduct = useCallback((slug: string) => {
    setProducts((prev) => prev.filter((p) => p.slug !== slug));
    if (isSupabaseConfigured) {
      supabase.from("products").delete().eq("slug", slug).then();
    }
  }, []);

  const incrementCartAdds = useCallback((slug: string, qty = 1) => {
    setProducts((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, cartAddsCount: p.cartAddsCount + qty } : p))
    );
  }, []);

  const createOrder = useCallback((orderData: Partial<Order> & Omit<Order, "id" | "date">): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      status: orderData.status || "Pending",
    };
    setOrders((prev) => [newOrder, ...prev]);
    if (isSupabaseConfigured) {
      supabase
        .from("orders")
        .insert({
          id: newOrder.id,
          customer_name: newOrder.customerName,
          phone: newOrder.phone,
          email: newOrder.email,
          address: newOrder.address,
          notes: newOrder.notes,
          items: newOrder.items,
          total: newOrder.total,
          status: newOrder.status,
          date: newOrder.date,
          payment_id: newOrder.paymentId,
          payment_status: newOrder.paymentStatus,
        })
        .then(({ error }) => {
          if (error) console.warn("Supabase order insert warning:", error.message);
        });
    }
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    if (isSupabaseConfigured) {
      supabase.from("orders").update({ status }).eq("id", orderId).then();
    }
  }, []);

  const createNotifyRequest = useCallback(
    (reqData: Omit<NotifyRequest, "id" | "date" | "status">): NotifyRequest => {
      const newReq: NotifyRequest = {
        ...reqData,
        id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        status: "Pending",
      };
      setNotifyRequests((prev) => [newReq, ...prev]);
      if (isSupabaseConfigured) {
        supabase.from("notify_requests").insert({
          id: newReq.id,
          saree_name: newReq.sareeName,
          saree_slug: newReq.sareeSlug,
          phone: newReq.phone,
          status: newReq.status,
          requested_at: newReq.date,
        }).then();
      }
      return newReq;
    },
    []
  );

  const updateNotifyStatus = useCallback((reqId: string, status: NotifyRequestStatus) => {
    setNotifyRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status } : r)));
    if (isSupabaseConfigured) {
      supabase.from("notify_requests").update({ status }).eq("id", reqId).then();
    }
  }, []);

  const deleteNotifyRequest = useCallback((reqId: string) => {
    setNotifyRequests((prev) => prev.filter((r) => r.id !== reqId));
    if (isSupabaseConfigured) {
      supabase.from("notify_requests").delete().eq("id", reqId).then();
    }
  }, []);

  const resetStore = useCallback(() => {
    setProducts([]);
    setOrders([]);
    setNotifyRequests([]);
    for (let i = 1; i <= 10; i++) {
      localStorage.removeItem(`kadha_admin_products_v${i}`);
    }
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(ORDERS_KEY);
    localStorage.removeItem(NOTIFY_KEY);
    if (isSupabaseConfigured) {
      supabase.from("products").delete().neq("slug", "").then();
    }
  }, []);

  const value = useMemo(
    () => ({
      products,
      orders,
      notifyRequests,
      updateProductStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      incrementCartAdds,
      createOrder,
      updateOrderStatus,
      createNotifyRequest,
      updateNotifyStatus,
      deleteNotifyRequest,
      resetStore,
    }),
    [
      products,
      orders,
      notifyRequests,
      updateProductStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      incrementCartAdds,
      createOrder,
      updateOrderStatus,
      createNotifyRequest,
      updateNotifyStatus,
      deleteNotifyRequest,
      resetStore,
    ]
  );

  return <ShopStoreContext.Provider value={value}>{children}</ShopStoreContext.Provider>;
}

export function useShopStore() {
  const ctx = useContext(ShopStoreContext);
  if (!ctx) throw new Error("useShopStore must be used within ShopStoreProvider");
  return ctx;
}
