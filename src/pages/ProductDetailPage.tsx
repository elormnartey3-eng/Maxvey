import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, Check, ShieldCheck, Truck, RotateCcw, Ruler, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  navigate: (path: string) => void;
  relatedProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  navigate,
  relatedProducts = [],
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>(
    product.featuredImage || product.images[0] || '/images/tee-black.jpg'
  );
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Accordion state
  const [openSection, setOpenSection] = useState<'details' | 'care' | 'shipping' | null>('details');

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <button onClick={onBack} className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span aria-hidden="true">/</span>
        <button onClick={() => navigate('/shop')} className="hover:text-white">Shop</button>
        <span aria-hidden="true">/</span>
        <span>{product.category}</span>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-300 truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main PDP Grid: Gallery Left, Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Gallery with Thumbnails (Sticky) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-[4/3] bg-[#0c0c0e] border border-[#27272a] rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 text-[11px] font-mono font-bold tracking-widest text-[#dc2626] uppercase bg-black/80 px-2.5 py-1 rounded">
                NEW DROP
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 bg-black shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#dc2626] scale-105'
                      : 'border-[#27272a] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Contiguous Purchase Module (Sticky on Desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 bg-[#121215] border border-[#27272a] rounded-xl p-6 sm:p-8">
          
          {/* Kicker & Title */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
              <span>{product.category}</span>
              {product.collection && (
                <>
                  <span>·</span>
                  <span>{product.collection}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading mt-2">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-xs text-[#dc2626] font-medium tracking-wide mt-1">
                {product.tagline}
              </p>
            )}
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-[#27272a]">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-tabular">
              ₦{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-zinc-500 line-through font-mono-tabular">
                ₦{product.compareAtPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-emerald-400 font-mono font-medium ml-auto">
              {product.stock > 0 ? `IN STOCK (${product.stock})` : 'SOLD OUT'}
            </span>
          </div>

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading">
                COLOR: <span className="text-white font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs border transition-colors ${
                      selectedColor === col.name
                        ? 'border-white bg-zinc-800 text-white font-semibold'
                        : 'border-[#27272a] text-zinc-400 hover:text-white bg-[#09090b]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-zinc-700"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector with Size Guide Trigger */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading">
                SELECT SIZE
              </label>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Ruler className="w-3 h-3" />
                <span className="underline">Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-xs font-mono font-bold rounded transition-colors text-center border ${
                    selectedSize === size
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-[#09090b] text-zinc-400 border-[#27272a] hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper & Add to Bag */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-zinc-700 rounded bg-[#09090b]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-mono font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Primary Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3.5 px-6 rounded text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : product.stock > 0
                    ? 'bg-[#dc2626] hover:bg-[#b91c1c] text-white'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.stock > 0 ? 'ADD TO BAG' : 'OUT OF STOCK'}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 text-center font-mono">
              Paystack Protected Checkout · Instant WhatsApp Confirmation
            </p>
          </div>

          {/* Accordion Specs */}
          <div className="pt-4 border-t border-[#27272a] space-y-2 text-xs">
            {/* Description & Details */}
            <div className="border border-[#27272a] rounded overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
                className="w-full p-3.5 bg-[#0e0e11] text-left font-bold text-white uppercase tracking-wider flex items-center justify-between"
              >
                <span>Product Details & Cut Specs</span>
                <span>{openSection === 'details' ? '−' : '+'}</span>
              </button>
              {openSection === 'details' && (
                <div className="p-4 space-y-3 text-zinc-300 bg-[#121215]">
                  <p className="leading-relaxed">{product.description}</p>
                  <ul className="space-y-1 text-zinc-400 list-disc list-inside">
                    {product.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Care Instructions */}
            <div className="border border-[#27272a] rounded overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === 'care' ? null : 'care')}
                className="w-full p-3.5 bg-[#0e0e11] text-left font-bold text-white uppercase tracking-wider flex items-center justify-between"
              >
                <span>Fabric Care & Washing</span>
                <span>{openSection === 'care' ? '−' : '+'}</span>
              </button>
              {openSection === 'care' && (
                <div className="p-4 text-zinc-300 bg-[#121215] space-y-1">
                  {product.careInstructions?.map((care, i) => (
                    <p key={i}>• {care}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping in Nigeria */}
            <div className="border border-[#27272a] rounded overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                className="w-full p-3.5 bg-[#0e0e11] text-left font-bold text-white uppercase tracking-wider flex items-center justify-between"
              >
                <span>Nigerian Delivery & Returns</span>
                <span>{openSection === 'shipping' ? '−' : '+'}</span>
              </button>
              {openSection === 'shipping' && (
                <div className="p-4 text-zinc-400 bg-[#121215] space-y-2">
                  <p><strong>Lagos Mainland & Island:</strong> 24–48 hours delivery (₦2,500 – ₦3,000).</p>
                  <p><strong>Nationwide Dispatch:</strong> 3–5 working days via tracked express courier.</p>
                  <p><strong>Returns:</strong> 7-day hassle-free exchange on unworn items with tags intact.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BUY BAR ON MOBILE (Android/iPhone) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-[#0e0e11]/95 backdrop-blur-md border-t border-[#27272a] flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[11px] text-zinc-400 block font-mono">TOTAL (SIZE {selectedSize})</span>
          <span className="text-base font-bold text-white font-mono-tabular">
            ₦{(product.price * quantity).toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="py-3 px-6 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>ADD TO BAG</span>
        </button>
      </div>

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121215] border border-[#27272a] rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="text-base font-bold text-white font-heading uppercase">
                MAXVEY OVERSIZED STREETWEAR SIZE GUIDE
              </h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-zinc-400">
              MAXVEY silhouettes are intentionally cut with an oversized boxy drop-shoulder streetwear fit. If you prefer a tailored/regular fit, consider sizing down one size.
            </p>
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-[#27272a] text-zinc-500">
                  <th className="py-2">SIZE</th>
                  <th className="py-2">CHEST (INCHES)</th>
                  <th className="py-2">LENGTH (INCHES)</th>
                  <th className="py-2">FIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a] text-zinc-300">
                <tr><td className="py-2 font-bold text-white">S</td><td className="py-2">40" - 42"</td><td className="py-2">28"</td><td className="py-2">Relaxed</td></tr>
                <tr><td className="py-2 font-bold text-white">M</td><td className="py-2">43" - 45"</td><td className="py-2">29"</td><td className="py-2">Boxy</td></tr>
                <tr><td className="py-2 font-bold text-white">L</td><td className="py-2">46" - 48"</td><td className="py-2">30"</td><td className="py-2">Oversized</td></tr>
                <tr><td className="py-2 font-bold text-white">XL</td><td className="py-2">49" - 51"</td><td className="py-2">31"</td><td className="py-2">Heavy Boxy</td></tr>
                <tr><td className="py-2 font-bold text-white">XXL</td><td className="py-2">52" - 54"</td><td className="py-2">32"</td><td className="py-2">Maximum Street</td></tr>
              </tbody>
            </table>
            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-2.5 bg-white text-black text-xs font-bold uppercase rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
