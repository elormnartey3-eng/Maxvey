import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does MAXVEY streetwear fit?',
      a: 'All MAXVEY t-shirts and hoodies are cut with an intentional oversized boxy drop-shoulder streetwear fit. If you prefer your standard fitted streetwear look, select your usual size. If you desire a regular or tighter tailored fit, we recommend sizing down one size.',
    },
    {
      q: 'What fabric quality do you use?',
      a: 'We use ultra-dense 260GSM (grams per square meter) 100% combed ringspun cotton for our t-shirts and 240GSM enzyme-washed cotton for our raw-cut muscle sleeveless pieces. They are completely opaque (zero transparency) and designed to retain structural collar integrity wash after wash.',
    },
    {
      q: 'How does delivery work in Nigeria?',
      a: 'Orders within Lagos are dispatched via local express riders and arrive within 24 to 48 hours. Orders to Abuja, Port Harcourt, Ibadan, and other states across Nigeria are delivered within 3 to 5 business days using tracked courier services.',
    },
    {
      q: 'How can I pay for my order?',
      a: 'We accept payments through Paystack, Nigeria’s leading secure payment gateway. You can pay using Nigerian Debit Cards (Mastercard, Visa, Verve), Direct Bank Transfer, or USSD.',
    },
    {
      q: 'Will I receive updates on WhatsApp or Email?',
      a: 'Yes! Once your payment is verified by Paystack, our system immediately sends an automated order receipt to your email, and our logistics team follows up with tracking updates directly on WhatsApp.',
    },
    {
      q: 'Can I exchange or return an item if the size doesn’t fit?',
      a: 'Yes. We offer a 7-day exchange window from the date of delivery. Garments must be unworn, unwashed, and returned in their original packaging with tags attached.',
    },
    {
      q: 'Are your drops limited edition?',
      a: 'Yes. MAXVEY operates on seasonal capsule drops. Once a limited batch colorway or print is sold out, it is rarely restocked in order to preserve exclusivity for our collectors.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="border-b border-[#27272a] pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
          CUSTOMER ASSISTANCE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
          Everything you need to know about sizing, textiles, Nigerian delivery, and Paystack payments.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-[#27272a] rounded-xl bg-[#121215] overflow-hidden transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-semibold text-sm sm:text-base text-white hover:text-zinc-200"
            >
              <span>{faq.q}</span>
              {openIndex === idx ? (
                <ChevronUp className="w-4 h-4 text-[#dc2626] shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-[#27272a]/60">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
