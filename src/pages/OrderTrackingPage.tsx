import React, { useState } from 'react';
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok && data.id) {
        setOrder(data);
      } else {
        setError('No order found with that order number or ID. Please check your spelling.');
      }
    } catch {
      setError('Network error while checking order status.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded">PAID & PREPARING</span>;
      case 'processing':
        return <span className="text-blue-400 font-bold bg-blue-950/60 px-2.5 py-1 rounded">IN PRODUCTION / PACKAGING</span>;
      case 'shipped':
        return <span className="text-amber-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded">DISPATCHED (IN TRANSIT)</span>;
      case 'delivered':
        return <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded">DELIVERED</span>;
      default:
        return <span className="text-zinc-400 font-bold bg-zinc-900 px-2.5 py-1 rounded">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
          LIVE FULFILLMENT PORTAL
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading">
          TRACK YOUR MAXVEY ORDER
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Enter your order reference (e.g. MV-2610-1082) found in your confirmation receipt.
        </p>
      </div>

      <form onSubmit={handleTrack} className="max-w-md mx-auto flex gap-2">
        <input
          type="text"
          required
          placeholder="Enter Order # or Reference..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 bg-[#121215] border border-zinc-700 rounded text-xs text-white uppercase placeholder-zinc-500 focus:outline-none focus:border-[#dc2626]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{loading ? 'CHECKING...' : 'TRACK'}</span>
        </button>
      </form>

      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-950/60 border border-red-800 rounded-lg text-red-300 text-xs text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {order && (
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
            <div>
              <span className="text-xs font-mono text-zinc-500">ORDER NUMBER</span>
              <h2 className="text-xl font-bold text-white font-mono mt-0.5">{order.orderNumber}</h2>
              <span className="text-xs text-zinc-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              {getStatusBadge(order.status)}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300">
            <div className="space-y-2">
              <span className="text-zinc-500 font-mono block">DELIVERY DESTINATION:</span>
              <p className="text-white font-medium">{order.customer.fullName}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.city}, {order.customer.state}</p>
              <p className="font-mono">{order.customer.phone}</p>
            </div>

            <div className="space-y-2">
              <span className="text-zinc-500 font-mono block">PAYMENT & METHOD:</span>
              <p className="text-white">Total: <span className="font-bold text-[#dc2626] font-mono-tabular">₦{order.total.toLocaleString()}</span></p>
              <p>Status: <span className="text-emerald-400 font-bold uppercase">{order.paymentStatus}</span></p>
              <p className="text-zinc-400">Gateway: Paystack ({order.paymentMethod})</p>
              <p className="font-mono text-[11px] text-zinc-500">Ref: {order.paystackReference || 'Verified'}</p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-[#27272a] pt-4 space-y-3">
            <span className="text-xs font-mono text-zinc-500 block">PIECES IN THIS SHIPMENT:</span>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-[#09090b] rounded border border-zinc-800 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded bg-black" />
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-zinc-400 text-[11px] font-mono">Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-white font-mono-tabular">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
