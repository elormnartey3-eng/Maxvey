import React from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Flame } from 'lucide-react';

interface NewArrivalsPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  navigate: (path: string) => void;
}

export const NewArrivalsPage: React.FC<NewArrivalsPageProps> = ({
  products,
  onSelectProduct,
  navigate,
}) => {
  const newArrivals = products.filter(p => p.isNewArrival);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#27272a] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#dc2626] uppercase">
            <Flame className="w-4 h-4" />
            <span>SEASON 01 DROPS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
            NEW ARRIVALS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
            The freshest pieces straight out of our Lagos cutting room. High density graphics, heavy gauge textiles, and signature fits.
          </p>
        </div>

        <button
          onClick={() => navigate('/shop')}
          className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          View Full Catalogue &rarr;
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newArrivals.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};
