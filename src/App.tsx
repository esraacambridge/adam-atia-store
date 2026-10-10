import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import GameDetailsPage from '@/pages/GameDetailsPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AuthPage from '@/pages/AuthPage';
import OrdersPage from '@/pages/OrdersPage';
import ContactPage from '@/pages/ContactPage';
import AdvisorPage from '@/pages/AdvisorPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminGames from '@/pages/admin/AdminGames';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminOffers from '@/pages/admin/AdminOffers';
import AdminStats from '@/pages/admin/AdminStats';

type Page = 'home' | 'shop' | 'game' | 'cart' | 'checkout' | 'auth' | 'orders' | 'contact' | 'advisor' | 'admin' | 'admin-games' | 'admin-orders' | 'admin-customers' | 'admin-offers' | 'admin-stats';

interface Route {
  page: Page;
  params: Record<string, string>;
}

function App() {
  const [route, setRoute] = useState<Route>({ page: 'home', params: {} });
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (page: string, params: Record<string, string> = {}) => {
    setRoute({ page: page as Page, params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (route.params['search']) {
      setSearchQuery(route.params['search']);
    }
  }, [route]);

  const isAdminPage = route.page.startsWith('admin');

  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'shop':
        return (
          <ShopPage
            onNavigate={navigate}
            initialSearch={route.params['search']}
            initialCategory={route.params['category']}
            initialSort={route.params['sort']}
          />
        );
      case 'game':
        return <GameDetailsPage slug={route.params['slug'] ?? ''} onNavigate={navigate} />;
      case 'cart':
        return <CartPage onNavigate={navigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigate} />;
      case 'auth':
        return <AuthPage onNavigate={navigate} />;
      case 'orders':
        return <OrdersPage onNavigate={navigate} />;
      case 'advisor':
        return <AdvisorPage onNavigate={navigate} />;
      case 'contact':
        return <ContactPage onNavigate={navigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={navigate} />;
      case 'admin-games':
        return <AdminGames onNavigate={navigate} />;
      case 'admin-orders':
        return <AdminOrders onNavigate={navigate} />;
      case 'admin-customers':
        return <AdminCustomers onNavigate={navigate} />;
      case 'admin-offers':
        return <AdminOffers onNavigate={navigate} />;
      case 'admin-stats':
        return <AdminStats onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <div className="min-h-screen bg-primary-c flex flex-col">
              <Navbar
                onNavigate={navigate}
                currentPage={route.page}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <main className="flex-1">
                {renderPage()}
              </main>
              {!isAdminPage && <Footer onNavigate={navigate} />}
            </div>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
