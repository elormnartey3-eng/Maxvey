import React, { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Package, ArrowRight, Clock, AlertTriangle, Truck } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationPageProps {
  navigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ navigate }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref') || urlParams.get('reference');
  const orderId = urlParams.get('orderId');

  useEffect(() => {
    async function verifyAndLoadOrder() {
      if (!ref && !orderId) {
        setError('No order or payment reference was provided in the return link.');
        setLoading(false);
        return;
      }

      try {
        if (ref) {
          // Verify with backend
          const res = await fetch(`/api/paystack/verify/${encodeURIComponent(ref)}`);
          const data = await res.json();
          if (res.ok && data.order) {
            setOrder(data.order);
          } else {
            // Fallback load order directly if already verified
            if (orderId) {
              const orderRes = await fetch(`/api/orders/${orderId}`);
              const orderData = await orderRes.json();
              if (orderRes.ok) setOrder(orderData);
              else setError(data.error || 'Failed to verify payment');
            } else {
              setError(data.error || 'Failed to verify transaction with payment server');
            }
          }
        } else if (orderId) {
          const res = await fetch(`/api/orders/${orderId}`);
          const data = await res.json();
          if (res.ok) setOrder(data);
          else setError('Order not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error communicating with order system');
      } finally {
        setLoading(false);
      }
    }

    verifyAndLoadOrder();
  }, [ref, orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-10 h-10 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-zinc-400">Verifying payment with Paystack & preparing receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold uppercase text-white font-heading">
          Payment Verification Issue
        </h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          {error || 'We could not confirm this order. If your account was debited, please contact our support team with your reference.'}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/2349029602573?text=${encodeURIComponent(`Hi MAXVEY, I had a payment issue with ref: ${ref || 'unknown'}`)}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-[#25D366] text-black text-xs font-bold uppercase rounded flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Admin on WhatsApp</span>
          </a>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-zinc-800 text-white text-xs font-bold uppercase rounded"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello MAXVEY, I just placed order ${order.orderNumber} for ₦${order.total.toLocaleString()} on your website. My name is ${order.customer.fullName}. Looking forward to dispatch!`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Success Banner */}
      <div className="bg-[#121215] border border-emerald-900/60 rounded-2xl p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            PAYMENT VERIFIED · PAYSTACK REF: {order.paystackReference || 'CONFIRMED'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading mt-2">
            ORDER CONFIRMED: {order.orderNumber}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-lg mx-auto">
            Thank you, {order.customer.fullName}. We have received your order and queued your garments for inspection and packaging.
          </p>
        </div>

        {/* WhatsApp Direct Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/2349029602573?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Support on WhatsApp</span>
          </a>
          <button
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dispatch Timeline */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#dc2626]" />
          <span>Fulfillment Progress</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-lg">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">STAGE 01</span>
            <h4 className="text-xs font-bold text-white mt-1">Payment Verified</h4>
            <p className="text-[11px] text-zinc-400 mt-1">Automatic Paystack clearance complete</p>
          </div>

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <span className="text-[10px] font-mono text-[#dc2626] font-bold">STAGE 02</span>
            <h4 className="text-xs font-bold text-white mt-1">Lagos Studio QC</h4>
            <p className="text-[11px] text-zinc-400 mt-1">Inspection, folding & custom tag packaging</p>
          </div>

          <div className="p-4 bg-zinc-900/60 border border-zinc-800/60 rounded-lg opacity-70">
            <span className="text-[10px] font-mono text-zinc-500 font-bold">STAGE 03</span>
            <h4 className="text-xs font-bold text-zinc-300 mt-1">Courier Dispatch</h4>
            <p className="text-[11px] text-zinc-500 mt-1">Waybill assigned & rider in transit</p>
          </div>

          <div className="p-4 bg-zinc-900/60 border border-zinc-800/60 rounded-lg opacity-70">
            <span className="text-[10px] font-mono text-zinc-500 font-bold">STAGE 04</span>
            <h4 className="text-xs font-bold text-zinc-300 mt-1">Delivered</h4>
            <p className="text-[11px] text-zinc-500 mt-1">Handed to customer in {order.customer.city}</p>
          </div>
        </div>
      </div>

      {/* Order Summary & Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="md:col-span-7 bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
            Ordered Garments ({order.items.length})
          </h3>

          <div className="divide-y divide-[#27272a]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded bg-black shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                  </div>
                  <div className="text-xs font-bold text-white font-mono-tabular mt-1">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#27272a] pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Items Subtotal:</span>
              <span className="text-white font-mono-tabular">₦{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Delivery Fee ({order.customer.state}):</span>
              <span className="text-white font-mono-tabular">₦{order.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#27272a]">
              <span>Total Paid:</span>
              <span className="text-[#dc2626] font-mono-tabular text-lg">₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="md:col-span-5 bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
            Customer & Delivery Info
          </h3>

          <div className="space-y-2 text-zinc-300">
            <div>
              <span className="text-zinc-500 block font-mono">RECIPIENT:</span>
              <span className="font-semibold text-white text-sm">{order.customer.fullName}</span>
            </div>
            <div>
              <span className="text-zinc-500 block font-mono">PHONE:</span>
              <span className="text-white font-mono">{order.customer.phone}</span>
            </div>
            <div>
              <span className="text-zinc-500 block font-mono">EMAIL:</span>
              <span className="text-white">{order.customer.email}</span>
            </div>
            <div>
              <span className="text-zinc-500 block font-mono">DESTINATION:</span>
              <p className="text-white leading-relaxed">
                {order.customer.address}, {order.customer.city}, {order.customer.state}
              </p>
            </div>
            {order.customer.notes && (
              <div>
                <span className="text-zinc-500 block font-mono">DELIVERY NOTES:</span>
                <p className="text-amber-300 italic">{order.customer.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
