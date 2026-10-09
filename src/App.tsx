import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Product, Category, StoreSettings } from './types';
import { initialProducts, initialCategories } from './db/seedData';

// Components
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { NewArrivalsPage } from './pages/NewArrivalsPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TestPayPage } from './pages/TestPayPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch live products, categories, settings from server
  const fetchStoreData = async () => {
    try {
      const [prodRes, catRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/settings'),
      ]);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData) && prodData.length > 0) {
          setProducts(prodData);
        }
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        if (Array.isArray(catData)) setCategories(catData);
      }
      if (setRes.ok) {
        setSettings(await setRes.json());
      }
    } catch {
      // Use seeded initial products if network delay
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.slug}`);
  };

  // Determine active view
  const isAdminRoute = currentPath.startsWith('/admin');
  const isTestPayRoute = currentPath.startsWith('/checkout/test-pay');

  const renderCurrentPage = () => {
    // 1. Product Detail Page
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '');
      const productToShow = selectedProduct || products.find(p => p.slug === slug || p.id === slug) || products[0];
      return (
        <ProductDetailPage
          product={productToShow}
          onBack={() => navigate('/shop')}
          navigate={navigate}
          relatedProducts={products.filter(p => p.id !== productToShow.id)}
          onSelectProduct={handleSelectProduct}
        />
      );
    }

    // 2. Specific routes
    switch (currentPath) {
      case '/shop':
        return (
          <ShopPage
            products={products}
            categories={categories}
            onSelectProduct={handleSelectProduct}
          />
        );
      case '/new-arrivals':
        return (
          <NewArrivalsPage
            products={products}
            onSelectProduct={handleSelectProduct}
            navigate={navigate}
          />
        );
      case '/collections':
        return (
          <CollectionsPage
            products={products}
            navigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        );
      case '/cart':
        return <CartPage navigate={navigate} />;
      case '/checkout':
        return <CheckoutPage navigate={navigate} />;
      case '/checkout/test-pay':
        return <TestPayPage />;
      case '/checkout/verify':
        return <OrderConfirmationPage navigate={navigate} />;
      case '/track':
        return <OrderTrackingPage />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/contact':
        return <ContactPage />;
      case '/faq':
        return <FaqPage />;
      case '/shipping-policy':
        return <ShippingPolicyPage />;
      case '/refund-policy':
        return <RefundPolicyPage />;
      case '/privacy-policy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsPage />;
      case '/admin/login':
        return <AdminLogin navigate={navigate} />;
      case '/admin':
        return (
          <AdminDashboard
            navigate={navigate}
            products={products}
            onRefreshProducts={fetchStoreData}
          />
        );
      case '/':
      default:
        return (
          <HomePage
            products={products}
            navigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-[#dc2626] selection:text-white">
          
          {/* Announcement Bar & Header (Hidden on admin console and test pay) */}
          {!isAdminRoute && !isTestPayRoute && (
            <>
              <AnnouncementBar
                text={settings?.announcementText}
                enabled={settings?.announcementEnabled ?? true}
              />
              <Navbar
                currentPath={currentPath}
                navigate={navigate}
                onOpenSearch={() => navigate('/shop')}
              />
            </>
          )}

          {/* Main View Area */}
          <main className="flex-1">
            {renderCurrentPage()}
          </main>

          {/* Footer & Cart Drawer */}
          {!isAdminRoute && !isTestPayRoute && (
            <>
              <Footer navigate={navigate} />
              <CartDrawer
                onCheckout={() => navigate('/checkout')}
                onViewCart={() => navigate('/cart')}
              />
            </>
          )}

        </div>
      </CartProvider>
    </AuthProvider>
  );
}
