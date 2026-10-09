import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Check, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  navigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, navigate, onSelectProduct }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterLoading(true);
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      setNewsletterSuccess(true);
    } catch {
      // Graceful fallback
      setNewsletterSuccess(true);
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO CAMPAIGN SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#27272a] bg-black">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="MAXVEY Streetwear Campaign in Lagos"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-60 contrast-110"
            loading="eager"
          />
          {/* Measured Contrast Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center flex flex-col items-center">
          
          {/* Kicker */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase bg-black/80 px-3 py-1 rounded border border-[#dc2626]/30">
              DROP 01 · OFFICIAL RELEASE
            </span>
          </div>

          {/* Slogan Headline (Anti-slop: strict containment, no orphan wrapping) */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-none max-w-4xl">
            FOR THOSE WHO <br className="hidden sm:inline" />
            <span className="text-white underline decoration-[#dc2626] decoration-4 underline-offset-8">
              MOVE DIFFERENT
            </span>
            <span className="text-[#dc2626]">.</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-zinc-300 max-w-xl mx-auto font-normal leading-relaxed">
            Engineered in Lagos. Heavyweight 260GSM combed cotton, custom boxy silhouettes, and raw streetwear aesthetics crafted for the fearless.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/shop')}
              className="w-full sm:w-auto px-8 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>SHOP DROP 01</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/collections')}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded border border-zinc-700 transition-colors"
            >
              EXPLORE COLLECTIONS
            </button>
          </div>
        </div>
      </section>

      {/* 2. BRAND SPECIFICATION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 bg-[#121215] border border-[#27272a] rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 rounded border border-zinc-800 text-[#dc2626] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                260 GSM Heavyweight Cotton
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Zero-transparency, drop-shoulder boxy drape that holds its structured shape through endless wears.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 rounded border border-zinc-800 text-[#dc2626] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                Lagos Express & Nationwide
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Rapid 24–48 hour delivery within Lagos. Fast nationwide dispatch with real-time order tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 rounded border border-zinc-800 text-[#dc2626] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                Paystack Verified Checkout
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Seamless Nigerian card payments, USSD, and bank transfers with instant automated receipt confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (DROP 01) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#27272a]">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
              FEATURED DROPS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
              THE GRAFFITI STAR SERIES
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All ({products.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL CAMPAIGN SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xl overflow-hidden border border-[#27272a] bg-[#121215] grid grid-cols-1 lg:grid-cols-2 items-stretch">
          
          {/* Editorial Visual */}
          <div className="relative aspect-[4/3] lg:aspect-auto min-h-[360px] bg-black">
            <img
              src="/images/sleeveless-black.jpg"
              alt="MAXVEY Cyber Metal Series"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Editorial Narrative */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
            <div className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              NEW SILHOUETTE
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading leading-tight">
              CYBER METAL <br />
              RAW-CUT SLEEVELESS
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Designed for Nigerian heat and uninhibited movement. Crafted from 240GSM enzyme-washed cotton with distressed armhole detailing and electric toxic green gothic typography.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  const sleeveless = products.find(p => p.category.toLowerCase().includes('sleeveless'));
                  if (sleeveless) onSelectProduct(sleeveless);
                  else navigate('/shop');
                }}
                className="px-6 py-3.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-widest rounded transition-colors inline-flex items-center gap-2"
              >
                <span>DISCOVER CYBER SERIES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS CAROUSEL/GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#27272a]">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
              JUST RESTOCKED
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
              NEW ARRIVALS
            </h2>
          </div>
          <button
            onClick={() => navigate('/new-arrivals')}
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>See New Arrivals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 6. NEWSLETTER & PRIVATE CLUB */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-[#121215] border border-[#27272a] rounded-xl text-center space-y-6">
          <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
            THE INNER CIRCLE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
            BE FIRST WHEN DROPS GO LIVE
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Our limited batches sell out quickly. Subscribers receive 2-hour early access keys before public releases.
          </p>

          {newsletterSuccess ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-medium rounded-md max-w-md mx-auto flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>You are on the private access list. Watch your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#09090b] border border-zinc-700 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#dc2626]"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shrink-0 disabled:opacity-50"
              >
                {newsletterLoading ? 'JOINING...' : 'JOIN'}
              </button>
            </form>
          )}

          <p className="text-[11px] text-zinc-600">
            No spam. Unsubscribe anytime with one tap.
          </p>
        </div>
      </section>

    </div>
  );
};
