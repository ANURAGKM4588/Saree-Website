import React, { useLayoutEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { DatabaseProvider } from './context/DatabaseContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CelebrateOccasion from './components/CelebrateOccasion';
import ShopByOccasion from './components/ShopByOccasion';
import BridalBanner from './components/BridalBanner';
import NewArrivals from './components/NewArrivals';
import BestSellers from './components/BestSellers';
import FeaturedCollections from './components/FeaturedCollections';
import Testimonials from './components/Testimonials';
import TrustBenefits from './components/TrustBenefits';
import Footer from './components/Footer';
import ProductsPage from './components/ProductsPage';
import BestsellersPage from './components/BestsellersPage';
import ProductDetailPage from './components/ProductDetailPage';
import WishlistPage from './components/WishlistPage';
import AdminPanel from './components/AdminPanel';
import StorySection from './components/StorySection';
import SareeGallerySection from './components/SareeGallerySection';
import FirstTimeSiteLoader from './components/FirstTimeSiteLoader';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    // Check if returning from gallery product details
    const returnToGallery = sessionStorage.getItem('return_to_gallery');
    if (returnToGallery === 'true' && pathname === '/') {
      sessionStorage.removeItem('return_to_gallery');
      document.documentElement.style.scrollBehavior = 'auto';
      setTimeout(() => {
        const galEl = document.getElementById('saree-drape-lookbook');
        if (galEl) {
          galEl.scrollIntoView({ block: 'start', behavior: 'instant' });
        } else {
          const lastScroll = sessionStorage.getItem('last_scroll_pos');
          if (lastScroll) {
            window.scrollTo({ top: parseInt(lastScroll, 10), left: 0, behavior: 'instant' });
          }
        }
      }, 30);
      return;
    }

    // Check if we are returning to the products catalog page from a product detail page
    const lastId = sessionStorage.getItem('last_viewed_product_id');
    const lastScroll = sessionStorage.getItem('last_scroll_pos');

    if ((pathname === '/products' || pathname === '/bestsellers') && lastId) {
      document.documentElement.style.scrollBehavior = 'auto';
      const targetElement = document.getElementById(`product-card-${lastId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ block: 'center', behavior: 'instant' });
      } else if (lastScroll) {
        window.scrollTo({ top: parseInt(lastScroll, 10), left: 0, behavior: 'instant' });
      }
      sessionStorage.removeItem('last_viewed_product_id');
      sessionStorage.removeItem('last_scroll_pos');
    } else {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
}

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <CelebrateOccasion />
      <StorySection />
      <ShopByOccasion />
      <BridalBanner />
      <SareeGallerySection />
      <NewArrivals />
      <BestSellers />
      <FeaturedCollections />
      <Testimonials />
      <TrustBenefits />
      <Footer />
    </>
  );
}

function App() {
  return (
    <DatabaseProvider>
      <CartProvider>
        <HashRouter>
          <FirstTimeSiteLoader />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<><Navbar /><ProductsPage /><Footer /></>} />
            <Route path="/bestsellers" element={<><Navbar /><BestsellersPage /><Footer /></>} />
            <Route path="/product/:id" element={<><Navbar /><ProductDetailPage /><Footer /></>} />
            <Route path="/gallery/product/:id" element={<><Navbar /><ProductDetailPage isGalleryView={true} /><Footer /></>} />
            <Route path="/wishlist" element={<><Navbar /><WishlistPage /><Footer /></>} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </HashRouter>
      </CartProvider>
    </DatabaseProvider>
  );
}

export default App;
