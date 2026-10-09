import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, onOpenSearch }) => {
  const { itemCount, openCart } = useCart();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'Collections', path: '/collections' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-b border-[#27272a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark / Logo Lockup */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 text-left focus:outline-none"
            aria-label="MAXVEY Home"
          >
            <Logo size="md" showText={true} />
          </button>
        </div>

        {/* Zone 2: 4–5 Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map(link => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive
                    ? 'text-white border-b-2 border-[#dc2626]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Shopping Bag */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch || (() => handleNavClick('/shop'))}
            className="p-2 text-zinc-400 hover:text-white transition-colors rounded-md focus:outline-none"
            aria-label="Search clothing"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Admin Indicator / Link */}
          <button
            onClick={() => handleNavClick(isAdmin ? '/admin' : '/admin/login')}
            className={`p-2 transition-colors rounded-md ${
              isAdmin ? 'text-[#dc2626] bg-[#dc2626]/10' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title={isAdmin ? 'Admin Dashboard' : 'Admin Login'}
            aria-label="Admin Portal"
          >
            {isAdmin ? <Shield className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
          </button>

          {/* Primary Action: Shopping Cart Button with Tabular Count */}
          <button
            onClick={openCart}
            className="relative flex items-center justify-center p-2 text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
            aria-label={`Shopping Cart with ${itemCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 bg-[#dc2626] text-white text-[11px] font-bold rounded-full flex items-center justify-center font-mono-tabular">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-md transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#27272a] bg-[#09090b] px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  currentPath === link.path
                    ? 'text-white bg-zinc-900 border-l-2 border-[#dc2626]'
                    : 'text-zinc-300 hover:bg-zinc-900/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#27272a] flex items-center justify-between text-xs text-zinc-400 px-3">
            <span>MAXVEY NIGERIA · NGN</span>
            <button
              onClick={() => handleNavClick(isAdmin ? '/admin' : '/admin/login')}
              className="text-[#dc2626] font-medium hover:underline"
            >
              {isAdmin ? 'Admin Console' : 'Staff Access'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
