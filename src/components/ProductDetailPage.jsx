import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Shield, Truck, RotateCcw, CheckCircle2, ThumbsUp, MessageSquarePlus, Quote, X, Sparkles, Upload, Send, User, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { useDatabase } from '../context/DatabaseContext';
import CheckoutModal from './CheckoutModal';
import './ProductDetailPage.css';

const sampleReviewsList = [
  {
    id: 1,
    author: 'Sunita Reddy',
    location: 'Hyderabad, India',
    rating: 5,
    date: '12 June 2026',
    verified: true,
    title: 'Exquisite Silk & Royal Finish!',
    comment: 'The saree is absolutely breathtaking! Pure silk feel with heavy zari border that gleams under wedding lights. Received so many compliments. Packaging was super premium too.',
    image: '/image/saree/Folded_pure_kanjivaram_silk_saree_crimson_red_gold_zari.webp'
  },
  {
    id: 2,
    author: 'Dr. Meera Menon',
    location: 'Bangalore, India',
    rating: 5,
    date: '28 May 2026',
    verified: true,
    title: 'Authentic Traditional Craft',
    comment: 'I ordered this for my sister’s engagement. The color matching and pallu embroidery are identical to what was shown in video shopping. Highly recommend KADHA Silks!',
    image: '/image/saree/folded-kanjivaram-silk-saree-green-golden-pallu.webp'
  },
  {
    id: 3,
    author: 'Ananya Nair',
    location: 'Kochi, Kerala',
    rating: 5,
    date: '10 April 2026',
    verified: true,
    title: 'Pure Perfection & Super Comfort',
    comment: 'The drape is incredibly soft and easy to carry for long hours. Includes a matching unstitched blouse piece. Express delivery arrived in just 2 days!',
    image: '/image/saree/Katan_silk_saree_yellow_gold_zari.webp'
  }
];

export default function ProductDetailPage({ isGalleryView = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, setIsCartOpen } = useCart();
  const { getProductById, loading } = useDatabase();
  const product = getProductById(id);

  const isFromGallery = isGalleryView || location.pathname.startsWith('/gallery/') || sessionStorage.getItem('from_gallery') === 'true';

  const handleBackToGallery = (e) => {
    if (e) e.preventDefault();
    sessionStorage.setItem('return_to_gallery', 'true');
    sessionStorage.removeItem('from_gallery');
    document.documentElement.style.scrollBehavior = 'auto';
    navigate('/');
  };

  const handleBackToHome = (e) => {
    if (e) e.preventDefault();
    document.documentElement.style.scrollBehavior = 'auto';
    navigate('/');
  };

  const getProductAngleImages = (p) => {
    if (!p) return [];
    if (p.images && p.images.length > 0) return p.images;
    const defaultAngles = [
      p.image,
      '/image/saree/Folded_pure_kanjivaram_silk_saree_crimson_red_gold_zari.webp',
      '/image/saree/folded-kanjivaram-silk-saree-green-golden-pallu.webp',
      '/image/saree/5_73_7415436e-9226-4442-9a42-d47387d04730.webp',
      '/image/saree/IMG20250515110716.jpg'
    ];
    return Array.from(new Set([p.image, ...defaultAngles])).slice(0, 4);
  };

  const angleImages = getProductAngleImages(product);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id]);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState(sampleReviewsList);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState({ 1: 24, 2: 18, 3: 15 });

  const [currentUser, setCurrentUser] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const isOwnerOfReview = (rev) => {
    if (!rev) return false;
    if (rev.isUserOwned) return true;
    const currentUserKey = currentUser?.email || currentUser?.name;
    if (!currentUserKey) return false;
    if (rev.userKey && rev.userKey === currentUserKey) return true;
    if (rev.author && rev.author === currentUser?.name) return true;
    return false;
  };

  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem('kadha_customer_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.name) {
            setCurrentUser(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadUser();
    window.addEventListener('kadha_user_changed', loadUser);
    return () => window.removeEventListener('kadha_user_changed', loadUser);
  }, []);

  // Load and merge persisted user reviews for this product
  useEffect(() => {
    if (!product?.id) return;

    try {
      const stored = localStorage.getItem('kadha_all_user_reviews');
      const allSavedReviews = stored ? JSON.parse(stored) : [];
      const productReviews = allSavedReviews.filter(
        (r) => String(r.productId) === String(product.id)
      );

      // Set combined reviews list
      setReviewsList([...productReviews, ...sampleReviewsList]);

      // Check if current user has already reviewed this product
      const userKey = currentUser?.email || currentUser?.name || 'guest_device';
      const hasRev = productReviews.some(
        (r) => r.userKey === userKey || (currentUser?.name && r.author === currentUser.name)
      );
      setUserHasReviewed(hasRev);
    } catch (e) {
      console.error(e);
      setReviewsList(sampleReviewsList);
    }
  }, [product?.id, currentUser]);

  const handleOpenReviewModal = () => {
    setEditingReviewId(null);
    setReviewRating(5);
    setReviewComment('');
    setImagePreview(null);
    setReviewSubmitted(false);
    setIsReviewModalOpen(true);
  };

  const handleEditReview = (rev) => {
    setEditingReviewId(rev.id);
    setReviewRating(rev.rating || 5);
    setReviewComment(rev.comment || '');
    setImagePreview(rev.image || null);
    setReviewSubmitted(false);
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;

    setReviewsList((prev) => prev.filter((r) => r.id !== reviewId));

    try {
      // Remove from kadha_all_user_reviews
      const stored = localStorage.getItem('kadha_all_user_reviews');
      if (stored) {
        const list = JSON.parse(stored);
        const filtered = list.filter((r) => r.id !== reviewId);
        localStorage.setItem('kadha_all_user_reviews', JSON.stringify(filtered));
      }

      // Remove lock from kadha_submitted_reviews
      const userKey = currentUser?.email || currentUser?.name || 'guest_device';
      const storedLocks = localStorage.getItem('kadha_submitted_reviews');
      if (storedLocks) {
        const list = JSON.parse(storedLocks);
        const filtered = list.filter(
          (item) => !(item.userKey === userKey && String(item.productId) === String(product.id))
        );
        localStorage.setItem('kadha_submitted_reviews', JSON.stringify(filtered));
      }
    } catch (err) {
      console.error(err);
    }

    setUserHasReviewed(false);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const userKey = currentUser?.email || currentUser?.name || 'guest_device';
    const authorName = currentUser?.name || 'Verified Customer';

    if (editingReviewId) {
      setReviewsList((prev) =>
        prev.map((rev) =>
          rev.id === editingReviewId
            ? {
                ...rev,
                rating: reviewRating,
                title: `${reviewRating}-Star Drape Review`,
                comment: reviewComment.trim(),
                image: imagePreview || null,
              }
            : rev
        )
      );

      try {
        const stored = localStorage.getItem('kadha_all_user_reviews');
        if (stored) {
          const list = JSON.parse(stored);
          const updatedList = list.map((r) =>
            r.id === editingReviewId
              ? {
                  ...r,
                  rating: reviewRating,
                  title: `${reviewRating}-Star Drape Review`,
                  comment: reviewComment.trim(),
                  image: imagePreview || null,
                }
              : r
          );
          localStorage.setItem('kadha_all_user_reviews', JSON.stringify(updatedList));
        }
      } catch (err) {
        console.error(err);
      }

      setEditingReviewId(null);
      setReviewSubmitted(true);
      return;
    }

    const createdReview = {
      id: Date.now(),
      productId: product.id,
      userKey: userKey,
      isUserOwned: true,
      author: authorName,
      location: 'Verified Buyer',
      rating: reviewRating,
      date: 'Just Now',
      verified: true,
      title: `${reviewRating}-Star Drape Review`,
      comment: reviewComment.trim(),
      image: imagePreview || null
    };

    try {
      const stored = localStorage.getItem('kadha_all_user_reviews');
      const list = stored ? JSON.parse(stored) : [];
      const updatedList = list.filter(
        (item) => !(item.userKey === userKey && String(item.productId) === String(product.id))
      );
      updatedList.unshift(createdReview);
      localStorage.setItem('kadha_all_user_reviews', JSON.stringify(updatedList));

      const storedLocks = localStorage.getItem('kadha_submitted_reviews');
      const locksList = storedLocks ? JSON.parse(storedLocks) : [];
      locksList.push({ userKey, productId: product.id, timestamp: Date.now() });
      localStorage.setItem('kadha_submitted_reviews', JSON.stringify(locksList));
    } catch (err) {
      console.error(err);
    }

    setReviewsList((prev) => [createdReview, ...prev]);
    setUserHasReviewed(true);
    setReviewSubmitted(true);
  };

  // Synchronous zero-scroll-animation positioning before screen paint
  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="pdp-not-found">
        <h2>Saree not found</h2>
        <Link to="/products">Browse all sarees</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    setIsCheckoutOpen(true);
  };

  const handleHelpfulClick = (revId) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [revId]: (prev[revId] || 0) + 1
    }));
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Clean horizontal animation variants
  const slideFromLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] }
  };

  const slideFromRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] }
  };

  return (
    <div className="pdp-page" key={product.id}>
      <div className="pdp-container">
        {/* Top Breadcrumb Path Navigation */}
        <div className="pdp-breadcrumb">
          {isFromGallery ? (
            <>
              <button
                type="button"
                className="pdp-gallery-back-btn"
                onClick={handleBackToGallery}
              >
                <ArrowLeft size={15} /> Back to Gallery
              </button>
              <span className="pdp-breadcrumb-sep">|</span>
              <Link to="/" onClick={handleBackToGallery} className="pdp-breadcrumb-link">
                Gallery
              </Link>
              <span className="pdp-breadcrumb-dash">—</span>
              <Link to="/" onClick={handleBackToGallery} className="pdp-breadcrumb-link">
                Collections
              </Link>
              <span className="pdp-breadcrumb-sep">/</span>
              <span className="pdp-current">{product.name}</span>
            </>
          ) : (
            <>
              <Link to="/" onClick={handleBackToHome}>Home</Link>
              <span>/</span>
              <Link to="/products" className="pdp-breadcrumb-link">
                All Sarees
              </Link>
              <span>/</span>
              <span className="pdp-current">{product.name}</span>
            </>
          )}
        </div>

        {/* Top Product Main Grid */}
        <div className="pdp-layout">
          {/* Product Image Column with Multiple Angles */}
          <motion.div
            key={`img-${product.id}`}
            className="pdp-image-col"
            initial={slideFromLeft.initial}
            animate={slideFromLeft.animate}
            transition={slideFromLeft.transition}
          >
            <div className="pdp-image-wrapper">
              {product.tag && <div className="pdp-tag">{product.tag}</div>}
              {discount > 0 && <div className="pdp-discount">-{discount}%</div>}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={angleImages[activeImageIndex] || product.image}
                  alt={`${product.name} Angle ${activeImageIndex + 1}`}
                  className="pdp-image"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>
            </div>

            {/* Multiple Angles Gallery Selector Strip */}
            <div className="pdp-angle-gallery-strip">
              <span className="pdp-angle-strip-title">Saree Drape Angles & Details:</span>
              <div className="pdp-thumbs-row">
                {angleImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`pdp-angle-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    title={`View Angle ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`Angle ${idx + 1}`} />
                    <span className="pdp-angle-badge">
                      {idx === 0 ? 'Full View' : idx === 1 ? 'Pallu Zari' : idx === 2 ? 'Border Work' : 'Fold Display'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Details: Clean Horizontal Slide from RIGHT to LEFT with Fade */}
          <motion.div
            key={`text-${product.id}`}
            className="pdp-details-col"
            initial={slideFromRight.initial}
            animate={slideFromRight.animate}
            transition={slideFromRight.transition}
          >
            <span className="pdp-material">{product.material || 'Authentic Silk'}</span>
            <h1 className="pdp-name">{product.name}</h1>

            <div className="pdp-rating">
              <div className="pdp-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(product.rating || 5) ? '#c89d36' : 'none'}
                    color="#c89d36"
                  />
                ))}
              </div>
              <span className="pdp-rating-text">
                {product.rating || 4.9} ({product.reviews || 89} customer reviews)
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

            <p className="pdp-tax">Inclusive of all taxes & free express shipping</p>

            <p className="pdp-description">{product.description || 'Luxurious authentic silk handwoven with traditional precision. Features detailed zari borders and rich texture.'}</p>

            <div className="pdp-category-row">
              <span className="pdp-category-label">Category:</span>
              <span className="pdp-category-value">{product.category}</span>
            </div>

            <div className="pdp-stock-row">
              <span className={`pdp-stock-dot ${product.inStock ? 'in' : 'out'}`} />
              <span>{product.inStock ? 'In Stock — Ready for Express Dispatch' : 'Currently Out of Stock'}</span>
              {product.comingSoon && <span className="pdp-coming-tag">Coming Soon</span>}
            </div>

            {/* Action Buttons */}
            <div className="pdp-actions">
              <button
                className="pdp-add-cart"
                onClick={handleAddToCart}
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
                <span>Free express shipping worldwide</span>
              </div>
              <div className="pdp-feature">
                <Shield size={16} />
                <span>100% Silk Mark certified authenticity guaranteed</span>
              </div>
              <div className="pdp-feature">
                <RotateCcw size={16} />
                <span>15-day easy returns & doorstep exchange</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Royal Heritage Craft & Feature Poster Banner */}
        <div className="pdp-feature-poster-banner">
          <div className="pdp-poster-content-wrapper">
            <div className="pdp-poster-header text-center">
              <div className="pdp-poster-badge">
                <Sparkles size={14} className="sparkle-gold" />
                <span>HERITAGE WEAVE SPECIFICATIONS & CRAFT POSTER</span>
              </div>
              <h2 className="pdp-poster-title">Authentic Handcrafted Masterpiece</h2>
              <p className="pdp-poster-subtitle">
                Woven by Master Artisans in South India using centuries-old silk preservation techniques
              </p>
            </div>

            <div className="pdp-poster-grid">
              <div className="pdp-poster-item">
                <div className="pdp-poster-icon">🏆</div>
                <div className="pdp-poster-text">
                  <h3>100% Silk Mark Certified</h3>
                  <p>Guaranteed authentic 100% natural Mulberry & Kanchipuram silk thread with Government certification tag.</p>
                </div>
              </div>

              <div className="pdp-poster-item">
                <div className="pdp-poster-icon">✨</div>
                <div className="pdp-poster-text">
                  <h3>Pure Gold-Tested Zari Weave</h3>
                  <p>Intricate temple border, floral jaal, and grand pallu motifs woven with authentic tested gold zari threads.</p>
                </div>
              </div>

              <div className="pdp-poster-item">
                <div className="pdp-poster-icon">🧵</div>
                <div className="pdp-poster-text">
                  <h3>Traditional Korvai Interlock</h3>
                  <p>Dual-shuttle handloom technique seamlessly joining heavy contrasting body, rich border, and ceremonial pallu.</p>
                </div>
              </div>

              <div className="pdp-poster-item">
                <div className="pdp-poster-icon">👚</div>
                <div className="pdp-poster-text">
                  <h3>Matching Unstitched Blouse Piece</h3>
                  <p>Includes an 80cm authentic matching silk blouse fabric complete with heavy zari border work.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Listing Section: Specifications & Customer Reviews Stacked */}
        <div className="pdp-listing-container">
          {/* Section 1: Product Specifications List */}
          <motion.div 
            className="listing-section"
            initial={slideFromLeft.initial}
            animate={slideFromLeft.animate}
            transition={slideFromLeft.transition}
          >
            <h2 className="listing-section-title">Product Specifications</h2>
            <div className="specs-list">
              <div className="spec-item-row">
                <span className="spec-label">Fabric Material</span>
                <span className="spec-val">{product.material || 'Pure Kanjivaram Silk'}</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-label">Weave Craft</span>
                <span className="spec-val">{product.weave || 'Traditional Handloom Zari'}</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-label">Saree Length</span>
                <span className="spec-val">5.5 Meters</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-label">Blouse Piece</span>
                <span className="spec-val">0.8 Meter Unstitched (Included)</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-label">Authenticity</span>
                <span className="spec-val">Silk Mark Certified 100% Genuine</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-label">Care Instructions</span>
                <span className="spec-val">Dry Clean Only • Store in Muslin Cloth • Low Heat Ironing</span>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Warm & Good Feeling Customer Reviews Listing */}
          <motion.div 
            className="listing-section warm-reviews-wrapper"
            initial={slideFromRight.initial}
            animate={slideFromRight.animate}
            transition={slideFromRight.transition}
          >
            <div className="reviews-header-banner">
              <div>
                <span className="rh-sub">COMMUNITY LOVE</span>
                <h2 className="rh-title">Customer Stories & Feedback</h2>
              </div>
              <div className="rh-right-box">
                <div className="rh-rating-badge">
                  <Star size={18} fill="#c89d36" color="#c89d36" />
                  <span className="rh-rating-num">4.9 / 5.0</span>
                  <span className="rh-count">({(product.reviews || 89) + (reviewsList.length - sampleReviewsList.length)} Reviews)</span>
                </div>
                <button 
                  className="rh-write-btn"
                  onClick={handleOpenReviewModal}
                >
                  <MessageSquarePlus size={15} /> Write a Review
                </button>
              </div>
            </div>

            <div className="reviews-warm-list">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="warm-review-card">
                  <Quote size={28} className="warm-quote-icon" />

                  <div className="wrc-top-bar">
                    <div className="wrc-user-profile">
                      <div className="wrc-avatar-circle">
                        {rev.author ? rev.author[0].toUpperCase() : 'U'}
                      </div>
                      <div className="wrc-user-meta">
                        <div className="wrc-author-name-row">
                          <h4 className="wrc-author-name">{rev.author}</h4>
                          {rev.verified && (
                            <span className="wrc-verified-badge"><CheckCircle2 size={12} /> Verified Buyer</span>
                          )}
                        </div>
                        <span className="wrc-location-date">{rev.location} • {rev.date}</span>
                      </div>
                    </div>

                    <div className="wrc-stars-box">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={15} fill={s <= (rev.rating || 5) ? "#c89d36" : "none"} color="#c89d36" />
                      ))}
                    </div>
                  </div>

                  <h3 className="wrc-review-title">{rev.title}</h3>
                  <p className="wrc-review-text">"{rev.comment}"</p>

                  {rev.image && (
                    <div className="wrc-photo-frame">
                      <img src={rev.image} alt={rev.title} className="wrc-photo-img" />
                      <span className="wrc-photo-label">Customer Drape Photo</span>
                    </div>
                  )}

                  <div className="wrc-footer">
                    <button 
                      className="wrc-helpful-btn"
                      onClick={() => handleHelpfulClick(rev.id)}
                    >
                      <ThumbsUp size={13} /> Helpful ({helpfulCounts[rev.id] || 0})
                    </button>

                    {isOwnerOfReview(rev) && (
                      <div className="user-review-owner-actions">
                        <button 
                          className="owner-action-btn edit-btn"
                          onClick={() => handleEditReview(rev)}
                          title="Edit Your Review"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button 
                          className="owner-action-btn delete-btn"
                          onClick={() => handleDeleteReview(rev.id)}
                          title="Delete Your Review"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="write-review-modal-backdrop" onClick={() => setIsReviewModalOpen(false)}>
            <motion.div 
              className="write-review-modal-box"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="review-modal-header">
                <div className="review-modal-title-group">
                  <Sparkles size={22} className="gold-sparkle-icon" />
                  <div>
                    <h3>{editingReviewId ? 'Edit Your Customer Review' : 'Write a Customer Review'}</h3>
                    <p className="review-modal-subtitle">Share your authentic drape experience for {product.name}</p>
                  </div>
                </div>
                <button className="review-modal-close-btn" onClick={() => setIsReviewModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              {userHasReviewed && !editingReviewId && !reviewSubmitted ? (
                <div className="review-already-submitted-state">
                  <div className="already-icon-wrap">
                    <CheckCircle2 size={40} className="already-check-icon" />
                  </div>
                  <span className="already-subtitle">REVIEW SUBMITTED</span>
                  <h4 className="already-title">You Have Reviewed This Saree</h4>
                  <p className="already-message">
                    You have submitted a verified review for <strong>{product.name}</strong> from your account ({currentUser ? currentUser.name : 'your profile'}). You can edit your existing review or delete it anytime.
                  </p>
                  <div className="already-actions-row" style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    {reviewsList.find((r) => isOwnerOfReview(r)) && (
                      <button 
                        className="review-done-btn" 
                        style={{ background: 'var(--gradient-gold)', color: '#ffffff' }}
                        onClick={() => {
                          const myRev = reviewsList.find((r) => isOwnerOfReview(r));
                          if (myRev) handleEditReview(myRev);
                        }}
                      >
                        <Pencil size={15} /> Edit My Review
                      </button>
                    )}
                    <button className="review-done-btn" onClick={() => setIsReviewModalOpen(false)}>
                      Close
                    </button>
                  </div>
                </div>
              ) : reviewSubmitted ? (
                <motion.div 
                  className="review-success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={36} className="success-check-icon" />
                  </div>
                  <span className="success-subtitle">FEEDBACK SAVED</span>
                  <h4 className="success-title">{editingReviewId ? 'Review Updated Successfully!' : 'Thank You for Your Review!'}</h4>
                  <p className="success-message">
                    Your authentic review has been published and updated in the customer stories section.
                  </p>
                  <button className="review-done-btn" onClick={() => setIsReviewModalOpen(false)}>
                    Done
                  </button>
                </motion.div>
              ) : (
                <form className="simple-review-form" onSubmit={handleReviewSubmit}>
                  {/* Account Name Indicator */}
                  <div className="review-user-badge-row">
                    <div className="review-user-avatar">
                      <User size={16} />
                    </div>
                    <div className="review-user-info">
                      <span className="review-user-label">Reviewing as</span>
                      <h4 className="review-user-name">{currentUser ? currentUser.name : 'Verified Customer'}</h4>
                    </div>
                  </div>

                  {/* Star Selection */}
                  <div className="star-rating-block">
                    <label className="star-picker-title">Select Star Rating</label>
                    <div className="star-picker-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className={`star-pick-btn ${star <= (hoverRating || reviewRating) ? 'active' : ''}`}
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <Star 
                            size={28} 
                            fill={(hoverRating || reviewRating) >= star ? '#c89d36' : 'none'} 
                            color="#c89d36" 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Writing Textarea */}
                  <div className="review-textarea-group">
                    <label className="review-textarea-label">Write Your Review *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Write your thoughts about this saree, silk texture, drape comfort, or zari sheen..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="review-textarea"
                    />
                  </div>

                  {/* Image Uploading Option */}
                  <div className="image-upload-group">
                    <label className="image-upload-label">Upload Drape Photo (Optional)</label>
                    {imagePreview ? (
                      <div className="uploaded-img-preview-box">
                        <img src={imagePreview} alt="Drape preview" className="uploaded-img-preview" />
                        <button type="button" className="remove-img-btn" onClick={handleRemoveImage} title="Remove Image">
                          <X size={14} /> Remove Photo
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="review-photo-file" className="custom-file-upload-btn">
                        <Upload size={18} /> Choose Photo File
                        <input
                          type="file"
                          id="review-photo-file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Submit & Cancel Buttons */}
                  <div className="review-modal-actions">
                    <button type="button" className="cancel-review-btn" onClick={() => setIsReviewModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-review-btn">
                      <Send size={16} /> {editingReviewId ? 'Update Review' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Razorpay Checkout Modal for Direct Buy Now */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={[{ ...product, qty: 1 }]}
        total={product.price}
      />
    </div>
  );
}
