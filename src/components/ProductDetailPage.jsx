import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { useDatabase } from '../context/DatabaseContext';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, setIsCartOpen } = useCart();
  const { getProductById, loading } = useDatabase();
  const product = getProductById(id);

  if (loading) {
    return (
      <div className="pdp-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ color: '#d4af37', fontSize: '1.2rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="spinner" style={{
            width: '24px',
            height: '24px',
            border: '2px solid #d4af37',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading Saree Details...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-not-found">
        <h2>Saree not found</h2>
        <Link to="/products">Browse all sarees</Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="pdp-page">
      <div className="pdp-container">
        {/* Breadcrumb */}
        <div className="pdp-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">All Sarees</Link>
          <span>/</span>
          <span className="pdp-current">{product.name}</span>
        </div>

        <Link to="/products" className="pdp-back-link">
          <ArrowLeft size={18} /> Back to Collection
        </Link>

        <div className="pdp-layout">
          {/* Image */}
          <motion.div
            className="pdp-image-col"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="pdp-image-wrapper">
              <div className="pdp-tag">{product.tag}</div>
              {discount > 0 && <div className="pdp-discount">-{discount}%</div>}
              <img src={product.image} alt={product.name} className="pdp-image" />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            className="pdp-details-col"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="pdp-material">{product.material}</span>
            <h1 className="pdp-name">{product.name}</h1>

            <div className="pdp-rating">
              <div className="pdp-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(product.rating) ? '#d4af37' : 'none'}
                    color="#d4af37"
                  />
                ))}
              </div>
              <span className="pdp-rating-text">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="pdp-pricing">
              <span className="pdp-current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="pdp-original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="pdp-save">Save {formatPrice(product.originalPrice - product.price)}</span>
                </>
              )}
            </div>

            <p className="pdp-tax">Inclusive of all taxes</p>

            <p className="pdp-description">{product.description}</p>

            <div className="pdp-category-row">
              <span className="pdp-category-label">Category</span>
              <span className="pdp-category-value">{product.category}</span>
            </div>

            <div className="pdp-stock-row">
              <span className={`pdp-stock-dot ${product.inStock ? 'in' : 'out'}`} />
              <span>{product.inStock ? 'In Stock' : 'Currently Out of Stock'}</span>
              {product.comingSoon && <span className="pdp-coming-tag">Coming Soon</span>}
            </div>

            <div className="pdp-actions">
              <button
                className="pdp-add-cart"
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
              >
                <ShoppingBag size={18} /> Add to Bag
              </button>
              <button
                className="pdp-buy-now"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>

            <div className="pdp-features">
              <div className="pdp-feature">
                <Truck size={16} />
                <span>Free shipping worldwide</span>
              </div>
              <div className="pdp-feature">
                <Shield size={16} />
                <span>Authenticity guaranteed</span>
              </div>
              <div className="pdp-feature">
                <RotateCcw size={16} />
                <span>15-day easy returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
