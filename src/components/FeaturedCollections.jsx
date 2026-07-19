import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import './FeaturedCollections.css';

export default function FeaturedCollections() {
  const navigate = useNavigate();
  const { featuredProducts } = useDatabase();
  const { addToCart, setIsCartOpen, wishlist, toggleWishlist } = useCart();
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleToggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleBuyNow = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <section className="featured-section" id="collections">
      <div className="featured-container">
        <div className="section-header">
          <div>
            <span className="section-subtitle">HANDPICKED MASTERPIECES</span>
            <h2 className="section-title">Our Featured Collection</h2>
          </div>
          <Link to="/products" className="view-all-link">
            VIEW ALL PRODUCTS
          </Link>
        </div>

        <div className="slider-container">
          <button 
            className="slider-arrow left" 
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="products-slider" ref={sliderRef}>
            {featuredProducts.map((product) => {
              const discount = product.originalPrice 
                ? Math.round((1 - product.price / product.originalPrice) * 100)
                : null;

              return (
                <div key={product.id} className="featured-product-card-wrap">
                  <Link to={`/product/${product.id}`} className="featured-product-card">
                    {/* Image Area */}
                    <div className="product-image-container">
                      <img src={product.image} alt={product.name} className="product-img" />
                      
                      <button 
                        className={`wishlist-toggle ${wishlist.includes(product.id) ? 'active' : ''}`}
                        onClick={(e) => handleToggleWishlist(product.id, e)}
                        aria-label="Add to Wishlist"
                      >
                        <Heart size={18} fill={wishlist.includes(product.id) ? "var(--color-gold)" : "none"} color={wishlist.includes(product.id) ? "var(--color-gold)" : "currentColor"} />
                      </button>

                      {discount && (
                        <div className="discount-badge">-{discount}%</div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="product-info-wrap">
                      <span className="product-brand">KADHA HERITAGE</span>
                      <h3 className="product-title-text">{product.name}</h3>
                      <div className="product-price-block">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <>
                            <span className="original-price">{formatPrice(product.originalPrice)}</span>
                            <span className="discount-pct">({discount}% OFF)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  {/* Actions */}
                  <div className="product-actions-hover">
                    <button 
                      className="add-to-bag-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      <ShoppingBag size={14} /> Add to Bag
                    </button>
                    <button 
                      className="buy-now-btn"
                      onClick={(e) => handleBuyNow(product, e)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            className="slider-arrow right" 
            onClick={() => scroll('right')}
            aria-label="Scroll Right"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
