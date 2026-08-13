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

const PRODUCTS_KEY = "kadha_admin_products_v4";
const ORDERS_KEY = "kadha_admin_orders_v1";
const NOTIFY_KEY = "kadha_admin_notify_v1";

const initialProducts: ExtendedSaree[] = defaultSarees.map((saree, idx) => {
  return {
    ...saree,
    status: "in_stock" as ProductStatus,
    stockQty: 1,
    cartAddsCount: Math.floor(Math.random() * 20) + 5,
    publishedAt: new Date(Date.now() - (idx + 1) * 86400000 * 3).toISOString().split("T")[0],
  };
});

const initialOrders: Order[] = [
  {
    id: "ORD-8492",
    customerName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    address: "Flat 402, Lotus Towers, Indiranagar, Bengaluru, KA 560038",
    notes: "Please pack in silk wrapping gift box.",
    items: [
      {
        slug: "turmeric-zari-brocade",
        name: "Turmeric Zari Brocade",
        qty: 1,
        price: 6200,
        image: "/Product/turmeric-zari-brocade.png",
      },
      {
        slug: "coffee-peacock-chettinad",
        name: "Coffee Peacock Chettinad",
        qty: 1,
        price: 5200,
        image: "/Product/coffee-peacock-chettinad.png",
      },
    ],
    total: 11400,
    date: new Date(Date.now() - 3600000 * 4).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    status: "Pending",
  },
  {
    id: "ORD-8491",
    customerName: "Ananya Roy",
    email: "ananya.roy@example.com",
    phone: "+91 91234 56789",
    address: "12/A Park Street, Flat 3B, Kolkata, WB 700016",
    notes: "Call before dispatch.",
    items: [
      {
        slug: "amber-peacock-silk-cotton",
        name: "Amber Peacock Silk Cotton",
        qty: 1,
        price: 5600,
        image: "/Product/amber-peacock-silk-cotton.png",
      },
    ],
    total: 5600,
    date: new Date(Date.now() - 3600000 * 22).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    status: "Processing",
  },
  {
    id: "ORD-8490",
    customerName: "Lakshmi Narayanan",
    email: "lakshmi.n@example.com",
    phone: "+91 99887 76655",
    address: "45 Anna Nagar 2nd Main Road, Chennai, TN 600040",
    items: [
      {
        slug: "ivory-ikat-handloom",
        name: "Ivory Ikat Handloom",
        qty: 1,
        price: 2900,
        image: "/Product/ivory-ikat-handloom.png",
      },
      {
        slug: "amber-peacock-silk-cotton",
        name: "Amber Peacock Silk Cotton",
        qty: 1,
        price: 5600,
        image: "/Product/amber-peacock-silk-cotton.png",
      },
    ],
    total: 8500,
    date: new Date(Date.now() - 86400000 * 2).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    status: "Completed",
  },
  {
    id: "ORD-8489",
    customerName: "Meera Iyer",
    email: "meera.iyer@example.com",
    phone: "+91 94455 12345",
    address: "78 Jubilee Hills, Road No 10, Hyderabad, TS 500033",
    items: [
      {
        slug: "coffee-peacock-chettinad",
        name: "Coffee Peacock Chettinad",
        qty: 1,
        price: 5200,
        image: "/Product/coffee-peacock-chettinad.png",
      },
    ],
    total: 5200,
    date: new Date(Date.now() - 86400000 * 3).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    status: "Completed",
  },
  {
    id: "ORD-8488",
    customerName: "Radhika Gupta",
    email: "radhika.g@example.com",
    phone: "+91 97112 33445",
    address: "B-401 Golf Links Apartments, New Delhi, DL 110003",
    notes: "Urgent wedding order",
    items: [
      {
        slug: "turmeric-zari-brocade",
        name: "Turmeric Zari Brocade",
        qty: 2,
        price: 6200,
        image: "/Product/turmeric-zari-brocade.png",
      },
      {
        slug: "sunrise-stripe-cotton",
        name: "Sunrise Stripe Cotton",
        qty: 1,
        price: 2200,
        image: "/Product/sunrise-stripe-cotton.png",
      },
    ],
    total: 14600,
    date: new Date(Date.now() - 86400000 * 4).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    status: "Pending",
  },
];

const initialNotifyRequests: NotifyRequest[] = [
  {
    id: "REQ-101",
    sareeSlug: "mustard-kanchi-cotton",
    sareeName: "Mustard Kanchi Cotton",
    customerEmail: "swati.mishra@example.com",
    customerPhone: "+91 98111 22233",
    type: "out_of_stock",
    date: new Date(Date.now() - 3600000 * 5).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    status: "Pending",
  },
  {
    id: "REQ-102",
    sareeSlug: "kumkum-chettinad-cotton",
    sareeName: "Kumkum Chettinad Cotton",
    customerEmail: "deepa.varma@example.com",
    customerPhone: "+91 91234 99887",
    type: "out_of_stock",
    date: new Date(Date.now() - 3600000 * 18).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    status: "Pending",
  },
  {
    id: "REQ-103",
    sareeSlug: "olive-ikat-handloom",
    sareeName: "Olive Ikat Handloom",
    customerEmail: "kavita.mahesh@example.com",
    customerPhone: "+91 99881 12233",
    type: "coming_soon",
    date: new Date(Date.now() - 86400000 * 1.5).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    status: "Pending",
  },
  {
    id: "REQ-104",
    sareeSlug: "rainbow-check-cotton",
    sareeName: "Rainbow Check Cotton",
    customerEmail: "pooja.designer@example.com",
    customerPhone: "+91 97654 11223",
    type: "coming_soon",
    date: new Date(Date.now() - 86400000 * 3).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    status: "Notified",
  },
  {
    id: "REQ-105",
    sareeSlug: "mustard-kanchi-cotton",
    sareeName: "Mustard Kanchi Cotton",
    customerEmail: "sunita.rao@example.com",
    customerPhone: "+91 94433 22110",
    type: "out_of_stock",
    date: new Date(Date.now() - 86400000 * 4).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    status: "Notified",
  },
];

const ShopStoreContext = createContext<ShopStoreContextType | null>(null);

function sanitizeProducts(prods: ExtendedSaree[]): ExtendedSaree[] {
  if (!Array.isArray(prods) || prods.length === 0) return initialProducts;
  return prods.map((p) => {
    let cleanImage = p.image;
    // If image is missing or an old uncompressed giant base64 (> 100KB string length), sanitize to default asset
    if (!cleanImage || (typeof cleanImage === "string" && cleanImage.length > 100000)) {
      cleanImage = "/Product/turmeric-zari-brocade.png";
    }
    return {
      ...p,
      image: cleanImage,
    };
  });
}

export function ShopStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ExtendedSaree[]>(() => {
    if (typeof window === "undefined") return initialProducts;
    try {
      const raw = localStorage.getItem(PRODUCTS_KEY);
      const parsed = raw ? JSON.parse(raw) : initialProducts;
      return sanitizeProducts(parsed);
    } catch {
      return initialProducts;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === "undefined") return initialOrders;
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      return raw ? JSON.parse(raw) : initialOrders;
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
          setOrders(dbOrders);
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

  const createOrder = useCallback((orderData: Omit<Order, "id" | "date" | "status">): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      status: "Pending",
    };
    setOrders((prev) => [newOrder, ...prev]);
    if (isSupabaseConfigured) {
      supabase.from("orders").insert({
        id: newOrder.id,
        customer_name: newOrder.customerName,
        phone: newOrder.phone,
        address: newOrder.address,
        items: newOrder.items,
        total: newOrder.total,
        status: newOrder.status,
        date: newOrder.date,
      }).then();
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
    setProducts(initialProducts);
    setOrders(initialOrders);
    setNotifyRequests(initialNotifyRequests);
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(ORDERS_KEY);
    localStorage.removeItem(NOTIFY_KEY);
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
