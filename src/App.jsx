import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShoppingSection from './components/ShoppingSection';
import StorySection from './components/StorySection';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <ShoppingSection />
      <StorySection />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<><Navbar /><ProductsPage /></>} />
          <Route path="/product/:id" element={<><Navbar /><ProductDetailPage /></>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
