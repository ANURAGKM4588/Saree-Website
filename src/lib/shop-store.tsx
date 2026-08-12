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

const PRODUCTS_KEY = "kadha_admin_products_v2";
const ORDERS_KEY = "kadha_admin_orders_v1";
const NOTIFY_KEY = "kadha_admin_notify_v1";

const initialProducts: ExtendedSaree[] = defaultSarees.map((saree, idx) => {
  let status: ProductStatus = "in_stock";
  let stockQty = 1;
  let cartAdds = Math.floor(Math.random() * 20) + 5;

  if (
    saree.slug === "mustard-kanchi-cotton" ||
    saree.slug === "kumkum-chettinad-cotton" ||
    saree.slug === "sungudi-cotton-brown" ||
    saree.slug === "sungudi-cotton-red" ||
    saree.slug === "sapphire-chanderi-silk" ||
    saree.slug === "plum-kanchi-tissue-zari"
  ) {
    status = "out_of_stock";
    stockQty = 0;
    cartAdds += 15;
  } else if (
    saree.slug === "olive-ikat-handloom" ||
    saree.slug === "rainbow-check-cotton" ||
    saree.slug === "sungudi-cotton-orange" ||
    saree.slug === "sungudi-cotton-yellow" ||
    saree.slug === "emerald-banarasi-tussar" ||
    saree.slug === "ruby-banarasi-brocade"
  ) {
    status = "coming_soon";
    stockQty = 0;
    cartAdds += 8;
  }

  return {
    ...saree,
    status,
    stockQty,
    cartAddsCount: cartAdds,
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

export function ShopStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ExtendedSaree[]>(() => {
    if (typeof window === "undefined") return initialProducts;
    try {
      const raw = localStorage.getItem(PRODUCTS_KEY);
      return raw ? JSON.parse(raw) : initialProducts;
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

  const updateProductStatus = useCallback((slug: string, status: ProductStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, status, stockQty: status === "in_stock" ? Math.max(1, p.stockQty) : 0 } : p))
    );
  }, []);

  const addProduct = useCallback((newProduct: Omit<ExtendedSaree, "cartAddsCount"> & { cartAddsCount?: number }) => {
    setProducts((prev) => [
      {
        ...newProduct,
        cartAddsCount: newProduct.cartAddsCount ?? 0,
        publishedAt: newProduct.publishedAt || new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
  }, []);

  const updateProduct = useCallback((slug: string, fields: Partial<ExtendedSaree>) => {
    setProducts((prev) => prev.map((p) => (p.slug === slug ? { ...p, ...fields } : p)));
  }, []);

  const deleteProduct = useCallback((slug: string) => {
    setProducts((prev) => prev.filter((p) => p.slug !== slug));
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
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
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
      return newReq;
    },
    []
  );

  const updateNotifyStatus = useCallback((reqId: string, status: NotifyRequestStatus) => {
    setNotifyRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status } : r)));
  }, []);

  const deleteNotifyRequest = useCallback((reqId: string) => {
    setNotifyRequests((prev) => prev.filter((r) => r.id !== reqId));
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
