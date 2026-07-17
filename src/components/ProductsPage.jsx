import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowLeft, Search, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { useDatabase } from '../context/DatabaseContext';
import './ProductsPage.css';

export default function ProductsPage() {
  const { addToCart, setIsCartOpen } = useCart();
  const { products, categories, loading } = useDatabase();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showSort, setShowSort] = useState(false);

  if (loading) {
    return (
      <div className="products-page">
        <div className="pp-top">
          <Link to="/" className="pp-back">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <h1 className="pp-title">All Sarees</h1>
          <span className="pp-count">Loading...</span>
        </div>
        <div className="pp-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="pp-card skeleton-card" style={{ opacity: 0.6 }}>
              <div className="pp-card-image-wrapper" style={{ height: '350px', background: '#222', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                <div className="shimmer" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
                  animation: 'shimmer 1.5s infinite'
                }} />
              </div>
              <div className="pp-card-info" style={{ marginTop: '15px' }}>
                <div style={{ height: '14px', width: '40%', background: '#333', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '20px', width: '80%', background: '#333', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '12px', width: '30%', background: '#333', borderRadius: '4px', marginBottom: '12px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ height: '18px', width: '50%', background: '#333', borderRadius: '4px' }} />
                  <div style={{ height: '28px', width: '28px', background: '#333', borderRadius: '50%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  const filtered = products
    .filter((p) => activeCategory === 'All' || p.category === activeCategory)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="products-page">
      {/* Top Bar */}
      <div className="pp-top">
        <Link to="/" className="pp-back">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <h1 className="pp-title">All Sarees</h1>
        <span className="pp-count">{filtered.length} pieces</span>
      </div>

      {/* Search + Sort */}
      <div className="pp-controls">
        <div className="pp-search-wrapper">
          <Search size={16} className="pp-search-icon" />
          <input
            type="text"
            placeholder="Search by name, material, or region..."
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

        <div className="pp-sort-wrapper">
          <button className="pp-sort-btn" onClick={() => setShowSort(!showSort)}>
            Sort by: <strong>{sortBy.replace('-', ' ')}</strong>
            <ChevronDown size={14} />
          </button>
          {showSort && (
            <div className="pp-sort-dropdown">
              {[
                { value: 'default', label: 'Default' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' },
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

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="pp-empty">
          <p>No sarees found for this filter.</p>
          <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="pp-grid">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              className="pp-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <Link to={`/product/${product.id}`} className="pp-card-image-link">
                <div className="pp-card-image-wrapper">
                  <div className="product-tag">{product.tag}</div>
                  <img src={product.image} alt={product.name} className="pp-card-image" loading="lazy" />
                  {product.originalPrice && (
                    <div className="product-discount">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="pp-out-of-stock">Out of Stock</div>
                  )}
                </div>
              </Link>

              <div className="pp-card-info">
                <Link to={`/product/${product.id}`} className="pp-card-name-link">
                  <span className="pp-card-material">{product.material}</span>
                  <h3 className="pp-card-name">{product.name}</h3>
                </Link>
                <div className="pp-card-rating">
                  <Star size={12} fill="#d4af37" color="#d4af37" />
                  <span>{product.rating}</span>
                  <span className="pp-review-count">({product.reviews})</span>
                </div>
                <div className="pp-card-bottom">
                  <div className="pp-card-prices">
                    <span className="pp-price-current">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="pp-price-original">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <button
                    className="pp-add-cart"
                    onClick={() => product.inStock && addToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingBag size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
