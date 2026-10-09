import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock, CreditCard, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StoreSettings } from '../types';

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { cart, subtotal, clearCart } = useCart();
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [selectedState, setSelectedState] = useState('Lagos (Mainland)');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch store settings for delivery fee configuration
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  // Compute delivery fee
  const deliveryFee = React.useMemo(() => {
    if (!settings) return 2500;
    // Check free shipping threshold
    if (settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold) {
      if (selectedState.toLowerCase().includes('lagos')) {
        return 0;
      }
    }
    const matched = settings.deliveryFees.find(
      d => d.state.toLowerCase() === selectedState.toLowerCase()
    );
    return matched ? matched.fee : settings.defaultDeliveryFee;
  }, [settings, subtotal, selectedState]);

  const grandTotal = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold uppercase text-white font-heading">Your bag is empty</h2>
        <p className="text-xs text-zinc-400">Add clothing pieces before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-[#dc2626] text-white text-xs font-bold uppercase rounded"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const payload = {
        items: cart,
        customer: {
          fullName,
          email,
          phone,
          address,
          city,
          state: selectedState,
          postalCode,
          notes,
        },
        deliveryFeeOverride: deliveryFee,
      };

      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize Paystack checkout');
      }

      // If sandbox test-mode redirect or live Paystack authorization URL
      if (data.authorization_url) {
        // Clear local cart now that order is queued in db
        clearCart();
        window.location.href = data.authorization_url;
      } else {
        throw new Error('No authorization URL received from payment provider');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed. Please check your network.');
      setIsLoading(false);
    }
  };

  const nigerianStates = [
    'Lagos (Mainland)',
    'Lagos (Island / Lekki / Ajah)',
    'Abuja (FCT)',
    'Rivers (Port Harcourt)',
    'Oyo (Ibadan)',
    'Ogun (Abeokuta / Sagamu)',
    'Edo (Benin City)',
    'Enugu',
    'Delta (Warri / Asaba)',
    'Kaduna / Kano',
    'Other States (Nationwide Express)',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#27272a] pb-6">
        <div>
          <button
            onClick={() => navigate('/cart')}
            className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Bag</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
            CHECKOUT & DELIVERY
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
          <Lock className="w-3.5 h-3.5 text-[#25D366]" />
          <span>PAYSTACK 256-BIT ENCRYPTED</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-950/60 border border-red-800 rounded-lg flex items-center gap-3 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: Form Left, Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Customer & Delivery Form */}
        <form onSubmit={handlePaystackCheckout} className="lg:col-span-7 space-y-8">
          
          {/* Contact Information */}
          <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-heading flex items-center justify-between">
              <span>1. Contact Information</span>
              <span className="text-zinc-500 text-xs font-normal font-mono">FOR DISPATCH UPDATES</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tunde Adeleke"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Email Address * (For Receipt)
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Phone Number * (WhatsApp preferred for rider updates)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#dc2626]"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              2. Delivery Address in Nigeria
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Street Address, Apartment or Suite *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    City / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki / Ikeja / Wuse 2"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    State / Region *
                  </label>
                  <select
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-[#dc2626]"
                  >
                    {nigerianStates.map(state => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Delivery Notes / Landmarks (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opposite standard chartered bank, call gate security"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#dc2626]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <CreditCard className="w-4 h-4 text-[#dc2626]" />
              <span>Payment Gateway: Paystack</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Upon clicking pay, you will be redirected to Paystack&apos;s certified payment gateway to complete payment via Debit Card (Mastercard, Visa, Verve), Bank Transfer, or USSD. Your order is confirmed automatically once verified.
            </p>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isLoading ? 'INITIALIZING PAYSTACK...' : `PAY ₦${grandTotal.toLocaleString()} VIA PAYSTACK`}
            </span>
          </button>
        </form>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
            ORDER SUMMARY ({cart.length} ITEMS)
          </h2>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {cart.map(item => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded bg-black shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-white truncate">{item.name}</h4>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    Size: {item.size} · {item.color} · Qty: {item.quantity}
                  </div>
                  <div className="text-xs font-bold text-white font-mono-tabular mt-1">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#27272a] pt-4 space-y-3 text-xs">
            <div className="flex justify-between text-zinc-300">
              <span>Items Subtotal</span>
              <span className="font-bold text-white font-mono-tabular">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Delivery Fee ({selectedState})</span>
              <span className="font-bold text-white font-mono-tabular">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-400">FREE</span>
                ) : (
                  `₦${deliveryFee.toLocaleString()}`
                )}
              </span>
            </div>
            <div className="border-t border-[#27272a] pt-3 flex justify-between text-base font-bold text-white">
              <span>Total to Pay</span>
              <span className="text-xl text-[#dc2626] font-mono-tabular">
                ₦{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3 bg-black rounded border border-[#27272a] text-[11px] text-zinc-400 space-y-1">
            <p className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Authentic MAXVEY Guarantee</span>
            </p>
            <p>Every piece is inspected in Lagos prior to dispatch.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
