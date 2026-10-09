import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Order } from '../types';

export const TestPayPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref') || '';
  const orderId = urlParams.get('orderId') || '';

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handleSimulatePayment = (success: boolean) => {
    setProcessing(true);
    if (success) {
      setTimeout(() => {
        window.location.href = `/checkout/verify?ref=${ref}&orderId=${orderId}`;
      }, 1000);
    } else {
      setTimeout(() => {
        setProcessing(false);
        alert('Simulated card decline or insufficient funds.');
      }, 800);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-400 text-xs">
        Connecting to payment sandbox...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#121215] border border-[#27272a] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Sandbox Header */}
        <div className="bg-[#09090b] p-6 border-b border-[#27272a] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider">
                PAYSTACK TEST SANDBOX
              </span>
            </div>
            <h2 className="text-lg font-bold text-white font-heading mt-1">MAXVEY OFFICIAL STORE</h2>
          </div>
          <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
            NGN (₦)
          </span>
        </div>

        {/* Order Details */}
        <div className="p-6 space-y-6">
          <div className="bg-[#09090b] p-4 rounded-lg border border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Order Number:</span>
              <span className="font-mono text-white font-bold">{order?.orderNumber || 'MV-PENDING'}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Customer:</span>
              <span className="text-white">{order?.customer.fullName || 'Customer'}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Customer Email:</span>
              <span className="text-white">{order?.customer.email || 'customer@gmail.com'}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
              <span>Total Amount:</span>
              <span className="text-base text-[#dc2626] font-mono-tabular">
                ₦{order?.total.toLocaleString() || '0'}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-zinc-400">
            <p className="font-semibold text-white">Payment Simulation Options:</p>
            <p className="leading-relaxed">
              This interactive sandbox verifies end-to-end payment confirmation, stock decrements, and order notification dispatches without requiring live bank credentials.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleSimulatePayment(true)}
              disabled={processing}
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{processing ? 'Processing Payment...' : 'Simulate Successful Payment'}</span>
            </button>

            <button
              onClick={() => handleSimulatePayment(false)}
              disabled={processing}
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-medium rounded-lg border border-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4 text-red-500" />
              <span>Simulate Declined Payment</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <a
              href="/checkout"
              className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Cancel and return to checkout</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
