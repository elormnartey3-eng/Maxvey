import React from 'react';
import { Product } from '../types';
import { ArrowRight } from 'lucide-react';

interface CollectionsPageProps {
  products: Product[];
  navigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  products,
  navigate,
  onSelectProduct,
}) => {
  const collections = [
    {
      id: 'graffiti-star',
      title: 'GRAFFITI STAR DROP 01',
      subtitle: 'The Debut Signature Series',
      description: 'Bold red spray-can typography, hand-drawn comic character art, and oversized 260GSM cottons in Jet Black, Canary Yellow, and Chalk White.',
      image: '/images/tee-black.jpg',
      itemCount: 3,
      tag: 'FLAGSHIP DROP',
      filterName: 'Graffiti Star Drop 01',
    },
    {
      id: 'cyber-metal',
      title: 'CYBER METAL CAPSULE',
      subtitle: 'Raw-Cut Aggression',
      description: 'Gothic barbed typography rendered in toxic electric neon green on washed black heavyweight raw-cut sleeveless armholes.',
      image: '/images/sleeveless-black.jpg',
      itemCount: 1,
      tag: 'SUMMER MOBILITY',
      filterName: 'Cyber Metal Collection',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-[#27272a] pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
          CURATED ARCHIVES
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
          COLLECTIONS
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
          Each MAXVEY collection tells a distinct chapter of our design narrative. Limited run productions never re-issued once sold out.
        </p>
      </div>

      {/* Collection Cards */}
      <div className="space-y-10">
        {collections.map((col, idx) => (
          <div
            key={col.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Visual */}
            <div className={`lg:col-span-6 relative aspect-[16/10] bg-black overflow-hidden ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <img
                src={col.image}
                alt={col.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4">
                <span className="text-[11px] font-mono font-bold tracking-widest text-white bg-black/80 px-2.5 py-1 rounded">
                  {col.tag}
                </span>
              </div>
            </div>

            {/* Info & Products in this Collection */}
            <div className={`lg:col-span-6 p-8 lg:p-12 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  {col.subtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
                  {col.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed">
                  {col.description}
                </p>
              </div>

              {/* Related Items Mini Preview */}
              <div className="pt-2 border-t border-[#27272a] space-y-3">
                <span className="text-xs text-zinc-500 font-mono">PIECES IN THIS DROP:</span>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {products
                    .filter(p => p.collection?.toLowerCase().includes(col.filterName.toLowerCase().slice(0, 10)))
                    .map(p => (
                      <button
                        key={p.id}
                        onClick={() => onSelectProduct(p)}
                        className="flex items-center gap-2 p-1.5 bg-[#09090b] border border-zinc-800 rounded hover:border-zinc-600 transition-colors shrink-0 text-left"
                      >
                        <img
                          src={p.featuredImage}
                          alt={p.name}
                          className="w-9 h-9 object-cover rounded bg-black"
                        />
                        <div className="pr-2">
                          <p className="text-[11px] font-medium text-white truncate max-w-[120px]">{p.name}</p>
                          <p className="text-[10px] text-zinc-400 font-mono-tabular">₦{p.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded transition-colors inline-flex items-center gap-2"
                >
                  <span>SHOP THE ENTIRE COLLECTION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
