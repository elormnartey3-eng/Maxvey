import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="border-b border-[#27272a] pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
          CUSTOMER AGREEMENT
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
          TERMS AND CONDITIONS
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2">
          Applicable to all online purchases within Nigeria and internationally.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <h3 className="text-base font-bold text-white font-heading uppercase">1. Overview</h3>
        <p>
          This website is operated by MAXVEY. By accessing our platform or purchasing our garments, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h3 className="text-base font-bold text-white font-heading uppercase">2. Pricing & Currency</h3>
        <p>
          All prices on the website are listed in Nigerian Naira (NGN). We reserve the right to modify prices or discontinue garments at our discretion without prior notice.
        </p>

        <h3 className="text-base font-bold text-white font-heading uppercase">3. Limited Batch Production</h3>
        <p>
          MAXVEY silhouettes are produced in limited capsule batches. Placing an item in your shopping bag does not reserve stock until payment has been successfully completed and verified through Paystack.
        </p>

        <h3 className="text-base font-bold text-white font-heading uppercase">4. Intellectual Property</h3>
        <p>
          All trademarks, designs, custom graffiti logos, graphics, brand copy, and photographs of MAXVEY are the exclusive intellectual property of MAXVEY and its founders. Unauthorized reproduction or resale is prohibited.
        </p>
      </div>
    </div>
  );
};
