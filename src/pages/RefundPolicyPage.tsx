import React from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="border-b border-[#27272a] pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
          CUSTOMER SATISFACTION
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
          RETURNS & REFUNDS POLICY
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2">
          Transparent, fair policies for the MAXVEY community.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-heading uppercase">
            1. 7-Day Exchange Window
          </h2>
          <p>
            We take pride in our premium garments. If you receive an item and the size is not ideal, you may request an exchange within <strong>7 calendar days</strong> from the day your package was delivered.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-heading uppercase">
            2. Condition Requirements
          </h2>
          <p>
            To be eligible for an exchange or return:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Garments must be unworn, unwashed, and odor-free (no perfume, smoke, or deodorant marks).</li>
            <li>All original woven MAXVEY tags and packaging must remain completely intact.</li>
            <li>Proof of purchase (Order Number #MV-XXXXX or Paystack reference) must accompany the request.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-heading uppercase">
            3. Defective or Damaged Items
          </h2>
          <p>
            In the rare event that an item arrives with a factory flaw or print defect, notify us within 48 hours of delivery with photographic evidence. 
            We will immediately issue a complimentary replacement with free reverse courier pickup in Lagos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-heading uppercase">
            4. How to Initiate a Return
          </h2>
          <p>
            Simply send a message to our WhatsApp support at <span className="font-mono text-white">+234 902 960 2573</span> or email <span className="font-mono text-white">maxwellunusual@gmail.com</span> with:
          </p>
          <div className="bg-[#121215] border border-[#27272a] rounded-lg p-4 font-mono text-xs text-zinc-300 space-y-1">
            <p>1. Your Order Number (e.g. MV-2610-1082)</p>
            <p>2. Reason for exchange (e.g. need size L instead of M)</p>
            <p>3. Picture of garment with tags attached</p>
          </div>
        </section>

      </div>
    </div>
  );
};
