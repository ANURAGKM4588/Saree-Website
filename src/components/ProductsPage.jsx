import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, X, ChevronDown, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { useDatabase } from '../context/DatabaseContext';
import ProductCard from './ProductCard';
import './ProductsPage.css';

export default function ProductsPage() {
  const { addToCart, setIsCartOpen } = useCart();
  const { products, categories, loading } = useDatabase();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
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

  const handleBuyNow = (product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

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
        <motion.div layout className="pp-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="pp-card-wrapper"
              >
                <ProductCard 
                  product={product} 
                  onQuickView={(p) => setQuickViewProduct(p)} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

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
                  {quickViewProduct.description || 'Crafted on traditional looms with pure silk filaments and intricate metallic zari borders. Includes matching unstitched blouse piece.'}
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
