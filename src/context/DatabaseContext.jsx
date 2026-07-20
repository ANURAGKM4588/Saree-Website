import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { 
  products as staticProducts, 
  offers as staticOffers, 
  categories as staticCategories 
} from '../data/products';

const DatabaseContext = createContext(null);

const BASE = import.meta.env.BASE_URL || '/';

const getFullImagePath = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }
  return `${BASE}${path}`;
};

const mapProduct = (p) => {
  const isTestOneRupee = [101, 103, 105, 108, 111].includes(Number(p.id));
  return {
    id: p.id,
    name: p.name,
    material: p.material,
    price: isTestOneRupee ? 1 : Number(p.price),
    originalPrice: isTestOneRupee ? (p.original_price ? Number(p.original_price) : Number(p.price)) : (p.original_price ? Number(p.original_price) : null),
    image: getFullImagePath(p.image),
    tag: isTestOneRupee ? '₹1 Test Special' : p.tag,
    rating: Number(p.rating),
    reviews: Number(p.reviews),
    category: p.category,
    description: p.description,
    inStock: p.in_stock,
    featured: p.featured,
    comingSoon: p.coming_soon,
  };
};

const mapProductToDb = (p) => ({
  id: Number(p.id),
  name: p.name,
  material: p.material,
  price: Number(p.price),
  original_price: p.originalPrice ? Number(p.originalPrice) : null,
  image: p.image,
  tag: p.tag || null,
  rating: p.rating ? Number(p.rating) : 5.0,
  reviews: p.reviews ? Number(p.reviews) : 0,
  category: p.category,
  description: p.description || null,
  in_stock: Boolean(p.inStock),
  featured: Boolean(p.featured),
  coming_soon: Boolean(p.comingSoon),
});

const mapOffer = (o) => ({
  id: o.id,
  title: o.title,
  subtitle: o.subtitle,
  desc: o.desc,
  image: getFullImagePath(o.image),
  cta: o.cta,
  discount: o.discount,
});

export function DatabaseProvider({ children }) {
  const [products, setProducts] = useState(staticProducts);
  const [offers, setOffers] = useState(staticOffers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        // Supabase not configured, use static fallback
        setProducts(staticProducts);
        setOffers(staticOffers);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch products and offers concurrently
        const [productsRes, offersRes] = await Promise.all([
          supabase.from('products').select('*').order('id', { ascending: true }),
          supabase.from('offers').select('*').order('created_at', { ascending: true })
        ]);

        if (productsRes.error) throw productsRes.error;
        if (offersRes.error) throw offersRes.error;

        if (productsRes.data && productsRes.data.length > 0) {
          setProducts(productsRes.data.map(mapProduct));
        } else {
          console.warn('No products found in Supabase. Using local static products.');
          setProducts(staticProducts);
        }

        if (offersRes.data && offersRes.data.length > 0) {
          setOffers(offersRes.data.map(mapOffer));
        } else {
          console.warn('No offers found in Supabase. Using local static offers.');
          setOffers(staticOffers);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data from Supabase, falling back to static data:', err);
        setError(err);
        // Fallback to static data
        setProducts(staticProducts);
        setOffers(staticOffers);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Dynamically compute categories from current products list
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map((p) => p.category)));
    // Maintain a sorted order for categories, with 'All' at the beginning
    return ['All', ...uniqueCats.sort()];
  }, [products]);

  const featuredProducts = useMemo(() => products.filter((p) => p.featured), [products]);
  const comingSoonProducts = useMemo(() => products.filter((p) => p.comingSoon), [products]);
  const onSaleProducts = useMemo(() => products.filter((p) => p.originalPrice), [products]);

  const getProductById = useCallback((id) => {
    return products.find((p) => p.id === Number(id));
  }, [products]);

  // Save newsletter subscription to Supabase
  const subscribeToNewsletter = useCallback(async (email) => {
    if (!supabase) {
      console.warn('Supabase not configured. Newsletter subscription simulated successfully.');
      return { success: true, error: null };
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) {
        // If it's a unique constraint error, we can treat it as success or return specific error
        if (error.code === '23505') {
          return { success: true, alreadySubscribed: true, error: null };
        }
        throw error;
      }
      return { success: true, error: null };
    } catch (err) {
      console.error('Failed to subscribe to newsletter:', err);
      return { success: false, error: err };
    }
  }, []);

  // Save product notification alert to Supabase
  const registerNotification = useCallback(async (productId, email) => {
    if (!supabase) {
      console.warn('Supabase not configured. Product notification simulated successfully.');
      return { success: true, error: null };
    }

    try {
      const { error } = await supabase
        .from('product_notifications')
        .insert([{ product_id: productId, email }]);

      if (error) {
        if (error.code === '23505') {
          return { success: true, alreadyRegistered: true, error: null };
        }
        throw error;
      }
      return { success: true, error: null };
    } catch (err) {
      console.error('Failed to register product notification:', err);
      return { success: false, error: err };
    }
  }, []);

  // Add Product to database and local state
  const addProduct = useCallback(async (productData) => {
    if (!supabase) {
      const newProduct = { ...productData, id: productData.id || Date.now() };
      setProducts((prev) => [...prev, mapProduct(mapProductToDb(newProduct))]);
      return { success: true };
    }

    try {
      const dbProduct = mapProductToDb(productData);
      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        setProducts((prev) => [...prev, mapProduct(data[0])]);
      }
      return { success: true };
    } catch (err) {
      console.error('Failed to add product:', err);
      return { success: false, error: err };
    }
  }, []);

  // Update Product in database and local state
  const updateProduct = useCallback(async (id, productData) => {
    if (!supabase) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...productData } : p)));
      return { success: true };
    }

    try {
      const dbProduct = mapProductToDb({ ...productData, id });
      const { data, error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        setProducts((prev) => prev.map((p) => (p.id === id ? mapProduct(data[0]) : p)));
      }
      return { success: true };
    } catch (err) {
      console.error('Failed to update product:', err);
      return { success: false, error: err };
    }
  }, []);

  // Delete Product from database and local state
  const deleteProduct = useCallback(async (id) => {
    if (!supabase) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete product:', err);
      return { success: false, error: err };
    }
  }, []);

  const value = useMemo(
    () => ({
      products,
      offers,
      categories,
      featuredProducts,
      comingSoonProducts,
      onSaleProducts,
      loading,
      error,
      getProductById,
      subscribeToNewsletter,
      registerNotification,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      products,
      offers,
      categories,
      featuredProducts,
      comingSoonProducts,
      onSaleProducts,
      loading,
      error,
      getProductById,
      subscribeToNewsletter,
      registerNotification,
      addProduct,
      updateProduct,
      deleteProduct,
    ]
  );

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
