import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="border-b border-[#27272a] pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
          LEGAL & DATA PROTECTION
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
          PRIVACY POLICY
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2">
          Effective Date: October 2026 · MAXVEY APPAREL LTD, Nigeria
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <p>
          At MAXVEY ("we", "our", or "us"), we prioritize customer privacy. This Privacy Policy outlines how your personal information is collected, used, and secured when you visit or purchase from maxvey.com.
        </p>

        <h3 className="text-base font-bold text-white font-heading uppercase">1. Information We Collect</h3>
        <p>
          When you place an order, we collect delivery details including your full name, email address, Nigerian phone number, shipping address, and order selections.
        </p>

        <h3 className="text-base font-bold text-white font-heading uppercase">2. Payment Security with Paystack</h3>
        <p>
          We NEVER store, see, or process your credit card numbers or bank credentials on our servers. All financial transactions are processed directly by <strong>Paystack Payments Limited</strong>, a PCI-DSS certified payment service provider licensed by the Central Bank of Nigeria (CBN).
        </p>

        <h3 className="text-base font-bold text-white font-heading uppercase">3. How We Use Your Data</h3>
        <p>
          We use your information strictly to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-zinc-400">
          <li>Fulfill orders and assign delivery riders.</li>
          <li>Send payment confirmations and WhatsApp delivery updates.</li>
          <li>Screen orders for potential fraud or unauthorized activity.</li>
          <li>Provide customer care and support responses.</li>
        </ul>

        <h3 className="text-base font-bold text-white font-heading uppercase">4. Data Inquiries</h3>
        <p>
          For any data requests or to delete your customer records, contact our privacy officer at <span className="text-white font-mono">maxwellunusual@gmail.com</span>.
        </p>
      </div>
    </div>
  );
};
