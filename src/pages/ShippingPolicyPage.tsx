import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="border-b border-[#27272a] pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
          LOGISTICS & DISPATCH
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
          SHIPPING & DELIVERY POLICY
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2">
          Last updated: October 2026 · Operating from Lagos, Nigeria
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-heading uppercase">
            1. Dispatch Timelines in Nigeria
          </h2>
          <p>
            All MAXVEY garments are quality checked and packaged at our Lagos studio before dispatch. 
            Once your payment is verified via Paystack:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li><strong>Lagos (Mainland & Island):</strong> Delivery within 24 to 48 hours via dedicated dispatch riders.</li>
            <li><strong>Abuja (FCT) & Rivers (Port Harcourt):</strong> Delivery within 2 to 4 working days via air cargo/express logistics.</li>
            <li><strong>All Other States in Nigeria:</strong> Delivery within 3 to 5 business days via tracked nationwide courier partners.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-heading uppercase">
            2. Standard Delivery Rates
          </h2>
          <p>
            Delivery rates are automatically calculated during checkout based on your selected destination state:
          </p>
          <div className="bg-[#121215] border border-[#27272a] rounded-lg p-4 font-mono text-xs space-y-1 text-zinc-300">
            <p>• Lagos (Mainland): ₦2,500</p>
            <p>• Lagos (Island / Lekki / Ikoyi / Ajah): ₦3,000</p>
            <p>• Abuja (FCT): ₦4,500</p>
            <p>• Rivers (Port Harcourt): ₦4,500</p>
            <p>• Oyo & Ogun States: ₦3,500</p>
            <p>• Other States (Nationwide Express): ₦5,000</p>
          </div>
          <p className="text-emerald-400 font-semibold">
            * Free Delivery: Orders over ₦75,000 qualify for free standard shipping within Lagos!
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-heading uppercase">
            3. Order Tracking & Rider Updates
          </h2>
          <p>
            When your parcel leaves our studio, you will receive an automatic tracking code and notification via SMS or WhatsApp (+234 902 960 2573). 
            Our delivery dispatch rider will call you prior to arrival at your delivery address.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-heading uppercase">
            4. International Orders
          </h2>
          <p>
            For customers ordering outside Nigeria (UK, US, Canada, Europe, Ghana), we dispatch via DHL Express (3–7 days). 
            Please contact our WhatsApp concierge directly for tailored international quotes.
          </p>
        </section>

      </div>
    </div>
  );
};
