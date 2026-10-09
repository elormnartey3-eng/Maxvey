import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, itemCount } = useCart();

  const FREE_SHIPPING_THRESHOLD = 75000;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
          YOUR BAG IS EMPTY
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
          Explore Drop 01 and find your signature oversized tee or raw-cut sleeveless piece.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded transition-colors"
        >
          EXPLORE SHOP
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading">
            SHOPPING BAG ({itemCount})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-red-400 transition-colors self-start sm:self-auto font-mono"
        >
          CLEAR BAG
        </button>
      </div>

      {/* Grid: Items Left, Order Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Items list */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert */}
          <div className="p-4 bg-[#121215] border border-[#27272a] rounded-lg">
            {remaining > 0 ? (
              <p className="text-xs text-zinc-300">
                Add <span className="font-bold text-white font-mono">₦{remaining.toLocaleString()}</span> more to unlock <span className="text-[#dc2626] font-semibold">FREE SHIPPING</span> in Lagos!
              </p>
            ) : (
              <p className="text-xs text-emerald-400 font-semibold">
                ✓ You qualify for FREE SHIPPING within Lagos!
              </p>
            )}
          </div>

          <div className="divide-y divide-[#27272a] border border-[#27272a] rounded-lg bg-[#121215] overflow-hidden">
            {cart.map(item => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded bg-black shrink-0"
                  />
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white">{item.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
                      <span>SIZE: {item.size}</span>
                      <span>·</span>
                      <span>COLOR: {item.color}</span>
                    </div>
                    <span className="text-sm font-bold text-white sm:hidden mt-2 block font-mono-tabular">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 mt-2 sm:mt-0">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-zinc-700 rounded bg-[#09090b]">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="p-2 text-zinc-400 hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="p-2 text-zinc-400 hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <span className="hidden sm:block text-base font-bold text-white font-mono-tabular">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-4 bg-[#121215] border border-[#27272a] rounded-lg p-6 space-y-6">
          <h2 className="text-base font-bold uppercase tracking-wider text-white font-heading">
            ORDER SUMMARY
          </h2>

          <div className="space-y-3 text-xs divide-y divide-[#27272a]">
            <div className="flex justify-between text-zinc-300 pb-3">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-bold text-white font-mono-tabular">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400 py-3">
              <span>Estimated Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-3">
              <span>Subtotal</span>
              <span className="text-lg text-white font-mono-tabular">₦{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 shadow-xl"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-[11px] text-zinc-500 space-y-1">
            <p>• Secured Nigerian checkout powered by Paystack.</p>
            <p>• Instant SMS & WhatsApp notification upon confirmation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
