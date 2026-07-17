import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { supabase } from '../supabaseClient';
import { 
  Plus, Edit3, Trash2, LogOut, Shield, Download, FileText, 
  CheckCircle, AlertTriangle, RefreshCw, Layers, Grid, List, Bell, Users, Search
} from 'lucide-react';
import './AdminPanel.css';

export default function AdminPanel() {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    loading: dbLoading 
  } = useDatabase();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState('products');

  // Product Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Authenticate listener
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

  // Fetch Newsletter and Alerts when user is authenticated/demo
  useEffect(() => {
    if (isAuthenticated || demoMode) {
      fetchSubscribersAndAlerts();
    }
  }, [isAuthenticated, demoMode]);

  const fetchSubscribersAndAlerts = async () => {
    if (!supabase) {
      // Mock data for demo mode
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

  const handleOpenAdd = () => {
    setEditingProduct(null);
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
    setFormData({
      id: product.id,
      name: product.name,
      material: product.material,
      price: product.price,
      originalPrice: product.originalPrice || '',
      image: product.image.replace(/^\//, ''), // Strip leading slash if any
      tag: product.tag || '',
      category: product.category,
      description: product.description || '',
      inStock: product.inStock,
      featured: product.featured,
      comingSoon: product.comingSoon
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const res = await deleteProduct(id);
      if (!res.success) {
        alert(`Error deleting product: ${res.error?.message || 'Unknown error'}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitLoading(true);

    const productPayload = {
      name: formData.name,
      material: formData.material,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      image: formData.image,
      tag: formData.tag || null,
      category: formData.category,
      description: formData.description || null,
      inStock: formData.inStock,
      featured: formData.featured,
      comingSoon: formData.comingSoon
    };

    let res;
    if (editingProduct) {
      res = await updateProduct(editingProduct.id, productPayload);
    } else {
      const newId = formData.id ? Number(formData.id) : Math.floor(Math.random() * 1000) + 200;
      res = await addProduct({ ...productPayload, id: newId });
    }

    setFormSubmitLoading(false);
    if (res.success) {
      setIsModalOpen(false);
    } else {
      alert(`Error saving product: ${res.error?.message || 'Unknown error'}`);
    }
  };

  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) return;
    const csvRows = [
      ['Email Address', 'Subscription Date'],
      ...subscribers.map(sub => [sub.email, new Date(sub.created_at).toLocaleString()])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + csvRows.map(e => e.map(val => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `newsletter_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.material.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toString().includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Dashboard Stats Calculations
  const stats = {
    totalProducts: products.length,
    outOfStock: products.filter(p => !p.inStock).length,
    featured: products.filter(p => p.featured).length,
    comingSoon: products.filter(p => p.comingSoon).length,
    subscribersCount: subscribers.length,
    alertsCount: alerts.length
  };

  // Render Login screen if not authenticated
  if (!isAuthenticated && !demoMode) {
    return (
      <div className="admin-login-container">
        <div className="login-glass-card">
          <div className="login-header">
            <span className="brand-emblem">◈</span>
            <h1>KADHA ADMIN</h1>
            <p>Access the heritage weave management dashboard</p>
          </div>

          {loginError && (
            <div className="login-error-alert">
              <AlertTriangle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                placeholder="admin@kadha.shop" 
                required 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>

            <button type="submit" className="login-submit-btn" disabled={authLoading}>
              {authLoading ? <RefreshCw size={18} className="spin-icon" /> : 'Log In Securely'}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button onClick={() => setDemoMode(true)} className="demo-mode-btn">
            Skip Login (Offline / Demo Mode)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-emblem">◈</span>
          <span>KADHA</span>
          <span className="badge-admin">Admin</span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Grid size={18} />
            <span>Manage Products</span>
          </button>
          
          <button 
            className={`nav-item-btn ${activeTab === 'subscribers' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscribers')}
          >
            <Users size={18} />
            <span>Newsletter Subscriptions</span>
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
            <span>You are operating in <strong>Offline Demo Mode</strong>. Changes are simulated in state but won't be saved to Supabase.</span>
          </div>
        )}

        {/* Dashboard Header */}
        <header className="viewport-header">
          <div>
            <h1>
              {activeTab === 'products' && 'Product Portfolio'}
              {activeTab === 'subscribers' && 'Mailing List'}
              {activeTab === 'alerts' && 'Product Notifications'}
            </h1>
            <p>
              {activeTab === 'products' && 'Add, update, and manage your inventory of masterweave sarees.'}
              {activeTab === 'subscribers' && 'View your customer mailing list subscribers and export contacts.'}
              {activeTab === 'alerts' && 'Review restock notification requests for out of stock inventory.'}
            </p>
          </div>
          
          {activeTab === 'products' && (
            <button onClick={handleOpenAdd} className="add-product-btn">
              <Plus size={18} />
              <span>Add Saree</span>
            </button>
          )}

          {activeTab === 'subscribers' && subscribers.length > 0 && (
            <button onClick={exportSubscribersCSV} className="export-csv-btn">
              <Download size={18} />
              <span>Export CSV</span>
            </button>
          )}
        </header>

        {/* Quick Stats Grid */}
        <section className="stats-row-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper blue">
              <Layers size={20} />
            </div>
            <div>
              <span className="stat-label">Total Inventory</span>
              <span className="stat-value">{stats.totalProducts}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper orange">
              <AlertTriangle size={20} />
            </div>
            <div>
              <span className="stat-label">Out of Stock</span>
              <span className="stat-value text-warn">{stats.outOfStock}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper gold">
              <CheckCircle size={20} />
            </div>
            <div>
              <span className="stat-label">Featured Masterpieces</span>
              <span className="stat-value">{stats.featured}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper purple">
              <Users size={20} />
            </div>
            <div>
              <span className="stat-label">Active Subscribers</span>
              <span className="stat-value">{stats.subscribersCount}</span>
            </div>
          </div>
        </section>

        {/* Dynamic Views */}
        <div className="tab-view-container">
          
          {/* TAB 1: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="table-wrapper-card">
              {/* Table Toolbar */}
              <div className="table-toolbar">
                <div className="search-bar-input">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by ID, name or weave..." 
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

              {/* Data Table */}
              <div className="table-responsive-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th>Product details</th>
                      <th>Weave</th>
                      <th>Price</th>
                      <th>Stock status</th>
                      <th>Visibility</th>
                      <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center-cell">
                          <RefreshCw size={24} className="spin-icon loader-margin" />
                          <span>Loading inventory data...</span>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center-cell">
                          <AlertTriangle size={24} />
                          <span>No products match the search filters.</span>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(product => (
                        <tr key={product.id}>
                          <td className="id-cell">#{product.id}</td>
                          <td className="product-info-cell">
                            <div className="product-avatar-wrapper">
                              <img src={product.image.startsWith('http') ? product.image : '/' + product.image} alt={product.name} />
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

          {/* TAB 2: NEWSLETTER SUBSCRIPTIONS */}
          {activeTab === 'subscribers' && (
            <div className="table-wrapper-card">
              <div className="table-responsive-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Subscriber Email</th>
                      <th>Date Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingSubscribers ? (
                      <tr>
                        <td colSpan="2" className="text-center-cell">
                          <RefreshCw size={24} className="spin-icon loader-margin" />
                          <span>Loading subscribers...</span>
                        </td>
                      </tr>
                    ) : subscribers.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="text-center-cell">
                          <Users size={24} />
                          <span>No newsletter subscribers yet.</span>
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
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
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

          {/* TAB 3: STOCK ALERTS */}
          {activeTab === 'alerts' && (
            <div className="table-wrapper-card">
              <div className="table-responsive-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Customer Email</th>
                      <th>Product ID</th>
                      <th>Requested Product</th>
                      <th>Alert Requested Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingAlerts ? (
                      <tr>
                        <td colSpan="4" className="text-center-cell">
                          <RefreshCw size={24} className="spin-icon loader-margin" />
                          <span>Loading notification requests...</span>
                        </td>
                      </tr>
                    ) : alerts.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center-cell">
                          <Bell size={24} />
                          <span>No product notification requests at this time.</span>
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
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
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

        </div>
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content-card">
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Saree Masterpiece' : 'Add New Saree'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="prodId">Product ID (Unique Integer)*</label>
                  <input 
                    type="number" 
                    id="prodId"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="e.g. 125"
                    disabled={Boolean(editingProduct)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prodName">Saree Name*</label>
                  <input 
                    type="text" 
                    id="prodName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kanchipuram Gold Brocade"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="prodMaterial">Material Description*</label>
                  <input 
                    type="text" 
                    id="prodMaterial"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g. Pure Katan Silk, Gold Zari"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prodCategory">Category*</label>
                  <select 
                    id="prodCategory"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Kanjeevaram">Kanjeevaram</option>
                    <option value="Banarasi">Banarasi</option>
                    <option value="Organza">Organza</option>
                    <option value="Patola">Patola</option>
                    <option value="Mysore">Mysore</option>
                    <option value="Paithani">Paithani</option>
                    <option value="Tussar">Tussar</option>
                    <option value="Chanderi">Chanderi</option>
                    <option value="Kota">Kota</option>
                    <option value="Kasavu">Kasavu</option>
                    <option value="Muga">Muga</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="prodPrice">Price (₹)*</label>
                  <input 
                    type="number" 
                    id="prodPrice"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 45000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prodOrigPrice">Original Price (₹ - Optional)</label>
                  <input 
                    type="number" 
                    id="prodOrigPrice"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. 58000 (To show a slash-price)"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="prodImage">Image Path / URL*</label>
                  <input 
                    type="text" 
                    id="prodImage"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="images/herosection/imagename.jpg"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prodTag">Label Badge Tag (Optional)</label>
                  <input 
                    type="text" 
                    id="prodTag"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. Bestseller, New, Premium"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prodDesc">Product Description</label>
                <textarea 
                  id="prodDesc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the weave history, thread type, border style, etc."
                  rows="3"
                />
              </div>

              <div className="form-toggles-row">
                <label className="toggle-container">
                  <input 
                    type="checkbox" 
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  <span className="toggle-label">In Stock</span>
                </label>

                <label className="toggle-container">
                  <input 
                    type="checkbox" 
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span className="toggle-label">Featured Masterpiece</span>
                </label>

                <label className="toggle-container">
                  <input 
                    type="checkbox" 
                    checked={formData.comingSoon}
                    onChange={(e) => setFormData({ ...formData, comingSoon: e.target.checked })}
                  />
                  <span className="toggle-label">Coming Soon</span>
                </label>
              </div>

              <div className="modal-footer-btns">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-form-btn">
                  Cancel
                </button>
                <button type="submit" className="save-form-btn" disabled={formSubmitLoading}>
                  {formSubmitLoading ? <RefreshCw size={16} className="spin-icon" /> : 'Save Weave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
