import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { supabase } from '../supabaseClient';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, Bell, Settings, 
  DollarSign, TrendingUp, Truck, CheckCircle2, Clock, XCircle, 
  Save, Download, Plus, Search, Edit3, Trash2, LogOut, Shield, 
  AlertTriangle, RefreshCw, Eye, X, Upload, Sparkles, Image as ImageIcon
} from 'lucide-react';
import './AdminPanel.css';

// Initial Mock Orders for E-Commerce Order Management
const INITIAL_ORDERS = [
  {
    id: 'ORD-9842',
    customerName: 'Priya Sundaram',
    email: 'priya.sundaram@gmail.com',
    phone: '+91 98401 23456',
    date: new Date(Date.now() - 3600000 * 4).toISOString(),
    total: 48500,
    itemsCount: 1,
    items: ['Kanchipuram Divine Lotus'],
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    shippingAddress: '42, RK Salai, Mylapore, Chennai, Tamil Nadu - 600004'
  },
  {
    id: 'ORD-9841',
    customerName: 'Ananya Iyer',
    email: 'ananya.iyer@yahoo.com',
    phone: '+91 98200 98765',
    date: new Date(Date.now() - 3600000 * 26).toISOString(),
    total: 105800,
    itemsCount: 2,
    items: ['Banarasi Royal Velvet', 'Organza Celestial Floral'],
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    shippingAddress: '15, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038'
  },
  {
    id: 'ORD-9840',
    customerName: 'Meera Krishnan',
    email: 'meera.k@hotmail.com',
    phone: '+91 97112 34567',
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    total: 38900,
    itemsCount: 1,
    items: ['Kanchipuram Tissue Zari'],
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Processing',
    shippingAddress: '78, Jubilee Hills Road No. 36, Hyderabad, Telangana - 500033'
  },
  {
    id: 'ORD-9839',
    customerName: 'Siddharth Varma',
    email: 'siddharth.varma@outlook.com',
    phone: '+91 99304 11223',
    date: new Date(Date.now() - 3600000 * 72).toISOString(),
    total: 62000,
    itemsCount: 1,
    items: ['Pure Kanjivaram Bridal Gold'],
    paymentMethod: 'NetBanking',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    shippingAddress: '102, Bandra Kurla Complex, Mumbai, Maharashtra - 400051'
  },
  {
    id: 'ORD-9838',
    customerName: 'Sunita Reddy',
    email: 'sunita.reddy@gmail.com',
    phone: '+91 98850 44332',
    date: new Date(Date.now() - 3600000 * 96).toISOString(),
    total: 29500,
    itemsCount: 1,
    items: ['Chanderi Soft Silk Zari'],
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    shippingAddress: '5, Anna Nagar East, Chennai, Tamil Nadu - 600102'
  }
];

export default function AdminPanel() {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    loading: dbLoading 
  } = useDatabase();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Tab Navigation: 'overview' | 'orders' | 'products' | 'customers' | 'alerts' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Product Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Orders State & Filters
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'KADHA Heritage Silks',
    contactEmail: 'support@kadha.shop',
    contactPhone: '+91 98765 43210',
    freeShippingThreshold: 2999,
    taxPercentage: 5,
    currencySymbol: '₹',
    enableCod: true,
    autoStockAlert: true
  });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // Modal Form State (Add / Edit Product)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    material: '',
    price: '',
    originalPrice: '',
    image: '',
    tag: '',
    category: 'Kanjeevaram',
    description: '',
    inStock: true,
    featured: false,
    comingSoon: false
  });

  // Additional Database States (Subscribers & Stock Alerts)
  const [subscribers, setSubscribers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  // Image Uploading States
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  // Auth Listener
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Fetch Subscribers & Restock Alerts
  useEffect(() => {
    if (isAuthenticated || demoMode) {
      fetchSubscribersAndAlerts();
    }
  }, [isAuthenticated, demoMode]);

  const fetchSubscribersAndAlerts = async () => {
    if (!supabase) {
      setSubscribers([
        { id: '1', email: 'aarav.sharma@example.com', created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: '2', email: 'ananya.iyer@example.com', created_at: new Date(Date.now() - 172800000).toISOString() },
        { id: '3', email: 'diya.nair@example.com', created_at: new Date(Date.now() - 259200000).toISOString() }
      ]);
      setAlerts([
        { id: '1', email: 'vihaan.rao@example.com', product_id: 110, products: { name: 'Tussar Silk Tribal' }, created_at: new Date(Date.now() - 43200000).toISOString() },
        { id: '2', email: 'meera.krishnan@example.com', product_id: 116, products: { name: 'Sambalpuri Ikat Magic' }, created_at: new Date(Date.now() - 98000000).toISOString() }
      ]);
      return;
    }

    setLoadingSubscribers(true);
    setLoadingAlerts(true);
    try {
      const subRes = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (subRes.data) setSubscribers(subRes.data);

      const alertRes = await supabase
        .from('product_notifications')
        .select('*, products(name)')
        .order('created_at', { ascending: false });
      if (alertRes.data) setAlerts(alertRes.data);
    } catch (err) {
      console.error('Failed to fetch subscribers/alerts:', err);
    } finally {
      setLoadingSubscribers(false);
      setLoadingAlerts(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!supabase) {
      setLoginError('Supabase is not configured. Use Demo Mode instead.');
      return;
    }

    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });
      if (error) throw error;
      setIsAuthenticated(true);
      setUser(data.user);
    } catch (err) {
      setLoginError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setUser(null);
    setDemoMode(false);
  };

  // Order Status Handler
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
  };

  // Save Store Settings Handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsSavedMsg('✓ Store Settings saved successfully!');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  // Product Modal Handlers
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setWizardStep(1);
    setFormData({
      id: '',
      name: '',
      material: '',
      price: '',
      originalPrice: '',
      image: 'images/herosection/',
      tag: '',
      category: 'Kanjeevaram',
      description: '',
      inStock: true,
      featured: false,
      comingSoon: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setWizardStep(1);
    setFormData({
      id: product.id,
      name: product.name,
      material: product.material,
      price: product.price,
      originalPrice: product.originalPrice || '',
      image: product.image.replace(/^\//, ''),
      tag: product.tag || '',
      category: product.category || 'Kanjeevaram',
      description: product.description || '',
      inStock: product.inStock !== false,
      featured: Boolean(product.featured),
      comingSoon: Boolean(product.comingSoon)
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    setImageUploadError('');

    if (!supabase || demoMode) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setImageUploading(false);
      };
      reader.onerror = () => {
        setImageUploadError('Failed to read local file.');
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error } = await supabase.storage
        .from('sarees')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('sarees')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
    } catch (err) {
      setImageUploadError(err.message || 'Image upload failed.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitLoading(true);

    try {
      const productPayload = {
        ...formData,
        id: Number(formData.id),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      };

      if (editingProduct) {
        await updateProduct(productPayload);
      } else {
        await addProduct(productPayload);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(`Error saving product: ${err.message}`);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" (ID #${id})?`)) {
      try {
        await deleteProduct(id);
      } catch (err) {
        alert(`Failed to delete product: ${err.message}`);
      }
    }
  };

  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Subscriber Email,Date Subscribed\n"
      + subscribers.map(s => `"${s.email}","${s.created_at}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kadha_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(p.id).includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderFilter === 'All' || o.orderStatus === orderFilter;
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.email.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats Calculations
  const stats = {
    totalRevenue: orders.reduce((acc, curr) => acc + (curr.paymentStatus === 'Paid' ? curr.total : 0), 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    outOfStock: products.filter(p => !p.inStock).length,
    subscribersCount: subscribers.length,
    alertsCount: alerts.length,
    processingOrders: orders.filter(o => o.orderStatus === 'Processing').length
  };

  // LOGIN SCREEN
  if (!isAuthenticated && !demoMode) {
    return (
      <div className="admin-login-container">
        <div className="login-glass-card">
          <div className="login-header">
            <img src="/logo/logo.png" alt="KADHA Logo" className="login-brand-logo" />
            <p>Access the KADHA E-Commerce Management Suite</p>
          </div>

          {loginError && (
            <div className="login-error-alert">
              <AlertTriangle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="adminEmail">Email Address</label>
              <input 
                type="email" 
                id="adminEmail" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                placeholder="admin@kadha.shop" 
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="adminPassword">Password</label>
              <input 
                type="password" 
                id="adminPassword" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                placeholder="••••••••••••" 
                required 
              />
            </div>

            <button type="submit" className="login-submit-btn" disabled={authLoading}>
              {authLoading ? <RefreshCw size={18} className="spin-icon" /> : 'Log In to Dashboard'}
            </button>
          </form>

          <div className="login-divider"><span>or test without backend</span></div>

          <button onClick={() => setDemoMode(true)} className="demo-mode-btn">
            Skip Login (Offline / Demo Mode)
          </button>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD SUITE
  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src="/logo/logo vertical white.png" alt="KADHA" className="sidebar-brand-logo" />
          <span className="badge-admin">Admin</span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            <span>Orders & Sales</span>
            {stats.processingOrders > 0 && <span className="tab-count-alert">{stats.processingOrders}</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>Products & Stock</span>
            <span className="tab-count">{products.length}</span>
          </button>
          
          <button 
            className={`nav-item-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={18} />
            <span>Customers</span>
            {subscribers.length > 0 && <span className="tab-count">{subscribers.length}</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <Bell size={18} />
            <span>Stock Alerts</span>
            {alerts.length > 0 && <span className="tab-count-alert">{alerts.length}</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Store Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <Shield size={16} />
            <span className="truncate">{demoMode ? 'Demo Admin' : user?.email}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Log Out">
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-viewport">
        {/* Offline Alert */}
        {demoMode && (
          <div className="demo-banner">
            <AlertTriangle size={18} />
            <span>Operating in <strong>Demo Mode</strong>. Order & product updates are rendered live in session state.</span>
          </div>
        )}

        {/* Dynamic Header */}
        <header className="viewport-header">
          <div>
            <h1>
              {activeTab === 'overview' && 'Store Executive Overview'}
              {activeTab === 'orders' && 'Orders & Fulfillment'}
              {activeTab === 'products' && 'Saree Inventory Catalog'}
              {activeTab === 'customers' && 'Customer & Mailing List'}
              {activeTab === 'alerts' && 'Product Restock Requests'}
              {activeTab === 'settings' && 'E-Commerce Store Settings'}
            </h1>
            <p>
              {activeTab === 'overview' && 'Live business statistics, total revenue, and quick store management metrics.'}
              {activeTab === 'orders' && 'Track customer purchases, update fulfillment statuses, and view delivery details.'}
              {activeTab === 'products' && 'Add new sarees, edit prices, update weaves, and control stock status.'}
              {activeTab === 'customers' && 'View newsletter subscribers, active buyer emails, and export mailing lists.'}
              {activeTab === 'alerts' && 'Review restock notifications requested by customers for sold-out weaves.'}
              {activeTab === 'settings' && 'Configure store name, free shipping rules, tax rates, and support contacts.'}
            </p>
          </div>
          
          {activeTab === 'products' && (
            <button onClick={handleOpenAdd} className="add-product-btn">
              <Plus size={18} />
              <span>Add New Saree</span>
            </button>
          )}

          {activeTab === 'customers' && subscribers.length > 0 && (
            <button onClick={exportSubscribersCSV} className="export-csv-btn">
              <Download size={18} />
              <span>Export CSV</span>
            </button>
          )}
        </header>

        {/* Top Metric Cards */}
        <section className="stats-row-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper gold">
              <DollarSign size={22} />
            </div>
            <div>
              <span className="stat-label">Total Sales Revenue</span>
              <span className="stat-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper blue">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{stats.totalOrders}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper green">
              <Package size={22} />
            </div>
            <div>
              <span className="stat-label">Active Sarees</span>
              <span className="stat-value">{stats.totalProducts}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper orange">
              <AlertTriangle size={22} />
            </div>
            <div>
              <span className="stat-label">Out of Stock</span>
              <span className="stat-value text-warn">{stats.outOfStock}</span>
            </div>
          </div>
        </section>

        {/* Dynamic Views */}
        <div className="tab-view-container">

          {/* TAB 0: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="overview-dashboard-wrapper">
              <div className="overview-grid-2col">
                {/* Recent Orders Overview */}
                <div className="dashboard-widget-card">
                  <div className="widget-header">
                    <h3>Recent Customer Orders</h3>
                    <button className="text-link-btn" onClick={() => setActiveTab('orders')}>View All Orders →</button>
                  </div>
                  <table className="mini-data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 4).map(o => (
                        <tr key={o.id}>
                          <td className="id-cell">{o.id}</td>
                          <td>
                            <strong>{o.customerName}</strong>
                            <span className="sub-text">{o.items[0]}</span>
                          </td>
                          <td className="price-cell">₹{o.total.toLocaleString('en-IN')}</td>
                          <td>
                            <span className={`status-pill ${o.orderStatus.toLowerCase()}`}>
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quick Actions & Store Health */}
                <div className="dashboard-widget-card">
                  <div className="widget-header">
                    <h3>Quick Management Actions</h3>
                  </div>
                  <div className="quick-actions-grid">
                    <button className="action-tile-btn" onClick={handleOpenAdd}>
                      <Plus size={20} />
                      <span>Add New Product</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setActiveTab('orders')}>
                      <ShoppingBag size={20} />
                      <span>Fulfill Orders</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setActiveTab('alerts')}>
                      <Bell size={20} />
                      <span>Check Restock Alerts ({alerts.length})</span>
                    </button>
                    <button className="action-tile-btn" onClick={exportSubscribersCSV}>
                      <Download size={20} />
                      <span>Export Subscribers</span>
                    </button>
                  </div>

                  <div className="store-summary-box">
                    <h4>Current Policy Settings</h4>
                    <ul>
                      <li>🚚 <strong>Free Shipping Threshold:</strong> Orders above ₹{storeSettings.freeShippingThreshold.toLocaleString('en-IN')}</li>
                      <li>🏷️ <strong>GST Tax Rate:</strong> {storeSettings.taxPercentage}% Inclusive</li>
                      <li>✉️ <strong>Support Email:</strong> {storeSettings.contactEmail}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* TAB 1: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="table-wrapper-card">
              <div className="table-toolbar">
                <div className="search-bar-input">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search order ID, customer name or email..." 
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>
                
                <div className="filter-pills-row">
                  {['All', 'Processing', 'Shipped', 'Delivered'].map(status => (
                    <button 
                      key={status}
                      className={`filter-pill-btn ${orderFilter === status ? 'active' : ''}`}
                      onClick={() => setOrderFilter(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="table-responsive-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer & Address</th>
                      <th>Items Purchased</th>
                      <th>Total Amount</th>
                      <th>Payment</th>
                      <th>Fulfillment Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center-cell">
                          <ShoppingBag size={24} />
                          <span>No orders found matching search criteria.</span>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id}>
                          <td className="id-cell">
                            <strong>{order.id}</strong>
                            <span className="date-cell">
                              {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </td>
                          <td>
                            <div className="customer-info-block">
                              <strong>{order.customerName}</strong>
                              <span className="sub-text">{order.email}</span>
                              <span className="sub-text-phone">{order.phone}</span>
                            </div>
                          </td>
                          <td>
                            <div className="items-list-cell">
                              <span>{order.items.join(', ')}</span>
                              <small>({order.itemsCount} item{order.itemsCount > 1 ? 's' : ''})</small>
                            </div>
                          </td>
                          <td className="price-cell">
                            <strong>₹{order.total.toLocaleString('en-IN')}</strong>
                          </td>
                          <td>
                            <span className={`payment-pill ${order.paymentStatus.toLowerCase()}`}>
                              {order.paymentStatus} ({order.paymentMethod})
                            </span>
                          </td>
                          <td>
                            <select 
                              className={`order-status-select ${order.orderStatus.toLowerCase()}`}
                              value={order.orderStatus}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <div className="row-action-buttons">
                              <button 
                                onClick={() => setSelectedOrder(order)} 
                                className="action-row-btn edit" 
                                title="View Full Order Details"
                              >
                                <Eye size={16} />
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

          {/* TAB 2: PRODUCT CATALOG */}
          {activeTab === 'products' && (
            <div className="table-wrapper-card">
              <div className="table-toolbar">
                <div className="search-bar-input">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by ID, saree name or material..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="filter-select">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="table-responsive-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th>Saree Product Details</th>
                      <th>Weave Category</th>
                      <th>Price</th>
                      <th>Stock Status</th>
                      <th>Badges & Tags</th>
                      <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center-cell">
                          <RefreshCw size={24} className="spin-icon loader-margin" />
                          <span>Loading product inventory...</span>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center-cell">
                          <AlertTriangle size={24} />
                          <span>No products match the search query.</span>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(product => (
                        <tr key={product.id}>
                          <td className="id-cell">#{product.id}</td>
                          <td className="product-info-cell">
                            <div className="product-avatar-wrapper">
                              <img 
                                src={
                                  product.image.startsWith('http') || product.image.startsWith('/')
                                    ? product.image
                                    : '/' + product.image
                                } 
                                alt={product.name} 
                                onError={(e) => { e.target.style.opacity = '0.3'; e.target.src = '/logo/logo-emblem.png'; }}
                              />
                            </div>
                            <div className="product-name-block">
                              <strong>{product.name}</strong>
                              <span>{product.material}</span>
                            </div>
                          </td>
                          <td>
                            <span className="category-tag">{product.category}</span>
                          </td>
                          <td className="price-cell">
                            <strong>₹{product.price.toLocaleString('en-IN')}</strong>
                            {product.originalPrice && (
                              <span className="strike-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                            )}
                          </td>
                          <td>
                            {product.inStock ? (
                              <span className="status-indicator-badge in-stock">In Stock</span>
                            ) : (
                              <span className="status-indicator-badge out-stock">Out of Stock</span>
                            )}
                          </td>
                          <td>
                            <div className="visibility-badges">
                              {product.featured && <span className="flag-badge featured">Featured</span>}
                              {product.comingSoon && <span className="flag-badge coming-soon">Coming Soon</span>}
                              {product.tag && <span className="flag-badge custom-tag">{product.tag}</span>}
                              {!product.featured && !product.comingSoon && <span className="flag-badge default">Standard</span>}
                            </div>
                          </td>
                          <td>
                            <div className="row-action-buttons">
                              <button 
                                onClick={() => handleOpenEdit(product)} 
                                className="action-row-btn edit" 
                                title="Edit Product"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(product.id, product.name)} 
                                className="action-row-btn delete" 
                                title="Delete Product"
                              >
                                <Trash2 size={16} />
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

          {/* TAB 3: CUSTOMERS & MAILING LIST */}
          {activeTab === 'customers' && (
            <div className="table-wrapper-card">
              <div className="table-responsive-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Subscriber Email</th>
                      <th>Subscription Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingSubscribers ? (
                      <tr>
                        <td colSpan="3" className="text-center-cell">
                          <RefreshCw size={24} className="spin-icon loader-margin" />
                          <span>Loading subscribers...</span>
                        </td>
                      </tr>
                    ) : subscribers.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center-cell">
                          <Users size={24} />
                          <span>No newsletter subscribers found.</span>
                        </td>
                      </tr>
                    ) : (
                      subscribers.map((sub, idx) => (
                        <tr key={sub.id || idx}>
                          <td className="email-cell">
                            <strong>{sub.email}</strong>
                          </td>
                          <td className="date-cell">
                            {new Date(sub.created_at).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td>
                            <span className="status-indicator-badge in-stock">Active</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: STOCK ALERTS */}
          {activeTab === 'alerts' && (
            <div className="table-wrapper-card">
              <div className="table-responsive-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Customer Email</th>
                      <th>Product ID</th>
                      <th>Requested Saree</th>
                      <th>Requested Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingAlerts ? (
                      <tr>
                        <td colSpan="4" className="text-center-cell">
                          <RefreshCw size={24} className="spin-icon loader-margin" />
                          <span>Loading restock requests...</span>
                        </td>
                      </tr>
                    ) : alerts.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center-cell">
                          <Bell size={24} />
                          <span>No restock alert requests at this time.</span>
                        </td>
                      </tr>
                    ) : (
                      alerts.map((alert, idx) => (
                        <tr key={alert.id || idx}>
                          <td className="email-cell">
                            <strong>{alert.email}</strong>
                          </td>
                          <td className="id-cell">#{alert.product_id}</td>
                          <td>
                            <span className="product-title-alert">
                              {alert.products?.name || `Product ID #${alert.product_id}`}
                            </span>
                          </td>
                          <td className="date-cell">
                            {new Date(alert.created_at).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="table-wrapper-card settings-card">
              {settingsSavedMsg && (
                <div className="settings-saved-banner">
                  <CheckCircle2 size={18} />
                  <span>{settingsSavedMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="settings-form-grid">
                <h3>Store Identity & Policies</h3>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Store Name</label>
                    <input 
                      type="text" 
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Support Email</label>
                    <input 
                      type="email" 
                      value={storeSettings.contactEmail}
                      onChange={(e) => setStoreSettings({ ...storeSettings, contactEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Support Phone Number</label>
                    <input 
                      type="text" 
                      value={storeSettings.contactPhone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, contactPhone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Free Shipping Minimum Order (₹)</label>
                    <input 
                      type="number" 
                      value={storeSettings.freeShippingThreshold}
                      onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>GST Tax Percentage (%)</label>
                    <input 
                      type="number" 
                      value={storeSettings.taxPercentage}
                      onChange={(e) => setStoreSettings({ ...storeSettings, taxPercentage: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Currency Display Symbol</label>
                    <input 
                      type="text" 
                      value={storeSettings.currencySymbol}
                      onChange={(e) => setStoreSettings({ ...storeSettings, currencySymbol: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="settings-submit-row">
                  <button type="submit" className="save-form-btn">
                    <Save size={18} />
                    <span>Save Store Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-content-card">
            <div className="modal-header">
              <h2>Order Details — {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="modal-close-btn">&times;</button>
            </div>

            <div className="modal-form">
              <div className="order-summary-header">
                <div>
                  <strong>Customer: {selectedOrder.customerName}</strong>
                  <p>{selectedOrder.email} | {selectedOrder.phone}</p>
                </div>
                <div className="order-total-badge">
                  <span>Total Amount</span>
                  <strong>₹{selectedOrder.total.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="order-address-box">
                <h4>Shipping Address</h4>
                <p>{selectedOrder.shippingAddress}</p>
              </div>

              <div className="order-items-box">
                <h4>Purchased Items</h4>
                <ul>
                  {selectedOrder.items.map((item, i) => (
                    <li key={i}>🛍️ {item}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-footer-btns">
                <button onClick={() => setSelectedOrder(null)} className="cancel-form-btn">
                  Close Detail Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW ULTRA-MINIMAL STEP-BY-STEP PROCEEDING MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="minimal-step-card">
            
            {/* Modal Header & Segmented Pill Stepper */}
            <div className="minimal-step-header">
              <div className="step-header-title">
                <div>
                  <span className="step-subtitle-pill">Step {wizardStep} of 3</span>
                  <h2>{editingProduct ? 'Edit Saree Product' : 'Add New Saree'}</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="minimal-close-circle" title="Close">
                  <X size={18} />
                </button>
              </div>

              {/* Minimal Segmented Tab Switcher */}
              <div className="minimal-tab-switcher">
                <button 
                  type="button"
                  className={`tab-segment-btn ${wizardStep === 1 ? 'active' : wizardStep > 1 ? 'done' : ''}`}
                  onClick={() => setWizardStep(1)}
                >
                  <span className="segment-num">1</span>
                  <span>Saree Info</span>
                </button>
                <button 
                  type="button"
                  className={`tab-segment-btn ${wizardStep === 2 ? 'active' : wizardStep > 2 ? 'done' : ''}`}
                  onClick={() => setWizardStep(2)}
                >
                  <span className="segment-num">2</span>
                  <span>Media & Price</span>
                </button>
                <button 
                  type="button"
                  className={`tab-segment-btn ${wizardStep === 3 ? 'active' : ''}`}
                  onClick={() => setWizardStep(3)}
                >
                  <span className="segment-num">3</span>
                  <span>Stock & Tags</span>
                </button>
              </div>
            </div>

            {/* Modal Step Content Form */}
            <form onSubmit={handleSubmit} className="minimal-step-form">
              <div className="minimal-step-body">

                {/* STEP 1: SAREE ESSENCE */}
                {wizardStep === 1 && (
                  <div className="step-pane-content fade-in">
                    <div className="adm-form-row">
                      <div className="adm-form-field">
                        <label className="adm-form-label" htmlFor="prodId">Product ID #</label>
                        <input 
                          className="adm-form-input"
                          type="number" 
                          id="prodId"
                          value={formData.id}
                          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                          placeholder="e.g. 101"
                          disabled={Boolean(editingProduct)}
                          required
                        />
                      </div>
                      <div className="adm-form-field">
                        <label className="adm-form-label" htmlFor="prodName">Saree Title / Name*</label>
                        <input 
                          className="adm-form-input"
                          type="text" 
                          id="prodName"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Kanchipuram Divine Lotus Silk"
                          required
                        />
                      </div>
                    </div>

                    {/* Weave Category Selection Chips */}
                    <div className="adm-form-field">
                      <label className="adm-form-label">Select Weave Category*</label>
                      <div className="category-chips-grid">
                        {['Kanjeevaram', 'Banarasi', 'Organza', 'Patola', 'Mysore', 'Paithani', 'Tussar', 'Chanderi', 'Kasavu'].map(cat => (
                          <button
                            type="button"
                            key={cat}
                            className={`category-chip-btn ${formData.category === cat ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, category: cat })}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="adm-form-field">
                      <label className="adm-form-label" htmlFor="prodMaterial">Material & Craft Specs*</label>
                      <input 
                        className="adm-form-input"
                        type="text" 
                        id="prodMaterial"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        placeholder="e.g. Pure Katan Silk with Real Gold Zari Woven Pallu"
                        required
                      />
                    </div>

                    <div className="adm-form-field">
                      <label className="adm-form-label" htmlFor="prodDesc">Product Description (Optional)</label>
                      <textarea 
                        className="adm-form-textarea"
                        id="prodDesc"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief summary of motif details, pallu weave, border style..."
                        rows="2"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: MEDIA & PRICING */}
                {wizardStep === 2 && (
                  <div className="step-pane-content fade-in">
                    <div className="adm-form-row">
                      <div className="adm-form-field">
                        <label className="adm-form-label" htmlFor="prodPrice">Selling Offer Price (₹)*</label>
                        <input 
                          className="adm-form-input"
                          type="number" 
                          id="prodPrice"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="e.g. 48500"
                          required
                        />
                      </div>
                      <div className="adm-form-field">
                        <label className="adm-form-label" htmlFor="prodOrigPrice">Original Price (₹)</label>
                        <input 
                          className="adm-form-input"
                          type="number" 
                          id="prodOrigPrice"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          placeholder="e.g. 62000"
                        />
                      </div>
                    </div>

                    {/* Image Upload Box & Preview */}
                    <div className="media-upload-pane">
                      <div className="media-preview-box">
                        {formData.image ? (
                          <img 
                            src={
                              formData.image.startsWith('data:') || formData.image.startsWith('http') || formData.image.startsWith('/')
                                ? formData.image
                                : '/' + formData.image
                            } 
                            alt="Preview" 
                            onError={(e) => { e.target.src = '/logo/logo-emblem.png'; }}
                          />
                        ) : (
                          <div className="media-placeholder">
                            <ImageIcon size={32} />
                            <span>Upload photo or enter URL below</span>
                          </div>
                        )}
                      </div>

                      <div className="media-fields-stack">
                        <div className="adm-form-field">
                          <label className="adm-form-label">Upload Image File</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            id="stepImageFileInput"
                            className="hidden-file-input"
                          />
                          <label htmlFor="stepImageFileInput" className="media-browse-btn">
                            <Upload size={15} />
                            <span>{imageUploading ? 'Uploading...' : 'Browse Local Image'}</span>
                          </label>
                        </div>

                        <div className="adm-form-field">
                          <label className="adm-form-label" htmlFor="prodImage">Image Path / URL*</label>
                          <input 
                            className="adm-form-input"
                            type="text" 
                            id="prodImage"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="image/saree/kanjivaram.webp"
                            required
                          />
                          {imageUploadError && <span className="input-field-error-msg">{imageUploadError}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: STOCK & TAGS */}
                {wizardStep === 3 && (
                  <div className="step-pane-content fade-in">
                    <div className="adm-form-field">
                      <label className="adm-form-label" htmlFor="prodTag">Label Badge Tag (Optional)</label>
                      <input 
                        className="adm-form-input"
                        type="text" 
                        id="prodTag"
                        value={formData.tag}
                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                        placeholder="e.g. Bestseller, New Arrival, Festive Special"
                      />
                    </div>

                    <div className="step-toggles-section">
                      <label className="step-toggle-card">
                        <div>
                          <strong>In Stock</strong>
                          <span>Ready for customer orders on website</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={formData.inStock}
                          onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        />
                      </label>

                      <label className="step-toggle-card">
                        <div>
                          <strong>Featured Masterpiece</strong>
                          <span>Showcase on homepage bestsellers grid</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        />
                      </label>

                      <label className="step-toggle-card">
                        <div>
                          <strong>Coming Soon</strong>
                          <span>Display as upcoming drop preview</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={formData.comingSoon}
                          onChange={(e) => setFormData({ ...formData, comingSoon: e.target.checked })}
                        />
                      </label>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer Controls */}
              <div className="minimal-step-footer">
                {wizardStep > 1 ? (
                  <button 
                    type="button" 
                    onClick={() => setWizardStep(prev => prev - 1)} 
                    className="cancel-form-btn"
                  >
                    ← Back
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="cancel-form-btn"
                  >
                    Cancel
                  </button>
                )}

                {wizardStep < 3 ? (
                  <button 
                    type="button" 
                    onClick={() => {
                      if (wizardStep === 1 && (!formData.id || !formData.name || !formData.material)) {
                        alert('Please fill in Product ID, Saree Name, and Material to proceed.');
                        return;
                      }
                      setWizardStep(prev => prev + 1);
                    }} 
                    className="save-form-btn"
                  >
                    Continue to Step {wizardStep + 1} →
                  </button>
                ) : (
                  <button type="submit" className="save-form-btn" disabled={formSubmitLoading}>
                    {formSubmitLoading ? <RefreshCw size={16} className="spin-icon" /> : (editingProduct ? 'Update Saree' : 'Save & Publish Saree')}
                  </button>
                )}
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
