import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  onSelectProduct,
  initialCategory = 'all',
  initialSearch = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category filter
        if (selectedCategory !== 'all') {
          const matchCat = p.category.toLowerCase() === selectedCategory.toLowerCase();
          const matchCol = p.collection?.toLowerCase().includes(selectedCategory.toLowerCase());
          if (!matchCat && !matchCol) return false;
        }
        // Stock filter
        if (onlyInStock && p.stock <= 0) return false;
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = p.name.toLowerCase().includes(q);
          const descMatch = p.description.toLowerCase().includes(q);
          const catMatch = p.category.toLowerCase().includes(q);
          if (!nameMatch && !descMatch && !catMatch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy, onlyInStock]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#27272a] pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading">
          ALL APPAREL
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
          Engineered streetwear silhouettes and limited drops. Built from dense 260GSM cottons for structured oversized fits.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Interactive Category Tabs (Buttons, Anti-slop) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white bg-[#121215] border border-[#27272a]'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.name
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white bg-[#121215] border border-[#27272a]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-[#121215] border border-[#27272a] rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#dc2626]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#121215] border border-[#27272a] rounded text-xs text-zinc-300 focus:outline-none focus:border-[#dc2626]"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-[#27272a]/40 font-mono">
          <span>SHOWING {filteredProducts.length} PRODUCTS</span>
          {searchQuery && (
            <span>FILTERED BY &quot;{searchQuery}&quot;</span>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#121215] border border-[#27272a] rounded-lg p-8">
          <p className="text-sm font-semibold text-white">No products found</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try resetting your search filter or selecting another category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded hover:bg-zinc-200"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
