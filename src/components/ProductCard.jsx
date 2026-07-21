import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import './ProductCard.css';

export default function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen, wishlist, toggleWishlist } = useCart();

  const isWishlisted = wishlist.includes(product.id);
  const badgeText = product.tag || (product.featured ? 'Exclusive Piece' : 'New Arrival');

  const handleProductClick = (e) => {
    sessionStorage.setItem('last_viewed_product_id', product.id.toString());
    sessionStorage.setItem('last_scroll_pos', window.scrollY.toString());
    if (e && e.target) {
      const section = e.target.closest('section') || e.target.closest('[id]');
      if (section && section.id) {
        sessionStorage.setItem('origin_section', section.id);
      }
    }
  };

  const handleCardClick = (e) => {
    // If click was inside a button or anchor link, let that element handle its own action
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    handleProductClick(e);
    navigate(`/product/${product.id}`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleBuyNow = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product);
  };

  return (
    <div 
      className="kalyan-product-card" 
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Image Container */}
      <div className="kalyan-img-box">
        <Link 
          to={`/product/${product.id}`} 
          className="kalyan-img-link"
          onClick={handleProductClick}
        >
          <img src={product.image} alt={product.name} className="kalyan-prod-img" loading="lazy" />
        </Link>
        
        {/* Badge */}
        <div className="kalyan-badge">{badgeText}</div>

        {/* Wishlist Button */}
        <button 
          className={`kalyan-wish-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          aria-label="Add to Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "currentColor"} />
        </button>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button 
            className="kalyan-quickview-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            <Eye size={15} /> Quick View
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="kalyan-prod-info">
        <span className="kalyan-brand-tag">KADHA SILKS</span>
        <h3 className="kalyan-prod-title">
          <Link 
            to={`/product/${product.id}`}
            onClick={handleProductClick}
          >
            {product.name}
          </Link>
        </h3>
        
        <div className="kalyan-price-row">
          <span className="regular-price-label">Regular Price</span>
          <div className="price-values">
            <span className="kalyan-sale-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="kalyan-orig-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="kalyan-card-actions">
          <button 
            className="kalyan-btn-add"
            onClick={handleAddToCart}
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
          <button 
            className="kalyan-btn-buy"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
