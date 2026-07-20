import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, X, ChevronDown, Star, ShoppingBag, Crown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { useDatabase } from '../context/DatabaseContext';
import ProductCard from './ProductCard';
import './ProductsPage.css';

export default function BestsellersPage() {
  const { addToCart, setIsCartOpen } = useCart();
  const { products, categories, loading } = useDatabase();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showSort, setShowSort] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (quickViewProduct) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [quickViewProduct]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const search = params.get('search');
    
    if (cat) {
      const matchedCat = categories.find(c => c.toLowerCase() === cat.toLowerCase());
      if (matchedCat) {
        setActiveCategory(matchedCat);
      } else {
        setActiveCategory('All');
      }
    } else {
      setActiveCategory('All');
    }

    if (search) {
      setSearchQuery(decodeURIComponent(search));
    } else {
      setSearchQuery('');
    }
  }, [location.search, categories]);

  // Filter products for bestsellers (featured or top rating)
  const bestsellersList = products.filter((p) => p.featured || p.rating >= 4.8 || p.originalPrice);

  const filteredProducts = bestsellersList
    .filter((p) => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0;
    });

  const handleBuyNow = (product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <div className="pp-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--color-gold)', fontSize: '1.2rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="spinner" style={{
            width: '24px',
            height: '24px',
            border: '2px solid var(--color-gold)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading Bestsellers...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="pp-page">
      <div className="pp-container">
        {/* Header */}
        <div className="pp-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent-gold)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            <Crown size={16} /> MOST TREASURED COLLECTION
          </div>
          <h1 className="pp-title">
            Bestsellers <span className="gold-text">Showroom</span>
          </h1>
          <p className="pp-subtitle">
            Explore our most beloved sarees, handpicked by connoisseurs of fine craftsmanship across the globe.
          </p>
        </div>

        {/* Toolbar */}
        <div className="pp-toolbar">
          <div className="pp-search">
            <Search size={18} className="pp-search-icon" />
            <input
              type="text"
              placeholder="Search bestsellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pp-search-input"
            />
            {searchQuery && (
              <button className="pp-search-clear" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="pp-sort-container">
            <button
              className="pp-sort-btn"
              onClick={() => setShowSort(!showSort)}
            >
              <span>
                Sort by: {sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Highest Rated'}
              </span>
              <ChevronDown size={16} />
            </button>

            {showSort && (
              <div className="pp-sort-menu">
                {[
                  { value: 'rating', label: 'Highest Rated' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`pp-sort-option ${sortBy === opt.value ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy(opt.value);
                      setShowSort(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="pp-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pp-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Count */}
        <div className="pp-results-count">
          Showing <strong>{filteredProducts.length}</strong> top-selling silk sarees
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="pp-empty">
            <h3>No bestsellers found</h3>
            <p>Try adjusting your search query or category filter.</p>
            <button
              className="pp-reset-btn"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="pp-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quickview-modal-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="quickview-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="quickview-close-btn" onClick={() => setQuickViewProduct(null)}>
              <X size={22} />
            </button>
            <div className="quickview-grid">
              <motion.div
                className="qv-image-side"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="qv-img" />
              </motion.div>
              <motion.div
                className="qv-details-side"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="qv-brand">AUTHENTIC KADHA SILKS</span>
                <h2 className="qv-title">{quickViewProduct.name}</h2>
                <div className="qv-rating">
                  <Star size={14} fill="#c89d36" color="#c89d36" />
                  <Star size={14} fill="#c89d36" color="#c89d36" />
                  <Star size={14} fill="#c89d36" color="#c89d36" />
                  <Star size={14} fill="#c89d36" color="#c89d36" />
                  <Star size={14} fill="#c89d36" color="#c89d36" />
                  <span>(4.9 / 5.0)</span>
                </div>
                <div className="qv-price-block">
                  <span className="qv-price">{formatPrice(quickViewProduct.price)}</span>
                  {quickViewProduct.originalPrice && (
                    <span className="qv-orig">{formatPrice(quickViewProduct.originalPrice)}</span>
                  )}
                </div>
                <p className="qv-description">
                  {quickViewProduct.description || 'Crafted on traditional looms with pure silk filaments and intricate metallic zari borders.'}
                </p>
                <div className="qv-specs">
                  <div><strong>Fabric:</strong> {quickViewProduct.material || 'Pure Silk'}</div>
                  <div><strong>Craft:</strong> {quickViewProduct.weave || 'Handloom Zari'}</div>
                  <div><strong>Dispatch:</strong> Express (2-4 Business Days)</div>
                </div>
                <div className="qv-actions">
                  <button
                    className="qv-add-btn"
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                  <button
                    className="qv-buy-btn"
                    onClick={() => {
                      handleBuyNow(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
