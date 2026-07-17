import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { DatabaseProvider } from './context/DatabaseContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBenefits from './components/TrustBenefits';
import FeaturedCollections from './components/FeaturedCollections';
import StorySection from './components/StorySection';
import ShoppingSection from './components/ShoppingSection';
import BestSellers from './components/BestSellers';
import BridalBanner from './components/BridalBanner';
import WhyChooseSutra from './components/WhyChooseSutra';
import Testimonials from './components/Testimonials';
import GallerySection from './components/GallerySection';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustBenefits />
      <FeaturedCollections />
        <StorySection />
        <ShoppingSection />
        <BestSellers />
      <BridalBanner />
      <WhyChooseSutra />
      <Testimonials />
      <GallerySection />
      <Newsletter />
      <Footer />
    </>
  );
}

import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <DatabaseProvider>
      <CartProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<><Navbar /><ProductsPage /></>} />
            <Route path="/product/:id" element={<><Navbar /><ProductDetailPage /></>} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </HashRouter>
      </CartProvider>
    </DatabaseProvider>
  );
}

export default App;
