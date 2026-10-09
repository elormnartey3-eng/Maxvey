import React from 'react';
import { Logo } from './Logo';
import { ArrowUpRight, MessageCircle, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#09090b] border-t border-[#27272a] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="text-left focus:outline-none"
              aria-label="MAXVEY Home"
            >
              <Logo size="lg" showText={true} />
            </button>
            <p className="font-heading text-lg font-bold text-white tracking-wide uppercase">
              FOR THOSE WHO MOVE DIFFERENT<span className="text-[#dc2626]">.</span>
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              MAXVEY is an independent luxury streetwear imprint engineered in Lagos, Nigeria. 
              Heavyweight cottons, custom cuts, bold screenprint typography, and uncompromised silhouettes.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/2349029602573"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-medium rounded border border-[#27272a] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp: +234 902 960 2573</span>
              </a>
            </div>
          </div>

          {/* Column 2: Store Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
                  All Apparel
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/new-arrivals')} className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/collections')} className="hover:text-white transition-colors">
                  Graffiti Star Drop 01
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/collections')} className="hover:text-white transition-colors">
                  Cyber Metal Series
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/track')} className="text-[#dc2626] font-semibold hover:underline">
                  Track Your Order
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Brand & Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading">
              Support & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shipping-policy')} className="hover:text-white transition-colors">
                  Shipping & Delivery (Nigeria)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/refund-policy')} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading">
              Lagos Flagship
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                <span>Lekki Phase 1, Lagos, Nigeria</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <a href="mailto:maxwellunusual@gmail.com" className="hover:text-white">
                  maxwellunusual@gmail.com
                </a>
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-zinc-500 font-mono">CURRENCY: NGN (₦)</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
                >
                  Administrator Portal &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} MAXVEY APPAREL LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>SECURED BY PAYSTACK</span>
            <span>LAGOS · NIGERIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
