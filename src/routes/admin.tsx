import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  useShopStore,
  type ProductStatus,
  type OrderStatus,
  type NotifyRequestStatus,
  type ExtendedSaree,
  type Order,
} from "@/lib/shop-store";
import { formatPrice, weaves } from "@/data/sarees";
import {
  DollarSign,
  ShoppingCart,
  Package,
  BellRing,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Mail,
  Phone,
  Eye,
  Trash2,
  Edit3,
  SlidersHorizontal,
  ChevronRight,
  Send,
  Layers,
  ArrowUpRight,
  AlertCircle,
  Image as ImageIcon,
  UploadCloud,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Kadha Atelier" },
      {
        name: "description",
        content: "Kadha Atelier Store Admin Panel — Products, Orders, Stock Alerts & Analytics.",
      },
    ],
  }),
  component: AdminPanel,
});

type TabType = "overview" | "orders" | "products" | "notify" | "cart_analytics";

const PRESET_IMAGES = [
  { url: "/Product/turmeric-zari-brocade.png", label: "Turmeric Zari" },
  { url: "/Product/amber-peacock-silk-cotton.png", label: "Amber Peacock" },
  { url: "/Product/coffee-peacock-chettinad.png", label: "Coffee Chettinad" },
  { url: "/Product/ivory-ikat-handloom.png", label: "Ivory Ikat" },
  { url: "/Product/kumkum-chettinad-cotton.png", label: "Kumkum Cotton" },
  { url: "/Product/mustard-kanchi-cotton.png", label: "Mustard Kanchi" },
  { url: "/Product/olive-ikat-handloom.png", label: "Olive Ikat" },
  { url: "/Product/rainbow-check-cotton.png", label: "Rainbow Check" },
  { url: "/Product/sunrise-stripe-cotton.png", label: "Sunrise Stripe" },
  { url: "/Product/Sungudi cotton red.png", label: "Sungudi Red" },
  { url: "/Product/Sungudi cotton orange.png", label: "Sungudi Orange" },
  { url: "/Product/Sungudi cotton yellow.png", label: "Sungudi Yellow" },
  { url: "/Product/Sungudi cotton brown.png", label: "Sungudi Brown" },
];

export function AdminPanel() {
  const {
    products,
    orders,
    notifyRequests,
    updateProductStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateNotifyStatus,
    deleteNotifyRequest,
    resetStore,
  } = useShopStore();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters state
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [notifyFilter, setNotifyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ExtendedSaree | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Lock background page scroll when order details modal is open
  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedOrder]);

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
  const processingOrdersCount = orders.filter((o) => o.status === "Processing").length;
  const completedOrdersCount = orders.filter((o) => o.status === "Completed").length;

  const totalProductsCount = products.length;
  const inStockProductsCount = products.filter((p) => p.status === "in_stock").length;
  const outOfStockProductsCount = products.filter((p) => p.status === "out_of_stock").length;
  const comingSoonProductsCount = products.filter((p) => p.status === "coming_soon").length;

  const totalCartAddsCount = products.reduce((sum, p) => sum + p.cartAddsCount, 0);

  const totalNotifyRequests = notifyRequests.length;
  const pendingNotifyRequests = notifyRequests.filter((r) => r.status === "Pending").length;
  const outOfStockRequestsCount = notifyRequests.filter((r) => r.type === "out_of_stock").length;
  const comingSoonRequestsCount = notifyRequests.filter((r) => r.type === "coming_soon").length;

  // Chart Data Preparation
  const chartStockData = [
    { name: "In Stock", value: inStockProductsCount, color: "#047857" },
    { name: "Out of Stock", value: outOfStockProductsCount, color: "#dc2626" },
    { name: "Coming Soon", value: comingSoonProductsCount, color: "#d97706" },
  ];

  const topCartProductsData = [...products]
    .sort((a, b) => b.cartAddsCount - a.cartAddsCount)
    .slice(0, 5)
    .map((p) => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
      cartAdds: p.cartAddsCount,
      price: p.price,
    }));

  // Filtered Lists
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === "all" || o.status.toLowerCase() === orderFilter.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredProducts = products.filter((p) => {
    const matchesFilter = productFilter === "all" || p.status === productFilter;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.weave.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredNotifyRequests = notifyRequests.filter((r) => {
    const matchesFilter =
      notifyFilter === "all" ||
      r.status.toLowerCase() === notifyFilter.toLowerCase() ||
      r.type === notifyFilter;
    const matchesSearch =
      !searchQuery ||
      r.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sareeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-16 font-sans text-foreground">
      {/* Top Header Banner */}
      <div className="bg-brand-soft text-primary-foreground py-10 px-5 lg:px-8 border-b border-gold/20">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold gold-frame">
                  <Sparkles className="h-3 w-3" /> Kadha Studio Admin
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                  ● Live Data
                </span>
              </div>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl text-primary-foreground">
                E-Commerce Management Center
              </h1>
              <p className="mt-1 text-xs text-primary-foreground/75">
                Monitor sales revenue, manage order bookings, restock alerts & product catalog.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary-foreground/20 whitespace-nowrap"
              >
                ← Back to Store
              </Link>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("products");
                  setShowAddProductModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-soft transition-colors hover:bg-gold-soft shadow-md cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-4 w-4" /> Add New Product
              </button>
              <button
                type="button"
                onClick={() => {
                  resetStore();
                  showToast("Store data reset to default demo state!");
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary-foreground/20 cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1400px] px-5 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-border pb-3 no-scrollbar">
          {[
            { id: "overview", label: "Dashboard Overview", icon: Layers, badge: null },
            { id: "orders", label: "Orders", icon: ShoppingCart, badge: pendingOrdersCount },
            { id: "products", label: "Products & Stock", icon: Package, badge: totalProductsCount },
            { id: "notify", label: "Restock & Coming Soon Requests", icon: BellRing, badge: pendingNotifyRequests },
            { id: "cart_analytics", label: "Cart Activity", icon: TrendingUp, badge: totalCartAddsCount },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-brand text-primary-foreground shadow-md"
                    : "border border-border text-muted-foreground hover:border-gold hover:text-brand bg-card"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.badge !== null && (
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive ? "bg-gold text-brand-soft" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TOP KPI METRICS CARDS */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Revenue */}
          <div className="glass-card rounded-3xl p-5 border border-gold/30 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gold">Total Revenue</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-brand-soft tabular-nums">
              {formatPrice(totalRevenue)}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Confirmed Orders</span>
              <span className="font-semibold text-emerald-600">Avg {formatPrice(totalOrdersCount ? Math.round(totalRevenue / totalOrdersCount) : 0)}</span>
            </div>
          </div>

          {/* Orders */}
          <div className="glass-card rounded-3xl p-5 border border-gold/30 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gold">Bookings</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-foreground tabular-nums">
              {totalOrdersCount} <span className="text-xs font-normal text-muted-foreground">Orders</span>
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-700">
                {pendingOrdersCount} Pending
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-700">
                {completedOrdersCount} Done
              </span>
            </div>
          </div>

          {/* Published Products */}
          <div className="glass-card rounded-3xl p-5 border border-gold/30 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gold">Published Products</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-foreground tabular-nums">
              {totalProductsCount} <span className="text-xs font-normal text-muted-foreground">Sarees</span>
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium">
              <span className="text-emerald-600">{inStockProductsCount} In Stock</span> ·{" "}
              <span className="text-destructive">{outOfStockProductsCount} Out</span> ·{" "}
              <span className="text-amber-600">{comingSoonProductsCount} Soon</span>
            </div>
          </div>

          {/* Cart Added Count */}
          <div className="glass-card rounded-3xl p-5 border border-gold/30 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gold">Total Cart Adds</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-foreground tabular-nums">
              {totalCartAddsCount} <span className="text-xs font-normal text-muted-foreground">Times</span>
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">High customer interest items</p>
          </div>

          {/* Restock & Coming Soon Requests */}
          <div className="glass-card rounded-3xl p-5 border border-gold/30 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gold">Notify Requests</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                <BellRing className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-foreground tabular-nums">
              {totalNotifyRequests} <span className="text-xs font-normal text-muted-foreground">Alerts</span>
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              <span className="font-semibold text-blue-600">{pendingNotifyRequests} Pending</span>
              <span className="text-muted-foreground font-normal">({outOfStockRequestsCount} Restock, {comingSoonRequestsCount} Launch)</span>
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Stock Breakdown Chart */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-display text-lg text-brand-soft">Stock Status Distribution</h3>
                    <p className="text-xs text-muted-foreground">Catalog products breakdown</p>
                  </div>
                  <Package className="h-5 w-5 text-gold" />
                </div>
                <div className="mt-4 w-full h-56">
                  <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180} debounce={50}>
                    <PieChart>
                      <Pie
                        data={chartStockData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {chartStockData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Sarees`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs font-medium pt-2">
                  <span className="flex items-center gap-1 text-emerald-700">● In Stock ({inStockProductsCount})</span>
                  <span className="flex items-center gap-1 text-destructive">● Out of Stock ({outOfStockProductsCount})</span>
                  <span className="flex items-center gap-1 text-amber-700">● Coming Soon ({comingSoonProductsCount})</span>
                </div>
              </div>

              {/* Top Cart Added Sarees Chart */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-display text-lg text-brand-soft">Most Added to Bag</h3>
                    <p className="text-xs text-muted-foreground">Top Sarees added to user shopping bags</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-gold" />
                </div>
                <div className="mt-4 w-full h-64">
                  <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200} debounce={50}>
                    <BarChart data={topCartProductsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val) => [`${val} Cart Adds`, "Count"]} />
                      <Bar dataKey="cartAdds" fill="var(--brand)" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Management Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-display text-xl text-brand-soft">Recent Orders</h3>
                    <p className="text-xs text-muted-foreground">Latest saree booking requests</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
                  >
                    View All Orders <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-4 divide-y divide-border">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">{order.id}</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              order.status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : order.status === "Processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} item(s) · {order.date}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-display text-base font-semibold tabular-nums text-brand-soft">
                          {formatPrice(order.total)}
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="mt-1 text-[11px] text-muted-foreground hover:text-brand underline cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Notify Requests */}
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-display text-xl text-brand-soft">Out of Stock & Launch Alerts</h3>
                    <p className="text-xs text-muted-foreground">Customer notification requests</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("notify")}
                    className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
                  >
                    View All ({pendingNotifyRequests} pending) <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-4 divide-y divide-border">
                  {notifyRequests.slice(0, 4).map((req) => (
                    <div key={req.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
                              req.type === "out_of_stock"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {req.type === "out_of_stock" ? "Restock Request" : "Coming Soon"}
                          </span>
                          <span
                            className={`text-[10px] font-medium ${
                              req.status === "Notified" ? "text-emerald-600" : "text-amber-600"
                            }`}
                          >
                            ● {req.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-foreground truncate">{req.sareeName}</p>
                        <p className="text-xs text-muted-foreground truncate">{req.customerEmail}</p>
                      </div>

                      {req.status === "Pending" ? (
                        <button
                          type="button"
                          onClick={() => {
                            updateNotifyStatus(req.id, "Notified");
                            showToast(`Marked notification request for ${req.customerEmail} as Notified!`);
                          }}
                          className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-brand-soft cursor-pointer"
                        >
                          Mark Notified
                        </button>
                      ) : (
                        <span className="shrink-0 text-xs text-emerald-600 font-medium">✓ Notified</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Filter:</span>
                {["all", "pending", "processing", "completed", "cancelled"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderFilter(st)}
                    className={`rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] cursor-pointer ${
                      orderFilter === st
                        ? "bg-brand text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search order ID or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-1.5 text-xs outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xs">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                        No orders match the current filter or search query.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-xs text-foreground">{order.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.email}</p>
                          <p className="text-xs text-muted-foreground">{order.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-foreground">{order.items.length} saree(s)</span>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {order.items.map((i) => i.name).join(", ")}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-display font-semibold text-brand-soft tabular-nums">
                          {formatPrice(order.total)}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">{order.date}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              updateOrderStatus(order.id, e.target.value as OrderStatus);
                              showToast(`Order ${order.id} status updated to ${e.target.value}!`);
                            }}
                            className={`rounded-full px-3 py-1 text-xs font-semibold outline-none cursor-pointer ${
                              order.status === "Pending"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : order.status === "Processing"
                                ? "bg-blue-100 text-blue-900 border border-blue-300"
                                : order.status === "Completed"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : "bg-red-100 text-red-900 border border-red-300"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-gold hover:text-brand cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & STOCK MANAGEMENT */}
        {activeTab === "products" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Status:</span>
                {[
                  { id: "all", label: `All (${totalProductsCount})` },
                  { id: "in_stock", label: `In Stock (${inStockProductsCount})` },
                  { id: "out_of_stock", label: `Out of Stock (${outOfStockProductsCount})` },
                  { id: "coming_soon", label: `Coming Soon (${comingSoonProductsCount})` },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setProductFilter(st.id)}
                    className={`rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] cursor-pointer ${
                      productFilter === st.id
                        ? "bg-brand text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-1.5 text-xs outline-none focus:border-gold"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(true)}
                  className="rounded-full bg-gold px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-soft hover:bg-gold-soft flex items-center gap-1.5 cursor-pointer shadow-md transition-transform active:scale-95 font-bold"
                >
                  <Plus className="h-4 w-4" /> + Add Saree Product
                </button>
              </div>
            </div>

            {/* Products Grid / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.slug}
                  className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-xs hover:border-gold/50 transition-all"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-secondary">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      <span className="absolute left-3 top-3 glass-panel rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-soft">
                        {p.weave}
                      </span>
                      {p.status === "out_of_stock" && (
                        <span className="absolute right-3 top-3 rounded-full bg-destructive/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-destructive-foreground">
                          Out of Stock
                        </span>
                      )}
                      {p.status === "coming_soon" && (
                        <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-soft gold-frame">
                          Coming Soon
                        </span>
                      )}
                      {p.status === "in_stock" && (
                        <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                          In Stock
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-brand-soft">{p.name}</h3>
                        <span className="font-display text-base font-semibold tabular-nums">{formatPrice(p.price)}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.blurb}</p>

                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                        <span className="inline-flex items-center gap-1 font-medium text-foreground">
                          <ShoppingCart className="h-3.5 w-3.5 text-purple-600" /> {p.cartAddsCount} Cart Adds
                        </span>
                        <span>Published: {p.publishedAt || "Active"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Status Selector & Action buttons */}
                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Status:</span>
                      <select
                        value={p.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as ProductStatus;
                          updateProductStatus(p.slug, newStatus);
                          showToast(`Updated "${p.name}" status to ${newStatus.replace("_", " ")}!`);
                        }}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold outline-none focus:border-gold cursor-pointer"
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="coming_soon">Coming Soon</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        to="/shop/$slug"
                        params={{ slug: p.slug }}
                        target="_blank"
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-brand"
                        title="View product on site"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(p)}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-brand cursor-pointer"
                        title="Edit Product Details"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteProduct(p.slug);
                          showToast(`Product "${p.name}" deleted.`);
                        }}
                        className="rounded-full p-2 text-muted-foreground hover:bg-red-50 hover:text-destructive cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESTOCK & COMING SOON NOTIFY REQUESTS */}
        {activeTab === "notify" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Filter:</span>
                {[
                  { id: "all", label: `All (${totalNotifyRequests})` },
                  { id: "pending", label: `Pending (${pendingNotifyRequests})` },
                  { id: "notified", label: "Notified" },
                  { id: "out_of_stock", label: `Restock Alerts (${outOfStockRequestsCount})` },
                  { id: "coming_soon", label: `Launch Alerts (${comingSoonRequestsCount})` },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setNotifyFilter(st.id)}
                    className={`rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] cursor-pointer ${
                      notifyFilter === st.id
                        ? "bg-brand text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search email or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-1.5 text-xs outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Notify Requests List Table */}
            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xs">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Request ID</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Request Type</th>
                    <th className="px-6 py-4">Customer Contact</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredNotifyRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                        No notification requests found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredNotifyRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-xs text-foreground">{req.id}</td>
                        <td className="px-6 py-4 font-medium text-brand-soft">{req.sareeName}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                              req.type === "out_of_stock"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {req.type === "out_of_stock" ? "Out of Stock Restock" : "Coming Soon Launch"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {req.customerEmail}
                          </div>
                          {req.customerPhone && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {req.customerPhone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">{req.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              req.status === "Notified"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {req.status === "Notified" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {req.status === "Pending" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  updateNotifyStatus(req.id, "Notified");
                                  showToast(`Restock alert email simulated & sent to ${req.customerEmail}!`);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-brand-soft cursor-pointer shadow-xs"
                              >
                                <Send className="h-3 w-3" /> Send Alert & Mark
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => updateNotifyStatus(req.id, "Pending")}
                                className="text-xs text-muted-foreground hover:text-brand underline cursor-pointer"
                              >
                                Reset to Pending
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                deleteNotifyRequest(req.id);
                                showToast(`Deleted request ${req.id}`);
                              }}
                              className="rounded-full p-1.5 text-muted-foreground hover:bg-red-50 hover:text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CART ANALYTICS */}
        {activeTab === "cart_analytics" && (
          <div className="mt-8 space-y-8">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="font-display text-2xl text-brand-soft">Cart Addition Metrics</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Detailed metrics of sarees added to customer carts, indicating high buying intent.
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Saree Name</th>
                      <th className="px-6 py-4">Weave</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock Status</th>
                      <th className="px-6 py-4">Total Cart Additions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[...products]
                      .sort((a, b) => b.cartAddsCount - a.cartAddsCount)
                      .map((p) => (
                        <tr key={p.slug} className="hover:bg-muted/30">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover bg-secondary" />
                            <span className="font-medium text-foreground">{p.name}</span>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-gold">{p.weave}</td>
                          <td className="px-6 py-4 font-display font-semibold tabular-nums">{formatPrice(p.price)}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                                p.status === "in_stock"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : p.status === "out_of_stock"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {p.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-brand-soft tabular-nums">
                            {p.cartAddsCount} times
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD NEW PRODUCT */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onAddProduct={(productData) => {
          addProduct(productData);
          setActiveTab("products");
        }}
        onShowToast={showToast}
        existingSlugs={products.map((p) => p.slug)}
      />

      {/* MODAL: EDIT PRODUCT */}
      <EditProductModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onUpdateProduct={(slug, fields) => {
          updateProduct(slug, fields);
          showToast(`Updated product details.`);
        }}
        onShowToast={showToast}
      />

      {/* MODAL: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-gold/30 bg-background p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-gold">{selectedOrder.id}</span>
                <h3 className="font-display text-2xl text-brand-soft">Order Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div className="rounded-xl bg-cream p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Customer Info</p>
                <p className="mt-1 font-medium text-foreground">{selectedOrder.customerName}</p>
                <p className="text-xs text-muted-foreground">{selectedOrder.email} · {selectedOrder.phone}</p>
                <p className="mt-2 text-xs text-muted-foreground"><strong>Address:</strong> {selectedOrder.address}</p>
                {selectedOrder.notes && (
                  <p className="mt-1 text-xs italic text-brand-soft"><strong>Notes:</strong> "{selectedOrder.notes}"</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">Ordered Sarees</p>
                <ul className="space-y-2 divide-y divide-border">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover bg-secondary" />
                        <div>
                          <p className="font-medium text-xs text-foreground">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <span className="font-display text-sm font-semibold tabular-nums">{formatPrice(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 text-base font-bold">
                <span>Total Amount:</span>
                <span className="font-display text-xl text-brand-soft tabular-nums">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 flex justify-end border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full bg-brand px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground hover:bg-brand-soft cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-brand px-5 py-3 text-xs font-semibold text-primary-foreground shadow-2xl gold-frame animate-in slide-in-from-bottom-4">
          ✓ {toastMessage}
        </div>
      )}
    </div>
  );
}

// FAST OFFSCREEN CANVAS IMAGE COMPRESSOR (Prevents large base64 browser freezes)
function compressImageFile(file: File, maxWidth = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// MINIMAL & MODERN ADD PRODUCT POPUP MODAL (LANDSCAPE WHITE THEME)
function AddProductModal({
  isOpen,
  onClose,
  onAddProduct,
  onShowToast,
  existingSlugs,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productData: Omit<ExtendedSaree, "cartAddsCount">) => void;
  onShowToast: (msg: string) => void;
  existingSlugs: string[];
}) {
  const [name, setName] = useState("");
  const [weave, setWeave] = useState("Kanjivaram");
  const [colour, setColour] = useState("Gold");
  const [price, setPrice] = useState<number | "">(4500);
  const [status, setStatus] = useState<ProductStatus>("in_stock");
  const [image, setImage] = useState("/Product/turmeric-zari-brocade.png");
  const [blurb, setBlurb] = useState("Handcrafted masterpiece woven with rich heritage craftsmanship.");
  const [fabric, setFabric] = useState("Handwoven pure silk cotton");
  const [blouse, setBlouse] = useState("0.8m unstitched blouse piece included");
  const [care, setCare] = useState("Dry clean recommended for first wash.");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Reset form whenever modal opens & lock background page scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setName("");
      setWeave("Kanjivaram");
      setColour("Gold");
      setPrice(4500);
      setStatus("in_stock");
      setImage("/Product/turmeric-zari-brocade.png");
      setBlurb("Handcrafted masterpiece woven with rich heritage craftsmanship.");
      setFabric("Handwoven pure silk cotton");
      setBlouse("0.8m unstitched blouse piece included");
      setCare("Dry clean recommended for first wash.");
      setErrorMessage(null);
      setIsCompressing(false);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedUrl = await compressImageFile(file, 800, 0.75);
      setImage(compressedUrl);
    } catch (err) {
      console.error("Compression failed:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter a valid saree product name.");
      return;
    }

    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setErrorMessage("Please enter a valid price greater than ₹0.");
      return;
    }

    let slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || `saree-${Date.now()}`;

    if (existingSlugs.includes(slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const imageUrl = image.trim() || "/Product/turmeric-zari-brocade.png";

    onAddProduct({
      slug,
      name: name.trim(),
      weave,
      colour: colour.trim() || "Gold",
      price: numPrice,
      status,
      stockQty: status === "in_stock" ? 1 : 0,
      image: imageUrl,
      views: [
        { url: imageUrl, label: "Full drape" },
        { url: imageUrl, label: "On the model" },
        { url: imageUrl, label: "Weave detail" },
      ],
      blurb: blurb.trim() || "Handcrafted saree.",
      fabric: fabric.trim() || "Handwoven silk cotton",
      blouse: blouse.trim() || "Blouse piece included",
      care: care.trim() || "Dry clean recommended for first wash.",
    });

    onShowToast(`Saree "${name.trim()}" published to catalog!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-gold/40 bg-white text-slate-900 p-6 sm:p-8 shadow-2xl font-sans">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/20 text-gold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">Studio Catalog</p>
              <h2 className="font-display text-2xl font-semibold text-brand-soft">Add New Saree Product</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: IMAGE UPLOAD & PREVIEW (LANDSCAPE STYLE) */}
          <div className="md:col-span-5 space-y-4 bg-cream/30 p-5 rounded-2xl border border-gold/20">
            <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-700 font-semibold">
              Product Photo Upload *
            </label>

            {/* Photo Preview Box (Landscape style) */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-gold/40 bg-white shadow-xs group">
              <img src={image} alt="Preview" className="h-full w-full object-cover" />
              <span className="absolute top-2 right-2 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-brand-soft shadow-xs">
                Live Drape Preview
              </span>
            </div>

            {/* Upload Button */}
            <div>
              <label className="w-full rounded-2xl border-2 border-dashed border-gold/50 bg-white hover:bg-gold/10 p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs group">
                <UploadCloud className="h-6 w-6 text-gold group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-800">
                  {isCompressing ? "Processing Photo..." : "Upload High-Res Photo"}
                </span>
                <span className="text-[10px] text-slate-500">PNG, JPG, WebP from computer</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-1">Custom Image URL</label>
              <input
                type="text"
                placeholder="e.g. /Product/saree.png or https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-gold text-slate-800"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS FORM FIELDS */}
          <div className="md:col-span-7 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                Saree Title / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Emerald Kanjivaram Brocade"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-gold font-medium"
              />
            </div>

            {/* Stock Status & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                  Stock Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gold cursor-pointer font-medium"
                >
                  <option value="in_stock">In Stock (Live on Store)</option>
                  <option value="out_of_stock">Out of Stock (Request Alert)</option>
                  <option value="coming_soon">Coming Soon (Priority Booking)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                  Price (INR ₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gold font-medium"
                />
              </div>
            </div>

            {/* Weave & Colour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                  Weave Type
                </label>
                <select
                  value={weave}
                  onChange={(e) => setWeave(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gold cursor-pointer font-medium"
                >
                  {weaves.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                  Primary Colour
                </label>
                <input
                  type="text"
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gold font-medium"
                />
              </div>
            </div>

            {/* Story Blurb */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                Short Story / Craft Blurb
              </label>
              <textarea
                rows={3}
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                placeholder="Handcrafted masterpiece woven with rich heritage craftsmanship..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-gold font-medium resize-none"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-5 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-brand px-8 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-brand-soft shadow-md cursor-pointer transition-transform active:scale-95 font-bold"
              >
                Publish Saree Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// MINIMAL & MODERN EDIT PRODUCT POPUP MODAL (LANDSCAPE WHITE THEME)
function EditProductModal({
  product,
  onClose,
  onUpdateProduct,
  onShowToast,
}: {
  product: ExtendedSaree | null;
  onClose: () => void;
  onUpdateProduct: (slug: string, fields: Partial<ExtendedSaree>) => void;
  onShowToast: (msg: string) => void;
}) {
  const [name, setName] = useState("");
  const [weave, setWeave] = useState("Kanjivaram");
  const [colour, setColour] = useState("Gold");
  const [price, setPrice] = useState<number | "">(4500);
  const [status, setStatus] = useState<ProductStatus>("in_stock");
  const [image, setImage] = useState("");
  const [blurb, setBlurb] = useState("");
  const [fabric, setFabric] = useState("");
  const [blouse, setBlouse] = useState("");
  const [care, setCare] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      setName(product.name);
      setWeave(product.weave);
      setColour(product.colour);
      setPrice(product.price);
      setStatus(product.status);
      setImage(product.image);
      setBlurb(product.blurb);
      setFabric(product.fabric);
      setBlouse(product.blouse);
      setCare(product.care);
      setErrorMessage(null);
      setIsCompressing(false);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedUrl = await compressImageFile(file, 800, 0.75);
      setImage(compressedUrl);
    } catch (err) {
      console.error("Compression failed:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter a valid saree name.");
      return;
    }

    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setErrorMessage("Please enter a valid price greater than ₹0.");
      return;
    }

    const imageUrl = image.trim() || product.image;

    onUpdateProduct(product.slug, {
      name: name.trim(),
      weave,
      colour: colour.trim(),
      price: numPrice,
      status,
      stockQty: status === "in_stock" ? 1 : 0,
      image: imageUrl,
      views: [
        { url: imageUrl, label: "Full drape" },
        { url: imageUrl, label: "On the model" },
        { url: imageUrl, label: "Weave detail" },
      ],
      blurb: blurb.trim(),
      fabric: fabric.trim(),
      blouse: blouse.trim(),
      care: care.trim(),
    });

    onShowToast(`Product "${name.trim()}" updated successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-gold/40 bg-white text-slate-900 p-6 sm:p-8 shadow-2xl font-sans">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/20 text-gold">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">Catalog Management</p>
              <h2 className="font-display text-2xl font-semibold text-brand-soft">Edit Saree Product</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: IMAGE UPLOAD & PREVIEW */}
          <div className="md:col-span-5 space-y-4 bg-cream/30 p-5 rounded-2xl border border-gold/20">
            <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-700 font-semibold">
              Product Photo Upload
            </label>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-gold/40 bg-white shadow-xs group">
              <img src={image} alt="Preview" className="h-full w-full object-cover" />
              <span className="absolute top-2 right-2 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-brand-soft shadow-xs">
                Active Photo
              </span>
            </div>

            <div>
              <label className="w-full rounded-2xl border-2 border-dashed border-gold/50 bg-white hover:bg-gold/10 p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs group">
                <UploadCloud className="h-6 w-6 text-gold group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-800">
                  {isCompressing ? "Processing Photo..." : "Change Image File"}
                </span>
                <span className="text-[10px] text-slate-500">Upload replacement from device</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-1">Custom Image URL</label>
              <input
                type="text"
                placeholder="Or enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-gold text-slate-800"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS FORM FIELDS */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                Saree Title / Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gold font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                  Stock Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gold cursor-pointer font-medium"
                >
                  <option value="in_stock">In Stock (Available)</option>
                  <option value="out_of_stock">Out of Stock (Request Notify)</option>
                  <option value="coming_soon">Coming Soon (Register Interest)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                  Price (INR ₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gold font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                  Weave Type
                </label>
                <select
                  value={weave}
                  onChange={(e) => setWeave(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gold cursor-pointer font-medium"
                >
                  {weaves.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                  Primary Colour
                </label>
                <input
                  type="text"
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gold font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1 font-semibold">
                Short Story / Craft Blurb
              </label>
              <textarea
                rows={3}
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gold font-medium resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-5 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-brand px-8 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-brand-soft shadow-md cursor-pointer transition-transform active:scale-95 font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
