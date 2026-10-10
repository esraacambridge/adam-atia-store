import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Menu, X, LayoutDashboard, User, LogOut, Package } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  currentPage: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Navbar({ onNavigate, currentPage, searchQuery, onSearchChange }: NavbarProps) {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', page: 'home' },
    { label: 'المتجر', page: 'shop' },
    { label: 'الأكثر مبيعاً', page: 'shop', params: { sort: 'rating' } },
    { label: 'اقترح لي لعبة', page: 'advisor' },
    { label: 'تواصل معنا', page: 'contact' },
  ];

  const handleNav = (page: string, params?: Record<string, string>) => {
    onNavigate(page, params);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    onNavigate('home');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav border-b border-c py-2.5' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Logo onClick={() => handleNav('home')} />

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-c" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNav('shop', { search: searchQuery });
                      setSearchOpen(false);
                    }
                  }}
                  placeholder="ابحث عن لعبة..."
                  className="input-field pr-10 text-sm"
                />
                {searchOpen && searchQuery && (
                  <div className="absolute top-full mt-2 w-full card shadow-2xl overflow-hidden animate-fade-in">
                    <button
                      onClick={() => { handleNav('shop', { search: searchQuery }); setSearchOpen(false); }}
                      className="w-full text-right px-4 py-3 text-sm text-secondary-c hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      عرض جميع نتائج البحث عن "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.page, link.params)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === link.page
                      ? 'text-accent-c bg-[var(--accent-glow)]'
                      : 'text-secondary-c hover:text-primary-c'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('admin')}
                className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center border border-c bg-secondary-c text-secondary-c hover:text-accent-c hover:border-[var(--accent)] transition-all duration-200"
                aria-label="لوحة التحكم"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <ThemeToggle />

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-c bg-secondary-c text-accent-c hover:border-[var(--accent)] transition-all duration-200"
                    aria-label="حسابي"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full mt-2 left-0 w-48 card p-2 shadow-2xl animate-fade-in z-50">
                      <div className="px-3 py-2 border-b border-c mb-2">
                        <p className="text-sm font-semibold text-primary-c truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => handleNav('orders')}
                        className="w-full text-right px-3 py-2 rounded-lg text-sm text-secondary-c hover:text-accent-c hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        طلباتي
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-right px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleNav('auth')}
                  className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center border border-c bg-secondary-c text-secondary-c hover:text-accent-c hover:border-[var(--accent)] transition-all duration-200"
                  aria-label="تسجيل الدخول"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => handleNav('cart')}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center border border-c bg-secondary-c text-secondary-c hover:text-accent-c hover:border-[var(--accent)] transition-all duration-200"
                aria-label="السلة"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center border border-c bg-secondary-c text-primary-c"
                aria-label="القائمة"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 mx-4 card p-4 animate-fade-in">
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-c" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNav('shop', { search: searchQuery });
                    }
                  }}
                  placeholder="ابحث عن لعبة..."
                  className="input-field pr-10 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.page, link.params)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium text-right transition-all ${
                    currentPage === link.page
                      ? 'text-accent-c bg-[var(--accent-glow)]'
                      : 'text-secondary-c hover:text-primary-c hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="border-t border-c my-1" />
              {user ? (
                <>
                  <button
                    onClick={() => handleNav('orders')}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-right text-secondary-c hover:text-primary-c hover:bg-[var(--bg-secondary)] transition-all flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    طلباتي
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-right text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNav('auth')}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-right text-secondary-c hover:text-primary-c hover:bg-[var(--bg-secondary)] transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  تسجيل الدخول
                </button>
              )}
              <button
                onClick={() => handleNav('admin')}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-right text-secondary-c hover:text-primary-c hover:bg-[var(--bg-secondary)] transition-all flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                لوحة التحكم
              </button>
            </div>
          </div>
        )}
      </header>
      <div className="h-[72px]" />
    </>
  );
}
