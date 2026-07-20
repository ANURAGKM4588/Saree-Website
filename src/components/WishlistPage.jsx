import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Trash2, Sparkles, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useDatabase } from '../context/DatabaseContext';
import { formatPrice } from '../data/products';
import './WishlistPage.css';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart, setIsCartOpen } = useCart();
  const { products: dbProducts } = useDatabase();

  const likedProducts = (dbProducts || []).filter((p) => wishlist.includes(p.id));

  return (
    <div className="wishlist-page-container">
      <div className="wishlist-page-header">
        <button className="back-btn" onClick={() => navigate('/products')}>
          <ArrowLeft size={18} /> Back to Catalog
        </button>
        <div className="wishlist-page-title-wrap">
          <Heart size={32} fill="var(--color-accent-gold)" color="var(--color-accent-gold)" />
          <h1 className="wishlist-page-title">My Liked Sarees ({likedProducts.length})</h1>
        </div>
        <p className="wishlist-page-subtitle">
          Your curated collection of handpicked luxury silk sarees.
        </p>
      </div>

      <div className="wishlist-page-content">
        {likedProducts.length === 0 ? (
          <div className="empty-wishlist-box">
            <Heart size={64} color="var(--color-accent-gold)" fill="rgba(200, 157, 54, 0.15)" className="empty-wishlist-icon" />
            <h2>Your Wishlist is Empty</h2>
            <p>You haven't saved any sarees yet. Explore our luxury collection and tap the heart icon on any saree to save it here.</p>
            <button className="explore-catalog-btn" onClick={() => navigate('/products')}>
              Explore Pure Silk Sarees <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {likedProducts.map((product) => (
              <div key={product.id} className="wishlist-card">
                <div 
                  className="wishlist-card-img-wrapper"
                  onClick={() => {
                    sessionStorage.setItem('last_scroll_pos', window.scrollY.toString());
                    navigate(`/product/${product.id}`);
                  }}
                >
                  <img src={product.image} alt={product.name} className="wishlist-card-img" />
                  <span className="wishlist-badge">{product.material}</span>
                  <button 
                    className="remove-wishlist-card-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    title="Remove from Liked Sarees"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="wishlist-card-info">
                  <h3 
                    className="wishlist-card-name"
                    onClick={() => {
                      sessionStorage.setItem('last_scroll_pos', window.scrollY.toString());
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    {product.name}
                  </h3>
                  <div className="wishlist-card-price">{formatPrice(product.price)}</div>

                  <button 
                    className="wishlist-add-bag-btn"
                    onClick={() => {
                      addToCart(product);
                      setIsCartOpen(true);
                    }}
                  >
                    <ShoppingBag size={16} /> Move to Shopping Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
