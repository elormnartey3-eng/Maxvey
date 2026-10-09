import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
  onViewCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onViewCart }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 75000;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0e11] border-l border-[#27272a] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#dc2626]" />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider font-heading">
                YOUR BAG ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-zinc-400 hover:text-white rounded-md transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tier */}
          <div className="px-5 py-3 bg-[#141417] border-b border-[#27272a]">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-zinc-300">
                Add <span className="text-white font-bold font-mono">₦{remainingForFreeShipping.toLocaleString()}</span> more to unlock <span className="text-[#dc2626] font-semibold">FREE SHIPPING</span> in Lagos!
              </p>
            ) : (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <span>✓</span> You qualify for FREE SHIPPING in Lagos!
              </p>
            )}
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#dc2626] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Your bag is empty</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Explore Drop 01 and pick your streetwear essentials.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-md hover:bg-zinc-200 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4 p-3 bg-[#121215] border border-[#27272a] rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded bg-black shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold text-white line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size, item.color)}
                          className="text-zinc-500 hover:text-red-400 p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
                        <span>SIZE: {item.size}</span>
                        <span>·</span>
                        <span>{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-zinc-800 rounded bg-black/40">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="p-1 hover:text-white text-zinc-400 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="p-1 hover:text-white text-zinc-400 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-white font-mono-tabular">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#27272a] bg-[#121215] space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-lg font-bold text-white font-mono-tabular">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Delivery calculated at checkout. Secured by Paystack.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    closeCart();
                    onViewCart();
                  }}
                  className="py-3 px-4 rounded-md border border-zinc-700 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-800 transition-colors text-center"
                >
                  View Bag
                </button>
                <button
                  onClick={() => {
                    closeCart();
                    onCheckout();
                  }}
                  className="py-3 px-4 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-xs font-bold uppercase tracking-wider text-white transition-colors flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
