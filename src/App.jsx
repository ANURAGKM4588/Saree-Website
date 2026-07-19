import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { DatabaseProvider } from './context/DatabaseContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CelebrateOccasion from './components/CelebrateOccasion';
import ShopByOccasion from './components/ShopByOccasion';
import NewArrivals from './components/NewArrivals';
import FeaturedCollections from './components/FeaturedCollections';
import Testimonials from './components/Testimonials';
import TrustBenefits from './components/TrustBenefits';
import Footer from './components/Footer';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import AdminPanel from './components/AdminPanel';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <CelebrateOccasion />
      <ShopByOccasion />
      <NewArrivals />
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
