import React, { useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const displayImage = product.featuredImage || product.images[0] || '/images/tee-black.jpg';
  const secondaryImage = product.images[1] || displayImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, product.colors[0]?.name || 'Standard', 1);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col bg-[#121215] border border-[#27272a] rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl"
    >
      {/* 1. Image Container (clean neutral backdrop) */}
      <div className="relative aspect-[4/3] bg-[#0c0c0e] overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img
            src={isHovered && secondaryImage ? secondaryImage : displayImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-900">
            <span className="font-heading text-lg font-bold text-zinc-400 uppercase">{product.name}</span>
            <span className="text-xs text-zinc-600 mt-2">MAXVEY STUDIO</span>
          </div>
        )}

        {/* Subtle Text Tag (Anti-slop: clean text, no candy pill cluster) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {product.isNewArrival && (
            <span className="text-[11px] font-bold tracking-widest text-[#dc2626] uppercase bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded">
              NEW DROP
            </span>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[11px] font-bold tracking-widest text-zinc-300 uppercase bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded">
              SALE
            </span>
          )}
        </div>

        {/* Stock Status if low */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-medium text-amber-400 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded font-mono">
              ONLY {product.stock} LEFT
            </span>
          </div>
        )}
      </div>

      {/* 2. Content & Typography */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5 font-medium tracking-wider uppercase">
            <span>{product.category}</span>
            {product.collection && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[140px]">{product.collection}</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-base font-semibold text-white group-hover:text-zinc-200 line-clamp-1 transition-colors">
            {product.name}
          </h3>

          {/* Price & Compare-At Price in Tabular Numerals */}
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-base font-bold text-white font-mono-tabular">
              ₦{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-zinc-500 line-through font-mono-tabular">
                ₦{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* 3. Interactive Quick Size Picker & Action */}
        <div className="pt-2 border-t border-[#27272a]/60 flex items-center justify-between gap-2">
          {/* Size Pills for quick selection */}
          <div className="flex items-center gap-1 overflow-x-auto py-1" onClick={e => e.stopPropagation()}>
            {product.sizes.slice(0, 4).map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-0.5 text-xs font-mono font-medium rounded transition-colors ${
                  selectedSize === size
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition-colors flex items-center gap-1 text-xs shrink-0"
            title="Quick Add to Bag"
            aria-label={`Quick add ${product.name} size ${selectedSize}`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#dc2626]" />
            <span className="hidden sm:inline text-[11px] font-medium">ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
