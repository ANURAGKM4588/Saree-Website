import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { featuredProducts, formatPrice } from '../data/products';
import './BestSellers.css';

export default function BestSellers() {
  const { addToCart, setIsCartOpen } = useCart();

  const handleBuyNow = (product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <section className="bestsellers-section" id="bestsellers">
      <div className="bs-inner">
        <motion.span
          className="bs-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          BESTSELLERS
        </motion.span>
        <motion.h2
          className="bs-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Most Treasured Weaves
        </motion.h2>
        <motion.p
          className="bs-desc"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Our most beloved sarees, handpicked by connoisseurs of fine craftsmanship.
        </motion.p>

        <div className="bs-grid">
          {featuredProducts.slice(0, 6).map((product, index) => (
            <motion.div
              key={product.id}
              className="bs-card"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={`/product/${product.id}`} className="bs-card-img-link">
                <div className="bs-card-img-wrap">
                  <div className="bs-card-tag">{product.tag}</div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="bs-card-img"
                    loading="lazy"
                  />
                  {product.originalPrice && (
                    <div className="bs-card-discount">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>
              </Link>

              <div className="bs-card-info">
                <Link to={`/product/${product.id}`} className="bs-card-info-link">
                  <span className="bs-card-material">{product.material}</span>
                  <h3 className="bs-card-name">{product.name}</h3>
                </Link>

                <div className="bs-card-rating">
                  <Star size={12} fill="#d4af37" color="#d4af37" />
                  <span className="bs-rating-value">{product.rating}</span>
                  <span className="bs-rating-count">({product.reviews})</span>
                </div>

                <div className="bs-card-prices">
                  <span className="bs-price-current">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="bs-price-original">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                <div className="bs-card-actions">
                  <button className="bs-btn-add" onClick={() => addToCart(product)}>
                    <ShoppingBag size={14} /> Add to Bag
                  </button>
                  <button className="bs-btn-buy" onClick={() => handleBuyNow(product)}>
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bs-view-all"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/products" className="bs-view-all-link">
            View All Sarees <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
